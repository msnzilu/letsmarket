// components/CampaignCard.tsx
// Display campaign with stats and controls

'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Play,
    Pause,
    Settings,
    Calendar,
    BarChart3,
    Loader2,
    MoreVertical
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { PLATFORM_CONFIG, Platform } from '@/types';

interface CampaignCardProps {
    campaign: {
        id: string;
        name: string;
        description?: string;
        status: string;
        schedule_type: string;
        schedule_days: number[];
        schedule_time: string;
        posts_per_week: number;
        next_post_at?: string;
        campaign_accounts?: Array<{
            social_connections?: {
                platform: string;
                account_name: string;
            };
        }>;
        stats?: {
            total_posts: number;
            pending_posts: number;
            published_posts: number;
        };
    };
    onStatusChange?: (id: string, status: string) => void;
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CampaignCard({ campaign, onStatusChange }: CampaignCardProps) {
    const [loading, setLoading] = useState(false);

    const handleToggle = async () => {
        if (!onStatusChange) return;
        setLoading(true);
        const newStatus = campaign.status === 'active' ? 'paused' : 'active';
        await onStatusChange(campaign.id, newStatus);
        setLoading(false);
    };

    const getStatusBadge = () => {
        switch (campaign.status) {
            case 'active':
                return <Badge className="bg-green-100 text-green-700">Active</Badge>;
            case 'paused':
                return <Badge className="bg-yellow-100 text-yellow-700">Paused</Badge>;
            case 'completed':
                return <Badge className="bg-slate-100 text-slate-700">Completed</Badge>;
            default:
                return <Badge variant="outline">Draft</Badge>;
        }
    };

    const scheduleDays = campaign.schedule_days
        ?.map(d => DAY_NAMES[d])
        .join(', ') || 'Not set';

    const platforms = campaign.campaign_accounts
        ?.map(ca => ca.social_connections?.platform)
        .filter(Boolean) as Platform[] || [];

    return (
        <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{campaign.name}</h3>
                        {getStatusBadge()}
                    </div>
                    {campaign.description && (
                        <p className="text-sm text-slate-600">{campaign.description}</p>
                    )}
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleToggle}
                        disabled={loading || campaign.status === 'draft'}
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : campaign.status === 'active' ? (
                            <Pause className="w-4 h-4" />
                        ) : (
                            <Play className="w-4 h-4" />
                        )}
                    </Button>
                    <Link href={`/campaigns/${campaign.id}`}>
                        <Button variant="outline" size="sm">
                            <Settings className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Platforms */}
            <div className="flex gap-2 mb-4">
                {platforms.map(platform => (
                    <div
                        key={platform}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: PLATFORM_CONFIG[platform]?.color || '#666' }}
                        title={PLATFORM_CONFIG[platform]?.name || platform}
                    >
                        {(PLATFORM_CONFIG[platform]?.name || platform)[0]}
                    </div>
                ))}
                {platforms.length === 0 && (
                    <span className="text-sm text-slate-400">No accounts connected</span>
                )}
            </div>

            {/* Schedule & Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span>{scheduleDays} @ {campaign.schedule_time?.slice(0, 5)}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                    <BarChart3 className="w-4 h-4" />
                    <span>{campaign.posts_per_week} posts/week</span>
                </div>
                <div>
                    <span className="text-green-600 font-medium">
                        {campaign.stats?.published_posts || 0}
                    </span>
                    <span className="text-slate-500"> published</span>
                </div>
                <div>
                    <span className="text-blue-600 font-medium">
                        {campaign.stats?.pending_posts || 0}
                    </span>
                    <span className="text-slate-500"> pending</span>
                </div>
            </div>

            {/* Next post */}
            {campaign.next_post_at && campaign.status === 'active' && (
                <p className="text-xs text-slate-500 mt-3">
                    Next post: {new Date(campaign.next_post_at).toLocaleString()}
                </p>
            )}
        </Card>
    );
}
