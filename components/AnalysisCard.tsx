'use client';

// components/AnalysisCard.tsx
// Reusable card component for displaying website analysis summary

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, TrendingUp, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { getScoreColor } from '@/lib/utils';
import { Analysis, Website } from '@/types';

interface AnalysisCardProps {
    website: Website;
    analysis?: Analysis;
    onReanalyze?: () => void;
}

export default function AnalysisCard({ website, analysis, onReanalyze }: AnalysisCardProps) {
    return (
        <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold truncate">{website.url}</h3>
                        <a
                            href={website.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-slate-600 flex-shrink-0"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>

                    <p className="text-sm text-slate-500 mb-4">
                        Last analyzed: {new Date(website.updated_at).toLocaleDateString()}
                    </p>

                    {analysis ? (
                        <div className="flex gap-4 items-center">
                            <div>
                                <span className="text-sm text-slate-600">Score</span>
                                <div className={`text-3xl font-bold ${getScoreColor(analysis.overall_score)}`}>
                                    {analysis.overall_score}
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                                    {Object.entries(analysis.principle_scores).slice(0, 3).map(([key, principle]: [string, any]) => (
                                        <div key={key} className="flex justify-between">
                                            <span className="text-slate-600 truncate">{principle.name}:</span>
                                            <span className={`font-semibold ml-2 ${getScoreColor(principle.score)}`}>
                                                {principle.score}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-slate-500">
                            <BarChart3 className="w-4 h-4" />
                            <span>No analysis data</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-2 flex-shrink-0">
                    {analysis && (
                        <Link href={`/dashboard/${analysis.id}`}>
                            <Button variant="default">View Details</Button>
                        </Link>
                    )}
                    <Link href="/analyze">
                        <Button variant="outline" onClick={onReanalyze}>
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Re-analyze
                        </Button>
                    </Link>
                </div>
            </div>
        </Card>
    );
}
