// app/api/posts/publish/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Platform } from '@/types';
import { decrypt } from '@/lib/encryption';
import { refreshOAuthToken } from '@/lib/oauth';
import { encrypt } from '@/lib/encryption';
import { publishToSocial } from '@/lib/social';

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

    console.log(`[${connection.platform}] Access token expired. Attempting refresh...`);

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

        console.log(`[${connection.platform}] Token refreshed successfully.`);
        return newAccessToken;
    } catch (error: any) {
        console.error(`[${connection.platform}] Token refresh failed:`, error.message);
        throw new Error(`Your session with ${connection.platform} has expired. Please reconnect your account.`);
    }
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

        const connection = post.connection;
        const platform = connection.platform as Platform;

        try {
            // Get a valid (potentially refreshed) access token
            const accessToken = await getValidAccessToken(supabase, connection);

            let result: { postId: string; postUrl: string };

            // Use unified social publishing for supported platforms
            if (platform === 'x' || platform === 'linkedin' || platform === 'facebook' || platform === 'instagram' || platform === 'threads') {
                result = await publishToSocial(platform, {
                    content: post.content,
                    accessToken: accessToken,
                    userId: connection.platform_user_id,
                });
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
