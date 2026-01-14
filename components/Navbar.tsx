// components/Navbar.tsx

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { User } from '@supabase/supabase-js';

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    return (
        <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
            <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg" />
                        <span className="font-bold text-xl">PsychAnalyze</span>
                    </Link>

                    <div className="flex items-center space-x-4">
                        {loading ? (
                            // Skeleton placeholder to prevent layout shift
                            <div className="flex space-x-4">
                                <div className="h-9 w-20 bg-slate-100 rounded animate-pulse" />
                                <div className="h-9 w-20 bg-slate-100 rounded animate-pulse" />
                            </div>
                        ) : user ? (
                            <>
                                <Link href="/dashboard">
                                    <Button variant={pathname === '/dashboard' ? 'default' : 'ghost'}>
                                        Dashboard
                                    </Button>
                                </Link>
                                <Link href="/analyze">
                                    <Button variant={pathname === '/analyze' ? 'default' : 'ghost'}>
                                        Analyze
                                    </Button>
                                </Link>
                                <Link href="/connections">
                                    <Button variant={pathname === '/connections' ? 'default' : 'ghost'}>
                                        Connections
                                    </Button>
                                </Link>
                                <Link href="/posts">
                                    <Button variant={pathname === '/posts' ? 'default' : 'ghost'}>
                                        Posts
                                    </Button>
                                </Link>
                                <Button variant="outline" onClick={handleSignOut}>
                                    Sign Out
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost">Login</Button>
                                </Link>
                                <Link href="/signup">
                                    <Button>Sign Up</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}