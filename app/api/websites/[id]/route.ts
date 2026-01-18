// app/api/websites/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

        // Delete the website
        // Note: Supabase FK constraints should handle cascading deletes for analyses if configured,
        // otherwise we might need to delete analyses first. 
        // Based on the migrations, let's assume standard behavior or handle error.
        const { error: deleteError } = await supabase
            .from('websites')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id); // Ensure user owns the website

        if (deleteError) {
            throw deleteError;
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting website:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to delete website' },
            { status: 500 }
        );
    }
}
