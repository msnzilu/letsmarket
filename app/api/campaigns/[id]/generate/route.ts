// app/api/campaigns/[id]/generate/route.ts
// Generate AI posts for a campaign

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateCampaignPosts } from '@/lib/campaign-generator';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get campaign with analysis and website
        const { data: campaign, error: campaignError } = await supabase
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
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (campaignError) throw campaignError;

        if (!campaign.analyses) {
            return NextResponse.json(
                { error: 'Campaign has no linked analysis' },
                { status: 400 }
            );
        }

        // Get platforms from connected accounts
        const platforms = campaign.campaign_accounts
            ?.map((ca: any) => ca.social_connections?.platform)
            .filter(Boolean) || [];

        if (platforms.length === 0) {
            return NextResponse.json(
                { error: 'No social accounts connected to campaign' },
                { status: 400 }
            );
        }

        // Generate posts with website context
        const generatedPosts = await generateCampaignPosts({
            analysis: campaign.analyses,
            platforms,
            postsPerPlatform: Math.ceil(campaign.posts_per_week / platforms.length),
            websiteUrl: campaign.websites?.url,
        });

        if (generatedPosts.length === 0) {
            return NextResponse.json(
                { error: 'Failed to generate posts' },
                { status: 500 }
            );
        }

        // Calculate scheduled times using campaign's schedule_time
        const now = new Date();
        const [hours, minutes] = (campaign.schedule_time || '09:00:00').split(':').map(Number);
        const scheduledPosts = generatedPosts.map((post, index) => {
            const scheduledFor = new Date(now);
            scheduledFor.setDate(scheduledFor.getDate() + Math.floor(index / platforms.length) * 7);
            scheduledFor.setHours(hours, minutes, 0, 0);

            return {
                campaign_id: id,
                content: post.content,
                platform: post.platform,
                content_type: post.contentType,
                status: 'pending',
                scheduled_for: scheduledFor.toISOString(),
            };
        });

        // Insert posts
        const { data: insertedPosts, error: insertError } = await supabase
            .from('campaign_posts')
            .insert(scheduledPosts)
            .select();

        if (insertError) throw insertError;

        // Update campaign status
        await supabase
            .from('campaigns')
            .update({
                status: 'active',
                next_post_at: scheduledPosts[0]?.scheduled_for,
            })
            .eq('id', id);

        return NextResponse.json({
            success: true,
            posts: insertedPosts,
            count: insertedPosts?.length || 0,
        });
    } catch (error: any) {
        console.error('Error generating posts:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
