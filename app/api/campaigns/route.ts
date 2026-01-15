// app/api/campaigns/route.ts
// CRUD for campaigns

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: campaigns, error } = await supabase
            .from('campaigns')
            .select(`
                *,
                campaign_accounts (
                    id,
                    connection_id,
                    enabled,
                    social_connections (
                        platform,
                        account_name,
                        account_avatar
                    )
                ),
                campaign_posts (
                    id,
                    status,
                    scheduled_for
                )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        // Handle table not created yet
        if (error?.code === '42P01') {
            return NextResponse.json({
                campaigns: [],
                tableNotCreated: true,
                message: 'Run the campaigns migration in Supabase SQL Editor'
            });
        }

        if (error) throw error;

        // Add stats to each campaign
        const campaignsWithStats = (campaigns || []).map(c => ({
            ...c,
            stats: {
                total_posts: c.campaign_posts?.length || 0,
                pending_posts: c.campaign_posts?.filter((p: any) => p.status === 'pending').length || 0,
                published_posts: c.campaign_posts?.filter((p: any) => p.status === 'published').length || 0,
            }
        }));

        return NextResponse.json({ campaigns: campaignsWithStats });
    } catch (error: any) {
        console.error('Error fetching campaigns:', error);
        // Return empty array instead of error to prevent breaking the UI
        return NextResponse.json({ campaigns: [], error: error.message });
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            name,
            description,
            analysis_id,
            website_id,
            schedule_type = 'weekly',
            schedule_days = [1], // Monday
            schedule_time = '09:00:00',
            schedule_timezone = 'UTC',
            posts_per_week = 3,
            connection_ids = [],
        } = body;

        if (!name) {
            return NextResponse.json({ error: 'Campaign name is required' }, { status: 400 });
        }

        // Create campaign
        const { data: campaign, error: campaignError } = await supabase
            .from('campaigns')
            .insert({
                user_id: user.id,
                name,
                description,
                analysis_id,
                website_id,
                schedule_type,
                schedule_days,
                schedule_time,
                schedule_timezone,
                posts_per_week,
                status: 'draft',
            })
            .select()
            .single();

        if (campaignError) throw campaignError;

        // Add campaign accounts
        if (connection_ids.length > 0) {
            const accountsToInsert = connection_ids.map((connId: string) => ({
                campaign_id: campaign.id,
                connection_id: connId,
            }));

            const { error: accountsError } = await supabase
                .from('campaign_accounts')
                .insert(accountsToInsert);

            if (accountsError) {
                console.error('Error adding campaign accounts:', accountsError);
            }
        }

        return NextResponse.json({ campaign });
    } catch (error: any) {
        console.error('Error creating campaign:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
