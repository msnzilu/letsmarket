// components/Navbar.tsx

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { User } from '@supabase/supabase-js';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        setMobileMenuOpen(false);
        router.push('/');
    };

    const navLinks = user ? [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/campaigns', label: 'Campaigns' },
        { href: '/connections', label: 'Connections' },
        { href: '/profile', label: 'Profile' },
    ] : [];

    const isActive = (href: string) => {
        if (href === '/campaigns') return pathname?.startsWith('/campaigns');
        return pathname === href;
    };

    return (
        <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg" />
                        <span className="font-bold text-xl">LetsMarket</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        {loading ? (
                            <div className="flex space-x-4">
                                <div className="h-9 w-20 bg-slate-100 rounded animate-pulse" />
                                <div className="h-9 w-20 bg-slate-100 rounded animate-pulse" />
                            </div>
                        ) : user ? (
                            <>
                                {navLinks.map(link => (
                                    <Link key={link.href} href={link.href}>
                                        <Button variant={isActive(link.href) ? 'default' : 'ghost'}>
                                            {link.label}
                                        </Button>
                                    </Link>
                                ))}
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

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t bg-white">
                    <div className="px-4 py-4 space-y-2">
                        {loading ? (
                            <div className="space-y-2">
                                <div className="h-10 bg-slate-100 rounded animate-pulse" />
                                <div className="h-10 bg-slate-100 rounded animate-pulse" />
                            </div>
                        ) : user ? (
                            <>
                                {navLinks.map(link => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`block px-4 py-3 rounded-lg transition-colors ${isActive(link.href)
                                            ? 'bg-purple-100 text-purple-700'
                                            : 'hover:bg-slate-100'
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <button
                                    onClick={handleSignOut}
                                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-100 text-red-600"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-4 py-3 rounded-lg hover:bg-slate-100"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-4 py-3 rounded-lg bg-purple-600 text-white text-center"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}