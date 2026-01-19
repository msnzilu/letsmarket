// components/PlanBadge.tsx
// Small badge showing current plan

import { Badge } from '@/components/ui/badge';
import { Crown } from 'lucide-react';
import { Plan, formatPlanName } from '@/lib/subscription';

interface PlanBadgeProps {
    plan: Plan;
    size?: 'sm' | 'md';
}

export default function PlanBadge({ plan, size = 'sm' }: PlanBadgeProps) {
    const getVariant = () => {
        switch (plan) {
            case 'pro':
                return 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white border-0';
            case 'enterprise':
                return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0';
            default:
                return '';
        }
    };

    return (
        <Badge
            className={`${getVariant()} ${size === 'md' ? 'px-3 py-1 text-sm' : ''}`}
            variant={plan === 'free' ? 'secondary' : 'default'}
        >
            {plan !== 'free' && <Crown className={`${size === 'md' ? 'w-4 h-4' : 'w-3 h-3'} mr-1`} />}
            {formatPlanName(plan)}
        </Badge>
    );
}
