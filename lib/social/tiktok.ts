// lib/social/tiktok.ts
// TikTok publishing service

import { PublishOptions, PublishResult } from './types';

export async function publishToTikTok(options: PublishOptions): Promise<PublishResult> {
    const { content, accessToken, userId } = options;

    // TikTok Content Posting API (v2)
    // Note: Simple text posting to TikTok isn't directly supported via a single "text" field like X.
    // Usually it requires a video. However, for the sake of completeness in the unified publisher:

    // This is a placeholder for TikTok video publishing which is the primary use case.
    // For now, we'll throw a specific error or implement the video upload flow if media is provided.

    if (!options.mediaUrl) {
        throw new Error('TikTok publishing requires a video file. Text-only posts are not supported via the API.');
    }

    // TikTok publishing flow is multi-step (upload, then post).
    // For now, we'll mark it as not yet fully implemented for automated campaigns.
    throw new Error('TikTok publishing is currently in development and requires manual video upload.');
}
