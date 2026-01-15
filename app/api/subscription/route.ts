// app/api/subscription/route.ts
// Get current user's subscription status

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getEffectivePlan, getPlanLimits } from '@/lib/subscription';

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get subscription
        const { data: subscription, error: subError } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .single();

        // Get usage
        const { data: usage, error: usageError } = await supabase
            .from('usage_tracking')
            .select('*')
            .eq('user_id', user.id)
            .single();

        // Handle case where tables don't exist yet
        if (subError?.code === '42P01' || usageError?.code === '42P01') {
            return NextResponse.json({
                subscription: { plan: 'free', status: 'active' },
                usage: { analyses_count: 0, posts_count: 0 },
                limits: getPlanLimits('free'),
                tableNotCreated: true,
            });
        }

        const plan = getEffectivePlan(subscription);
        const limits = getPlanLimits(plan);

        return NextResponse.json({
            subscription: subscription || { plan: 'free', status: 'active' },
            usage: usage || { analyses_count: 0, posts_count: 0 },
            limits,
        });
    } catch (error: any) {
        console.error('Error fetching subscription:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch subscription' },
            { status: 500 }
        );
    }
}
