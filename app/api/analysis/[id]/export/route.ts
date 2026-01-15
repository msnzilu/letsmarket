// app/api/analysis/[id]/export/route.ts
// Export analysis report as PDF

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateAnalysisPDF } from '@/lib/pdf-generator';
import { getEffectivePlan, canAccessFeature } from '@/lib/subscription';

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

        // Fetch analysis and website data
        const { data: analysis, error: analysisError } = await supabase
            .from('analyses')
            .select(`
                *,
                websites (
                    url
                )
            `)
            .eq('id', id)
            .single();

        if (analysisError || !analysis) {
            return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
        }

        // Check subscription status
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .single();

        const plan = getEffectivePlan(subscription);
        const { allowed } = canAccessFeature(plan, 'export_reports');

        if (!allowed) {
            return NextResponse.json({
                error: 'Premium feature',
                message: 'Upgrade to Pro to export PDF reports'
            }, { status: 403 });
        }

        // Generate PDF
        const pdfBytes = await generateAnalysisPDF(analysis, analysis.websites?.url || 'Unknown');

        // Return PDF as response
        const filename = `LetsMarket_Report_${new Date().toISOString().split('T')[0]}.pdf`;

        return new Response(pdfBytes as any, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Content-Length': pdfBytes.length.toString(),
            },
        });

    } catch (error: any) {
        console.error('PDF Export error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to export PDF' },
            { status: 500 }
        );
    }
}
