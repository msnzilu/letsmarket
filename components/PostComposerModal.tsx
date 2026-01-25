'use client';

// components/PostComposerModal.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, X, Send, Clock, Check } from 'lucide-react';
import { Platform, SocialConnection, PLATFORM_CONFIG } from '@/types';

interface PostComposerModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialContent: string;
    copyType: 'headline' | 'cta';
    analysisId?: string;
}

export default function PostComposerModal({
    isOpen,
    onClose,
    initialContent,
    copyType,
    analysisId,
}: PostComposerModalProps) {
    const router = useRouter();
    const [content, setContent] = useState(initialContent);
    const [analysis, setAnalysis] = useState<any>(null);
    const [connections, setConnections] = useState<Partial<SocialConnection>[]>([]);
    const [selectedConnections, setSelectedConnections] = useState<string[]>([]);
    const [scheduleMode, setScheduleMode] = useState<'now' | 'later'>('now');
    const [scheduleDate, setScheduleDate] = useState('');
    const [scheduleTime, setScheduleTime] = useState('');
    const [loading, setLoading] = useState(true);
    const [posting, setPosting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setContent(initialContent);
            setSuccess(false);
            fetchConnections();
            if (analysisId) fetchAnalysis();
        }
    }, [isOpen, initialContent, analysisId]);

    const fetchAnalysis = async () => {
        try {
            const res = await fetch(`/api/analyses/${analysisId}`);
            const data = await res.json();
            setAnalysis(data.analysis);
        } catch (error) {
            console.error('Error fetching analysis:', error);
        }
    };

    const fetchConnections = async () => {
        try {
            const res = await fetch('/api/connections');
            const data = await res.json();
            setConnections(data.connections || []);
        } catch (error) {
            console.error('Error fetching connections:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleConnection = (connectionId: string) => {
        setSelectedConnections(prev =>
            prev.includes(connectionId)
                ? prev.filter(id => id !== connectionId)
                : [...prev, connectionId]
        );
    };

    const handlePost = async () => {
        if (selectedConnections.length === 0) return;

        setPosting(true);
        setError(null);
        try {
            // Create posts for each selected connection
            const scheduledFor = scheduleMode === 'later' && scheduleDate && scheduleTime
                ? new Date(`${scheduleDate}T${scheduleTime}`).toISOString()
                : null;

            const promises = selectedConnections.map(connectionId =>
                fetch('/api/posts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        connectionId,
                        content,
                        copyType,
                        analysisId,
                        scheduledFor,
                    }),
                })
            );

            const results = await Promise.all(promises);
            const posts = await Promise.all(results.map(r => r.json()));

            // Check for errors in post creation
            const createErrors = posts.filter(p => p.error);
            if (createErrors.length > 0) {
                throw new Error(createErrors[0].error);
            }

            // If posting now, immediately publish
            if (scheduleMode === 'now') {
                const publishPromises = posts.map(({ post }) =>
                    fetch('/api/posts/publish', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ postId: post.id }),
                    }).then(r => r.json())
                );
                const publishResults = await Promise.all(publishPromises);

                // Check for publish errors
                const publishErrors = publishResults.filter(r => r.error);
                if (publishErrors.length > 0) {
                    throw new Error(publishErrors[0].error);
                }
            }

            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error: any) {
            console.error('Error posting:', error);
            setError(error.message || 'Failed to post. Please try again.');
        } finally {
            setPosting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Post to Social Media</h2>
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {success ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                {scheduleMode === 'now' ? 'Posted Successfully!' : 'Scheduled Successfully!'}
                            </h3>
                            <p className="text-slate-600">
                                {scheduleMode === 'now'
                                    ? 'Your content has been published to the selected platforms.'
                                    : `Your content will be published on ${scheduleDate} at ${scheduleTime}.`}
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Error Display */}
                            {error && (
                                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-700 text-sm">{error}</p>
                                </div>
                            )}
                            {/* Content Editor */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Post Content
                                </label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full h-32 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                                    placeholder="Write your post..."
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    {content.length} characters
                                </p>

                                {/* Suggestions */}
                                {analysis?.generated_copy && (
                                    <div className="mt-4">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                            Add context from analysis:
                                        </p>
                                        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
                                            {analysis.generated_copy.valueProps?.map((vp: any, i: number) => (
                                                <button
                                                    key={`vp-${i}`}
                                                    onClick={() => setContent(prev => prev + '\n\n' + vp.copy)}
                                                    className="text-[10px] bg-brand-secondary-light text-brand-primary px-2 py-1 rounded hover:bg-brand-secondary transition-colors text-left"
                                                >
                                                    + {vp.copy}
                                                </button>
                                            ))}
                                            {analysis.generated_copy.painPoints?.map((pp: any, i: number) => (
                                                <button
                                                    key={`pp-${i}`}
                                                    onClick={() => setContent(prev => prev + '\n\n' + pp.copy)}
                                                    className="text-[10px] bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100 transition-colors text-left"
                                                >
                                                    + {pp.copy}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Platform Selection */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Select Platforms
                                </label>
                                {loading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                                    </div>
                                ) : connections.length === 0 ? (
                                    <Card className="p-4 bg-slate-50 text-center">
                                        <p className="text-slate-600 mb-2">No connected accounts</p>
                                        <Button variant="outline" size="sm" onClick={() => router.push('/connections')}>
                                            Connect Accounts
                                        </Button>
                                    </Card>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        {connections.map(conn => {
                                            const config = PLATFORM_CONFIG[conn.platform as Platform];
                                            const isSelected = selectedConnections.includes(conn.id!);
                                            const isOverLimit = content.length > config.maxLength;

                                            return (
                                                <button
                                                    key={conn.id}
                                                    onClick={() => toggleConnection(conn.id!)}
                                                    disabled={isOverLimit}
                                                    className={`p-3 rounded-lg border-2 transition-all text-left ${isSelected
                                                        ? 'border-brand-primary bg-brand-secondary-light'
                                                        : 'border-slate-200 hover:border-slate-300'
                                                        } ${isOverLimit ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                                                            style={{ backgroundColor: config.color }}
                                                        >
                                                            {config.name[0]}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm">{config.name}</p>
                                                            <p className="text-xs text-slate-500">
                                                                {conn.account_username || conn.account_name}
                                                            </p>
                                                        </div>
                                                        {isSelected && (
                                                            <Check className="w-5 h-5 text-brand-primary ml-auto" />
                                                        )}
                                                    </div>
                                                    {isOverLimit && (
                                                        <p className="text-xs text-red-500 mt-1">
                                                            Exceeds {config.maxLength} char limit
                                                        </p>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Schedule Options */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    When to Post
                                </label>
                                <div className="flex gap-3 mb-3">
                                    <Button
                                        variant={scheduleMode === 'now' ? 'default' : 'outline'}
                                        onClick={() => setScheduleMode('now')}
                                        className="flex-1"
                                    >
                                        <Send className="w-4 h-4 mr-2" />
                                        Post Now
                                    </Button>
                                    <Button
                                        variant={scheduleMode === 'later' ? 'default' : 'outline'}
                                        onClick={() => setScheduleMode('later')}
                                        className="flex-1"
                                    >
                                        <Clock className="w-4 h-4 mr-2" />
                                        Schedule
                                    </Button>
                                </div>

                                {scheduleMode === 'later' && (
                                    <div className="flex gap-3">
                                        <input
                                            type="date"
                                            value={scheduleDate}
                                            onChange={(e) => setScheduleDate(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="flex-1 p-2 border rounded-lg"
                                        />
                                        <input
                                            type="time"
                                            value={scheduleTime}
                                            onChange={(e) => setScheduleTime(e.target.value)}
                                            className="flex-1 p-2 border rounded-lg"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={onClose} className="flex-1">
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handlePost}
                                    disabled={selectedConnections.length === 0 || posting}
                                    className="flex-1 bg-gradient-to-r from-brand-primary to-brand-secondary"
                                >
                                    {posting ? (
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    ) : scheduleMode === 'now' ? (
                                        <Send className="w-4 h-4 mr-2" />
                                    ) : (
                                        <Clock className="w-4 h-4 mr-2" />
                                    )}
                                    {posting
                                        ? 'Posting...'
                                        : scheduleMode === 'now'
                                            ? `Post to ${selectedConnections.length} Platform${selectedConnections.length > 1 ? 's' : ''}`
                                            : 'Schedule Post'}
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </Card>
        </div>
    );
}
