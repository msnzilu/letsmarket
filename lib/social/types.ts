// lib/social/types.ts
// Shared types for social media publishing

export interface PublishResult {
    postId: string;
    postUrl: string;
}

export interface PublishOptions {
    content: string;
    accessToken: string;
    userId?: string; // For platforms that need user/org ID
    mediaUrl?: string;
}
