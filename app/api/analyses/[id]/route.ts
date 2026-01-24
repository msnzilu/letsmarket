// app/api/analyses/[id]/route.ts
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

        const { data: analysis, error } = await supabase
            .from('analyses')
            .select(`
                *,
                websites (url)
            `)
            .eq('id', id)
            .single();

        if (error) throw error;

        // Verify ownership
        const { data: website } = await supabase
            .from('websites')
            .select('user_id')
            .eq('id', analysis.website_id)
            .single();

        if (website?.user_id !== user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json({ analysis });
    } catch (error: any) {
        console.error('Error fetching analysis:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
