// app/api/subscription/callback/route.ts
// Handle Paystack payment callback

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyTransaction } from '@/lib/paystack';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const reference = searchParams.get('reference');
    const trxref = searchParams.get('trxref');

    const ref = reference || trxref;

    if (!ref) {
        return NextResponse.redirect(
            new URL('/pricing?error=missing_reference', request.url)
        );
    }

    try {
        // Verify the transaction with Paystack
        const result = await verifyTransaction(ref);

        if (result.data.status !== 'success') {
            return NextResponse.redirect(
                new URL('/pricing?error=payment_failed', request.url)
            );
        }

        const supabase = await createClient();
        const metadata = result.data.metadata as any;

        // Extract user_id, plan, and interval from metadata
        const userId = metadata?.user_id;
        const plan = metadata?.plan || 'pro';
        const interval = metadata?.interval || 'month';

        if (!userId) {
            throw new Error('User ID not found in transaction metadata');
        }

        // Calculate period end based on interval
        const periodEndDate = new Date();
        if (interval === 'year') {
            periodEndDate.setFullYear(periodEndDate.getFullYear() + 1);
        } else {
            periodEndDate.setMonth(periodEndDate.getMonth() + 1);
        }

        // Update subscription
        const { error: subError } = await supabase
            .from('subscriptions')
            .upsert({
                user_id: userId,
                plan,
                interval,
                status: 'active',
                provider: 'paystack',
                provider_customer_id: String(result.data.customer.id),
                current_period_start: new Date().toISOString(),
                current_period_end: periodEndDate.toISOString(),
            }, {
                onConflict: 'user_id',
            });

        if (subError) {
            console.error('Error updating subscription:', subError);
        }

        // Record payment
        await supabase.from('payment_history').insert({
            user_id: userId,
            amount: result.data.amount,
            currency: 'NGN',
            status: 'success',
            provider: 'paystack',
            provider_reference: ref,
            description: `Subscription upgrade to ${plan}`,
        });

        return NextResponse.redirect(
            new URL('/dashboard?success=subscription_activated', request.url)
        );
    } catch (error: any) {
        console.error('Callback error:', error);
        return NextResponse.redirect(
            new URL(`/pricing?error=${encodeURIComponent(error.message)}`, request.url)
        );
    }
}
