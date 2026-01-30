import { notFound } from 'next/navigation';
import { posts } from '@/lib/blog-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';

export async function generateStaticParams() {
    return posts.filter(p => p.content && p.content.trim().length > 0).map((post) => ({
        slug: post.slug,
    }));
}

import { createClient } from '@/lib/supabase/server';

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = posts.find((p) => p.slug === slug && p.content && p.content.trim().length > 0);

    if (!post) {
        notFound();
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <article className="max-w-4xl mx-auto px-4 py-20">
            <Link href="/blog">
                <Button variant="ghost" className="mb-8 -ml-4 hover:bg-transparent hover:text-brand-primary">
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back to Blog
                </Button>
            </Link>

            <div className="mb-12">
                <Badge className="mb-6 bg-brand-secondary-light text-brand-primary border-none text-brand-primary">
                    {post.category}
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight text-slate-900">
                    {post.title}
                </h1>
                <div className="flex items-center gap-6 text-slate-500 text-sm font-medium">
                    <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {post.date}
                    </span>
                    <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                    </span>
                </div>
            </div>

            {post.image && (
                <div className="mb-12 rounded-3xl overflow-hidden shadow-2xl">
                    <img src={post.image} alt={post.title} className="w-full h-auto object-cover" />
                </div>
            )}

            <div className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-a:text-brand-primary">
                {post.content ? (
                    <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }} />
                ) : (
                    <p className="text-slate-600 italic">Article content coming soon...</p>
                )}
            </div>

            <div className="mt-20 pt-10 border-t border-slate-100">
                <h3 className="text-2xl font-bold mb-6">Ready to optimize your own site?</h3>
                <div className="p-8 bg-gradient-to-br from-brand-primary to-blue-700 rounded-3xl text-white shadow-xl">
                    <h4 className="text-xl font-bold mb-2">
                        {user ? 'Optimize Your Website Now' : 'Join Lez Market Today'}
                    </h4>
                    <p className="opacity-90 mb-6 max-w-lg">
                        {user 
                            ? 'Run a new analysis on your latest landing page and get AI-powered insights in seconds.'
                            : 'Get AI-powered conversion analysis and copywriting suggestions in seconds.'
                        }
                    </p>
                    <Link href={user ? '/analyze' : '/signup'}>
                        <Button className="bg-white text-brand-primary hover:bg-slate-100">
                            {user ? 'New Analysis' : 'Get Started Free'}
                        </Button>
                    </Link>
                </div>
            </div>
        </article>
    );
}
