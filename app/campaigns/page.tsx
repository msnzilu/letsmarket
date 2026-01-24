// app/campaigns/page.tsx
// Campaigns list page

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, Megaphone, ArrowLeft } from 'lucide-react';
import CampaignCard from '@/components/CampaignCard';
import { useUpgradeModal } from '@/hooks/use-upgrade-modal';
import { PremiumGate } from '@/components/PremiumGate';

interface Campaign {
    id: string;
    name: string;
    description?: string;
    status: string;
    schedule_type: string;
    schedule_days: number[];
    schedule_time: string;
    posts_per_week: number;
    next_post_at?: string;
    campaign_accounts?: any[];
    stats?: {
        total_posts: number;
        pending_posts: number;
        published_posts: number;
    };
}

export default function CampaignsPage() {
    const router = useRouter();
    const supabase = createClient();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [limits, setLimits] = useState<any>(null);
    const { onOpen } = useUpgradeModal();

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) {
                router.push('/login');
                return;
            }
            fetchCampaigns();
        });
    }, []);

    const fetchCampaigns = async () => {
        try {
            // Fetch subscription and limits from subscription API
            const subRes = await fetch('/api/subscription');
            const subData = await subRes.json();
            setLimits(subData.limits);

            // Fetch actual campaigns from campaigns API
            const campRes = await fetch('/api/campaigns');
            const campData = await campRes.json();
            setCampaigns(campData.campaigns || []);
        } catch (error) {
            console.error('Error fetching campaigns/limits:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id: string, status: string) => {
        try {
            await fetch(`/api/campaigns/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            setCampaigns(prev =>
                prev.map(c => c.id === id ? { ...c, status } : c)
            );
        } catch (error) {
            console.error('Error updating campaign:', error);
        }
    };

    const activeCampaigns = campaigns.filter(c => c.status === 'active');
    const otherCampaigns = campaigns.filter(c => c.status !== 'active');

    return (
        <PremiumGate>
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="mb-8">
                    <Link href="/dashboard">
                        <Button variant="ghost" className="mb-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </Link>

                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Campaigns</h1>
                            <p className="text-slate-600">
                                Automate your social media posting with AI-generated content
                            </p>
                        </div>
                        <div onClick={(e) => {
                            if (limits && limits.posts_per_month === 0) {
                                e.preventDefault();
                                onOpen();
                            }
                        }}>
                            <Link href="/campaigns/new">
                                <Button size="lg">
                                    <Plus className="w-4 h-4 mr-2" />
                                    New Campaign
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2].map(i => (
                            <Card key={i} className="p-6 animate-pulse">
                                <div className="h-6 bg-slate-200 rounded w-1/3 mb-3" />
                                <div className="h-4 bg-slate-200 rounded w-1/2" />
                            </Card>
                        ))}
                    </div>
                ) : campaigns.length === 0 ? (
                    <Card className="p-12 text-center">
                        <Megaphone className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                        <h2 className="text-xl font-semibold mb-2">No campaigns yet</h2>
                        <p className="text-slate-600 mb-6">
                            Create your first campaign to start automating your social media posts
                        </p>
                        <Link href="/campaigns/new">
                            <Button>Create Your First Campaign</Button>
                        </Link>
                    </Card>
                ) : (
                    <div className="space-y-8">
                        {/* Active Campaigns */}
                        {activeCampaigns.length > 0 && (
                            <div>
                                <h2 className="text-lg font-semibold mb-4 text-green-700">
                                    Active Campaigns ({activeCampaigns.length})
                                </h2>
                                <div className="space-y-4">
                                    {activeCampaigns.map(campaign => (
                                        <CampaignCard
                                            key={campaign.id}
                                            campaign={campaign}
                                            onStatusChange={handleStatusChange}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Other Campaigns */}
                        {otherCampaigns.length > 0 && (
                            <div>
                                <h2 className="text-lg font-semibold mb-4 text-slate-600">
                                    {activeCampaigns.length > 0 ? 'Other Campaigns' : 'All Campaigns'} ({otherCampaigns.length})
                                </h2>
                                <div className="space-y-4">
                                    {otherCampaigns.map(campaign => (
                                        <CampaignCard
                                            key={campaign.id}
                                            campaign={campaign}
                                            onStatusChange={handleStatusChange}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </PremiumGate>
    );
}
