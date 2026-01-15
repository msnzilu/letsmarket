// app/api/team/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getEffectivePlan } from '@/lib/subscription';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Get organization first
        const { data: org } = await supabase
            .from('organizations')
            .select('*')
            .or(`owner_id.eq.${user.id}`)
            .single();

        if (!org) {
            return NextResponse.json({ members: [] });
        }

        const { data: members, error } = await supabase
            .from('team_members')
            .select(`
                id,
                role,
                joined_at,
                user_id,
                org_id
            `)
            .eq('org_id', org.id);

        if (error) throw error;

        return NextResponse.json({ members, org });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Verify Enterprise plan
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .single();

        const plan = getEffectivePlan(subscription);
        if (plan !== 'enterprise') {
            return NextResponse.json({ error: 'Enterprise plan required for teams' }, { status: 403 });
        }

        const { email, role = 'member' } = await request.json();
        if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

        // Logic for inviting member (Simplified: find user by email and add to team_members)
        // In a real app, this would send an invitation email

        return NextResponse.json({ success: true, message: 'Invitation functionality coming soon' });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
