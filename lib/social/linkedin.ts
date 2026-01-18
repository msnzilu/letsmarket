// lib/social/linkedin.ts
// LinkedIn publishing service (supports both personal profiles and company pages)

import { PublishOptions, PublishResult } from './types';

export async function publishToLinkedIn(options: PublishOptions): Promise<PublishResult> {
    const { content, accessToken, userId } = options;

    if (!userId) {
        throw new Error('LinkedIn requires a user or organization ID');
    }

    // Determine if this is a personal profile or organization
    const isOrganization = userId.includes('urn:li:organization');
    const authorUrn = isOrganization ? userId : (userId.startsWith('urn:') ? userId : `urn:li:person:${userId}`);

    // Use the Share API for posting
    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0',
        },
        body: JSON.stringify({
            author: authorUrn,
            lifecycleState: 'PUBLISHED',
            specificContent: {
                'com.linkedin.ugc.ShareContent': {
                    shareCommentary: { text: content },
                    shareMediaCategory: 'NONE',
                },
            },
            visibility: {
                'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
            },
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        console.error('[LinkedIn] Publish error:', error);
        throw new Error(error.message || error.serviceErrorCode || 'Failed to publish to LinkedIn');
    }

    const data = await response.json();
    const postId = data.id || '';

    return {
        postId,
        postUrl: `https://linkedin.com/feed/update/${postId}`,
    };
}

// Helper to fetch user's managed LinkedIn pages
export async function getLinkedInPages(accessToken: string): Promise<Array<{ id: string; name: string }>> {
    try {
        const response = await fetch(
            'https://api.linkedin.com/v2/organizationalEntityAcls?q=roleAssignee&role=ADMIN&state=APPROVED',
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'X-Restli-Protocol-Version': '2.0.0',
                },
            }
        );

        if (!response.ok) return [];

        const data = await response.json();
        const elements = data.elements || [];

        // Fetch details for each organization
        const pages = await Promise.all(
            elements.map(async (element: any) => {
                const orgUrn = element.organizationalTarget;
                const orgId = orgUrn.split(':').pop();

                const orgRes = await fetch(`https://api.linkedin.com/v2/organizations/${orgId}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'X-Restli-Protocol-Version': '2.0.0',
                    },
                });

                if (!orgRes.ok) return null;

                const org = await orgRes.json();
                return {
                    id: orgUrn,
                    name: org.localizedName || org.vanityName || `Organization ${orgId}`,
                };
            })
        );

        return pages.filter((p): p is { id: string; name: string } => p !== null);
    } catch (error) {
        console.error('Error fetching LinkedIn pages:', error);
        return [];
    }
}
