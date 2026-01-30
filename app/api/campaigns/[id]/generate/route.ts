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
            positioningFocus: campaign.positioning_focus,
        });

        if (generatedPosts.length === 0) {
            return NextResponse.json(
                { error: 'Failed to generate posts' },
                { status: 500 }
            );
        }

        // Calculate scheduled times using campaign's schedule_time and schedule_timezone
        const now = new Date();
        const [hours, minutes] = (campaign.schedule_time || '09:00:00').split(':').map(Number);
        const timezone = campaign.schedule_timezone || 'UTC';
        
        console.log(`[Campaign ${id}] Scheduling with time: ${campaign.schedule_time}, TZ: ${timezone}, Current time (UTC): ${now.toISOString()}`);

        const scheduledPosts = generatedPosts.map((post, index) => {
            // Create a date in the target timezone
            const scheduledDate = new Date(now);
            scheduledDate.setDate(scheduledDate.getDate() + Math.floor(index / platforms.length) * 7);
            
            // Format to YYYY-MM-DD
            const dateStr = scheduledDate.toISOString().split('T')[0];
            const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
            const localString = `${dateStr}T${timeStr}`;
            
            let scheduledFor: Date;
            try {
                // Determine offset by comparing local time in target TZ with UTC
                const formatter = new Intl.DateTimeFormat('en-GB', {
                    timeZone: timezone,
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                });
                
                const goalUTC = new Date(`${localString}Z`);
                const parts = formatter.formatToParts(goalUTC);
                const partMap: any = {};
                parts.forEach(p => partMap[p.type] = p.value);
                
                // Construct the "local time" as a UTC date to calculate the delta
                const formattedDate = new Date(`${partMap.year}-${partMap.month}-${partMap.day}T${partMap.hour}:${partMap.minute}:${partMap.second}Z`);
                
                const offset = goalUTC.getTime() - formattedDate.getTime();
                scheduledFor = new Date(goalUTC.getTime() + offset);

                // Safeguard: Ensure we don't schedule in the past
                if (scheduledFor.getTime() < now.getTime()) {
                    scheduledFor.setDate(scheduledFor.getDate() + 1);
                }
                
                console.log(`[Post ${index}] Goal local: ${localString}, Calculated UTC: ${scheduledFor.toISOString()}`);
            } catch (e) {
                console.error(`Timezone ${timezone} failed, falling back to UTC`, e);
                scheduledFor = new Date(`${localString}Z`);
                if (scheduledFor.getTime() < now.getTime()) {
                    scheduledFor.setDate(scheduledFor.getDate() + 1);
                }
            }

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
