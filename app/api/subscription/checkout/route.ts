// app/api/subscription/checkout/route.ts
// Initialize Paystack checkout for subscription

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PaymentFactory } from '@/lib/payment/factory';
import { Plan } from '@/lib/subscription';
import { getAppUrl } from '@/lib/utils';

// Base prices in USD
const BASE_PRICES_USD: Record<'free' | 'pro' | 'enterprise', number> = {
    free: 0,
    pro: 49,
    enterprise: 0,
};


export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { plan } = await request.json() as { plan: Plan };
        const currency = 'USD';

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

        // Calculate amount in cents
        const baseUSD = BASE_PRICES_USD[plan];
        const amount = Math.round(baseUSD * 100);

        const callbackUrl = `${getAppUrl()}/api/subscription/callback`;

        const provider = PaymentFactory.getProvider();

        const result = await provider.createCheckoutSession({
            userId: user.id,
            email: user.email!,
            plan: plan as 'pro' | 'enterprise',
            currency,
            amount,
            callbackUrl,
            metadata: {
                user_id: user.id,
                plan,
                type: 'subscription',
                currency,
            },
        });

        return NextResponse.json({
            authorization_url: result.checkoutUrl,
            reference: result.reference,
            provider: provider.name
        });
    } catch (error: any) {
        console.error('Checkout error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to initialize checkout' },
            { status: 500 }
        );
    }
}
