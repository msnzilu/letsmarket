// components/Navbar.tsx

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { User } from '@supabase/supabase-js';
import { Menu, X, User as UserIcon, LogOut, Settings, LayoutDashboard, Share2, Zap, CreditCard } from 'lucide-react';

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Close dropdowns on outside click
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.profile-dropdown-container')) {
                setProfileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            subscription.unsubscribe();
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setMobileMenuOpen(false);
        setProfileMenuOpen(false);
        router.push('/');
    };

    const navLinks = user ? [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/campaigns', label: 'Campaigns', icon: Zap },
        { href: '/connections', label: 'Connections', icon: Share2 },
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
                        <Image
                            src="/logo/logo.png"
                            alt="LetsMarket Logo"
                            width={150}
                            height={100}
                            className="w-8 h-8 object-contain"
                        />
                        <span className="font-bold text-xl">LetsMarket</span>
                    </Link>

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
                                        <Button
                                            variant={isActive(link.href) ? 'default' : 'ghost'}
                                            className="gap-2"
                                        >
                                            <link.icon className="w-4 h-4" />
                                            {link.label}
                                        </Button>
                                    </Link>
                                ))}

                                {/* Profile Dropdown */}
                                <div className="relative profile-dropdown-container">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={`rounded-full border-2 transition-all ${profileMenuOpen ? 'border-purple-500 bg-purple-50' : 'border-transparent'}`}
                                        onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                    >
                                        <UserIcon className="w-5 h-5 text-slate-600" />
                                    </Button>

                                    {profileMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in duration-200">
                                            <div className="px-4 py-2 border-b border-slate-50 mb-2">
                                                <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Account Active</p>
                                            </div>

                                            <Link
                                                href="/profile"
                                                className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-purple-600 transition-colors"
                                                onClick={() => setProfileMenuOpen(false)}
                                            >
                                                <Settings className="w-4 h-4" />
                                                Account Settings
                                            </Link>

                                            <Link
                                                href="/pricing"
                                                className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-purple-600 transition-colors"
                                                onClick={() => setProfileMenuOpen(false)}
                                            >
                                                <CreditCard className="w-4 h-4" />
                                                Pricing & Plans
                                            </Link>

                                            <button
                                                onClick={handleSignOut}
                                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors mt-2 border-t border-slate-50 pt-3"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
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
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(link.href)
                                            ? 'bg-purple-100 text-purple-700'
                                            : 'hover:bg-slate-100'
                                            }`}
                                    >
                                        <link.icon className="w-5 h-5" />
                                        {link.label}
                                    </Link>
                                ))}
                                <Link
                                    href="/profile"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/profile')
                                        ? 'bg-purple-100 text-purple-700'
                                        : 'hover:bg-slate-100'
                                        }`}
                                >
                                    <Settings className="w-5 h-5" />
                                    Account Settings
                                </Link>
                                <Link
                                    href="/pricing"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/pricing')
                                        ? 'bg-purple-100 text-purple-700'
                                        : 'hover:bg-slate-100'
                                        }`}
                                >
                                    <CreditCard className="w-5 h-5" />
                                    Pricing & Plans
                                </Link>
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