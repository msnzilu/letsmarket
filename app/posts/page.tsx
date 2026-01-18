// app/posts/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Send, Clock, CheckCircle, XCircle, ExternalLink, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { PremiumGate } from '@/components/PremiumGate';
import { ScheduledPost, Platform, PLATFORM_CONFIG } from '@/types';

export default function PostsPage() {
    const router = useRouter();
    const supabase = createClient();
    const [posts, setPosts] = useState<ScheduledPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [authChecked, setAuthChecked] = useState(false);
    const [publishingId, setPublishingId] = useState<string | null>(null);

    useEffect(() => {
        // Check auth first
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) {
                router.push('/login');
                return;
            }
            setAuthChecked(true);
            fetchPosts();
        });
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/posts');
            const data = await res.json();
            setPosts(data.posts || []);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async (postId: string) => {
        setPublishingId(postId);
        try {
            const res = await fetch('/api/posts/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId }),
            });
            const data = await res.json();

            if (data.success) {
                setPosts(prev => prev.map(p =>
                    p.id === postId ? { ...p, ...data.post } : p
                ));
            } else {
                // Update with error status
                setPosts(prev => prev.map(p =>
                    p.id === postId ? { ...p, status: 'failed', error_message: data.error } : p
                ));
            }
        } catch (error: any) {
            console.error('Error publishing:', error);
        } finally {
            setPublishingId(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'published':
                return (
                    <Badge className="bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Published
                    </Badge>
                );
            case 'scheduled':
                return (
                    <Badge className="bg-blue-100 text-blue-700">
                        <Clock className="w-3 h-3 mr-1" />
                        Scheduled
                    </Badge>
                );
            case 'failed':
                return (
                    <Badge className="bg-red-100 text-red-700">
                        <XCircle className="w-3 h-3 mr-1" />
                        Failed
                    </Badge>
                );
            case 'publishing':
                return (
                    <Badge className="bg-yellow-100 text-yellow-700">
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Publishing...
                    </Badge>
                );
            default:
                return (
                    <Badge variant="outline">
                        Draft
                    </Badge>
                );
        }
    };

    const filterPosts = (status?: string) => {
        if (!status || status === 'all') return posts;
        return posts.filter(p => p.status === status);
    };

    const scheduledPosts = posts.filter(p => p.status === 'scheduled');
    const publishedPosts = posts.filter(p => p.status === 'published');
    const draftPosts = posts.filter(p => p.status === 'draft');

    return (
        <PremiumGate>
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="mb-8">
                    <Link href="/dashboard">
                        <Button variant="ghost" className="mb-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </Link>

                    <h1 className="text-3xl font-bold mb-2">Your Posts</h1>
                    <p className="text-slate-600">
                        Manage your scheduled and published social media posts
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <Card className="p-4 text-center">
                        <p className="text-3xl font-bold text-blue-600">{scheduledPosts.length}</p>
                        <p className="text-sm text-slate-600">Scheduled</p>
                    </Card>
                    <Card className="p-4 text-center">
                        <p className="text-3xl font-bold text-green-600">{publishedPosts.length}</p>
                        <p className="text-sm text-slate-600">Published</p>
                    </Card>
                    <Card className="p-4 text-center">
                        <p className="text-3xl font-bold text-slate-600">{draftPosts.length}</p>
                        <p className="text-sm text-slate-600">Drafts</p>
                    </Card>
                </div>

                <Tabs defaultValue="all">
                    <TabsList className="mb-6">
                        <TabsTrigger value="all">All ({posts.length})</TabsTrigger>
                        <TabsTrigger value="draft">Drafts ({draftPosts.length})</TabsTrigger>
                        <TabsTrigger value="scheduled">Scheduled ({scheduledPosts.length})</TabsTrigger>
                        <TabsTrigger value="published">Published ({publishedPosts.length})</TabsTrigger>
                    </TabsList>

                    {['all', 'draft', 'scheduled', 'published'].map(tab => (
                        <TabsContent key={tab} value={tab}>
                            {loading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <Card key={i} className="p-6 animate-pulse">
                                            <div className="h-5 bg-slate-200 rounded w-3/4 mb-3" />
                                            <div className="h-4 bg-slate-200 rounded w-1/2" />
                                        </Card>
                                    ))}
                                </div>
                            ) : filterPosts(tab === 'all' ? undefined : tab).length === 0 ? (
                                <Card className="p-12 text-center">
                                    <p className="text-slate-500 mb-4">No posts yet</p>
                                    <Link href="/dashboard">
                                        <Button>Analyze a Website to Create Posts</Button>
                                    </Link>
                                </Card>
                            ) : (
                                <div className="space-y-4">
                                    {filterPosts(tab === 'all' ? undefined : tab).map(post => (
                                        <Card key={post.id} className="p-6">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-3">
                                                    {post.connection && (
                                                        <div
                                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                                                            style={{ backgroundColor: PLATFORM_CONFIG[post.connection.platform as Platform].color }}
                                                        >
                                                            {PLATFORM_CONFIG[post.connection.platform as Platform].name[0]}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="text-sm text-slate-500">
                                                            {post.connection?.account_name || 'Unknown account'}
                                                        </p>
                                                    </div>
                                                </div>
                                                {getStatusBadge(post.status)}
                                            </div>

                                            <p className="text-slate-800 mb-4 whitespace-pre-wrap">
                                                {post.content}
                                            </p>

                                            {post.error_message && (
                                                <p className="text-sm text-red-600 mb-3 bg-red-50 p-2 rounded">
                                                    Error: {post.error_message}
                                                </p>
                                            )}

                                            <div className="flex items-center justify-between text-sm text-slate-500">
                                                <div>
                                                    {post.scheduled_for && (
                                                        <span>
                                                            Scheduled: {new Date(post.scheduled_for).toLocaleString()}
                                                        </span>
                                                    )}
                                                    {post.published_at && (
                                                        <span>
                                                            Published: {new Date(post.published_at).toLocaleString()}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex gap-2">
                                                    {post.platform_post_url && (
                                                        <a
                                                            href={post.platform_post_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <Button variant="outline" size="sm">
                                                                <ExternalLink className="w-4 h-4 mr-1" />
                                                                View
                                                            </Button>
                                                        </a>
                                                    )}
                                                    {(post.status === 'draft' || post.status === 'scheduled') && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handlePublish(post.id)}
                                                            disabled={publishingId === post.id}
                                                        >
                                                            {publishingId === post.id ? (
                                                                <Loader2 className="w-4 h-4 animate-spin mr-1" />
                                                            ) : (
                                                                <Send className="w-4 h-4 mr-1" />
                                                            )}
                                                            Publish Now
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </PremiumGate>
    );
}
