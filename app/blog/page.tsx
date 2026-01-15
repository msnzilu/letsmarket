// app/blog/page.tsx

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, TrendingUp } from 'lucide-react';

const featuredPost = {
    slug: 'psychology-of-ctas',
    title: 'The Complete Guide to High-Converting CTAs',
    excerpt: 'Learn how to craft calls-to-action that leverage urgency, social proof, and loss aversion to drive more clicks and conversions on your landing pages.',
    category: 'Conversion',
    date: 'Jan 10, 2026',
    readTime: '8 min read',
    image: '/blog/cta-hero.jpg',
};

const posts = [
    {
        slug: 'social-proof-guide',
        title: 'The Ultimate Guide to Social Proof',
        excerpt: 'Discover how testimonials, reviews, and user counts can dramatically increase trust.',
        category: 'Marketing',
        date: 'Jan 5, 2026',
        readTime: '6 min read',
    },
    {
        slug: 'ai-copywriting-tips',
        title: '10 Tips for Better AI-Generated Copy',
        excerpt: 'Get the most out of AI copywriting tools with these proven strategies.',
        category: 'AI',
        date: 'Dec 28, 2025',
        readTime: '5 min read',
    },
    {
        slug: 'landing-page-optimization',
        title: 'Landing Page Optimization Guide',
        excerpt: 'Use scoring and A/B testing to improve your conversion rates.',
        category: 'Conversion',
        date: 'Dec 20, 2025',
        readTime: '7 min read',
    },
    {
        slug: 'scarcity-marketing',
        title: 'How to Use Scarcity in Marketing',
        excerpt: 'Create urgency without being pushy or misleading your customers.',
        category: 'Marketing',
        date: 'Dec 15, 2025',
        readTime: '5 min read',
    },
    {
        slug: 'authority-building',
        title: 'Building Authority for Your Brand',
        excerpt: 'Establish credibility with certifications, experts, and trust signals.',
        category: 'Branding',
        date: 'Dec 10, 2025',
        readTime: '6 min read',
    },
    {
        slug: 'pricing-strategies',
        title: 'Pricing Strategies That Convert',
        excerpt: 'Charm pricing, anchoring, and tier structures that boost sales.',
        category: 'Conversion',
        date: 'Dec 5, 2025',
        readTime: '7 min read',
    },
];

const categories = ['All', 'Conversion', 'Marketing', 'AI', 'Branding'];

export default function BlogPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            {/* Header */}
            <div className="text-center mb-12">
                <Badge className="mb-4 bg-purple-100 text-purple-700">Blog</Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Insights & Resources
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                    Learn how to optimize your website copy and boost conversions with AI-powered insights.
                </p>
            </div>

            {/* Featured Post */}
            <Card className="mb-12 overflow-hidden bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                <div className="p-8 md:p-12">
                    <Badge className="bg-white/20 text-white mb-4">Featured</Badge>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        {featuredPost.title}
                    </h2>
                    <p className="text-lg opacity-90 mb-6 max-w-2xl">
                        {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-6 mb-6 text-sm opacity-75">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {featuredPost.date}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {featuredPost.readTime}
                        </span>
                    </div>
                    <Link href={`/blog/${featuredPost.slug}`}>
                        <Button variant="secondary" size="lg">
                            Read Article
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </Card>

            {/* Category Filter */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                {categories.map((cat) => (
                    <Button
                        key={cat}
                        variant={cat === 'All' ? 'default' : 'outline'}
                        size="sm"
                        className="whitespace-nowrap"
                    >
                        {cat}
                    </Button>
                ))}
            </div>

            {/* Posts Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {posts.map((post) => (
                    <Card key={post.slug} className="p-6 hover:shadow-lg transition-all hover:-translate-y-1">
                        <Badge variant="secondary" className="mb-3">
                            {post.category}
                        </Badge>
                        <h3 className="text-xl font-semibold mb-2 hover:text-purple-600 transition-colors">
                            <Link href={`/blog/${post.slug}`}>
                                {post.title}
                            </Link>
                        </h3>
                        <p className="text-slate-600 mb-4 text-sm line-clamp-2">
                            {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {post.date}
                            </span>
                            <span>{post.readTime}</span>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Newsletter CTA */}
            <Card className="p-8 text-center bg-slate-50">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                <h2 className="text-2xl font-bold mb-2">Get Weekly Insights</h2>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">
                    Join 5,000+ marketers getting conversion tips delivered to their inbox.
                </p>
                <div className="flex gap-2 max-w-md mx-auto">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <Button>Subscribe</Button>
                </div>
            </Card>
        </div>
    );
}
