// lib/social/index.ts
// Unified social media publishing service

import { Platform } from '@/types';
import { PublishResult, PublishOptions } from './types';
import { publishToX } from './x';
import { publishToLinkedIn } from './linkedin';
import { publishToReddit } from './reddit';
import { publishToTikTok } from './tiktok';
import { publishToFacebook } from './facebook';
import { publishToInstagram } from './instagram';
import { publishToThreads } from './threads';

export type { PublishResult, PublishOptions } from './types';

export async function publishToSocial(
    platform: Platform,
    options: PublishOptions
): Promise<PublishResult> {
    switch (platform) {
        case 'x':
            return publishToX(options);
        case 'linkedin':
            return publishToLinkedIn(options);
        case 'reddit':
            return publishToReddit(options);
        case 'tiktok':
            return publishToTikTok(options);
        case 'facebook':
            return publishToFacebook(options);
        case 'instagram':
            return publishToInstagram(options);
        case 'threads':
            return publishToThreads(options);
        default:
            throw new Error(`Platform ${platform} is not yet supported for publishing.`);
    }
}

export { publishToX } from './x';
export { publishToLinkedIn } from './linkedin';
export { publishToReddit } from './reddit';
export { publishToTikTok } from './tiktok';
export { publishToFacebook } from './facebook';
export { publishToInstagram } from './instagram';
export { publishToThreads } from './threads';

