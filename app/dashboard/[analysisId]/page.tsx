// app/dashboard/[analysisId]/page.tsx

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ScoreCard from '@/components/ScoreCard';
import CopySection from '@/components/CopySection';
import Link from 'next/link';
import { ArrowLeft, Download } from 'lucide-react';
import { getScoreColor, getDifficultyColor } from '@/lib/utils';
import { Analysis, Website } from '@/types';

export default async function AnalysisDetailPage({
    params,
}: {
    params: Promise<{ analysisId: string }>;
}) {
    const { analysisId } = await params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch the analysis with website info
    const { data: analysis, error } = await supabase
        .from('analyses')
        .select(`
      *,
      websites (*)
    `)
        .eq('id', analysisId)
        .single();

    if (error || !analysis) {
        redirect('/dashboard');
    }

    const analysisData = analysis as Analysis & { websites: Website };

    // Verify the website belongs to the user
    if (analysisData.websites.user_id !== user.id) {
        redirect('/dashboard');
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="mb-8">
                <Link href="/dashboard">
                    <Button variant="ghost" className="mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>
                </Link>

                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{analysisData.websites.url}</h1>
                        <p className="text-slate-600">
                            Analysis from {new Date(analysisData.created_at).toLocaleDateString()}
                        </p>
                    </div>
                    <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                    </Button>
                </div>
            </div>

            {/* Overall Score */}
            <Card className="p-8 mb-8 bg-gradient-to-br from-purple-50 to-blue-50">
                <div className="text-center">
                    <p className="text-lg text-slate-600 mb-2">Overall Conversion Score</p>
                    <div className={`text-7xl font-bold mb-4 ${getScoreColor(analysisData.overall_score)}`}>
                        {analysisData.overall_score}
                    </div>
                    <p className="text-slate-600">
                        {analysisData.overall_score < 40
                            ? 'Critical - Major improvements needed'
                            : analysisData.overall_score < 70
                                ? 'Good foundation with room for improvement'
                                : 'Excellent use of persuasion principles'}
                    </p>
                </div>
            </Card>

            {/* Principle Scores */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Persuasion Principles</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.values(analysisData.principle_scores).map((principle: any) => (
                        <ScoreCard key={principle.name} principle={principle} />
                    ))}
                </div>
            </div>

            {/* Generated Copy */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Generated Copy</h2>
                <CopySection
                    headlines={analysisData.generated_copy.headlines}
                    ctas={analysisData.generated_copy.ctas}
                    analysisId={analysisId}
                />
            </div>

            {/* Recommendations */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Top 10 Recommendations</h2>
                <div className="space-y-4">
                    {analysisData.recommendations.slice(0, 10).map((rec, i) => (
                        <Card key={i} className="p-6">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="font-semibold text-lg">
                                    {i + 1}. {rec.title}
                                </h3>
                                <div className="flex gap-2">
                                    <Badge className={getDifficultyColor(rec.difficulty)}>
                                        {rec.difficulty}
                                    </Badge>
                                    <Badge variant="outline">
                                        Impact: {rec.impactScore}/100
                                    </Badge>
                                </div>
                            </div>

                            <p className="text-slate-700 mb-3">{rec.description}</p>

                            <div className="bg-slate-50 p-4 rounded-lg">
                                <p className="text-sm font-semibold text-slate-700 mb-2">
                                    How to implement:
                                </p>
                                <p className="text-sm text-slate-600">{rec.implementation}</p>
                            </div>

                            <div className="mt-3">
                                <Badge variant="secondary">{rec.principle}</Badge>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}