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
                        <p className="font-bold text-slate-900">
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
                        <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 font-bold">
                            <Crown className="w-4 h-4 mr-2" />
                            Upgrade to Pro
                        </Button>
                    </Link>
                )}
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Analyses */}
                <Card className="p-4 bg-white border-slate-100">
                    <div className="flex items-center gap-2 text-slate-500 mb-2">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Analyses</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-slate-900">{analysesUsed}</span>
                        {analysesLimit !== Infinity && (
                            <span className="text-slate-400 text-xs">/ {analysesLimit}</span>
                        )}
                        {analysesLimit === Infinity && (
                            <span className="text-green-500 text-xs font-bold">Unlimited</span>
                        )}
                    </div>
                    {analysesLimit !== Infinity && (
                        <Progress value={analysesPercent} className="mt-3 h-1.5" />
                    )}
                </Card>

                {/* Websites */}
                <Card className="p-4 bg-white border-slate-100">
                    <div className="flex items-center gap-2 text-slate-500 mb-2">
                        <Zap className="w-4 h-4 text-purple-500" />
                        <span className="text-xs font-bold uppercase tracking-wider">Websites</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-slate-900">{websiteCount}</span>
                        <span className="text-slate-400 text-xs font-medium">tracked</span>
                    </div>
                </Card>

                {/* Social Accounts */}
                <Card className="p-4 bg-white border-slate-100">
                    <div className="flex items-center gap-2 text-slate-500 mb-2">
                        <Link2 className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-bold uppercase tracking-wider">Social Accounts</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        {socialLimit === 0 ? (
                            <span className="text-slate-400 text-xs font-medium italic">Pro feature</span>
                        ) : (
                            <>
                                <span className="text-2xl font-black text-slate-900">0</span>
                                {socialLimit !== Infinity && (
                                    <span className="text-slate-400 text-xs">/ {socialLimit}</span>
                                )}
                            </>
                        )}
                    </div>
                    {socialLimit === 0 && (
                        <Link href="/pricing" className="text-purple-500 text-[10px] font-bold hover:underline mt-1 block">
                            Upgrade to connect
                        </Link>
                    )}
                </Card>

                {/* Posts */}
                <Card className="p-4 bg-white border-slate-100">
                    <div className="flex items-center gap-2 text-slate-500 mb-2">
                        <Send className="w-4 h-4 text-green-500" />
                        <span className="text-xs font-bold uppercase tracking-wider">Posts This Month</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        {postsLimit === 0 ? (
                            <span className="text-slate-400 text-xs font-medium italic">Pro feature</span>
                        ) : (
                            <>
                                <span className="text-2xl font-black text-slate-900">{postsUsed}</span>
                                {postsLimit !== Infinity && (
                                    <span className="text-slate-400 text-xs">/ {postsLimit}</span>
                                )}
                            </>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
