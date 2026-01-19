// app/pricing/page.tsx

import { Metadata } from 'next';
import PricingClient from './PricingClient';

export const metadata: Metadata = {
    title: 'Pricing - lez Market AI Website Analyzer',
    description: 'Choose the perfect plan for your business. From free website analysis to unlimited AI-powered conversion optimization.',
    openGraph: {
        title: 'Simple, Transparent Pricing - lez Market',
        description: 'Start optimizing your website today with our flexible pricing plans.',
    }
};

export default function PricingPage() {
    return <PricingClient />;
}
