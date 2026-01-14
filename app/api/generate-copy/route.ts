// app/api/generate-copy/route.ts
// API endpoint for generating additional copy variations

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { analysisId, type } = await request.json();

        if (!analysisId) {
            return NextResponse.json({ error: 'Analysis ID is required' }, { status: 400 });
        }

        // Fetch the analysis
        const { data: analysis, error } = await supabase
            .from('analyses')
            .select('*, websites(*)')
            .eq('id', analysisId)
            .single();

        if (error || !analysis) {
            return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
        }

        // Verify ownership
        if (analysis.websites.user_id !== user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // Return existing generated copy
        // In a full implementation, this could generate more variations using OpenAI
        return NextResponse.json({
            headlines: analysis.generated_copy?.headlines || [],
            ctas: analysis.generated_copy?.ctas || [],
        });
    } catch (error: any) {
        console.error('Error generating copy:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate copy' },
            { status: 500 }
        );
    }
}
