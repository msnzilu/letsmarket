// app/docs/page.tsx

import { Metadata } from 'next';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Book, Zap, Link2, Settings, Code, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Documentation - lez Market Support',
    description: 'Find guides, API references, and FAQs to help you get the most out of lez Market AI Website Analyzer.',
};

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
            { title: 'Social Proof', href: '#social-proof' },
            { title: 'Loss Aversion', href: '#loss-aversion' },
            { title: 'Authority', href: '#authority' },
            { title: 'Scarcity & Urgency', href: '#scarcity' },
            { title: 'Cognitive Ease', href: '#cognitive-ease' },
            { title: 'Pricing Psychology', href: '#pricing-psychology' },
        ],
    },
    {
        title: 'Social Connections',
        icon: Link2,
        items: [
            { title: 'Connecting Accounts', href: '#connect' },
            { title: 'LinkedIn Organization Pages', href: '#linkedin-pages' },
            { title: 'Automated Campaigns', href: '#campaigns' },
            { title: 'Scheduled Posts', href: '#scheduling' },
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
        title: 'Account & Billing',
        icon: Settings,
        items: [
            { title: 'Pro Subscription', href: '#billing' },
            { title: 'Usage Limits', href: '#limits' },
            { title: 'Team Management', href: '#team' },
        ],
    },
    {
        title: 'Support',
        icon: HelpCircle,
        items: [
            { title: 'FAQ', href: '#faq' },
            { title: 'TikTok Submission Guide', href: '#tiktok-guide' },
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
                    Everything you need to get started and make the most of lez Market.
                </p>
            </div>

            {/* Quick Start Card */}
            <Card className="p-8 mb-12 bg-gradient-to-br from-brand-secondary-light to-brand-secondary/5">
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">New to lez Market?</h2>
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
                            <section.icon className="w-6 h-6 text-brand-primary" />
                            <h3 className="font-semibold text-lg">{section.title}</h3>
                        </div>
                        <ul className="space-y-2">
                            {section.items.map((item) => (
                                <li key={item.title}>
                                    <Link
                                        href={item.href}
                                        className="text-slate-600 hover:text-brand-primary hover:underline text-sm"
                                    >
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </Card>
                ))}
            </div>

            {/* Documentation Content */}
            <div className="mt-20 space-y-24">
                {/* Getting Started */}
                <section id="quick-start" className="scroll-mt-24">
                    <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 border-b pb-4">
                        <Zap className="w-8 h-8 text-brand-primary" />
                        Getting Started
                    </h2>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <div id="create-account">
                                <h3 className="text-xl font-semibold mb-3">1. Creating Your Account</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Sign up with your email or use a social provider (Google, GitHub) to create your lez Market account.
                                    New users receive 1 free credit to perform their first full website analysis.
                                </p>
                            </div>

                            <div id="first-analysis">
                                <h3 className="text-xl font-semibold mb-3">2. Your First Analysis</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Enter your website's URL on the dashboard and click "Analyze". Our AI engine will crawl your
                                    homepage, identify existing copy, and evaluate it based on 6 core persuasion principles.
                                    You'll receive an overall "Persuasion Score" and a detailed report in under 2 minutes.
                                </p>
                            </div>
                        </div>

                        <Card className="p-6 bg-slate-50 border-none shadow-inner">
                            <h4 className="font-semibold mb-4 text-brand-primary">Pro Tip</h4>
                            <p className="text-sm text-slate-600 italic">
                                "The best results come from analyze individual landing pages rather than broad homepages.
                                Focus on pages where you want the user to take a specific action (like a pricing page)."
                            </p>
                        </Card>
                    </div>
                </section>

                {/* Psychology Principles */}
                <section id="scores" className="scroll-mt-24">
                    <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 border-b pb-4">
                        <Book className="w-8 h-8 text-brand-primary" />
                        Psychology Principles
                    </h2>

                    <p className="text-xl text-slate-600 mb-10">
                        Our analysis engine is built on the 6 foundational principles of conversion psychology.
                        Each section of your website is scored based on how effectively it leverages these cognitive biases.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            {
                                id: 'social-proof',
                                title: 'Social Proof',
                                description: 'Leveraging the behavior and testimonials of others to build trust. People follow the lead of similar others.'
                            },
                            {
                                id: 'loss-aversion',
                                title: 'Loss Aversion',
                                description: 'The psychological tendency to prefer avoiding losses to acquiring equivalent gains. It\'s twice as powerful as the joy of winning.'
                            },
                            {
                                id: 'authority',
                                title: 'Authority',
                                description: 'The tendency to follow those who provide evidence of expertise, credentials, or industry recognition.'
                            },
                            {
                                id: 'scarcity',
                                title: 'Scarcity & Urgency',
                                description: 'Items or opportunities become more desirable as they become less available or time-limited.'
                            },
                            {
                                id: 'cognitive-ease',
                                title: 'Cognitive Ease',
                                description: 'Making information easy to process. When a task feels easy, we perceive it as true and familiar.'
                            },
                            {
                                id: 'pricing-psychology',
                                title: 'Pricing Psychology',
                                description: 'Using strategies like anchoring, charm pricing, and decoy effects to influence value perception.'
                            }
                        ].map((p) => (
                            <Card key={p.id} id={p.id} className="p-6 border-l-4 border-l-brand-primary hover:shadow-md transition-shadow scroll-mt-24">
                                <h3 className="font-bold text-lg mb-2">{p.title}</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">{p.description}</p>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Social Connections */}
                <section id="connect" className="scroll-mt-24">
                    <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 border-b pb-4">
                        <Link2 className="w-8 h-8 text-brand-primary" />
                        Social Connections
                    </h2>
                    <div className="space-y-8">
                        <div id="linkedin-pages">
                            <h3 className="text-xl font-semibold mb-3">Connecting LinkedIn Organization Pages</h3>
                            <p className="text-slate-600 mb-4">
                                lez Market supports both personal profiles and company pages. When you connect LinkedIn,
                                we automatically detect all organizations where you have Administrative roles.
                            </p>
                            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                                <li>Connect your personal LinkedIn account first.</li>
                                <li>Use the "Select Page" button on the Social Connections card.</li>
                                <li>Switch between your personal profile and any managed company pages.</li>
                            </ul>
                        </div>

                        <div id="campaigns">
                            <h3 className="text-xl font-semibold mb-3">Automated Campaigns</h3>
                            <p className="text-slate-600">
                                Pro users can create AI-driven campaigns that automatically generate and publish content
                                to their connected social accounts based on a customized schedule.
                                Our AI rotates through different psychology principles to keep your feed fresh and engaging.
                            </p>
                        </div>
                    </div>
                </section>

                {/* API Reference */}
                <section id="api-auth" className="scroll-mt-24">
                    <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 border-b pb-4">
                        <Code className="w-8 h-8 text-brand-primary" />
                        API Reference
                    </h2>
                    <div className="bg-slate-900 rounded-xl p-8 text-slate-300 font-mono text-sm overflow-x-auto">
                        <p className="text-brand-secondary mb-4">// Authenticate with your API Key</p>
                        <p>GET /api/v1/analyze?url=https://yourwebsite.com</p>
                        <p>Authorization: Bearer YOUR_API_KEY</p>
                    </div>
                    <p className="mt-4 text-slate-600 italic">
                        Full API documentation is available for Enterprise users. Contact support for access keys.
                    </p>
                </section>

                {/* Account & Billing */}
                <section id="billing" className="scroll-mt-24">
                    <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 border-b pb-4">
                        <Settings className="w-8 h-8 text-brand-primary" />
                        Account & Billing
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div id="limits">
                            <h3 className="text-xl font-semibold mb-3">Usage Limits</h3>
                            <p className="text-slate-600 mb-4">
                                Free accounts are limited to 1 website analysis and 1 social connection.
                                Pro accounts unlock unlimited analysis history, automated campaigns, and
                                up to 10 social connections.
                            </p>
                        </div>
                        <div id="team">
                            <h3 className="text-xl font-semibold mb-3">Team Management</h3>
                            <p className="text-slate-600">
                                Pro and Enterprise users can invite team members to collaborate on analyses
                                and campaigns. Usage is shared across the entire team account.
                            </p>
                        </div>
                    </div>
                </section>

                {/* FAQ & Support */}
                <section id="faq" className="scroll-mt-24">
                    <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 border-b pb-4">
                        <HelpCircle className="w-8 h-8 text-brand-primary" />
                        FAQ & Support
                    </h2>
                    <div className="space-y-6">
                        <div className="p-6 bg-slate-50 rounded-lg">
                            <h4 className="font-bold mb-2">Why isn't my website scoring 100?</h4>
                            <p className="text-sm text-slate-600">
                                Perfect scores are rare. Our AI evaluates your site against a high bar of industry best practices.
                                Focus on the "Top Recommendations" to see the biggest impact on your conversion rates.
                            </p>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-lg">
                            <h4 className="font-bold mb-2">How do I fix social publishing errors?</h4>
                            <p className="text-sm text-slate-600">
                                Most publishing errors are due to expired tokens. Try disconnecting and reconnecting
                                your account on the Social Connections page. For X (Twitter), ensure you have authorized
                                "write" permissions.
                            </p>
                        </div>
                        <div id="tiktok-guide" className="p-6 border-2 border-brand-secondary/20 rounded-lg">
                            <h4 className="font-bold mb-2">TikTok App Review Guide</h4>
                            <p className="text-sm text-slate-600 mb-4">
                                If you are a developer integrating TikTok, ensure you follow our submission guide
                                which includes specific text explanations for Login Kit and Content Posting API.
                            </p>
                            <Link href="/tiktok-submission-guide" className="text-brand-primary text-sm font-semibold hover:underline">
                                View Full Submission Guide →
                            </Link>
                        </div>
                    </div>
                </section>
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
