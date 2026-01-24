// app/api/cron/publish/route.ts
// Cron job to publish scheduled posts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { publishToSocial } from '@/lib/social';
import { decrypt } from '@/lib/encryption';
import { Platform } from '@/types';

// This endpoint should be protected by a secret key in production
// export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        // Simple secret check (configure in Vercel/env)
        const { searchParams } = new URL(request.url);
        const secret = searchParams.get('secret');

        if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabase = await createClient();

        // 1. Find pending posts that are due
        const now = new Date().toISOString();
        const { data: posts, error: postsError } = await supabase
            .from('campaign_posts')
            .select(`
                *,
                campaigns (
                    user_id
                )
            `)
            .eq('status', 'pending')
            .lte('scheduled_for', now)
            .limit(10); // Process in small batches

        if (postsError) throw postsError;

        console.log(`Cron: Found ${posts?.length || 0} posts to publish`);

        const results = [];

        for (const post of (posts || [])) {
            try {
                // 2. Update status to 'publishing' to prevent double-processing
                await supabase
                    .from('campaign_posts')
                    .update({ status: 'publishing' })
                    .eq('id', post.id);

                // 3. Find the connection for this post
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

                // 4. Publish to platform
                const publishResult = await publishToSocial(
                    post.platform as Platform,
                    {
                        content: post.content,
                        accessToken: decrypt(connection.access_token),
                        userId: connection.platform_user_id,
                    }
                );

                // 5. Update post status to 'published'
                await supabase
                    .from('campaign_posts')
                    .update({
                        status: 'published',
                        published_at: new Date().toISOString(),
                        platform_post_id: publishResult.postId,
                        platform_post_url: publishResult.postUrl,
                    })
                    .eq('id', post.id);

                results.push({ id: post.id, status: 'success' });
            } catch (error: any) {
                console.error(`Cron: Failed to publish post ${post.id}:`, error.message);

                // Update post status to 'failed'
                await supabase
                    .from('campaign_posts')
                    .update({
                        status: 'failed',
                        error_message: error.message,
                    })
                    .eq('id', post.id);

                results.push({ id: post.id, status: 'failed', error: error.message });
            }
        }

        return NextResponse.json({
            processed: results.length,
            details: results,
        });

    } catch (error: any) {
        console.error('Cron error:', error);
        return NextResponse.json(
            { error: error.message || 'Cron execution failed' },
            { status: 500 }
        );
    }
}
