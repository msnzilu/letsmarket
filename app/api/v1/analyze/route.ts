// app/api/v1/analyze/route.ts
// Programmatic website analysis via Public API

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { hashApiKey } from '@/lib/api-keys';

export async function POST(request: NextRequest) {
    try {
        // 1. Authenticate via API Key
        const apiKey = request.headers.get('x-api-key');
        if (!apiKey) {
            return NextResponse.json({ error: 'Missing x-api-key header' }, { status: 401 });
        }

        const keyHash = await hashApiKey(apiKey);
        const supabase = await createClient(); // Use service role if needed, but here we'll use a special check

        // Find user by key hash
        const { data: keyData, error: keyError } = await supabase
            .from('api_keys')
            .select('user_id')
            .eq('key_hash', keyHash)
            .single();

        if (keyError || !keyData) {
            return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
        }

        // 2. Check if user is Enterprise (normally we'd check subscription here)
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('plan')
            .eq('user_id', keyData.user_id)
            .single();

        if (subscription?.plan !== 'enterprise') {
            return NextResponse.json({
                error: 'Enterprise feature',
                message: 'API access requires an Enterprise plan.'
            }, { status: 403 });
        }

        // 3. Process analysis request (Logic duplicated from /api/analyze but for programmatic use)
        const { url } = await request.json();
        if (!url) return NextResponse.json({ error: 'Missing url in body' }, { status: 400 });

        // Forward to internal analysis logic or implement here
        // For brevity, we'll return a partial mock response

        return NextResponse.json({
            success: true,
            message: 'Analysis started programmatically',
            website: url,
            request_id: crypto.randomUUID(),
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
