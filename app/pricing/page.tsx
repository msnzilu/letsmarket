// app/pricing/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Check, Loader2, MapPin } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useGeolocation, formatPrice } from '@/lib/hooks/useGeolocation';

// Base prices in USD
const BASE_PRICES = {
    free: 0,
    pro: 29,
    enterprise: 0, // Custom
};

interface Plan {
    id: 'free' | 'pro' | 'enterprise';
    name: string;
    basePrice: number;
    period: string;
    description: string;
    features: string[];
    cta: string;
    popular: boolean;
}

const plans: Plan[] = [
    {
        id: 'free',
        name: 'Free',
        basePrice: 0,
        period: 'forever',
        description: 'Perfect for trying out LetsMarket',
        features: [
            '3 website analyses',
            'Basic conversion scoring',
            '5 AI-generated headlines',
            '5 AI-generated CTAs',
            'Email support',
        ],
        cta: 'Get Started',
        popular: false,
    },
    {
        id: 'pro',
        name: 'Pro',
        basePrice: 29,
        period: '/month',
        description: 'For growing businesses and marketers',
        features: [
            'Unlimited website analyses',
            'Advanced conversion scoring',
            'Unlimited AI-generated copy',
            'Social media scheduling',
            '5 social accounts',
            'Priority support',
            'Export reports (PDF)',
        ],
        cta: 'Upgrade Now',
        popular: true,
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        basePrice: 0,
        period: '',
        description: 'For large teams and agencies',
        features: [
            'Everything in Pro',
            'Unlimited social accounts',
            'Team collaboration',
            'White-label reports',
            'API access',
            'Dedicated account manager',
            'Custom integrations',
        ],
        cta: 'Contact Sales',
        popular: false,
    },
];

export default function PricingPage() {
    const router = useRouter();
    const { plan: currentPlan, isLoading: subLoading } = useSubscription();
    const { currency, country, loading: geoLoading } = useGeolocation();
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

    const getDisplayPrice = (plan: Plan): string => {
        if (plan.id === 'enterprise') return 'Custom';
        if (plan.basePrice === 0) return currency === 'KES' ? 'KES 0' : '$0';
        return formatPrice(plan.basePrice, currency);
    };

    const handleUpgrade = async (planId: string) => {
        if (planId === 'free') {
            router.push('/signup');
            return;
        }

        if (planId === 'enterprise') {
            router.push('/contact');
            return;
        }

        setLoadingPlan(planId);
        try {
            const res = await fetch('/api/subscription/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan: planId, currency }),
            });

            const data = await res.json();

            if (data.authorization_url) {
                window.location.href = data.authorization_url;
            } else if (data.error) {
                alert(data.error);
            }
        } catch (error) {
            console.error('Checkout error:', error);
        } finally {
            setLoadingPlan(null);
        }
    };

    const getButtonText = (planId: string, cta: string) => {
        if (currentPlan === planId) return 'Current Plan';
        if (planId === 'free' && currentPlan !== 'free') return 'Downgrade';
        return cta;
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-16">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                    Start free and scale as you grow. No hidden fees, cancel anytime.
                </p>

                {/* Currency indicator */}
                {!geoLoading && (
                    <div className="mt-4 inline-flex items-center gap-2 text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
                        <MapPin className="w-4 h-4" />
                        <span>
                            Prices shown in {currency === 'KES' ? 'Kenyan Shillings (KES)' : 'US Dollars (USD)'}
                            {country && ` • ${country}`}
                        </span>
                    </div>
                )}
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {plans.map((plan) => {
                    const isCurrentPlan = currentPlan === plan.id;
                    const isLoading = loadingPlan === plan.id;

                    return (
                        <Card
                            key={plan.name}
                            className={`p-8 relative ${plan.popular ? 'border-purple-500 border-2 shadow-lg' : ''} ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}
                        >
                            {plan.popular && (
                                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600">
                                    Most Popular
                                </Badge>
                            )}
                            {isCurrentPlan && (
                                <Badge className="absolute -top-3 right-4 bg-green-600">
                                    Current
                                </Badge>
                            )}

                            <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                            <div className="mb-4">
                                <span className="text-4xl font-bold">
                                    {geoLoading ? '...' : getDisplayPrice(plan)}
                                </span>
                                <span className="text-slate-600">{plan.period}</span>
                            </div>
                            <p className="text-slate-600 mb-6">{plan.description}</p>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                className="w-full"
                                variant={plan.popular ? 'default' : 'outline'}
                                size="lg"
                                onClick={() => handleUpgrade(plan.id)}
                                disabled={isCurrentPlan || isLoading || subLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : null}
                                {getButtonText(plan.id, plan.cta)}
                            </Button>
                        </Card>
                    );
                })}
            </div>

            {/* Payment info */}
            <div className="text-center mt-12 text-sm text-slate-500">
                <p>Secure payments powered by Paystack</p>
                {currency === 'KES' && (
                    <p className="mt-1 text-xs">Payment processed in Kenyan Shillings</p>
                )}
            </div>

            {/* FAQ teaser */}
            <div className="text-center mt-8">
                <p className="text-slate-600">
                    Have questions?{' '}
                    <Link href="/contact" className="text-purple-600 hover:underline">
                        Contact our sales team
                    </Link>
                </p>
            </div>
        </div>
    );
}
