// app/api/campaigns/[id]/route.ts
// Individual campaign operations

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: campaign, error } = await supabase
            .from('campaigns')
            .select(`
                *,
                campaign_accounts (
                    id,
                    connection_id,
                    enabled,
                    social_connections (
                        id,
                        platform,
                        account_name,
                        account_avatar
                    )
                ),
                campaign_posts (
                    id,
                    content,
                    platform,
                    status,
                    scheduled_for,
                    published_at,
                    platform_post_url
                ),
                analyses (
                    id,
                    overall_score,
                    generated_copy
                )
            `)
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (error) throw error;

        return NextResponse.json({ campaign });
    } catch (error: any) {
        console.error('Error fetching campaign:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const allowedFields = [
            'name', 'description', 'status', 'schedule_type',
            'schedule_days', 'schedule_time', 'posts_per_week'
        ];

        const updates: Record<string, any> = {};
        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                updates[field] = body[field];
            }
        }

        const { data: campaign, error } = await supabase
            .from('campaigns')
            .update(updates)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ campaign });
    } catch (error: any) {
        console.error('Error updating campaign:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { error } = await supabase
            .from('campaigns')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting campaign:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
