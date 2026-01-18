// app/api/webhooks/paddle/route.ts
// Handle Paddle webhook events

import { NextRequest, NextResponse } from 'next/server';
import { PaymentFactory } from '@/lib/payment/factory';
import { createClient } from '@supabase/supabase-js';

function getSupabaseClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

export async function POST(request: NextRequest) {
    const provider = PaymentFactory.getProvider('paddle');
    const signature = request.headers.get('paddle-signature'); // Verify actual header name
    const body = await request.text();

    if (!signature || !provider.verifyWebhookSignature(body, signature)) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const eventData = JSON.parse(body);
    const { event, data } = provider.parseWebhookEvent(eventData);

    try {
        switch (event) {
            case 'subscription.created':
                await handleSubscriptionCreated(data);
                break;
            case 'subscription.updated':
                await handleSubscriptionUpdated(data);
                break;
            case 'subscription.canceled':
                await handleSubscriptionCanceled(data);
                break;
            case 'transaction.completed':
                await handleTransactionCompleted(data);
                break;
            case 'adjustment.created':
                await handleAdjustmentCreated(data);
                break;
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error('Paddle webhook error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function handleSubscriptionCreated(data: any) {
    const supabase = getSupabaseClient();
    const userId = data.custom_data?.user_id;

    if (!userId) return;

    await supabase
        .from('subscriptions')
        .upsert({
            user_id: userId,
            plan: data.custom_data?.plan || 'pro',
            status: 'active',
            provider: 'paddle',
            provider_customer_id: data.customer_id,
            provider_subscription_id: data.id,
            provider_plan_id: data.items[0]?.price_id,
            current_period_end: data.next_billed_at
        }, { onConflict: 'user_id' });
}

async function handleSubscriptionUpdated(data: any) {
    const supabase = getSupabaseClient();
    await supabase
        .from('subscriptions')
        .update({
            status: data.status,
            current_period_end: data.next_billed_at
        })
        .eq('provider_subscription_id', data.id)
        .eq('provider', 'paddle');
}

async function handleSubscriptionCanceled(data: any) {
    const supabase = getSupabaseClient();
    await supabase
        .from('subscriptions')
        .update({
            status: 'canceled',
            cancel_at_period_end: true
        })
        .eq('provider_subscription_id', data.id)
        .eq('provider', 'paddle');
}

async function handleTransactionCompleted(data: any) {
    const supabase = getSupabaseClient();
    const userId = data.custom_data?.user_id;

    if (!userId) return;

    await supabase.from('payment_history').insert({
        user_id: userId,
        amount: data.details.totals.total,
        currency: data.currency_code,
        status: 'success',
        provider: 'paddle',
        provider_reference: data.id,
        description: `Paddle payment - ${data.custom_data?.plan}`
    });
}

async function handleAdjustmentCreated(data: any) {
    // Paddle adjustment event covers refunds
    const supabase = getSupabaseClient();
    const subscriptionId = data.subscription_id;

    if (!subscriptionId) return;

    // Update subscription status
    await supabase
        .from('subscriptions')
        .update({ status: 'canceled' })
        .eq('provider_subscription_id', subscriptionId)
        .eq('provider', 'paddle');

    // Record adjustment in history if possible
    // Note: adjustment data might not have user_id directly, would need to lookup first
    const { data: sub } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('provider_subscription_id', subscriptionId)
        .single();

    if (sub) {
        await supabase.from('payment_history').insert({
            user_id: sub.user_id,
            amount: data.totals.total,
            currency: data.currency_code,
            status: 'refunded',
            provider: 'paddle',
            provider_reference: data.id,
            description: 'Paddle Refund/Adjustment'
        });
    }
}
