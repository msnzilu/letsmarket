// lib/payment/providers/paddle.ts

import { PaymentProvider, CheckoutParams, CheckoutResult, PaymentGateway } from '../types';

const PADDLE_API_KEY = process.env.PADDLE_API_KEY!;
const PADDLE_BASE_URL = process.env.PADDLE_SANDBOX === 'true'
    ? 'https://sandbox-api.paddle.com'
    : 'https://api.paddle.com';

export class PaddleProvider implements PaymentProvider {
    readonly name: PaymentGateway = 'paddle';

    async createCheckoutSession(params: CheckoutParams): Promise<CheckoutResult> {
        // In a real implementation, you would use Paddle SDK or make a POST to /transactions or /checkouts
        // For this decoupling demo, we'll implement the structure

        const response = await fetch(`${PADDLE_BASE_URL}/checkouts`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${PADDLE_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                items: [
                    {
                        price_id: params.metadata?.paddle_price_id || '', // Price ID from environment/config
                        quantity: 1
                    }
                ],
                customer_id: params.metadata?.paddle_customer_id, // If existing
                custom_data: {
                    user_id: params.userId,
                    plan: params.plan,
                    type: 'subscription'
                },
                return_url: params.callbackUrl
            })
        });

        const data = await response.json();

        // This is a simplified representation of Paddle's checkout response
        return {
            checkoutUrl: data.data?.url || '',
            reference: data.data?.id || ''
        };
    }

    verifyWebhookSignature(rawBody: string, signature: string): boolean {
        // Paddle signature verification logic
        // Typically involves hmac with a webhook secret
        return true; // Simplified for initial decoupling setup
    }

    parseWebhookEvent(body: any): { event: string; data: any } {
        return {
            event: body.event_type,
            data: body.data
        };
    }
}
