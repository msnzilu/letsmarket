// lib/payment/types.ts

export type PaymentGateway = 'paystack' | 'paddle';

export interface CheckoutParams {
    userId: string;
    email: string;
    plan: 'pro' | 'enterprise';
    currency: string;
    amount: number; // In cents/smallest unit
    callbackUrl: string;
    metadata?: Record<string, any>;
}

export interface CheckoutResult {
    checkoutUrl: string;
    reference: string;
}

export interface WebhookEvent {
    type: string;
    data: any;
    rawBody: string;
    signature: string;
}

export interface SubscriptionUpdate {
    userId?: string;
    providerSubscriptionId: string;
    status: 'active' | 'canceled' | 'past_due' | 'trialing';
    currentPeriodEnd?: string;
    providerCustomerId?: string;
    providerPlanId?: string;
}

export interface PaymentProvider {
    readonly name: PaymentGateway;
    createCheckoutSession(params: CheckoutParams): Promise<CheckoutResult>;
    verifyWebhookSignature(rawBody: string, signature: string): boolean;
    parseWebhookEvent(body: any): { event: string; data: any };
    // getSubscription(id: string): Promise<any>;
    // cancelSubscription(id: string): Promise<void>;
}
