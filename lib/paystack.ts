// lib/paystack.ts
// Paystack API integration utilities

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

export interface PaystackCustomer {
    id: number;
    customer_code: string;
    email: string;
    first_name?: string;
    last_name?: string;
}

export interface PaystackPlan {
    id: number;
    name: string;
    plan_code: string;
    amount: number;
    interval: 'monthly' | 'annually';
}

export interface PaystackSubscription {
    id: number;
    status: string;
    subscription_code: string;
    email_token: string;
    next_payment_date: string;
}

/**
 * Make a request to Paystack API
 */
async function paystackRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<{ status: boolean; message: string; data: T }> {
    const response = await fetch(`${PAYSTACK_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Paystack API error');
    }

    return data;
}

/**
 * Initialize a payment transaction
 */
export async function initializeTransaction({
    email,
    amount,
    reference,
    metadata,
    callback_url,
    plan,
    currency,
}: {
    email: string;
    amount: number;
    reference?: string;
    metadata?: Record<string, any>;
    callback_url?: string;
    plan?: string;
    currency?: 'KES' | 'USD';
}) {
    return paystackRequest<{
        authorization_url: string;
        access_code: string;
        reference: string;
    }>('/transaction/initialize', {
        method: 'POST',
        body: JSON.stringify({
            email,
            amount,
            reference,
            metadata,
            callback_url,
            plan,
            currency,
        }),
    });
}

/**
 * Verify a transaction
 */
export async function verifyTransaction(reference: string) {
    return paystackRequest<{
        id: number;
        status: string;
        reference: string;
        amount: number;
        customer: PaystackCustomer;
        plan?: { plan_code: string };
    }>(`/transaction/verify/${reference}`);
}

/**
 * Create or get customer
 */
export async function createCustomer({
    email,
    first_name,
    last_name,
    metadata,
}: {
    email: string;
    first_name?: string;
    last_name?: string;
    metadata?: Record<string, any>;
}) {
    return paystackRequest<PaystackCustomer>('/customer', {
        method: 'POST',
        body: JSON.stringify({
            email,
            first_name,
            last_name,
            metadata,
        }),
    });
}

/**
 * Create a subscription
 */
export async function createSubscription({
    customer,
    plan,
    start_date,
}: {
    customer: string; // customer email or code
    plan: string; // plan code
    start_date?: string;
}) {
    return paystackRequest<PaystackSubscription>('/subscription', {
        method: 'POST',
        body: JSON.stringify({
            customer,
            plan,
            start_date,
        }),
    });
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription({
    subscription_code,
    email_token,
}: {
    subscription_code: string;
    email_token: string;
}) {
    return paystackRequest<{ status: boolean }>('/subscription/disable', {
        method: 'POST',
        body: JSON.stringify({
            code: subscription_code,
            token: email_token,
        }),
    });
}

/**
 * Get subscription details
 */
export async function getSubscription(subscriptionCode: string) {
    return paystackRequest<PaystackSubscription>(
        `/subscription/${subscriptionCode}`
    );
}

/**
 * List plans
 */
export async function listPlans() {
    return paystackRequest<PaystackPlan[]>('/plan');
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
    body: string,
    signature: string
): boolean {
    const crypto = require('crypto');
    const hash = crypto
        .createHmac('sha512', PAYSTACK_SECRET_KEY)
        .update(body)
        .digest('hex');
    return hash === signature;
}
