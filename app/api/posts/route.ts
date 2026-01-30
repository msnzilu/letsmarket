// app/api/posts/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - List all user's scheduled/published posts
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        let query = supabase
            .from('scheduled_posts')
            .select(`
                *,
                connection:social_connections(id, platform, account_name, account_avatar)
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (status) {
            query = query.eq('status', status);
        }

        const { data: posts, error } = await query;

        // If table doesn't exist yet, return empty array
        if (error) {
            if (error.code === '42P01' || error.message?.includes('does not exist')) {
                return NextResponse.json({ posts: [], tableNotCreated: true });
            }
            throw error;
        }

        return NextResponse.json({ posts: posts || [] });
    } catch (error: any) {
        console.error('Error fetching posts:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch posts' },
            { status: 500 }
        );
    }
}

// POST - Create a new scheduled post
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { connectionId, content, copyType, analysisId, scheduledFor } = body;

        if (!connectionId || !content) {
            return NextResponse.json(
                { error: 'Connection ID and content are required' },
                { status: 400 }
            );
        }

        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Premium Check
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('plan, status')
            .eq('user_id', user.id)
            .single();

        const { getEffectivePlan } = await import('@/lib/subscription');
        const plan = getEffectivePlan(subscription as any);

        if (plan === 'free') {
            return NextResponse.json(
                { error: 'Pro subscription required for social posting' },
                { status: 403 }
            );
        }

        // Verify the connection belongs to the user
        const { data: connection } = await supabase
            .from('social_connections')
            .select('id, platform')
            .eq('id', connectionId)
            .eq('user_id', user.id)
            .single();

        if (!connection) {
            return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
        }

        // Create the post
        let finalScheduledFor = scheduledFor;
        if (scheduledFor) {
            const scheduledDate = new Date(scheduledFor);
            const now = new Date();
            if (scheduledDate < now) {
                // If in the past, set to 2 minutes from now to give the system time to process
                finalScheduledFor = new Date(now.getTime() + 2 * 60 * 1000).toISOString();
            }
        }

        const postData = {
            user_id: user.id,
            connection_id: connectionId,
            content,
            copy_type: copyType || 'custom',
            analysis_id: analysisId || null,
            scheduled_for: finalScheduledFor || null,
            status: finalScheduledFor ? 'scheduled' : 'draft',
        };

        const { data: post, error: insertError } = await supabase
            .from('scheduled_posts')
            .insert(postData)
            .select(`
                *,
                connection:social_connections(id, platform, account_name, account_avatar)
            `)
            .single();

        if (insertError) {
            throw insertError;
        }

        return NextResponse.json({ post });
    } catch (error: any) {
        console.error('Error creating post:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create post' },
            { status: 500 }
        );
    }
}
