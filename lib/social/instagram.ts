// lib/social/instagram.ts
// Instagram publishing service via Graph API (requires Business/Creator account linked to Facebook Page)

import { PublishOptions, PublishResult } from './types';

export async function publishToInstagram(options: PublishOptions): Promise<PublishResult> {
    const { content, accessToken, userId, mediaUrl } = options;

    if (!userId) {
        throw new Error('Instagram requires an Instagram Business Account ID');
    }

    // Instagram Graph API requires media for posts
    // For text-only, we'll create a "caption" post which requires an image
    if (!mediaUrl) {
        throw new Error('Instagram publishing requires an image or video. Text-only posts are not supported.');
    }

    // Step 1: Create media container
    const containerResponse = await fetch(
        `https://graph.facebook.com/v18.0/${userId}/media`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                image_url: mediaUrl,
                caption: content,
                access_token: accessToken,
            }),
        }
    );

    if (!containerResponse.ok) {
        const error = await containerResponse.json();
        console.error('[Instagram] Container creation error:', error);
        throw new Error(error.error?.message || 'Failed to create Instagram media container');
    }

    const containerData = await containerResponse.json();
    const containerId = containerData.id;

    // Step 2: Publish the container
    const publishResponse = await fetch(
        `https://graph.facebook.com/v18.0/${userId}/media_publish`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                creation_id: containerId,
                access_token: accessToken,
            }),
        }
    );

    if (!publishResponse.ok) {
        const error = await publishResponse.json();
        console.error('[Instagram] Publish error:', error);
        throw new Error(error.error?.message || 'Failed to publish to Instagram');
    }

    const data = await publishResponse.json();
    return {
        postId: data.id,
        postUrl: `https://instagram.com/p/${data.id}`,
    };
}
