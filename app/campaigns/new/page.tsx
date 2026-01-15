// app/campaigns/new/page.tsx
// Create new campaign wizard

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Loader2, Check, Sparkles } from 'lucide-react';
import { PLATFORM_CONFIG, Platform } from '@/types';

interface Website {
    id: string;
    url: string;
    analyses?: Array<{ id: string; overall_score: number }>;
}

interface Connection {
    id: string;
    platform: string;
    account_name: string;
    avatar_url?: string;
}

const SCHEDULE_OPTIONS = [
    { value: 'daily', label: 'Daily', description: 'Post every day' },
    { value: 'weekly', label: 'Weekly', description: 'Post on specific days' },
];

const DAY_OPTIONS = [
    { value: 1, label: 'Mon' },
    { value: 2, label: 'Tue' },
    { value: 3, label: 'Wed' },
    { value: 4, label: 'Thu' },
    { value: 5, label: 'Fri' },
    { value: 6, label: 'Sat' },
    { value: 0, label: 'Sun' },
];

export default function NewCampaignPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [generating, setGenerating] = useState(false);

    // Data
    const [websites, setWebsites] = useState<Website[]>([]);
    const [connections, setConnections] = useState<Connection[]>([]);

    // Form state
    const [name, setName] = useState('');
    const [selectedWebsite, setSelectedWebsite] = useState<string | null>(null);
    const [selectedConnections, setSelectedConnections] = useState<string[]>([]);
    const [scheduleType, setScheduleType] = useState('weekly');
    const [scheduleDays, setScheduleDays] = useState<number[]>([1, 3, 5]); // Mon, Wed, Fri
    const [scheduleTime, setScheduleTime] = useState('09:00');
    const [postsPerWeek, setPostsPerWeek] = useState(3);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) {
                router.push('/login');
                return;
            }
            fetchData();
        });

        // Pre-select website if passed in URL
        const websiteId = searchParams.get('website');
        if (websiteId) setSelectedWebsite(websiteId);
    }, []);

    const fetchData = async () => {
        try {
            // Fetch websites
            const { data: sites } = await supabase
                .from('websites')
                .select('id, url, analyses (id, overall_score)')
                .order('updated_at', { ascending: false });
            setWebsites(sites || []);

            // Fetch connections
            const res = await fetch('/api/connections');
            const data = await res.json();
            setConnections(data.connections || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleConnection = (id: string) => {
        setSelectedConnections(prev =>
            prev.includes(id)
                ? prev.filter(c => c !== id)
                : [...prev, id]
        );
    };

    const toggleDay = (day: number) => {
        setScheduleDays(prev =>
            prev.includes(day)
                ? prev.filter(d => d !== day)
                : [...prev, day].sort()
        );
    };

    const validateStep = (currentStep: number): { valid: boolean; error?: string } => {
        switch (currentStep) {
            case 1:
                if (!name.trim()) return { valid: false, error: 'Please enter a campaign name' };
                if (!selectedWebsite) return { valid: false, error: 'Please select a website' };
                return { valid: true };
            case 2:
                if (selectedConnections.length === 0) return { valid: false, error: 'Please select at least one social account' };
                return { valid: true };
            case 3:
                if (scheduleDays.length === 0) return { valid: false, error: 'Please select at least one posting day' };
                return { valid: true };
            default:
                return { valid: true };
        }
    };

    const handleNext = () => {
        const { valid, error } = validateStep(step);
        if (!valid && error) {
            alert(error); // Simple feedback, could be toast
            return;
        }
        setStep(s => s + 1);
    };

    // Updated handleCreate to use validation
    const handleCreate = async () => {
        const { valid, error } = validateStep(3); // Validate current step (3)
        if (!valid && error) {
            alert(error);
            return;
        }

        // Also sanity check previous steps
        if (!name || !selectedWebsite || selectedConnections.length === 0) {
            alert('Please check previous steps for missing information');
            return;
        }

        setCreating(true);
        try {
            const website = websites.find(w => w.id === selectedWebsite);
            const analysisId = website?.analyses?.[0]?.id;

            const res = await fetch('/api/campaigns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    website_id: selectedWebsite,
                    analysis_id: analysisId,
                    schedule_type: scheduleType,
                    schedule_days: scheduleDays,
                    schedule_time: scheduleTime + ':00',
                    posts_per_week: postsPerWeek,
                    connection_ids: selectedConnections,
                }),
            });

            const data = await res.json();

            if (data.campaign) {
                // Generate posts
                setGenerating(true);
                await fetch(`/api/campaigns/${data.campaign.id}/generate`, {
                    method: 'POST',
                });

                router.push(`/campaigns/${data.campaign.id}`);
            } else {
                alert(data.error || 'Failed to create campaign');
            }
        } catch (error) {
            console.error('Error creating campaign:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setCreating(false);
            setGenerating(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-12">
                <Card className="p-8 animate-pulse">
                    <div className="h-8 bg-slate-200 rounded w-1/3 mb-4" />
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <Link href="/campaigns">
                <Button variant="ghost" className="mb-8">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Campaigns
                </Button>
            </Link>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-4 mb-8">
                {[1, 2, 3].map(s => (
                    <div key={s} className="flex items-center">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${s < step
                                ? 'bg-green-500 text-white'
                                : s === step
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-slate-200 text-slate-600'
                                }`}
                        >
                            {s < step ? <Check className="w-4 h-4" /> : s}
                        </div>
                        {s < 3 && (
                            <div className={`w-12 h-1 mx-2 ${s < step ? 'bg-green-500' : 'bg-slate-200'}`} />
                        )}
                    </div>
                ))}
            </div>

            <Card className="p-8">
                {/* Step 1: Name & Website */}
                {step === 1 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Create Campaign</h2>

                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Campaign Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="e.g., Weekly LinkedIn Posts"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Select Website</label>
                            <div className="space-y-2">
                                {websites.map(site => (
                                    <div
                                        key={site.id}
                                        onClick={() => setSelectedWebsite(site.id)}
                                        className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedWebsite === site.id
                                            ? 'border-purple-500 bg-purple-50'
                                            : 'hover:border-slate-300'
                                            }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">{site.url}</span>
                                            {site.analyses?.[0] && (
                                                <Badge variant="outline">
                                                    Score: {site.analyses[0].overall_score}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {websites.length === 0 && (
                                    <p className="text-slate-500">
                                        No websites analyzed yet.{' '}
                                        <Link href="/analyze" className="text-purple-600 hover:underline">
                                            Analyze a website first
                                        </Link>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Social Accounts */}
                {step === 2 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Select Social Accounts</h2>
                        <p className="text-slate-600 mb-6">Choose where to publish your posts</p>

                        <div className="space-y-2">
                            {connections.map(conn => {
                                const config = PLATFORM_CONFIG[conn.platform as Platform];
                                const isSelected = selectedConnections.includes(conn.id);

                                return (
                                    <div
                                        key={conn.id}
                                        onClick={() => toggleConnection(conn.id)}
                                        className={`p-4 border rounded-lg cursor-pointer transition-all flex items-center gap-4 ${isSelected
                                            ? 'border-purple-500 bg-purple-50'
                                            : 'hover:border-slate-300'
                                            }`}
                                    >
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                                            style={{ backgroundColor: config?.color || '#666' }}
                                        >
                                            {(config?.name || conn.platform)[0]}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">{conn.account_name}</p>
                                            <p className="text-sm text-slate-500">{config?.name || conn.platform}</p>
                                        </div>
                                        {isSelected && <Check className="w-5 h-5 text-purple-600" />}
                                    </div>
                                );
                            })}
                            {connections.length === 0 && (
                                <p className="text-slate-500">
                                    No social accounts connected.{' '}
                                    <Link href="/connections" className="text-purple-600 hover:underline">
                                        Connect accounts first
                                    </Link>
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Step 3: Schedule */}
                {step === 3 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Set Schedule</h2>
                        <p className="text-slate-600 mb-6">When should we publish your posts?</p>

                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Posting Days</label>
                            <div className="flex gap-2">
                                {DAY_OPTIONS.map(day => (
                                    <button
                                        key={day.value}
                                        onClick={() => toggleDay(day.value)}
                                        className={`px-4 py-2 rounded-lg border transition-all ${scheduleDays.includes(day.value)
                                            ? 'bg-purple-600 text-white border-purple-600'
                                            : 'hover:border-purple-300'
                                            }`}
                                    >
                                        {day.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Time</label>
                            <input
                                type="time"
                                value={scheduleTime}
                                onChange={e => setScheduleTime(e.target.value)}
                                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Posts per week: {postsPerWeek}
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="14"
                                value={postsPerWeek}
                                onChange={e => setPostsPerWeek(parseInt(e.target.value))}
                                className="w-full"
                            />
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <div className="flex flex-col-reverse md:flex-row justify-between mt-8 pt-6 border-t gap-4">
                    <Button
                        variant="outline"
                        onClick={() => setStep(s => s - 1)}
                        disabled={step === 1 || creating}
                        className="w-full md:w-auto"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>

                    {step < 3 ? (
                        <Button
                            onClick={handleNext}
                            disabled={creating}
                            className="w-full md:w-auto"
                        >
                            Next
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleCreate}
                            disabled={creating}
                            className={`w-full md:w-auto ${creating ? 'opacity-80' : ''}`}
                        >
                            {creating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    {generating ? 'Generating Posts...' : 'Creating...'}
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Create & Generate Posts
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
}
