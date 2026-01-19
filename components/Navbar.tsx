// components/Navbar.tsx

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { User } from '@supabase/supabase-js';
import { Menu, X, User as UserIcon, LogOut, Settings, LayoutDashboard, Share2, Zap, CreditCard, Lock } from 'lucide-react';
import { useUpgradeModal } from '@/hooks/use-upgrade-modal';
import { getEffectivePlan } from '@/lib/subscription';

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [plan, setPlan] = useState<string>('free');
    const { onOpen } = useUpgradeModal();

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Fetch plan
        const fetchPlan = async () => {
            const res = await fetch('/api/subscription');
            if (res.ok) {
                const data = await res.json();
                setPlan(data.subscription?.plan || 'free');
            }
        };
        fetchPlan();

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
        { href: '/campaigns', label: 'Campaigns', icon: Zap, premium: true },
        { href: '/connections', label: 'Connections', icon: Share2, premium: true },
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
                            src="/logo/site-logo.png"
                            alt="lez Market Logo"
                            width={200}
                            height={90}
                            className="w-40 h-15 object-contain"
                        />
                    </Link>

                    <div className="hidden md:flex items-center space-x-4">
                        {loading ? (
                            <div className="flex space-x-4">
                                <div className="h-9 w-20 bg-slate-100 rounded animate-pulse" />
                                <div className="h-9 w-20 bg-slate-100 rounded animate-pulse" />
                            </div>
                        ) : user ? (
                            <>
                                {navLinks.map(link => {
                                    const isPremiumRestricted = link.premium && plan === 'free';
                                    return (
                                        <div key={link.href}>
                                            {isPremiumRestricted ? (
                                                <Button
                                                    variant="ghost"
                                                    className="gap-2 text-slate-400"
                                                    onClick={onOpen}
                                                >
                                                    <link.icon className="w-4 h-4" />
                                                    {link.label}
                                                    <Lock className="w-3 h-3 ml-1" />
                                                </Button>
                                            ) : (
                                                <Link href={link.href}>
                                                    <Button
                                                        variant={isActive(link.href) ? 'default' : 'ghost'}
                                                        className="gap-2"
                                                    >
                                                        <link.icon className="w-4 h-4" />
                                                        {link.label}
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    );
                                })}

                                {/* Profile Dropdown */}
                                <div className="relative profile-dropdown-container">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={`rounded-full border-2 transition-all ${profileMenuOpen ? 'border-brand-primary bg-brand-secondary-light' : 'border-transparent'}`}
                                        onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                    >
                                        <UserIcon className="w-5 h-5 text-slate-600" />
                                    </Button>

                                    {profileMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in duration-200">
                                            <div className="px-4 py-2 border-b border-slate-50 mb-2">
                                                <p className="text-sm font-bold text-slate-900 truncate">{user?.email}</p>
                                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Account Active</p>
                                            </div>

                                            <Link
                                                href="/profile"
                                                className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-primary transition-colors"
                                                onClick={() => setProfileMenuOpen(false)}
                                            >
                                                <Settings className="w-4 h-4" />
                                                Account Settings
                                            </Link>

                                            <Link
                                                href="/pricing"
                                                className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-primary transition-colors"
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
                    <div className="md:hidden flex items-center gap-2">
                        <button
                            className="p-2"
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
                                {navLinks.map(link => {
                                    const isPremiumRestricted = link.premium && plan === 'free';
                                    return (
                                        <div key={link.href}>
                                            {isPremiumRestricted ? (
                                                <button
                                                    onClick={() => {
                                                        onOpen();
                                                        setMobileMenuOpen(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-slate-400 hover:bg-slate-50"
                                                >
                                                    <link.icon className="w-5 h-5" />
                                                    {link.label}
                                                    <Lock className="w-4 h-4 ml-auto" />
                                                </button>
                                            ) : (
                                                <Link
                                                    href={link.href}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(link.href)
                                                        ? 'bg-brand-secondary-light text-brand-primary'
                                                        : 'hover:bg-slate-100'
                                                        }`}
                                                >
                                                    <link.icon className="w-5 h-5" />
                                                    {link.label}
                                                </Link>
                                            )}
                                        </div>
                                    );
                                })}
                                <Link
                                    href="/profile"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/profile')
                                        ? 'bg-brand-secondary-light text-brand-primary'
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
                                        ? 'bg-brand-secondary-light text-brand-primary'
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
                                    className="block px-4 py-3 rounded-lg bg-brand-primary text-white text-center font-bold"
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