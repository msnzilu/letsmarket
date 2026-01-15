// components/DashboardStats.tsx
// Dashboard stats component showing subscription and usage info

'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { TrendingUp, Link2, Send, Crown, Zap } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import PlanBadge from '@/components/PlanBadge';

interface DashboardStatsProps {
    websiteCount: number;
    analysisCount: number;
}

export default function DashboardStats({ websiteCount, analysisCount }: DashboardStatsProps) {
    const { plan, usage, limits, isLoading } = useSubscription();

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[1, 2, 3, 4].map(i => (
                    <Card key={i} className="p-4 animate-pulse">
                        <div className="h-4 bg-slate-200 rounded w-1/2 mb-2" />
                        <div className="h-8 bg-slate-200 rounded w-1/3" />
                    </Card>
                ))}
            </div>
        );
    }

    const analysesUsed = usage?.analyses_count || analysisCount;
    const analysesLimit = limits.analyses_total;
    const analysesPercent = analysesLimit === Infinity ? 0 : (analysesUsed / analysesLimit) * 100;

    const postsUsed = usage?.posts_this_month || 0;
    const postsLimit = limits.posts_per_month;

    const socialLimit = limits.social_accounts;

    return (
        <div className="space-y-6 mb-8">
            {/* Plan Status Bar */}
            <Card className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-50 to-slate-100">
                <div className="flex items-center gap-3">
                    <PlanBadge plan={plan} size="md" />
                    <div>
                        <p className="font-medium">
                            {plan === 'free' ? 'Free Tier' : plan === 'pro' ? 'Pro Plan' : 'Enterprise'}
                        </p>
                        <p className="text-sm text-slate-600">
                            {plan === 'free'
                                ? 'Upgrade to unlock unlimited features'
                                : 'All features unlocked'}
                        </p>
                    </div>
                </div>
                {plan === 'free' && (
                    <Link href="/pricing">
                        <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600">
                            <Crown className="w-4 h-4 mr-2" />
                            Upgrade to Pro
                        </Button>
                    </Link>
                )}
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Analyses */}
                <Card className="p-4">
                    <div className="flex items-center gap-2 text-slate-600 mb-2">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm">Analyses</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold">{analysesUsed}</span>
                        {analysesLimit !== Infinity && (
                            <span className="text-slate-500">/ {analysesLimit}</span>
                        )}
                        {analysesLimit === Infinity && (
                            <span className="text-green-600 text-sm">Unlimited</span>
                        )}
                    </div>
                    {analysesLimit !== Infinity && (
                        <Progress value={analysesPercent} className="mt-2 h-1.5" />
                    )}
                </Card>

                {/* Websites */}
                <Card className="p-4">
                    <div className="flex items-center gap-2 text-slate-600 mb-2">
                        <Zap className="w-4 h-4" />
                        <span className="text-sm">Websites</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold">{websiteCount}</span>
                        <span className="text-slate-500 text-sm">tracked</span>
                    </div>
                </Card>

                {/* Social Accounts */}
                <Card className="p-4">
                    <div className="flex items-center gap-2 text-slate-600 mb-2">
                        <Link2 className="w-4 h-4" />
                        <span className="text-sm">Social Accounts</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        {socialLimit === 0 ? (
                            <span className="text-slate-400 text-sm">Pro feature</span>
                        ) : (
                            <>
                                <span className="text-2xl font-bold">0</span>
                                {socialLimit !== Infinity && (
                                    <span className="text-slate-500">/ {socialLimit}</span>
                                )}
                            </>
                        )}
                    </div>
                    {socialLimit === 0 && (
                        <Link href="/pricing" className="text-purple-600 text-xs hover:underline">
                            Upgrade to connect
                        </Link>
                    )}
                </Card>

                {/* Posts */}
                <Card className="p-4">
                    <div className="flex items-center gap-2 text-slate-600 mb-2">
                        <Send className="w-4 h-4" />
                        <span className="text-sm">Posts This Month</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        {postsLimit === 0 ? (
                            <span className="text-slate-400 text-sm">Pro feature</span>
                        ) : (
                            <>
                                <span className="text-2xl font-bold">{postsUsed}</span>
                                {postsLimit !== Infinity && (
                                    <span className="text-slate-500">/ {postsLimit}</span>
                                )}
                            </>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
