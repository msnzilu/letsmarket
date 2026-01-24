// lib/social/reddit.ts
// Reddit publishing service

import { PublishOptions, PublishResult } from './types';

export async function publishToReddit(options: PublishOptions): Promise<PublishResult> {
    const { content, accessToken, userId } = options;

    // Reddit API
    // Note: userId can be used as the subreddit if provided, otherwise default to a test or general subreddit
    const subreddit = userId || 'test';

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
        console.error('[Reddit] Publish error:', error);
        throw new Error(error.message || 'Failed to publish to Reddit');
    }

    const data = await response.json();

    return {
        postId: data.json?.data?.id || '',
        postUrl: data.json?.data?.url || '',
    };
}
