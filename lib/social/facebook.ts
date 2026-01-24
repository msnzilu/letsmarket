// lib/social/facebook.ts
// Facebook Pages publishing service via Graph API

import { PublishOptions, PublishResult } from './types';

export async function publishToFacebook(options: PublishOptions): Promise<PublishResult> {
    const { content, accessToken, userId } = options;

    if (!userId) {
        throw new Error('Facebook requires a Page ID to publish');
    }

    // Facebook Graph API - Post to Page
    const response = await fetch(`https://graph.facebook.com/v18.0/${userId}/feed`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: content,
            access_token: accessToken,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        console.error('[Facebook] Publish error:', error);
        throw new Error(error.error?.message || 'Failed to publish to Facebook');
    }

    const data = await response.json();
    return {
        postId: data.id,
        postUrl: `https://facebook.com/${data.id}`,
    };
}

// Helper to fetch user's managed Facebook Pages
export async function getFacebookPages(accessToken: string): Promise<Array<{ id: string; name: string; access_token: string }>> {
    try {
        const response = await fetch(
            `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`
        );

        if (!response.ok) return [];

        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching Facebook pages:', error);
        return [];
    }
}
