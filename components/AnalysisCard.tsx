'use client';

// components/AnalysisCard.tsx
// Reusable card component for displaying website analysis summary

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, TrendingUp, BarChart3, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getScoreColor } from '@/lib/utils';
import { Analysis, Website } from '@/types';

interface AnalysisCardProps {
    website: Website;
    analysis?: Analysis;
    onReanalyze?: () => void;
}

export default function AnalysisCard({ website, analysis, onReanalyze }: AnalysisCardProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            const response = await fetch(`/api/websites/${website.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete website');
            }

            router.refresh();
        } catch (error) {
            console.error('Error deleting website:', error);
            alert('Failed to delete website');
        } finally {
            setIsDeleting(false);
            setShowConfirm(false);
        }
    };

    return (
        <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                <div className="flex-1 w-full">
                    <div className="flex items-center justify-between lg:justify-start gap-3 mb-2">
                        <h3 className="text-xl font-semibold truncate max-w-[200px] md:max-w-none">{website.url}</h3>
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
                        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                            <div className="flex flex-col items-center sm:items-start">
                                <span className="text-xs uppercase font-semibold text-slate-400">Score</span>
                                <div className={`text-4xl font-bold ${getScoreColor(analysis.overall_score)}`}>
                                    {analysis.overall_score}
                                </div>
                            </div>

                            <div className="flex-1 w-full border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 text-sm">
                                    {Object.entries(analysis.principle_scores).slice(0, 3).map(([key, principle]: [string, any]) => (
                                        <div key={key} className="flex justify-between items-center">
                                            <span className="text-slate-500 truncate">{principle.name}</span>
                                            <span className={`font-bold ml-2 ${getScoreColor(principle.score)}`}>
                                                {principle.score}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-slate-500 bg-slate-50 p-3 rounded-lg">
                            <BarChart3 className="w-4 h-4" />
                            <span className="text-sm font-medium">No analysis data available yet</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-2 w-full lg:w-auto lg:min-w-[160px]">
                    {analysis && (
                        <Link href={`/dashboard/${analysis.id}`} className="w-full">
                            <Button variant="default" className="w-full shadow-sm">View Details</Button>
                        </Link>
                    )}
                    <Link href="/analyze" className="w-full">
                        <Button variant="outline" className="w-full" onClick={onReanalyze}>
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Re-analyze
                        </Button>
                    </Link>

                    {showConfirm ? (
                        <div className="flex gap-2">
                            <Button
                                variant="destructive"
                                size="sm"
                                className="flex-1"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm'}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex-1 border"
                                onClick={() => setShowConfirm(false)}
                                disabled={isDeleting}
                            >
                                Cancel
                            </Button>
                        </div>
                    ) : (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center"
                            onClick={() => setShowConfirm(true)}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Website
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
}
