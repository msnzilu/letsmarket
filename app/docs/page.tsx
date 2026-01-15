// app/docs/page.tsx

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Book, Zap, Link2, Settings, Code, HelpCircle } from 'lucide-react';

const sections = [
    {
        title: 'Getting Started',
        icon: Zap,
        items: [
            { title: 'Quick Start Guide', href: '#quick-start' },
            { title: 'Creating Your Account', href: '#create-account' },
            { title: 'Your First Analysis', href: '#first-analysis' },
        ],
    },
    {
        title: 'Psychology Principles',
        icon: Book,
        items: [
            { title: 'Understanding Scores', href: '#scores' },
            { title: 'Reciprocity', href: '#reciprocity' },
            { title: 'Social Proof', href: '#social-proof' },
            { title: 'Scarcity & Urgency', href: '#scarcity' },
            { title: 'Authority', href: '#authority' },
        ],
    },
    {
        title: 'Social Connections',
        icon: Link2,
        items: [
            { title: 'Connecting Accounts', href: '#connect' },
            { title: 'Posting Content', href: '#posting' },
            { title: 'Scheduling Posts', href: '#scheduling' },
        ],
    },
    {
        title: 'Account Settings',
        icon: Settings,
        items: [
            { title: 'Profile Settings', href: '#profile' },
            { title: 'Billing & Plans', href: '#billing' },
            { title: 'Team Management', href: '#team' },
        ],
    },
    {
        title: 'API Reference',
        icon: Code,
        items: [
            { title: 'Authentication', href: '#api-auth' },
            { title: 'Analyze Endpoint', href: '#api-analyze' },
            { title: 'Rate Limits', href: '#api-limits' },
        ],
    },
    {
        title: 'FAQ',
        icon: HelpCircle,
        items: [
            { title: 'Common Questions', href: '#faq' },
            { title: 'Troubleshooting', href: '#troubleshooting' },
            { title: 'Contact Support', href: '/contact' },
        ],
    },
];

export default function DocsPage() {
    return (
        <div className="max-w-6xl mx-auto px-4 py-16">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Documentation</h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                    Everything you need to get started and make the most of LetsMarket.
                </p>
            </div>

            {/* Quick Start Card */}
            <Card className="p-8 mb-12 bg-gradient-to-br from-purple-50 to-blue-50">
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">New to LetsMarket?</h2>
                        <p className="text-slate-600">
                            Get up and running in under 5 minutes with our quick start guide.
                        </p>
                    </div>
                    <Link href="/analyze">
                        <Button size="lg">
                            <Zap className="w-4 h-4 mr-2" />
                            Start Analyzing
                        </Button>
                    </Link>
                </div>
            </Card>

            {/* Documentation Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sections.map((section) => (
                    <Card key={section.title} className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <section.icon className="w-6 h-6 text-purple-600" />
                            <h3 className="font-semibold text-lg">{section.title}</h3>
                        </div>
                        <ul className="space-y-2">
                            {section.items.map((item) => (
                                <li key={item.title}>
                                    <Link
                                        href={item.href}
                                        className="text-slate-600 hover:text-purple-600 hover:underline text-sm"
                                    >
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </Card>
                ))}
            </div>

            {/* Help Section */}
            <div className="text-center mt-12 p-8 bg-slate-50 rounded-xl">
                <h2 className="text-xl font-semibold mb-2">Need More Help?</h2>
                <p className="text-slate-600 mb-4">
                    Can't find what you're looking for? Our support team is here to help.
                </p>
                <Link href="/contact">
                    <Button variant="outline">Contact Support</Button>
                </Link>
            </div>
        </div>
    );
}
