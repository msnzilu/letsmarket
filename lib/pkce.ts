// lib/pkce.ts
// PKCE (Proof Key for Code Exchange) utilities

export function generateCodeVerifier(): string {
    const array = new Uint8Array(32);
    if (typeof window !== 'undefined') {
        window.crypto.getRandomValues(array);
    } else {
        // Fallback for server-side although PKCE generation usually happens on client
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
    return b64(array);
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
    if (typeof window === 'undefined') {
        // Fallback for plain method if on server
        return verifier;
    }
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return b64(new Uint8Array(digest));
}

function b64(buffer: Uint8Array): string {
    return btoa(String.fromCharCode(...buffer))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}
