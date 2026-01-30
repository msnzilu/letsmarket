// app/blog/page.tsx

import { Metadata } from 'next';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Blog - lez Market Conversion Insights',
    description: 'Learn how to optimize your website copy and boost conversions with AI-powered insights, marketing psychology, and behavioral economics.',
};

import { posts as allPosts } from '@/lib/blog-data';

// Only show posts that have content
const posts = allPosts.filter(post => post.content && post.content.trim().length > 0);

const featuredPost = posts[0];
const categories = ['All', 'Conversion', 'Marketing', 'AI', 'Branding'];

import { createClient } from '@/lib/supabase/server';

export default async function BlogPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            {/* Header */}
            <div className="text-center mb-12">
                <Badge className="mb-4 bg-brand-secondary-light text-brand-primary">Blog</Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Insights & Resources
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                    Learn how to optimize your website copy and boost conversions with AI-powered insights.
                </p>
            </div>

            {/* Featured Post */}
            <Card className="mb-12 overflow-hidden border-none shadow-2xl relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary via-brand-primary/90 to-blue-600 group-hover:scale-105 transition-transform duration-700"></div>
                <div className="relative p-8 md:p-16 backdrop-blur-sm text-white">
                    <Badge className="bg-white/20 hover:bg-white/30 text-white mb-6 backdrop-blur-md border-white/10 px-4 py-1">Featured Article</Badge>
                    <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight max-w-4xl tracking-tight">
                        {featuredPost.title}
                    </h2>
                    <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-2xl font-light leading-relaxed">
                        {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-8 mb-10 text-sm font-medium opacity-80">
                        <span className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-300" />
                            {featuredPost.date}
                        </span>
                        <span className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-300" />
                            {featuredPost.readTime}
                        </span>
                    </div>
                    <Link href={`/blog/${featuredPost.slug}`}>
                        <Button variant="secondary" size="lg" className="h-14 px-10 text-lg font-semibold bg-white text-brand-primary hover:bg-slate-100 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                            Read Full Story
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl"></div>
            </Card>

            {/* Category Filter */}
            <div className="flex gap-3 mb-12 overflow-x-auto pb-4 scrollbar-hide">
                {categories.map((cat) => (
                    <Button
                        key={cat}
                        variant={cat === 'All' ? 'default' : 'outline'}
                        className={`rounded-full px-6 transition-all ${
                            cat === 'All' 
                            ? 'bg-brand-primary text-white shadow-lg hover:shadow-brand-primary/20' 
                            : 'hover:bg-brand-primary/5 hover:border-brand-primary text-slate-600'
                        }`}
                    >
                        {cat}
                    </Button>
                ))}
            </div>

            {/* Posts Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                {posts.slice(0, 6).map((post) => (
                    <Card key={post.slug} className="flex flex-col h-full border-none shadow-md hover:shadow-2xl transition-all hover:-translate-y-2 group overflow-hidden bg-white">
                        <div className="p-8 flex flex-col h-full justify-between">
                            <div>
                                <Badge variant="secondary" className="mb-4 bg-slate-100 text-slate-600 font-medium px-3">
                                    {post.category}
                                </Badge>
                                <h3 className="text-2xl font-bold mb-4 group-hover:text-brand-primary transition-colors leading-snug">
                                    <Link href={`/blog/${post.slug}`}>
                                        {post.title}
                                    </Link>
                                </h3>
                                <p className="text-slate-500 mb-6 text-base leading-relaxed line-clamp-3">
                                    {post.excerpt}
                                </p>
                            </div>
                            <div className="pt-6 border-t border-slate-50 flex items-center justify-between text-sm text-slate-400 font-medium">
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    {post.date}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" />
                                    {post.readTime}
                                </span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Newsletter CTA */}
            <Card className="p-8 text-center bg-slate-50">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-brand-primary" />
                <h2 className="text-2xl font-bold mb-2">Get Weekly Insights</h2>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">
                    Join 5,000+ marketers getting conversion tips delivered to their inbox.
                </p>
                <div className="flex gap-2 max-w-md mx-auto">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                    <Button>Subscribe</Button>
                </div>
            </Card>
        </div>
    );
}
