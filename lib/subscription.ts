// lib/subscription.ts
// Subscription utilities and feature access control

export type Plan = 'free' | 'pro' | 'enterprise';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing';

export interface Subscription {
    id: string;
    user_id: string;
    plan: Plan;
    status: SubscriptionStatus;
    provider: string;
    provider_customer_id?: string;
    provider_subscription_id?: string;
    provider_plan_id?: string;
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
export const UNLIMITED = 999999999;

export const PLAN_LIMITS = {
    free: {
        analyses_total: 1,
        analyses_per_month: 1,
        headlines_per_analysis: 5,
        ctas_per_analysis: 5,
        social_accounts: 0,
        posts_per_month: 0,
        team_members: 1,
        export_reports: false,
    },
    pro: {
        analyses_total: UNLIMITED,
        analyses_per_month: UNLIMITED,
        headlines_per_analysis: UNLIMITED,
        ctas_per_analysis: UNLIMITED,
        social_accounts: 5,
        posts_per_month: UNLIMITED,
        team_members: 5,
        export_reports: true,
    },
    enterprise: {
        analyses_total: UNLIMITED,
        analyses_per_month: UNLIMITED,
        headlines_per_analysis: UNLIMITED,
        ctas_per_analysis: UNLIMITED,
        social_accounts: UNLIMITED,
        posts_per_month: UNLIMITED,
        team_members: UNLIMITED,
        export_reports: true,
    },
} as const;

// Plan prices in cents (Smallest currency unit)
export const PLAN_PRICES = {
    free: 0,
    pro: 4900, // $49.00
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

    if (limit === Infinity || limit === UNLIMITED) {
        return { allowed: true, limit: limit as any, remaining: UNLIMITED };
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
