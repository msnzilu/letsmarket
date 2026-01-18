// lib/social/index.ts
// Unified social media publishing service

import { Platform } from '@/types';
import { PublishResult, PublishOptions } from './types';
import { publishToX } from './x';
import { publishToLinkedIn } from './linkedin';

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
        default:
            throw new Error(`Platform ${platform} is not yet supported for publishing.`);
    }
}

export { publishToX } from './x';
export { publishToLinkedIn } from './linkedin';
