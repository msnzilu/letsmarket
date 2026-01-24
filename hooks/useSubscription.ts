// hooks/useSubscription.ts
// React hook for subscription status and feature access

'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plan, Feature, canAccessFeature, getEffectivePlan, PLAN_LIMITS, UNLIMITED, BillingInterval } from '@/lib/subscription';

interface SubscriptionData {
    plan: Plan;
    interval?: BillingInterval;
    status: string;
    current_period_end?: string;
}

interface UsageData {
    analyses_count: number;
    analyses_this_month: number;
    posts_count: number;
    posts_this_month: number;
}

interface UseSubscriptionReturn {
    subscription: SubscriptionData | null;
    usage: UsageData | null;
    plan: Plan;
    limits: typeof PLAN_LIMITS.free;
    isLoading: boolean;
    error: string | null;
    canAccess: (feature: Feature, currentUsage?: number) => boolean;
    getRemaining: (feature: Feature) => number;
    refresh: () => Promise<void>;
}

export function useSubscription(): UseSubscriptionReturn {
    const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
    const [usage, setUsage] = useState<UsageData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSubscription = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const res = await fetch('/api/subscription');
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to fetch subscription');
            }

            setSubscription(data.subscription);
            setUsage(data.usage);
        } catch (err: any) {
            setError(err.message);
            // Default to free plan on error
            setSubscription({ plan: 'free', status: 'active' });
            setUsage({ analyses_count: 0, analyses_this_month: 0, posts_count: 0, posts_this_month: 0 });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSubscription();
    }, [fetchSubscription]);

    const plan = getEffectivePlan(subscription as any);
    const limits = PLAN_LIMITS[plan] as typeof PLAN_LIMITS['free'];

    const canAccess = useCallback(
        (feature: Feature, currentUsage?: number) => {
            const result = canAccessFeature(plan, feature, currentUsage);
            return result.allowed;
        },
        [plan]
    );

    const getRemaining = useCallback(
        (feature: Feature) => {
            const limit = limits[feature];
            if (typeof limit === 'boolean') return limit ? UNLIMITED : 0;
            if (limit === (Infinity as any) || limit === (UNLIMITED as any)) return UNLIMITED;

            // Get current usage for this feature
            let currentUsage = 0;
            if (feature === 'analyses_total' || feature === 'analyses_per_month') {
                currentUsage = usage?.analyses_count || 0;
            } else if (feature === 'posts_per_month') {
                currentUsage = usage?.posts_this_month || 0;
            }

            return Math.max(0, limit - currentUsage);
        },
        [limits, usage]
    );

    return {
        subscription,
        usage,
        plan,
        limits,
        isLoading,
        error,
        canAccess,
        getRemaining,
        refresh: fetchSubscription,
    };
}
