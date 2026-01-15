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
        const metadata = result.data.customer as any;

        // Extract user_id and plan from reference
        // Reference format: sub_<userId>_<timestamp>
        const refParts = ref.split('_');
        const userId = refParts[1];
        const plan = 'pro'; // Default to pro for now

        // Update subscription
        const { error: subError } = await supabase
            .from('subscriptions')
            .upsert({
                user_id: userId,
                plan,
                status: 'active',
                paystack_customer_id: String(result.data.customer.id),
                current_period_start: new Date().toISOString(),
                current_period_end: new Date(
                    Date.now() + 30 * 24 * 60 * 60 * 1000
                ).toISOString(), // 30 days
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
            paystack_reference: ref,
            paystack_transaction_id: String(result.data.id),
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
