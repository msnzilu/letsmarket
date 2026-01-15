// app/api/subscription/checkout/route.ts
// Initialize Paystack checkout for subscription

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { initializeTransaction } from '@/lib/paystack';
import { PLAN_PRICES, Plan } from '@/lib/subscription';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { plan } = await request.json() as { plan: Plan };

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

        const amount = PLAN_PRICES[plan];
        const reference = `sub_${user.id}_${Date.now()}`;
        const callback_url = `${process.env.NEXT_PUBLIC_APP_URL}/api/subscription/callback`;

        const result = await initializeTransaction({
            email: user.email!,
            amount,
            reference,
            callback_url,
            metadata: {
                user_id: user.id,
                plan,
                type: 'subscription',
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
