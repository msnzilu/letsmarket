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

export default function AnalyzePage() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [progress, setProgress] = useState('');
    const [usage, setUsage] = useState<any>(null);
    const [limitReached, setLimitReached] = useState(false);
    const [fetchingUsage, setFetchingUsage] = useState(true);
    const { onOpen } = useUpgradeModal();
    const router = useRouter();

    useEffect(() => {
        const checkUsage = async () => {
            try {
                const res = await fetch('/api/subscription');
                const data = await res.json();
                if (data.usage && data.limits) {
                    setUsage(data.usage);
                    if (data.usage.analyses_count >= data.limits.analyses_total) {
                        setLimitReached(true);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch usage:', err);
            } finally {
                setFetchingUsage(false);
            }
        };
        checkUsage();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

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
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <Card className="p-8 w-full max-w-7xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Analyze Your Website</h1>
                    <p className="text-slate-600">
                        Get AI-powered insights and optimized copy in under 2 minutes
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

                <form onSubmit={handleSubmit} className="space-y-6 relative">
                    {limitReached && (
                        <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] rounded-lg flex items-center justify-center">
                            <Card className="p-8 border-2 border-purple-200 shadow-2xl max-w-md text-center bg-white/90 transform hover:scale-[1.02] transition-all">
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Lock className="text-purple-600 w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Limit Reached</h3>
                                <p className="text-slate-600 mb-6">
                                    You've analyzed <strong>{usage?.analyses_count}</strong> websites. Upgrade to <strong>Pro</strong> for unlimited analyses and advanced features.
                                </p>
                                <Button
                                    onClick={onOpen}
                                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-6 group"
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
                                    disabled={loading || limitReached}
                                    className="text-lg py-7 px-5 border-2 border-slate-200 focus:border-purple-500 transition-all rounded-xl shadow-sm"
                                />
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-purple-500 transition-colors">
                                    <Zap size={20} />
                                </div>
                            </div>
                            <p className="text-sm text-slate-500 mt-3 flex items-center gap-2">
                                <ShieldCheck size={14} className="text-green-500" />
                                We'll analyze your landing page for high-converting psychology principles
                            </p>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-14 text-lg bg-slate-900 hover:bg-slate-800 transition-all rounded-xl shadow-lg hover:shadow-xl disabled:bg-slate-300"
                            disabled={loading || limitReached}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                    Analyzing Architecture...
                                </>
                            ) : (
                                'Start AI Analysis'
                            )}
                        </Button>
                    </div>
                </form>

                <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 text-center text-sm">
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <div className="font-semibold text-purple-600">Social Proof</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <div className="font-semibold text-purple-600">Loss Aversion</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <div className="font-semibold text-purple-600">Authority</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <div className="font-semibold text-purple-600">Scarcity</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <div className="font-semibold text-purple-600">Cognitive Ease</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <div className="font-semibold text-purple-600">Pricing</div>
                    </div>
                </div>
            </Card>
        </div>
    );
}