// lib/payment/providers/paystack.ts

import { PaymentProvider, CheckoutParams, CheckoutResult, PaymentGateway } from '../types';
import * as paystack from '../../paystack';

export class PaystackProvider implements PaymentProvider {
    readonly name: PaymentGateway = 'paystack';

    async createCheckoutSession(params: CheckoutParams): Promise<CheckoutResult> {
        const result = await paystack.initializeTransaction({
            email: params.email,
            amount: params.amount,
            reference: `sub_${params.userId}_${Date.now()}`,
            callback_url: params.callbackUrl,
            currency: params.currency as any,
            metadata: {
                ...params.metadata,
                user_id: params.userId,
                plan: params.plan,
                type: 'subscription',
                currency: params.currency,
                provider: 'paystack'
            },
        });

        return {
            checkoutUrl: result.data.authorization_url,
            reference: result.data.reference,
        };
    }

    verifyWebhookSignature(rawBody: string, signature: string): boolean {
        return paystack.verifyWebhookSignature(rawBody, signature);
    }

    parseWebhookEvent(body: any): { event: string; data: any } {
        return {
            event: body.event,
            data: body.data
        };
    }
}
