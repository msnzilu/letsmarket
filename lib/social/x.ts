// lib/social/x.ts
// X (Twitter) publishing service

import { PublishOptions, PublishResult } from './types';

export async function publishToX(options: PublishOptions): Promise<PublishResult> {
    const { content, accessToken } = options;

    // X (Twitter) API v2
    const body: Record<string, any> = { text: content };

    const response = await fetch('https://api.twitter.com/2/tweets', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const error = await response.json();
        console.error('[X] Publish error:', error);
        throw new Error(error.detail || error.title || 'Failed to publish to X');
    }

    const data = await response.json();
    return {
        postId: data.data.id,
        postUrl: `https://x.com/i/status/${data.data.id}`,
    };
}

// Helper to upload media to X (for future use)
export async function uploadMediaToX(accessToken: string, mediaUrl: string): Promise<string> {
    // Implementation for media upload would go here
    // This requires the v1.1 media upload endpoint
    throw new Error('Media upload to X is not yet implemented');
}
