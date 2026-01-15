// app/api/subscription/checkout/route.ts
// Initialize Paystack checkout for subscription

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { initializeTransaction } from '@/lib/paystack';
import { Plan } from '@/lib/subscription';

// Base prices in USD
const BASE_PRICES_USD: Record<'free' | 'pro' | 'enterprise', number> = {
    free: 0,
    pro: 29,
    enterprise: 0,
};

// Approximate USD to KES rate
const KES_RATE = 130;

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { plan, currency = 'KES' } = await request.json() as { plan: Plan; currency?: 'KES' | 'USD' };

        if (!plan || !['pro', 'enterprise'].includes(plan)) {
            return NextResponse.json(
                { error: 'Invalid plan selected' },
                { status: 400 }
            );
        }

        if (plan === 'enterprise') {
            return NextResponse.json(
                { error: 'Please contact sales for Enterprise pricing' },
                { status: 400 }
            );
        }

        // Calculate amount in smallest currency unit (cents/cents)
        const baseUSD = BASE_PRICES_USD[plan];
        // For KES: convert USD to KES then multiply by 100 (Paystack uses smallest unit)
        // For USD: multiply by 100 (cents)
        const amount = currency === 'KES'
            ? Math.round(baseUSD * KES_RATE * 100)
            : Math.round(baseUSD * 100);

        const reference = `sub_${user.id}_${Date.now()}`;
        const callback_url = `${process.env.NEXT_PUBLIC_APP_URL}/api/subscription/callback`;

        const result = await initializeTransaction({
            email: user.email!,
            amount,
            reference,
            callback_url,
            currency, // Pass currency to Paystack
            metadata: {
                user_id: user.id,
                plan,
                type: 'subscription',
                currency,
            },
        });

        return NextResponse.json({
            authorization_url: result.data.authorization_url,
            reference: result.data.reference,
        });
    } catch (error: any) {
        console.error('Checkout error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to initialize checkout' },
            { status: 500 }
        );
    }
}
