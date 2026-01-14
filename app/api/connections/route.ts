// app/api/connections/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Platform, SocialConnection } from '@/types';

// GET - List all user's social connections
export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: connections, error } = await supabase
            .from('social_connections')
            .select('id, platform, account_name, account_username, account_avatar, is_active, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        // If table doesn't exist yet, return empty array
        if (error) {
            if (error.code === '42P01' || error.message?.includes('does not exist')) {
                return NextResponse.json({ connections: [], tableNotCreated: true });
            }
            throw error;
        }

        return NextResponse.json({ connections: connections || [] });
    } catch (error: any) {
        console.error('Error fetching connections:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch connections' },
            { status: 500 }
        );
    }
}

// DELETE - Remove a social connection
export async function DELETE(request: NextRequest) {
    try {
        const { connectionId } = await request.json();

        if (!connectionId) {
            return NextResponse.json({ error: 'Connection ID is required' }, { status: 400 });
        }

        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify ownership before deleting
        const { error: deleteError } = await supabase
            .from('social_connections')
            .delete()
            .eq('id', connectionId)
            .eq('user_id', user.id);

        if (deleteError) {
            throw deleteError;
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting connection:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to delete connection' },
            { status: 500 }
        );
    }
}
