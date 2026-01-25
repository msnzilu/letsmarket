// app/api/cron/publish/route.ts
// Cron job to publish scheduled posts AND auto-regenerate content

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { publishToSocial } from '@/lib/social';
import { decrypt } from '@/lib/encryption';
import { encrypt } from '@/lib/encryption';
import { Platform } from '@/types';
import { generateCampaignPosts } from '@/lib/campaign-generator';
import { refreshOAuthToken } from '@/lib/oauth';

async function getValidAccessToken(supabase: any, connection: any): Promise<string> {
    const expiresAt = connection.token_expires_at;
    const now = new Date();

    // Refresh if expiring within 5 minutes or already expired
    const isExpired = expiresAt && new Date(expiresAt).getTime() < now.getTime() + 5 * 60 * 1000;

    if (!isExpired) {
        return decrypt(connection.access_token);
    }

    if (!connection.refresh_token) {
        throw new Error(`Access token expired and no refresh token available for ${connection.platform}`);
    }

    console.log(`[Cron] [${connection.platform}] Access token expired. Attempting refresh...`);

    try {
        const tokenData = await refreshOAuthToken(
            connection.platform as Platform,
            decrypt(connection.refresh_token)
        );

        const newAccessToken = tokenData.access_token;
        const newRefreshToken = tokenData.refresh_token;
        const expiresIn = tokenData.expires_in;

        // Update database with new tokens
        await supabase
            .from('social_connections')
            .update({
                access_token: encrypt(newAccessToken),
                refresh_token: newRefreshToken ? encrypt(newRefreshToken) : connection.refresh_token,
                token_expires_at: expiresIn
                    ? new Date(Date.now() + expiresIn * 1000).toISOString()
                    : null,
                updated_at: new Date().toISOString()
            })
            .eq('id', connection.id);

        console.log(`[Cron] [${connection.platform}] Token refreshed successfully.`);
        return newAccessToken;
    } catch (error: any) {
        console.error(`[Cron] [${connection.platform}] Token refresh failed:`, error.message);
        throw new Error(`Session with ${connection.platform} has expired.`);
    }
}

// Minimum pending posts before triggering regeneration
const MIN_PENDING_POSTS = 2;

export async function GET(request: NextRequest) {
    try {
        // Simple secret check (configure in Vercel/env)
        const { searchParams } = new URL(request.url);
        const secret = searchParams.get('secret');

        if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabase = await createClient();
        const now = new Date();
        const nowISO = now.toISOString();

        // ========================================
        // PART 1: Publish pending posts that are due
        // ========================================
        const { data: posts, error: postsError } = await supabase
            .from('campaign_posts')
            .select(`
                *,
                campaigns (
                    user_id
                )
            `)
            .eq('status', 'pending')
            .lte('scheduled_for', nowISO)
            .limit(10);

        if (postsError) throw postsError;

        console.log(`Cron: Found ${posts?.length || 0} posts to publish`);

        const publishResults = [];

        for (const post of (posts || [])) {
            try {
                await supabase
                    .from('campaign_posts')
                    .update({ status: 'publishing' })
                    .eq('id', post.id);

                const { data: connection, error: connError } = await supabase
                    .from('social_connections')
                    .select('*')
                    .eq('user_id', post.campaigns.user_id)
                    .eq('platform', post.platform)
                    .eq('is_active', true)
                    .single();

                if (connError || !connection) {
                    throw new Error(`No active connection found for ${post.platform}`);
                }

                const accessToken = await getValidAccessToken(supabase, connection);

                const publishResult = await publishToSocial(
                    post.platform as Platform,
                    {
                        content: post.content,
                        accessToken: accessToken,
                        userId: connection.platform_user_id,
                    }
                );

                await supabase
                    .from('campaign_posts')
                    .update({
                        status: 'published',
                        published_at: new Date().toISOString(),
                        platform_post_id: publishResult.postId,
                        platform_post_url: publishResult.postUrl,
                    })
                    .eq('id', post.id);

                publishResults.push({ id: post.id, status: 'success' });
            } catch (error: any) {
                console.error(`Cron: Failed to publish post ${post.id}:`, error.message);

                await supabase
                    .from('campaign_posts')
                    .update({
                        status: 'failed',
                        error_message: error.message,
                    })
                    .eq('id', post.id);

                publishResults.push({ id: post.id, status: 'failed', error: error.message });
            }
        }

        // ========================================
        // PART 2: Auto-regenerate posts for active campaigns running low
        // ========================================
        const regenerationResults = [];

        // Find active campaigns
        const { data: activeCampaigns, error: campaignsError } = await supabase
            .from('campaigns')
            .select(`
                *,
                campaign_accounts (
                    connection_id,
                    social_connections (platform)
                ),
                analyses (
                    overall_score,
                    principle_scores,
                    generated_copy
                ),
                websites (
                    url
                )
            `)
            .eq('status', 'active');

        if (campaignsError) {
            console.error('Cron: Error fetching active campaigns:', campaignsError);
        }

        for (const campaign of (activeCampaigns || [])) {
            try {
                // Count pending posts for this campaign
                const { count: pendingCount } = await supabase
                    .from('campaign_posts')
                    .select('*', { count: 'exact', head: true })
                    .eq('campaign_id', campaign.id)
                    .eq('status', 'pending');

                console.log(`Cron: Campaign ${campaign.id} has ${pendingCount} pending posts`);

                // If running low on pending posts, generate more
                if ((pendingCount || 0) < MIN_PENDING_POSTS) {
                    console.log(`Cron: Regenerating posts for campaign ${campaign.id}`);

                    const platforms = campaign.campaign_accounts
                        ?.map((ca: any) => ca.social_connections?.platform)
                        .filter(Boolean) || [];

                    if (platforms.length === 0 || !campaign.analyses) {
                        console.log(`Cron: Skipping campaign ${campaign.id} - no platforms or analysis`);
                        continue;
                    }

                    // Generate new posts
                    const generatedPosts = await generateCampaignPosts({
                        analysis: campaign.analyses,
                        platforms,
                        postsPerPlatform: Math.ceil(campaign.posts_per_week / platforms.length),
                        websiteUrl: campaign.websites?.url,
                        positioningFocus: campaign.positioning_focus,
                    });

                    if (generatedPosts.length === 0) {
                        console.log(`Cron: No posts generated for campaign ${campaign.id}`);
                        continue;
                    }

                    // Schedule the new posts starting from now
                    const [hours, minutes] = (campaign.schedule_time || '09:00:00').split(':').map(Number);
                    const scheduledPosts = generatedPosts.map((post, index) => {
                        const scheduledFor = new Date(now);
                        // Spread posts across upcoming days
                        scheduledFor.setDate(scheduledFor.getDate() + index + 1);
                        scheduledFor.setHours(hours, minutes, 0, 0);

                        return {
                            campaign_id: campaign.id,
                            content: post.content,
                            platform: post.platform,
                            content_type: post.contentType,
                            status: 'pending',
                            scheduled_for: scheduledFor.toISOString(),
                        };
                    });

                    // Insert new posts
                    const { error: insertError } = await supabase
                        .from('campaign_posts')
                        .insert(scheduledPosts);

                    if (insertError) {
                        throw insertError;
                    }

                    // Update campaign next_post_at
                    await supabase
                        .from('campaigns')
                        .update({ next_post_at: scheduledPosts[0]?.scheduled_for })
                        .eq('id', campaign.id);

                    regenerationResults.push({
                        campaignId: campaign.id,
                        postsGenerated: scheduledPosts.length,
                    });

                    console.log(`Cron: Generated ${scheduledPosts.length} new posts for campaign ${campaign.id}`);
                }
            } catch (error: any) {
                console.error(`Cron: Error regenerating for campaign ${campaign.id}:`, error.message);
                regenerationResults.push({
                    campaignId: campaign.id,
                    error: error.message,
                });
            }
        }

        return NextResponse.json({
            published: publishResults.length,
            publishDetails: publishResults,
            regenerated: regenerationResults.length,
            regenerationDetails: regenerationResults,
        });

    } catch (error: any) {
        console.error('Cron error:', error);
        return NextResponse.json(
            { error: error.message || 'Cron execution failed' },
            { status: 500 }
        );
    }
}

