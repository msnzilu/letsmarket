// app/api/posts/publish/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Platform } from '@/types';
import { decrypt } from '@/lib/encryption';

// Platform-specific publish functions
async function publishToFacebook(accessToken: string, content: string): Promise<{ postId: string; postUrl: string }> {
    // Facebook Graph API
    const response = await fetch(
        `https://graph.facebook.com/v18.0/me/feed`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: content,
                access_token: accessToken,
            }),
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to publish to Facebook');
    }

    const data = await response.json();
    return {
        postId: data.id,
        postUrl: `https://facebook.com/${data.id}`,
    };
}

async function publishToX(accessToken: string, content: string): Promise<{ postId: string; postUrl: string }> {
    // X (Twitter) API v2
    const response = await fetch('https://api.twitter.com/2/tweets', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: content }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to publish to X');
    }

    const data = await response.json();
    return {
        postId: data.data.id,
        postUrl: `https://x.com/i/status/${data.data.id}`,
    };
}

async function publishToLinkedIn(accessToken: string, content: string, userId: string): Promise<{ postId: string; postUrl: string }> {
    // LinkedIn API
    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0',
        },
        body: JSON.stringify({
            author: `urn:li:person:${userId}`,
            lifecycleState: 'PUBLISHED',
            specificContent: {
                'com.linkedin.ugc.ShareContent': {
                    shareCommentary: { text: content },
                    shareMediaCategory: 'NONE',
                },
            },
            visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to publish to LinkedIn');
    }

    const data = await response.json();
    return {
        postId: data.id,
        postUrl: `https://linkedin.com/feed/update/${data.id}`,
    };
}

async function publishToTikTok(accessToken: string, content: string): Promise<{ postId: string; postUrl: string }> {
    // TikTok Content Posting API (requires video, text-only not supported for regular posts)
    // This is a placeholder - TikTok requires video content
    throw new Error('TikTok requires video content. Text-only posts are not supported.');
}

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

            switch (connection.platform as Platform) {
                case 'facebook':
                case 'instagram': // Instagram uses Facebook Graph API
                    result = await publishToFacebook(decrypt(connection.access_token), post.content);
                    break;
                case 'x':
                    result = await publishToX(decrypt(connection.access_token), post.content);
                    break;
                case 'linkedin':
                    result = await publishToLinkedIn(decrypt(connection.access_token), post.content, connection.platform_user_id);
                    break;
                case 'tiktok':
                    result = await publishToTikTok(decrypt(connection.access_token), post.content);
                    break;
                case 'reddit':
                    result = await publishToReddit(decrypt(connection.access_token), post.content);
                    break;
                default:
                    throw new Error(`Unsupported platform: ${connection.platform}`);
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
