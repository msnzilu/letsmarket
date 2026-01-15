// lib/api-keys.ts
import { crypto } from 'next/dist/compiled/@edge-runtime/primitives/crypto';
// Note: In standard Node, we'd use 'crypto' module. Using a cross-env approach.

export async function generateApiKey() {
    const buffer = new Uint8Array(32);
    globalThis.crypto.getRandomValues(buffer);
    const key = `lm_${Array.from(buffer).map(b => b.toString(16).padStart(2, '0')).join('')}`;

    // Hash for storage
    const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(key));
    const hash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

    return { key, hash, prefix: key.substring(0, 10) + '...' };
}

export async function hashApiKey(key: string) {
    const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(key));
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}
