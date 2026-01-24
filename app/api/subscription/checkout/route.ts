// app/api/subscription/checkout/route.ts
// Initialize Paystack checkout for subscription

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PaymentFactory } from '@/lib/payment/factory';
import { Plan } from '@/lib/subscription';
import { getAppUrl } from '@/lib/utils';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { plan, interval = 'month' } = await request.json() as {
            plan: Plan;
            interval?: 'month' | 'year'
        };
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

        // Calculate amount in cents using lib/subscription constants
        const { PLAN_PRICES } = await import('@/lib/subscription');
        const amount = PLAN_PRICES[plan as keyof typeof PLAN_PRICES][interval as 'month' | 'year'];

        if (!amount && amount !== 0) {
            return NextResponse.json(
                { error: 'Invalid interval selected' },
                { status: 400 }
            );
        }

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
                interval,
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
