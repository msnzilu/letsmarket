// lib/oauth.ts
// OAuth utilities for social media connections

import { Platform } from '@/types';

interface OAuthConfig {
    authUrl: string;
    scope: string;
    additionalParams?: Record<string, string>;
}

const OAUTH_CONFIGS: Record<Platform, OAuthConfig> = {
    facebook: {
        authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
        scope: 'pages_manage_posts,pages_read_engagement,public_profile',
    },
    instagram: {
        authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
        scope: 'instagram_basic,instagram_content_publish,public_profile',
    },
    x: {
        authUrl: 'https://x.com/i/oauth2/authorize',
        scope: 'tweet.read users.read offline.access',
        additionalParams: {
            code_challenge_method: 'S256',
        },
    },
    linkedin: {
        authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
        scope: 'openid profile w_member_social',
    },
    tiktok: {
        authUrl: 'https://www.tiktok.com/v2/auth/authorize/',
        scope: 'user.info.basic,video.publish',
        additionalParams: {
            client_key: process.env.NEXT_PUBLIC_TIKTOK_CLIENT_ID || '',
            code_challenge: 'challenge',
            code_challenge_method: 'plain',
        },
    },
    reddit: {
        authUrl: 'https://www.reddit.com/api/v1/authorize',
        scope: 'identity submit',
        additionalParams: {
            duration: 'permanent',
        },
    },
};

import { getAppUrl } from '@/lib/utils';

export function getOAuthUrl(platform: Platform, codeChallenge?: string): string {
    const config = OAUTH_CONFIGS[platform];
    const clientId = getClientId(platform);
    const redirectUri = `${getAppUrl()}/api/auth/callback/${platform}`;

    if (!clientId) {
        console.error(`[${platform}] Missing client_id for OAuth URL generation`);
        throw new Error(`Missing client_id for ${platform}`);
    }

    const state = generateState();
    console.log(`[${platform}] Generating OAuth URL. State: ${state}, Client: ${clientId.substring(0, 10)}...`);

    const params: Record<string, string> = {
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: config.scope,
        state: state,
        ...config.additionalParams,
    };

    if (codeChallenge) {
        params.code_challenge = codeChallenge;
    }

    const searchParams = new URLSearchParams(params);
    return `${config.authUrl}?${searchParams.toString()}`;
}

function getClientId(platform: Platform): string {
    let clientId: string | undefined;

    // Must use explicit env var names for Next.js bundler to inline them
    switch (platform) {
        case 'x':
            clientId = process.env.NEXT_PUBLIC_X_CLIENT_ID;
            break;
        case 'facebook':
            clientId = process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID;
            break;
        case 'instagram':
            clientId = process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID; // Instagram uses Facebook app
            break;
        case 'linkedin':
            clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
            break;
        case 'tiktok':
            clientId = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_ID;
            break;
        case 'reddit':
            clientId = process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID;
            break;
    }

    if (!clientId) {
        console.error(`Missing NEXT_PUBLIC_${platform.toUpperCase()}_CLIENT_ID environment variable`);
        return '';
    }

    return clientId;
}

function generateState(): string {
    return Math.random().toString(36).substring(2, 15);
}
