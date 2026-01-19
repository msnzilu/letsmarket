// app/analyze/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Loader2, Zap, ShieldCheck, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import Link from 'next/link';
import { useUpgradeModal } from '@/hooks/use-upgrade-modal';
import { useSubscription } from '@/hooks/useSubscription';
import { UNLIMITED } from '@/lib/subscription';
import RevenueCalculator from '@/components/RevenueCalculator';

export default function AnalyzePage() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [progress, setProgress] = useState('');
    const router = useRouter();
    const { onOpen } = useUpgradeModal();
    const { plan, limits, usage, isLoading: subLoading } = useSubscription();

    const limitReached = usage && limits &&
        limits.analyses_total !== (Infinity as any) &&
        limits.analyses_total !== (UNLIMITED as any) &&
        usage.analyses_count >= (limits.analyses_total as number);

    useEffect(() => {
        if (!subLoading && limitReached) {
            onOpen();
        }
    }, [subLoading, limitReached, onOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (subLoading) return; // Wait for limits to load

        if (limitReached) {
            onOpen(); // Trigger the upgrade modal
            return;
        }

        setError('');
        setLoading(true);

        try {
            setProgress('Scraping website...');

            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Analysis failed');
            }

            setProgress('Analysis complete!');

            // Redirect to the analysis detail page
            setTimeout(() => {
                router.push(`/dashboard/${data.analysis.id}`);
            }, 500);

        } catch (err: any) {
            setError(err.message || 'An error occurred');
            setProgress('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen max-w-7xl mx-auto px-4 py-24">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                <div className="lg:col-span-2">
                    <Card className="p-8 w-full border-none shadow-none bg-transparent">
                        <div className="text-left mb-8">
                            <h1 className="text-4xl font-black text-slate-900 mb-4">
                                Optimize Your Conversion Architecture <span className="text-brand-primary block">with AI Psychology</span>
                            </h1>
                            <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">
                                Our AI models audit your landing page against 20+ psychological triggers to find revenue leaks and generate copy that actually converts.
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                                {error}
                            </div>
                        )}

                        {progress && (
                            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-6 flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {progress}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6 relative max-w-xl">
                            {limitReached && (
                                <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] rounded-lg flex items-center justify-center">
                                    <Card className="p-8 border-2 border-brand-primary/20 shadow-2xl max-w-md text-center bg-white/90 transform hover:scale-[1.02] transition-all">
                                        <div className="w-16 h-16 bg-brand-secondary-light rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Lock className="text-brand-primary w-8 h-8" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Limit Reached</h3>
                                        <p className="text-slate-600 mb-6 font-medium">
                                            You've used your <strong>one free analysis</strong> limit. Upgrade to <strong>Pro</strong> for unlimited analyses and advanced features.
                                        </p>
                                        <Button
                                            onClick={onOpen}
                                            className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90 text-white font-bold py-6 group"
                                            size="lg"
                                        >
                                            Unlock Pro Access
                                            <Sparkles className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                                        </Button>
                                        <Link href="/pricing" className="text-sm text-slate-400 mt-4 block hover:underline">
                                            View all plans
                                        </Link>
                                    </Card>
                                </div>
                            )}

                            <div className={limitReached ? 'opacity-40 pointer-events-none grayscale-[0.5]' : ''}>
                                <div className="mb-6">
                                    <Label htmlFor="url" className="text-slate-700 font-semibold mb-2 block">Website URL</Label>
                                    <div className="relative group">
                                        <Input
                                            id="url"
                                            type="url"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            placeholder="https://example.com"
                                            required
                                            disabled={loading || !!limitReached}
                                            className="text-lg py-7 px-5 border-2 border-slate-200 focus:border-brand-primary transition-all rounded-xl shadow-sm"
                                        />
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-primary transition-colors">
                                            <Zap size={20} />
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-3 flex items-center gap-2">
                                        <ShieldCheck size={14} className="text-green-500" />
                                        Ready to find your hidden revenue?
                                    </p>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-14 text-lg bg-slate-900 hover:bg-slate-800 transition-all rounded-xl shadow-lg hover:shadow-xl disabled:bg-slate-300"
                                    disabled={loading || !!limitReached || subLoading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                            Analyzing Architecture...
                                        </>
                                    ) : subLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                            Checking account...
                                        </>
                                    ) : (
                                        'Start Free Analysis'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>

                <div className="md:sticky md:top-24">
                    <RevenueCalculator />

                    <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary text-white shadow-xl">
                        <h4 className="font-bold mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Pro Strategy Included
                        </h4>
                        <p className="text-sm text-purple-100 mb-4">
                            You'll receive a detailed breakdown of 6 core psychological principles applied specifically to your business.
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-[10px] font-bold uppercase tracking-tight">
                            <div className="bg-white/10 p-2 rounded">Social Proof</div>
                            <div className="bg-white/10 p-2 rounded">Loss Aversion</div>
                            <div className="bg-white/10 p-2 rounded">Authority</div>
                            <div className="bg-white/10 p-2 rounded">Scarcity</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}