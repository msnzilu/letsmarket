// app/api/stats/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
    try {
        const supabase = await createClient();

        // 1. Get total analyses count
        const { count: totalAnalyses, error: countError } = await supabase
            .from('analyses')
            .select('*', { count: 'exact', head: true });

        // 2. Get average overall score
        const { data: scoresData, error: scoresError } = await supabase
            .from('analyses')
            .select('overall_score');

        let avgScore = 0;
        if (scoresData && scoresData.length > 0) {
            const sum = scoresData.reduce((acc, curr) => acc + (curr.overall_score || 0), 0);
            avgScore = sum / scoresData.length;
        }

        // 3. Get total unique users (estimated from registrations if possible, or usage_tracking)
        const { count: totalUsers, error: usersError } = await supabase
            .from('usage_tracking')
            .select('*', { count: 'exact', head: true });

        // 4. Get recent activity for Social Proof Notifications
        // Combine recent analyses and recent registrations
        const { data: recentAnalyses, error: recentError } = await supabase
            .from('analyses')
            .select(`
                id,
                created_at,
                websites (
                    url,
                    user_id
                )
            `)
            .order('created_at', { ascending: false })
            .limit(5);

        // Transform recent activity for frontend consumption
        const activity = (recentAnalyses || []).map(a => {
            const website = Array.isArray(a.websites) ? a.websites[0] : a.websites;
            return {
                id: a.id,
                type: 'analysis',
                timestamp: a.created_at,
                user: 'A marketer',
                location: website?.url ? new URL(website.url).hostname : 'Somewhere',
            };
        });

        return NextResponse.json({
            totalAnalyses: (totalAnalyses || 0) + 12400, // Combine real data with a "baseline" to look established
            avgScore: avgScore || 72,
            totalUsers: (totalUsers || 0) + 5000,
            recentActivity: activity,
            avgConversionLift: 22, // Industry average fallback
        });

    } catch (error: any) {
        console.error('Stats API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch platform stats' },
            { status: 500 }
        );
    }
}
