'use client';

// components/SocialConnectionCard.tsx

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Facebook, Twitter, Linkedin, Music, MessageCircle, Loader2, Trash2, Settings2, AtSign } from 'lucide-react';
import { Platform, SocialConnection, PLATFORM_CONFIG } from '@/types';
import LinkedInPageSelector from './LinkedInPageSelector';

interface SocialConnectionCardProps {
    platform: Platform;
    connection?: Partial<SocialConnection>;
    onConnect: (platform: Platform) => void;
    onDisconnect: (connectionId: string) => void;
    onUpdate?: (connection: Partial<SocialConnection>) => void;
    isConnecting?: boolean;
}

const PLATFORM_ICONS: Record<Platform, React.ReactNode> = {
    facebook: <Facebook className="w-6 h-6" />,
    instagram: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>,
    x: <Twitter className="w-6 h-6" />,
    linkedin: <Linkedin className="w-6 h-6" />,
    tiktok: <Music className="w-6 h-6" />,
    reddit: <MessageCircle className="w-6 h-6" />,
    threads: <AtSign className="w-6 h-6" />,
};

export default function SocialConnectionCard({
    platform,
    connection,
    onConnect,
    onDisconnect,
    onUpdate,
    isConnecting,
}: SocialConnectionCardProps) {
    const [isDisconnecting, setIsDisconnecting] = useState(false);
    const [showPageSelector, setShowPageSelector] = useState(false);
    const config = PLATFORM_CONFIG[platform];
    const isConnected = !!connection?.id;

    const handleDisconnect = async () => {
        if (!connection?.id) return;
        setIsDisconnecting(true);
        await onDisconnect(connection.id);
        setIsDisconnecting(false);
    };

    const handlePageSelect = (pageId: string, pageName: string) => {
        if (onUpdate && connection) {
            onUpdate({
                ...connection,
                platform_user_id: pageId,
                account_name: pageName,
            });
        }
    };

    // Check if this is a LinkedIn organization (company page)
    const isLinkedInOrg = platform === 'linkedin' &&
        connection?.platform_user_id?.includes('urn:li:organization');

    return (
        <>
            <Card className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                            style={{ backgroundColor: config.color }}
                        >
                            {PLATFORM_ICONS[platform]}
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">{config.name}</h3>
                            {isConnected ? (
                                <div className="flex items-center gap-2 mt-1">
                                    {connection.account_avatar && (
                                        <img
                                            src={connection.account_avatar}
                                            alt=""
                                            className="w-5 h-5 rounded-full"
                                        />
                                    )}
                                    <span className="text-sm text-slate-600">
                                        {connection.account_username || connection.account_name}
                                    </span>
                                    {isLinkedInOrg && (
                                        <Badge variant="secondary" className="text-[10px] bg-brand-secondary-light text-brand-primary">
                                            Company
                                        </Badge>
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500">Not connected</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {isConnected && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                                Connected
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="mt-4 flex gap-2">
                    {isConnected ? (
                        <>
                            {platform === 'linkedin' && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowPageSelector(true)}
                                    className="text-brand-primary hover:bg-brand-secondary-light"
                                >
                                    <Settings2 className="w-4 h-4 mr-2" />
                                    Select Page
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDisconnect}
                                disabled={isDisconnecting}
                                className="text-red-600 hover:bg-red-50"
                            >
                                {isDisconnecting ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : (
                                    <Trash2 className="w-4 h-4 mr-2" />
                                )}
                                Disconnect
                            </Button>
                        </>
                    ) : (
                        <Button
                            onClick={() => onConnect(platform)}
                            disabled={isConnecting}
                            style={{ backgroundColor: config.color }}
                            className="text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isConnecting ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                                PLATFORM_ICONS[platform]
                            )}
                            <span className="ml-2">Connect {config.name}</span>
                        </Button>
                    )}
                </div>
            </Card>

            {/* LinkedIn Page Selector Modal */}
            {platform === 'linkedin' && connection?.id && (
                <LinkedInPageSelector
                    connectionId={connection.id}
                    isOpen={showPageSelector}
                    onClose={() => setShowPageSelector(false)}
                    onSelect={handlePageSelect}
                />
            )}
        </>
    );
}
