import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getScoreColor, getScoreBgColor, getScoreLabel } from '@/lib/utils';
import { PrincipleScore } from '@/types';
import { getPrincipleSlug } from '@/lib/principles-data';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface ScoreCardProps {
    principle: PrincipleScore;
}

export default function ScoreCard({ principle }: ScoreCardProps) {
    const slug = getPrincipleSlug(principle.name);
    
    return (
        <Card className={`p-6 ${getScoreBgColor(principle.score)} hover:shadow-lg transition-all`}>
            <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg">{principle.name}</h3>
                <Badge variant="outline" className={getScoreColor(principle.score)}>
                    {getScoreLabel(principle.score)}
                </Badge>
            </div>

            <div className="mb-4">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-sm text-slate-600">Score</span>
                    <span className={`text-3xl font-bold ${getScoreColor(principle.score)}`}>
                        {principle.score}
                    </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full transition-all ${principle.score < 40
                            ? 'bg-red-600'
                            : principle.score < 70
                                ? 'bg-yellow-600'
                                : 'bg-green-600'
                            }`}
                        style={{ width: `${principle.score}%` }}
                    />
                </div>
            </div>

            <p className="text-sm text-slate-700 mb-3">{principle.explanation}</p>

            {principle.examples.length > 0 && (
                <div className="mb-3">
                    <p className="text-xs font-semibold text-green-700 mb-1">✓ What's Working:</p>
                    <ul className="text-xs text-slate-600 space-y-1">
                        {principle.examples.map((example, i) => (
                            <li key={i}>• {example}</li>
                        ))}
                    </ul>
                </div>
            )}

            {principle.missing.length > 0 && (
                <div className="mb-4">
                    <p className="text-xs font-semibold text-red-700 mb-1">✗ What's Missing:</p>
                    <ul className="text-xs text-slate-600 space-y-1">
                        {principle.missing.map((item, i) => (
                            <li key={i}>• {item}</li>
                        ))}
                    </ul>
                </div>
            )}

            <Link href={`/principles/${slug}`}>
                <Button variant="outline" size="sm" className="w-full mt-2">
                    Learn How to Improve
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </Link>
        </Card>
    );
}