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
        authUrl: 'https://twitter.com/i/oauth2/authorize',
        scope: 'tweet.read tweet.write users.read offline.access',
        additionalParams: {
            code_challenge: 'challenge',
            code_challenge_method: 'plain',
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

export function getOAuthUrl(platform: Platform): string {
    const config = OAUTH_CONFIGS[platform];
    const clientId = getClientId(platform);
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/${platform}`;

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: config.scope,
        state: generateState(),
        ...config.additionalParams,
    });

    return `${config.authUrl}?${params.toString()}`;
}

function getClientId(platform: Platform): string {
    const envKey = `NEXT_PUBLIC_${platform.toUpperCase()}_CLIENT_ID`;
    const clientId = process.env[envKey];

    if (!clientId) {
        console.warn(`Missing ${envKey} environment variable`);
        return '';
    }

    return clientId;
}

function generateState(): string {
    return Math.random().toString(36).substring(2, 15);
}
