// app/dashboard/page.tsx

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import { Website, Analysis } from '@/types';
import DashboardStats from '@/components/DashboardStats';
import AnalysisCard from '@/components/AnalysisCard';

export default async function DashboardPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch all websites with their latest analysis
    const { data: websites, error } = await supabase
        .from('websites')
        .select(`
      *,
      analyses (*)
    `)
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

    if (error) {
        console.error('Error fetching websites:', error);
    }

    const websitesWithAnalyses = (websites || []) as (Website & { analyses: Analysis[] })[];
    const totalAnalyses = websitesWithAnalyses.reduce(
        (acc, w) => acc + (w.analyses?.length || 0),
        0
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Stats Section */}
            <DashboardStats
                websiteCount={websitesWithAnalyses.length}
                analysisCount={totalAnalyses}
            />

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Your Websites</h1>
                    <p className="text-slate-600">
                        Analyze websites and generate high-converting copy
                    </p>
                </div>
                <Link href="/analyze">
                    <Button size="lg">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Analyze New Website
                    </Button>
                </Link>
            </div>

            {websitesWithAnalyses.length === 0 ? (
                <Card className="p-12 text-center">
                    <TrendingUp className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                    <h2 className="text-xl font-semibold mb-2">No websites analyzed yet</h2>
                    <p className="text-slate-600 mb-6">
                        Start by analyzing your first website to get AI-powered insights
                    </p>
                    <Link href="/analyze">
                        <Button>Analyze Your First Website</Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {websitesWithAnalyses.map((website) => (
                        <AnalysisCard
                            key={website.id}
                            website={website}
                            analysis={website.analyses?.[0]}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}