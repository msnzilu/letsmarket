// lib/social/threads.ts
// Threads publishing service via Threads API

import { PublishOptions, PublishResult } from './types';

export async function publishToThreads(options: PublishOptions): Promise<PublishResult> {
    const { content, accessToken, userId, mediaUrl } = options;

    if (!userId) {
        throw new Error('Threads requires a user ID');
    }

    // Step 1: Create a media container
    const containerBody: Record<string, string> = {
        text: content,
        media_type: mediaUrl ? 'IMAGE' : 'TEXT',
        access_token: accessToken,
    };

    if (mediaUrl) {
        containerBody.image_url = mediaUrl;
    }

    const containerResponse = await fetch(
        `https://graph.threads.net/v1.0/${userId}/threads`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(containerBody),
        }
    );

    if (!containerResponse.ok) {
        const error = await containerResponse.json();
        console.error('[Threads] Container creation error:', error);
        throw new Error(error.error?.message || 'Failed to create Threads post container');
    }

    const containerData = await containerResponse.json();
    const containerId = containerData.id;

    // Step 2: Publish the container
    const publishResponse = await fetch(
        `https://graph.threads.net/v1.0/${userId}/threads_publish`,
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
        console.error('[Threads] Publish error:', error);
        throw new Error(error.error?.message || 'Failed to publish to Threads');
    }

    const data = await publishResponse.json();
    return {
        postId: data.id,
        postUrl: `https://threads.net/t/${data.id}`,
    };
}
