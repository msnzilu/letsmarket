// app/api/webhooks/paystack/route.ts
// Handle Paystack webhook events

import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/paystack';
import { createClient } from '@supabase/supabase-js';

// Use service role for webhook (no user context)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    const signature = request.headers.get('x-paystack-signature');
    const body = await request.text();

    // Verify webhook signature
    if (!signature || !verifyWebhookSignature(body, signature)) {
        console.error('Invalid Paystack webhook signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);
    console.log('Paystack webhook event:', event.event);

    try {
        switch (event.event) {
            case 'charge.success':
                await handleChargeSuccess(event.data);
                break;

            case 'subscription.create':
                await handleSubscriptionCreated(event.data);
                break;

            case 'subscription.disable':
                await handleSubscriptionCanceled(event.data);
                break;

            case 'invoice.payment_failed':
                await handlePaymentFailed(event.data);
                break;

            default:
                console.log('Unhandled event:', event.event);
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

async function handleChargeSuccess(data: any) {
    const { reference, customer, metadata, amount } = data;

    // Only handle subscription payments
    if (metadata?.type !== 'subscription') return;

    const userId = metadata.user_id;
    const plan = metadata.plan || 'pro';

    // Update subscription
    await supabase
        .from('subscriptions')
        .upsert({
            user_id: userId,
            plan,
            status: 'active',
            paystack_customer_id: String(customer.id),
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
        }, {
            onConflict: 'user_id',
        });

    // Record payment
    await supabase.from('payment_history').insert({
        user_id: userId,
        amount,
        currency: 'NGN',
        status: 'success',
        paystack_reference: reference,
        description: `Subscription payment - ${plan}`,
    });
}

async function handleSubscriptionCreated(data: any) {
    const { customer, subscription_code, plan, next_payment_date } = data;

    // Find user by customer email
    const { data: users } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('paystack_customer_id', String(customer.id));

    if (users && users.length > 0) {
        await supabase
            .from('subscriptions')
            .update({
                paystack_subscription_code: subscription_code,
                paystack_plan_code: plan.plan_code,
                current_period_end: next_payment_date,
            })
            .eq('user_id', users[0].user_id);
    }
}

async function handleSubscriptionCanceled(data: any) {
    const { subscription_code } = data;

    await supabase
        .from('subscriptions')
        .update({
            status: 'canceled',
            cancel_at_period_end: true,
        })
        .eq('paystack_subscription_code', subscription_code);
}

async function handlePaymentFailed(data: any) {
    const { subscription } = data;

    await supabase
        .from('subscriptions')
        .update({
            status: 'past_due',
        })
        .eq('paystack_subscription_code', subscription.subscription_code);
}
