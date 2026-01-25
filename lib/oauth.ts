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
            code_challenge_method: 'S256',
        },
    },
    linkedin: {
        authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
        scope: 'openid profile email w_member_social',
    },
    threads: {
        authUrl: 'https://threads.net/oauth/authorize',
        scope: 'threads_basic,threads_content_publish',
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

export async function refreshOAuthToken(platform: Platform, refreshToken: string): Promise<any> {
    const config = OAUTH_CONFIGS[platform];
    const clientId = getClientId(platform);
    const clientSecret = getClientSecret(platform);

    if (!clientId || !clientSecret) {
        throw new Error(`Missing credentials for ${platform}`);
    }

    const params: Record<string, string> = {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId,
    };

    let headers: Record<string, string> = {
        'Content-Type': 'application/x-www-form-urlencoded',
    };

    // X and Reddit often require Basic Auth for refresh too
    if (platform === 'x') {
        const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        headers['Authorization'] = `Basic ${auth}`;
    } else {
        params.client_secret = clientSecret;
    }

    const tokenUrl = getTokenUrl(platform);
    const response = await fetch(tokenUrl, {
        method: 'POST',
        headers,
        body: new URLSearchParams(params),
    });

    if (!response.ok) {
        const error = await response.text();
        console.error(`[${platform}] Token refresh failed:`, error);
        throw new Error(`Failed to refresh token for ${platform}`);
    }

    return response.json();
}

function getTokenUrl(platform: Platform): string {
    switch (platform) {
        case 'x': return 'https://api.twitter.com/2/oauth2/token';
        case 'facebook':
        case 'instagram': return 'https://graph.facebook.com/v18.0/oauth/access_token';
        case 'linkedin': return 'https://www.linkedin.com/oauth/v2/accessToken';
        case 'threads': return 'https://graph.threads.net/oauth/access_token';
        default: throw new Error(`Unsupported platform for token refresh: ${platform}`);
    }
}

function getClientSecret(platform: Platform): string {
    // Note: Secrets should only be accessed in server-side code
    switch (platform) {
        case 'x': return process.env.X_CLIENT_SECRET || '';
        case 'facebook':
        case 'instagram': return process.env.FACEBOOK_CLIENT_SECRET || '';
        case 'linkedin': return process.env.LINKEDIN_CLIENT_SECRET || '';
        case 'threads': return process.env.THREADS_CLIENT_SECRET || '';
        default: return '';
    }
}

function getClientId(platform: Platform): string {
    let clientId: string | undefined;

    // Must use explicit env var names for Next.js bundler to inline them
    switch (platform) {
        case 'x':
            clientId = process.env.NEXT_PUBLIC_X_CLIENT_ID || process.env.X_CLIENT_ID;
            break;
        case 'facebook':
            clientId = process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID || process.env.FACEBOOK_CLIENT_ID;
            break;
        case 'instagram':
            clientId = process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID || process.env.FACEBOOK_CLIENT_ID;
            break;
        case 'linkedin':
            clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || process.env.LINKEDIN_CLIENT_ID;
            break;
        case 'threads':
            clientId = process.env.NEXT_PUBLIC_THREADS_CLIENT_ID || process.env.THREADS_CLIENT_ID;
            break;
    }

    return clientId || '';
}

function generateState(): string {
    return Math.random().toString(36).substring(2, 15);
}
