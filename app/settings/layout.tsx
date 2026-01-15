// app/settings/layout.tsx
import { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Settings, Users, Key, Palette, ArrowLeft } from 'lucide-react';

const navItems = [
    { name: 'Team', href: '/settings/team', icon: Users },
    { name: 'API Keys', href: '/settings/api-keys', icon: Key },
    { name: 'Branding', href: '/settings/branding', icon: Palette },
];

export default function SettingsLayout({ children }: { children: ReactNode }) {
    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <Link href="/dashboard">
                <Button variant="ghost" className="mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Button>
            </Link>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <aside className="w-full md:w-64 space-y-2">
                    <h2 className="text-xl font-bold mb-6 px-4">Settings</h2>
                    <nav className="space-y-1">
                        {navItems.map((item) => (
                            <Link key={item.name} href={item.href}>
                                <div className="flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.name}</span>
                                </div>
                            </Link>
                        ))}
                    </nav>
                </aside>

                {/* Content */}
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
