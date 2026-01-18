// app/api/posts/publish/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Platform } from '@/types';
import { decrypt } from '@/lib/encryption';
import { publishToSocial } from '@/lib/social';

async function publishToReddit(accessToken: string, content: string, subreddit: string = 'test'): Promise<{ postId: string; postUrl: string }> {
    // Reddit API
    const response = await fetch('https://oauth.reddit.com/api/submit', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            kind: 'self',
            sr: subreddit,
            title: content.slice(0, 300),
            text: content,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to publish to Reddit');
    }

    const data = await response.json();
    return {
        postId: data.json?.data?.id || '',
        postUrl: data.json?.data?.url || '',
    };
}

// POST - Publish a post immediately
export async function POST(request: NextRequest) {
    try {
        const { postId } = await request.json();

        if (!postId) {
            return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
        }

        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get the post with connection details
        const { data: post, error: postError } = await supabase
            .from('scheduled_posts')
            .select(`
                *,
                connection:social_connections(*)
            `)
            .eq('id', postId)
            .eq('user_id', user.id)
            .single();

        if (postError || !post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Update status to publishing
        await supabase
            .from('scheduled_posts')
            .update({ status: 'publishing' })
            .eq('id', postId);

        try {
            let result: { postId: string; postUrl: string };
            const connection = post.connection;

            const platform = connection.platform as Platform;

            // Use unified social publishing for supported platforms
            if (platform === 'x' || platform === 'linkedin') {
                result = await publishToSocial(platform, {
                    content: post.content,
                    accessToken: decrypt(connection.access_token),
                    userId: connection.platform_user_id,
                });
            } else if (platform === 'reddit') {
                result = await publishToReddit(decrypt(connection.access_token), post.content);
            } else {
                throw new Error(`Platform ${platform} is not yet supported for publishing.`);
            }

            // Update post with success
            const { data: updatedPost } = await supabase
                .from('scheduled_posts')
                .update({
                    status: 'published',
                    published_at: new Date().toISOString(),
                    platform_post_id: result.postId,
                    platform_post_url: result.postUrl,
                })
                .eq('id', postId)
                .select()
                .single();

            return NextResponse.json({ success: true, post: updatedPost });
        } catch (publishError: any) {
            // Update post with failure
            await supabase
                .from('scheduled_posts')
                .update({
                    status: 'failed',
                    error_message: publishError.message,
                })
                .eq('id', postId);

            throw publishError;
        }
    } catch (error: any) {
        console.error('Error publishing post:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to publish post' },
            { status: 500 }
        );
    }
}
