// components/UpgradeModal.tsx
// Modal shown when user hits plan limits

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Check, Zap, Crown, Loader2 } from 'lucide-react';
import { Plan, PLAN_LIMITS, formatPlanName } from '@/lib/subscription';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentPlan: Plan;
    requiredPlan: Plan;
    feature: string;
    featureDescription?: string;
}

export default function UpgradeModal({
    isOpen,
    onClose,
    currentPlan,
    requiredPlan,
    feature,
    featureDescription,
}: UpgradeModalProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleUpgrade = async () => {
        if (requiredPlan === 'enterprise') {
            router.push('/contact');
            onClose();
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/subscription/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan: requiredPlan }),
            });

            const data = await res.json();

            if (data.authorization_url) {
                window.location.href = data.authorization_url;
            } else {
                alert(data.error || 'Failed to start checkout');
            }
        } catch (error) {
            console.error('Upgrade error:', error);
        } finally {
            setLoading(false);
        }
    };

    const proFeatures = [
        'Unlimited website analyses',
        'Unlimited AI-generated copy',
        'Connect up to 5 social accounts',
        'Schedule unlimited posts',
        'Export reports (PDF)',
        'Priority support',
    ];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Crown className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Upgrade to {formatPlanName(requiredPlan)}</h2>
                    <p className="text-slate-600">
                        {featureDescription || `Unlock ${feature} and more powerful features`}
                    </p>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline">{formatPlanName(currentPlan)}</Badge>
                        <span className="text-slate-400">→</span>
                        <Badge className="bg-purple-600">{formatPlanName(requiredPlan)}</Badge>
                    </div>

                    <ul className="space-y-2">
                        {proFeatures.map((feat, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm">
                                <Check className="w-4 h-4 text-green-500" />
                                <span>{feat}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="text-center mb-6">
                    <div className="text-3xl font-bold">
                        {requiredPlan === 'pro' ? '$29' : 'Custom'}
                        {requiredPlan === 'pro' && (
                            <span className="text-base font-normal text-slate-600">/month</span>
                        )}
                    </div>
                </div>

                <div className="space-y-3">
                    <Button
                        className="w-full"
                        size="lg"
                        onClick={handleUpgrade}
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                            <Zap className="w-4 h-4 mr-2" />
                        )}
                        {requiredPlan === 'enterprise' ? 'Contact Sales' : 'Upgrade Now'}
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full"
                        onClick={onClose}
                    >
                        Maybe Later
                    </Button>
                </div>
            </Card>
        </div>
    );
}
