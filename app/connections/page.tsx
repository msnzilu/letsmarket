// app/connections/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import SocialConnectionCard from '@/components/SocialConnectionCard';
import { Platform, SocialConnection, PLATFORM_CONFIG } from '@/types';
import { getOAuthUrl } from '@/lib/oauth';

const PLATFORMS: Platform[] = ['facebook', 'instagram', 'x', 'linkedin', 'tiktok', 'reddit'];

export default function ConnectionsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [connections, setConnections] = useState<Partial<SocialConnection>[]>([]);
    const [loading, setLoading] = useState(true);
    const [connectingPlatform, setConnectingPlatform] = useState<Platform | null>(null);

    const successMessage = searchParams.get('success');
    const errorMessage = searchParams.get('error');

    useEffect(() => {
        fetchConnections();
    }, []);

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

    const handleConnect = (platform: Platform) => {
        setConnectingPlatform(platform);
        const authUrl = getOAuthUrl(platform);
        window.location.href = authUrl;
    };

    const handleDisconnect = async (connectionId: string) => {
        try {
            await fetch('/api/connections', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ connectionId }),
            });
            setConnections(prev => prev.filter(c => c.id !== connectionId));
        } catch (error) {
            console.error('Error disconnecting:', error);
        }
    };

    const getConnectionForPlatform = (platform: Platform) => {
        return connections.find(c => c.platform === platform);
    };

    const connectedCount = connections.length;

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="mb-8">
                <Link href="/dashboard">
                    <Button variant="ghost" className="mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>
                </Link>

                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Social Connections</h1>
                        <p className="text-slate-600">
                            Connect your social media accounts to publish AI-generated content
                        </p>
                    </div>
                    {connectedCount > 0 && (
                        <Badge variant="secondary" className="text-lg px-4 py-2">
                            {connectedCount} Connected
                        </Badge>
                    )}
                </div>
            </div>

            {/* Status Messages */}
            {successMessage && (
                <Card className="p-4 mb-6 bg-green-50 border-green-200">
                    <div className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-600" />
                        <p className="text-green-800">
                            {successMessage === 'connected' && 'Account connected successfully!'}
                        </p>
                    </div>
                </Card>
            )}

            {errorMessage && (
                <Card className="p-4 mb-6 bg-red-50 border-red-200">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <p className="text-red-800">
                            Connection failed: {decodeURIComponent(errorMessage)}
                        </p>
                    </div>
                </Card>
            )}

            {/* Info Card */}
            <Card className="p-6 mb-8 bg-gradient-to-br from-purple-50 to-blue-50">
                <h2 className="font-semibold text-lg mb-2">How it works</h2>
                <ol className="list-decimal list-inside space-y-2 text-slate-700">
                    <li>Connect your social media accounts below</li>
                    <li>Analyze a website to generate AI copy</li>
                    <li>Click "Post to Socials" on any headline or CTA</li>
                    <li>Post instantly or schedule for later</li>
                </ol>
            </Card>

            {/* Connection Cards */}
            {loading ? (
                <div className="grid md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <Card key={i} className="p-6 animate-pulse">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-200 rounded-xl" />
                                <div>
                                    <div className="h-5 bg-slate-200 rounded w-24 mb-2" />
                                    <div className="h-4 bg-slate-200 rounded w-32" />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {PLATFORMS.map(platform => (
                        <SocialConnectionCard
                            key={platform}
                            platform={platform}
                            connection={getConnectionForPlatform(platform)}
                            onConnect={handleConnect}
                            onDisconnect={handleDisconnect}
                            isConnecting={connectingPlatform === platform}
                        />
                    ))}
                </div>
            )}

            {/* Developer Setup Instructions - only shown in development */}
            {process.env.NODE_ENV === 'development' && (
                <Card className="p-6 mt-8 border-dashed border-orange-300 bg-orange-50">
                    <h3 className="font-semibold mb-3 text-orange-800">🔧 Developer Setup Required</h3>
                    <p className="text-slate-600 text-sm mb-4">
                        This message only appears in development. Add OAuth credentials to your{' '}
                        <code className="bg-slate-100 px-1 rounded">.env.local</code> file to enable social connections.
                    </p>
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-xs overflow-x-auto">
                        {`# Facebook / Instagram (Meta Business)
NEXT_PUBLIC_FACEBOOK_CLIENT_ID=your_app_id
FACEBOOK_CLIENT_SECRET=your_app_secret

# X (Twitter)
NEXT_PUBLIC_X_CLIENT_ID=your_client_id
X_CLIENT_SECRET=your_client_secret

# LinkedIn
NEXT_PUBLIC_LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_client_secret

# TikTok
NEXT_PUBLIC_TIKTOK_CLIENT_ID=your_client_key
TIKTOK_CLIENT_SECRET=your_client_secret

# Reddit
NEXT_PUBLIC_REDDIT_CLIENT_ID=your_client_id
REDDIT_CLIENT_SECRET=your_client_secret`}
                    </pre>
                </Card>
            )}
        </div>
    );
}
