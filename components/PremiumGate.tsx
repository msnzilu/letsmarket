'use client';

import { useSubscription } from '@/hooks/useSubscription';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface PremiumGateProps {
    children: ReactNode;
    fallbackUrl?: string;
}

export function PremiumGate({ children, fallbackUrl = '/pricing' }: PremiumGateProps) {
    const { plan, isLoading } = useSubscription();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && plan === 'free') {
            router.push(fallbackUrl);
        }
    }, [plan, isLoading, router, fallbackUrl]);

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-4" />
                <p className="text-slate-500 font-medium">Verifying access...</p>
            </div>
        );
    }

    if (plan === 'free') {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                    <Loader2 className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Premium Feature</h2>
                <p className="text-slate-600 max-w-md mb-8">
                    This feature is exclusive to Pro and Enterprise users. Upgrade your plan to unlock advanced social media and automation tools.
                </p>
                <button
                    onClick={() => router.push('/pricing')}
                    className="px-8 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-200"
                >
                    View Pricing
                </button>
            </div>
        );
    }

    return <>{children}</>;
}
