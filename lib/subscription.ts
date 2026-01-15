// lib/subscription.ts
// Subscription utilities and feature access control

export type Plan = 'free' | 'pro' | 'enterprise';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing';

export interface Subscription {
    id: string;
    user_id: string;
    plan: Plan;
    status: SubscriptionStatus;
    paystack_customer_id?: string;
    paystack_subscription_code?: string;
    current_period_start?: string;
    current_period_end?: string;
    cancel_at_period_end: boolean;
}

export interface UsageTracking {
    id: string;
    user_id: string;
    analyses_count: number;
    analyses_this_month: number;
    posts_count: number;
    posts_this_month: number;
}

// Feature limits by plan
export const PLAN_LIMITS = {
    free: {
        analyses_total: 3,
        analyses_per_month: 3,
        headlines_per_analysis: 5,
        ctas_per_analysis: 5,
        social_accounts: 0,
        posts_per_month: 0,
        team_members: 1,
        export_reports: false,
    },
    pro: {
        analyses_total: Infinity,
        analyses_per_month: Infinity,
        headlines_per_analysis: Infinity,
        ctas_per_analysis: Infinity,
        social_accounts: 5,
        posts_per_month: Infinity,
        team_members: 5,
        export_reports: true,
    },
    enterprise: {
        analyses_total: Infinity,
        analyses_per_month: Infinity,
        headlines_per_analysis: Infinity,
        ctas_per_analysis: Infinity,
        social_accounts: Infinity,
        posts_per_month: Infinity,
        team_members: Infinity,
        export_reports: true,
    },
} as const;

// Plan prices in cents (Paystack uses smallest currency unit)
export const PLAN_PRICES = {
    free: 0,
    pro: 2900, // $29.00
    enterprise: 0, // Custom pricing
} as const;

export type Feature = keyof typeof PLAN_LIMITS.free;

/**
 * Check if a subscription is currently active
 */
export function isSubscriptionActive(subscription: Subscription | null): boolean {
    if (!subscription) return false;
    return subscription.status === 'active' || subscription.status === 'trialing';
}

/**
 * Get the effective plan (defaults to free if no subscription)
 */
export function getEffectivePlan(subscription: Subscription | null): Plan {
    if (!subscription || !isSubscriptionActive(subscription)) {
        return 'free';
    }
    return subscription.plan;
}

/**
 * Get limits for a specific plan
 */
export function getPlanLimits(plan: Plan) {
    return PLAN_LIMITS[plan];
}

/**
 * Check if user can access a feature based on their plan
 */
export function canAccessFeature(
    plan: Plan,
    feature: Feature,
    currentUsage?: number
): { allowed: boolean; limit: number | boolean; remaining?: number } {
    const limits = PLAN_LIMITS[plan];
    const limit = limits[feature];

    if (typeof limit === 'boolean') {
        return { allowed: limit, limit };
    }

    if (limit === Infinity) {
        return { allowed: true, limit, remaining: Infinity };
    }

    const remaining = Math.max(0, limit - (currentUsage || 0));
    return {
        allowed: remaining > 0,
        limit,
        remaining,
    };
}

/**
 * Check if user needs to upgrade to access a feature
 */
export function requiresUpgrade(currentPlan: Plan, feature: Feature): Plan | null {
    const plans: Plan[] = ['free', 'pro', 'enterprise'];
    const currentIndex = plans.indexOf(currentPlan);

    for (let i = currentIndex; i < plans.length; i++) {
        const plan = plans[i];
        const { allowed } = canAccessFeature(plan, feature);
        if (allowed) {
            return i === currentIndex ? null : plan;
        }
    }

    return 'enterprise';
}

/**
 * Format plan name for display
 */
export function formatPlanName(plan: Plan): string {
    return plan.charAt(0).toUpperCase() + plan.slice(1);
}
