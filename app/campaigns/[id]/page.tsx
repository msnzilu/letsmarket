// app/campaigns/[id]/page.tsx
// Campaign detail page

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft, Calendar, FileText, Share2, Loader2, Play, Pause, Trash2, Clock } from 'lucide-react';
import { PLATFORM_CONFIG, Platform } from '@/types';

interface Campaign {
    id: string;
    name: string;
    status: 'draft' | 'active' | 'paused' | 'completed';
    posts_per_week: number;
    schedule_time: string;
    schedule_days: number[];
    next_post_at: string;
    campaign_accounts: {
        connection_id: string;
        social_connections: {
            platform: Platform;
            account_name: string;
        };
    }[];
    campaign_posts: {
        id: string;
        content: string;
        platform: Platform;
        status: 'pending' | 'published' | 'failed';
        scheduled_for: string;
    }[];
}

export default function CampaignDetailPage() {
    const params = useParams();
    const router = useRouter();
    const supabase = createClient();

    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const { id } = params;

    useEffect(() => {
        fetchCampaign();
    }, [id]);

    const fetchCampaign = async () => {
        try {
            const res = await fetch(`/api/campaigns/${id}`);
            if (!res.ok) {
                if (res.status === 404) router.push('/campaigns');
                return;
            }
            const data = await res.json();
            setCampaign(data.campaign);
        } catch (error) {
            console.error('Error fetching campaign:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus: string) => {
        setActionLoading(true);
        try {
            await fetch(`/api/campaigns/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            await fetchCampaign(); // Refresh data
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this campaign?')) return;

        setActionLoading(true);
        try {
            await fetch(`/api/campaigns/${id}`, {
                method: 'DELETE',
            });
            router.push('/campaigns');
        } catch (error) {
            console.error('Error deleting campaign:', error);
            setActionLoading(false);
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

    if (!campaign) return null;

    const stats = {
        total: campaign.campaign_posts?.length || 0,
        pending: campaign.campaign_posts?.filter(p => p.status === 'pending').length || 0,
        published: campaign.campaign_posts?.filter(p => p.status === 'published').length || 0,
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <Link href="/campaigns">
                <Button variant="ghost" className="mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Campaigns
                </Button>
            </Link>

            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-10 pb-8 border-b border-slate-100">
                <div className="flex-1 space-y-4 w-full">
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                            {campaign.name}
                        </h1>
                        <Badge
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                campaign.status === 'active' 
                                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            {campaign.status.toUpperCase()}
                        </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-slate-500">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-slate-100 rounded-md">
                                <Clock className="w-4 h-4 text-slate-600" />
                            </div>
                            <span>{campaign.schedule_days.length} days / week at {campaign.schedule_time.slice(0, 5)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-slate-100 rounded-md">
                                <Share2 className="w-4 h-4 text-slate-600" />
                            </div>
                            <span>{campaign.campaign_accounts.length} platforms connected</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                    {campaign.status === 'active' ? (
                        <Button
                            variant="outline"
                            className="flex-1 sm:flex-initial"
                            onClick={() => handleStatusUpdate('paused')}
                            disabled={actionLoading}
                        >
                            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pause className="w-4 h-4 mr-2" />}
                            Pause
                        </Button>
                    ) : (
                        <Button
                            variant="default"
                            className="flex-1 sm:flex-initial"
                            onClick={() => handleStatusUpdate('active')}
                            disabled={actionLoading}
                        >
                            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                            Activate
                        </Button>
                    )}
                    <Button
                        variant="destructive"
                        size="icon"
                        className="shrink-0"
                        onClick={handleDelete}
                        disabled={actionLoading}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Connected Platforms */}
            <div className="flex gap-2 mb-8">
                {campaign.campaign_accounts.map(acc => {
                    const platform = acc.social_connections.platform;
                    const config = PLATFORM_CONFIG[platform];
                    return (
                        <Badge
                            key={acc.connection_id}
                            variant="outline"
                            className="pl-1 pr-3 py-1 flex items-center gap-2"
                        >
                            <div
                                className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                style={{ backgroundColor: config?.color || '#666' }}
                            >
                                {(config?.name || platform)[0]}
                            </div>
                            {acc.social_connections.account_name}
                        </Badge>
                    );
                })}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="p-6">
                    <h3 className="text-slate-500 mb-2">Total Posts</h3>
                    <p className="text-3xl font-bold">{stats.total}</p>
                </Card>
                <Card className="p-6">
                    <h3 className="text-slate-500 mb-2">Scheduled</h3>
                    <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
                </Card>
                <Card className="p-6">
                    <h3 className="text-slate-500 mb-2">Published</h3>
                    <p className="text-3xl font-bold text-green-600">{stats.published}</p>
                </Card>
            </div>

            {/* Posts List */}
            <Card className="overflow-hidden">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold">Campaign Content</h2>
                </div>

                {stats.total === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        No posts generated yet.
                    </div>
                ) : (
                    <div className="divide-y">
                        {campaign.campaign_posts.sort((a, b) => new Date(a.scheduled_for).getTime() - new Date(b.scheduled_for).getTime()).map(post => {
                            const platform = post.platform;
                            const config = PLATFORM_CONFIG[platform];

                            return (
                                <div key={post.id} className="p-6 hover:bg-slate-50 transition-colors">
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <div
                                                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm"
                                                style={{ backgroundColor: config?.color || '#666' }}
                                            >
                                                {(config?.name || platform)[0]}
                                            </div>
                                            <span className="font-bold text-slate-900">{config?.name || platform}</span>
                                            <Badge
                                                variant={post.status === 'published' ? 'default' : post.status === 'failed' ? 'destructive' : 'secondary'}
                                                className="text-[10px] uppercase tracking-wider px-2 py-0.5"
                                            >
                                                {post.status}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-100/50 px-3 py-1.5 rounded-full">
                                            <Calendar className="w-4 h-4" />
                                            <span>
                                                {new Date(post.scheduled_for).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} at {new Date(post.scheduled_for).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="relative group">
                                        <p className="whitespace-pre-wrap text-slate-700 leading-relaxed pl-4 border-l-4 border-slate-100 group-hover:border-brand-primary/30 transition-colors">
                                            {post.content}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Card>
        </div>
    );
}
