// app/api/connections/[id]/pages/route.ts
// Fetch available pages/organizations for a LinkedIn connection

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { decrypt } from '@/lib/encryption';
import { getLinkedInPages } from '@/lib/social/linkedin';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: connectionId } = await params;

        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get the connection
        const { data: connection, error: connError } = await supabase
            .from('social_connections')
            .select('*')
            .eq('id', connectionId)
            .eq('user_id', user.id)
            .single();

        if (connError || !connection) {
            return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
        }

        if (connection.platform !== 'linkedin') {
            return NextResponse.json({ error: 'Page selection is only available for LinkedIn' }, { status: 400 });
        }

        // Fetch available pages
        const accessToken = decrypt(connection.access_token);
        const pages = await getLinkedInPages(accessToken);

        console.log('[LinkedIn Pages] Found organizations:', pages.length);

        // Extract the person ID correctly - it could be stored as just the ID or as a full URN
        let personId = connection.platform_user_id;
        if (personId.startsWith('urn:li:person:')) {
            personId = personId.replace('urn:li:person:', '');
        } else if (personId.startsWith('urn:li:organization:')) {
            // If currently set to an org, we need a way to get the original person ID
            // For now, we'll skip adding personal profile if we don't have it
            personId = '';
        }

        // Build options list
        const options: Array<{ id: string; name: string; type: string }> = [];

        // Add personal profile option if we have a person ID
        if (personId) {
            options.push({
                id: `urn:li:person:${personId}`,
                name: `${connection.account_name} (Personal Profile)`,
                type: 'personal',
            });
        }

        // Add organization pages
        pages.forEach(page => {
            options.push({
                id: page.id,
                name: page.name,
                type: 'organization',
            });
        });

        console.log('[LinkedIn Pages] Total options:', options.length, options.map(o => o.name));

        return NextResponse.json({
            pages: options,
            currentSelection: connection.platform_user_id,
        });
    } catch (error: any) {
        console.error('Error fetching LinkedIn pages:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch pages' },
            { status: 500 }
        );
    }
}

// PATCH - Update the selected page for a connection
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: connectionId } = await params;
        const { pageId, pageName } = await request.json();

        if (!pageId) {
            return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
        }

        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Update the connection with the selected page
        const { data: updated, error: updateError } = await supabase
            .from('social_connections')
            .update({
                platform_user_id: pageId,
                account_name: pageName || undefined,
                updated_at: new Date().toISOString(),
            })
            .eq('id', connectionId)
            .eq('user_id', user.id)
            .select()
            .single();

        if (updateError) {
            throw updateError;
        }

        return NextResponse.json({ success: true, connection: updated });
    } catch (error: any) {
        console.error('Error updating LinkedIn page:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update page' },
            { status: 500 }
        );
    }
}
