// app/analyze/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function AnalyzePage() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [progress, setProgress] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="url">Website URL</Label>
                        <Input
                            id="url"
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com"
                            required
                            disabled={loading}
                            className="text-lg"
                        />
                        <p className="text-sm text-slate-500 mt-2">
                            We'll analyze your homepage for psychology principles
                        </p>
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            'Analyze Website'
                        )}
                    </Button>
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