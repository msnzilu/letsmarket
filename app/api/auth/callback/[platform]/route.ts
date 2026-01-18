// app/api/auth/callback/[platform]/route.ts
// Universal OAuth callback handler for all social platforms

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Platform } from '@/types';
import { encrypt } from '@/lib/encryption';

// Platform OAuth configurations
const PLATFORM_CONFIGS: Record<Platform, {
    tokenUrl: string;
    userInfoUrl: string;
    scope: string;
}> = {
    facebook: {
        tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
        userInfoUrl: 'https://graph.facebook.com/me?fields=id,name,picture',
        scope: 'pages_manage_posts,pages_read_engagement',
    },
    instagram: {
        tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
        userInfoUrl: 'https://graph.facebook.com/me?fields=id,name,picture',
        scope: 'instagram_basic,instagram_content_publish',
    },
    x: {
        tokenUrl: 'https://api.twitter.com/2/oauth2/token',
        userInfoUrl: 'https://api.twitter.com/2/users/me',
        scope: 'tweet.read tweet.write users.read',
    },
    linkedin: {
        tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
        userInfoUrl: 'https://api.linkedin.com/v2/userinfo',
        scope: 'openid profile w_member_social',
    },
    tiktok: {
        tokenUrl: 'https://open.tiktokapis.com/v2/oauth/token/',
        userInfoUrl: 'https://open.tiktokapis.com/v2/user/info/',
        scope: 'user.info.basic,video.publish',
    },
    reddit: {
        tokenUrl: 'https://www.reddit.com/api/v1/access_token',
        userInfoUrl: 'https://oauth.reddit.com/api/v1/me',
        scope: 'identity submit',
    },
};

async function exchangeCodeForToken(platform: Platform, code: string, redirectUri: string) {
    const config = PLATFORM_CONFIGS[platform];

    // Handle X (Twitter) naming - env vars use X_ prefix
    let clientId: string | undefined;
    let clientSecret: string | undefined;

    if (platform === 'x') {
        clientId = process.env.X_CLIENT_ID || process.env.NEXT_PUBLIC_X_CLIENT_ID;
        clientSecret = process.env.X_CLIENT_SECRET;
    } else {
        const upperPlatform = platform.toUpperCase();
        // Check both NEXT_PUBLIC_ and non-prefixed versions
        clientId = process.env[`NEXT_PUBLIC_${upperPlatform}_CLIENT_ID`] || process.env[`${upperPlatform}_CLIENT_ID`];
        clientSecret = process.env[`${upperPlatform}_CLIENT_SECRET`];
    }

    if (!clientId || !clientSecret) {
        console.error(`Missing credentials for ${platform}. clientId: ${!!clientId}, clientSecret: ${!!clientSecret}`);
        throw new Error(`Missing OAuth credentials for ${platform}`);
    }

    console.log(`[${platform}] Exchanging code for token with client_id: ${clientId.substring(0, 10)}...`);

    let response: Response;
    let body: Record<string, string>;

    if (platform === 'reddit') {
        // Reddit uses Basic Auth
        const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        response = await fetch(config.tokenUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri,
            }),
        });
    } else if (platform === 'x') {
        // X uses PKCE + Basic Auth
        const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        response = await fetch(config.tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${auth}`,
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri,
                code_verifier: 'challenge',
            }),
        });
    } else if (platform === 'tiktok') {
        response = await fetch(config.tokenUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_key: clientId,
                client_secret: clientSecret,
                code,
                grant_type: 'authorization_code',
                redirect_uri: redirectUri,
                code_verifier: 'challenge',
            }),
        });
    } else {
        // Facebook, Instagram, LinkedIn
        response = await fetch(config.tokenUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                code,
                grant_type: 'authorization_code',
                redirect_uri: redirectUri,
            }),
        });
    }

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Token exchange failed: ${error}`);
    }

    return response.json();
}

async function fetchUserInfo(platform: Platform, accessToken: string) {
    const config = PLATFORM_CONFIGS[platform];
    let url = config.userInfoUrl;
    let headers: HeadersInit = { 'Authorization': `Bearer ${accessToken}` };

    if (platform === 'facebook' || platform === 'instagram') {
        url = `${config.userInfoUrl}&access_token=${accessToken}`;
        headers = {};
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to fetch user info: ${error}`);
    }

    return response.json();
}

async function fetchLinkedInOrganizations(accessToken: string) {
    try {
        const response = await fetch('https://api.linkedin.com/v2/organizationalEntityAcls?q=roleAssignee&role=ADMIN&state=APPROVED', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'X-Restli-Protocol-Version': '2.0.0',
            },
        });
        if (!response.ok) return [];
        const data = await response.json();
        return data.elements || [];
    } catch (error) {
        console.error('Error fetching LinkedIn organizations:', error);
        return [];
    }
}

async function fetchLinkedInOrgDetails(accessToken: string, orgUrn: string) {
    try {
        const orgId = orgUrn.split(':').pop();
        const response = await fetch(`https://api.linkedin.com/v2/organizations/${orgId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'X-Restli-Protocol-Version': '2.0.0',
            },
        });
        if (!response.ok) return null;
        return response.json();
    } catch (error) {
        console.error('Error fetching LinkedIn organization details:', error);
        return null;
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ platform: string }> }
) {
    try {
        const { platform: platformParam } = await params;
        const platform = platformParam as Platform;
        const { searchParams } = new URL(request.url);
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
            return NextResponse.redirect(new URL(`/connections?error=${error}`, request.url));
        }

        if (!code) {
            return NextResponse.redirect(new URL('/connections?error=no_code', request.url));
        }

        if (!PLATFORM_CONFIGS[platform]) {
            return NextResponse.redirect(new URL('/connections?error=invalid_platform', request.url));
        }

        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/${platform}`;

        // Exchange code for tokens
        const tokenData = await exchangeCodeForToken(platform, code, redirectUri);
        const accessToken = tokenData.access_token;
        const refreshToken = tokenData.refresh_token;
        const expiresIn = tokenData.expires_in;

        // Fetch user info
        const userInfo = await fetchUserInfo(platform, accessToken);

        // Normalize user data based on platform
        let platformUserId: string;
        let accountName: string;
        let accountUsername: string | undefined;
        let accountAvatar: string | undefined;

        switch (platform) {
            case 'facebook':
            case 'instagram':
                platformUserId = userInfo.id;
                accountName = userInfo.name;
                accountAvatar = userInfo.picture?.data?.url;
                break;
            case 'x':
                platformUserId = userInfo.data.id;
                accountName = userInfo.data.name;
                accountUsername = userInfo.data.username;
                accountAvatar = userInfo.data.profile_image_url;
                break;
            case 'linkedin':
                // Try to find a managed page first
                const orgs = await fetchLinkedInOrganizations(accessToken);
                if (orgs && orgs.length > 0) {
                    const primaryOrgUrn = orgs[0].organizationalTarget;
                    const orgDetails = await fetchLinkedInOrgDetails(accessToken, primaryOrgUrn);

                    if (orgDetails) {
                        platformUserId = primaryOrgUrn; // Store full URN for pages
                        accountName = orgDetails.localizedName || orgDetails.vanityName;
                        // Handle logo if exists
                        accountAvatar = userInfo.picture; // Keep user avatar for now or try to get logo
                        if (orgDetails.logoV2) {
                            // Extracting logo is complex, stick to user avatar for simplicity
                        }
                    } else {
                        platformUserId = `urn:li:person:${userInfo.sub}`;
                        accountName = userInfo.name;
                        accountAvatar = userInfo.picture;
                    }
                } else {
                    platformUserId = `urn:li:person:${userInfo.sub}`;
                    accountName = userInfo.name;
                    accountAvatar = userInfo.picture;
                }
                break;
            case 'tiktok':
                platformUserId = userInfo.data.user.open_id;
                accountName = userInfo.data.user.display_name;
                accountUsername = userInfo.data.user.username;
                accountAvatar = userInfo.data.user.avatar_url;
                break;
            case 'reddit':
                platformUserId = userInfo.id;
                accountName = userInfo.name;
                accountUsername = userInfo.name;
                accountAvatar = userInfo.icon_img;
                break;
            default:
                throw new Error('Unsupported platform');
        }

        // Upsert connection
        const { error: upsertError } = await supabase
            .from('social_connections')
            .upsert({
                user_id: user.id,
                platform,
                platform_user_id: platformUserId,
                access_token: encrypt(accessToken),
                refresh_token: refreshToken ? encrypt(refreshToken) : null,
                token_expires_at: expiresIn
                    ? new Date(Date.now() + expiresIn * 1000).toISOString()
                    : null,
                account_name: accountName,
                account_username: accountUsername,
                account_avatar: accountAvatar,
                is_active: true,
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'user_id,platform,platform_user_id',
            });

        if (upsertError) {
            throw upsertError;
        }

        return NextResponse.redirect(new URL('/connections?success=connected', request.url));
    } catch (error: any) {
        console.error('OAuth callback error:', error);
        return NextResponse.redirect(
            new URL(`/connections?error=${encodeURIComponent(error.message)}`, request.url)
        );
    }
}
