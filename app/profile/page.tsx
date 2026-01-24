// app/profile/page.tsx
// Profile page with edit functionality

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Mail, Calendar, Crown, Settings, LogOut, Pencil, Loader2, Check, X, Shield, Users, Key, Palette } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import PlanBadge from '@/components/PlanBadge';
import { useSubscription } from '@/hooks/useSubscription';

export default function ProfilePage() {
    const router = useRouter();
    const supabase = createClient();
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const { plan, subscription } = useSubscription();

    // Edit form state
    const [fullName, setFullName] = useState('');

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) {
                router.push('/login');
                return;
            }
            setUser(user);
            setFullName(user.user_metadata?.full_name || '');
            setLoading(false);
        });
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.updateUser({
                data: { full_name: fullName }
            });

            if (error) throw error;

            // Refresh user data
            const { data: { user: updatedUser } } = await supabase.auth.getUser();
            setUser(updatedUser);
            setEditing(false);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setFullName(user?.user_metadata?.full_name || '');
        setEditing(false);
        setMessage(null);
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-12">
                <Card className="p-8 animate-pulse">
                    <div className="h-20 w-20 bg-slate-200 rounded-full mx-auto mb-4" />
                    <div className="h-6 bg-slate-200 rounded w-1/3 mx-auto mb-2" />
                    <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto" />
                </Card>
            </div>
        );
    }

    const createdAt = user?.created_at
        ? new Date(user.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : 'Unknown';

    const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <Link href="/dashboard">
                <Button variant="ghost" className="mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Button>
            </Link>

            <h1 className="text-3xl font-bold mb-8">Profile</h1>

            {/* Message */}
            {message && (
                <div className={`mb-6 p-4 rounded-lg ${message.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {message.text}
                </div>
            )}

            {/* User Info Card */}
            <Card className="p-6 md:p-8 mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left w-full">
                        <div className="w-20 h-20 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                            {(fullName || user?.email)?.[0].toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 w-full min-w-0">
                            {editing ? (
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                    placeholder="Your name"
                                    className="w-full text-xl font-semibold px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none mb-2"
                                />
                            ) : (
                                <h2 className="text-xl font-semibold truncate">{displayName}</h2>
                            )}
                            <p className="text-slate-600 truncate">{user?.email}</p>
                        </div>
                    </div>

                    <div className="w-full sm:w-auto flex justify-center sm:justify-start">
                        {editing ? (
                            <div className="flex gap-2 w-full sm:w-auto">
                                <Button size="lg" className="flex-1 sm:flex-none" onClick={handleSave} disabled={saving}>
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                                    Save
                                </Button>
                                <Button size="lg" variant="outline" className="flex-1 sm:flex-none" onClick={handleCancel}>
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                </Button>
                            </div>
                        ) : (
                            <Button variant="outline" className="w-full sm:w-auto" onClick={() => setEditing(true)}>
                                <Pencil className="w-4 h-4 mr-2" />
                                Edit Profile
                            </Button>
                        )}
                    </div>
                </div>

                <div className="space-y-4 border-t pt-6">
                    <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-slate-400" />
                        <div>
                            <p className="text-sm text-slate-500">Email</p>
                            <p className="font-medium">{user?.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-slate-400" />
                        <div>
                            <p className="text-sm text-slate-500">Member since</p>
                            <p className="font-medium">{createdAt}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Crown className="w-5 h-5 text-slate-400" />
                        <div>
                            <p className="text-sm text-slate-500">Plan</p>
                            <div className="flex items-center gap-2">
                                <PlanBadge plan={plan} />
                                {plan === 'free' && (
                                    <Link href="/pricing" className="text-sm text-brand-primary hover:underline">
                                        Upgrade
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Enterprise Settings (Only for Enterprise Plan) */}
            {plan === 'enterprise' && (
                <Card className="p-6 mb-6 border-brand-primary/20 bg-brand-secondary-light/30">
                    <h3 className="font-semibold mb-4 flex items-center gap-2 text-purple-900">
                        <Shield className="w-5 h-5 text-brand-primary" />
                        Enterprise Settings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link href="/settings/team">
                            <Button variant="outline" className="w-full bg-white hover:bg-brand-secondary-light">
                                <Users className="w-4 h-4 mr-2" />
                                Team Management
                            </Button>
                        </Link>
                        <Link href="/settings/api-keys">
                            <Button variant="outline" className="w-full bg-white hover:bg-brand-secondary-light">
                                <Key className="w-4 h-4 mr-2" />
                                API Access
                            </Button>
                        </Link>
                        <Link href="/settings/branding">
                            <Button variant="outline" className="w-full bg-white hover:bg-brand-secondary-light">
                                <Palette className="w-4 h-4 mr-2" />
                                White-Labeling
                            </Button>
                        </Link>
                    </div>
                </Card>
            )}

            {/* Subscription Card */}
            <Card className="p-6 mb-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Subscription
                </h3>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                        <p className="font-bold text-lg">
                            {plan === 'free'
                                ? 'Free Plan'
                                : `${plan === 'pro' ? 'Pro Plan' : 'Enterprise Plan'} (${subscription?.interval === 'year' ? 'Yearly' : 'Monthly'})`}
                        </p>
                        <p className="text-sm text-slate-500">
                            {plan === 'free'
                                ? 'Unlock pro features for automated campaigns'
                                : subscription?.current_period_end
                                    ? `Next billing date: ${new Date(subscription.current_period_end).toLocaleDateString()}`
                                    : 'Active and verified'
                            }
                        </p>
                    </div>
                    <Link href="/pricing" className="w-full sm:w-auto">
                        <Button variant={plan === 'free' ? 'default' : 'outline'} className="w-full sm:w-auto py-6 sm:py-2 text-lg sm:text-base">
                            {plan === 'free' ? 'Upgrade Now' : 'Manage Subscription'}
                        </Button>
                    </Link>
                </div>
            </Card>

            {/* Sign Out */}
            <Button
                variant="outline"
                className="w-full text-red-600 hover:bg-red-50"
                onClick={handleSignOut}
            >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
            </Button>
        </div>
    );
}
