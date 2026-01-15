// app/settings/team/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Mail, Shield, Loader2, Info } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

interface Member {
    id: string;
    user_id: string;
    role: 'owner' | 'admin' | 'member';
    joined_at: string;
}

export default function TeamPage() {
    const { plan, isLoading: subLoading } = useSubscription();
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviting, setInviting] = useState(false);

    useEffect(() => {
        if (plan === 'enterprise') {
            fetchMembers();
        } else if (!subLoading) {
            setLoading(false);
        }
    }, [plan, subLoading]);

    const fetchMembers = async () => {
        try {
            const res = await fetch('/api/team');
            const data = await res.json();
            setMembers(data.members || []);
        } catch (error) {
            console.error('Failed to fetch team:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async () => {
        if (!inviteEmail) return;
        setInviting(true);
        try {
            const res = await fetch('/api/team', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: inviteEmail }),
            });
            const data = await res.json();
            if (data.success) {
                alert('Invite sent (simulated)');
                setInviteEmail('');
            } else {
                alert(data.error || 'Failed to send invite');
            }
        } catch (error) {
            console.error('Invite error:', error);
        } finally {
            setInviting(false);
        }
    };

    if (subLoading || loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    if (plan !== 'enterprise') {
        return (
            <Card className="p-8 text-center border-dashed border-2">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold mb-2">Team Collaboration</h2>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">
                    Collaborate with your team members. Assign roles, share campaigns, and manage projects together.
                </p>
                <Button onClick={() => window.location.href = '/pricing'}>
                    Upgrade to Enterprise
                </Button>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Team Members</h1>
                    <p className="text-slate-600">Invite and manage your organization's members</p>
                </div>
            </div>

            {/* Invite Form */}
            <Card className="p-6">
                <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-slate-500">Invite Member</h3>
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <Mail className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                        <input
                            type="email"
                            placeholder="colleague@example.com"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                    </div>
                    <Button onClick={handleInvite} disabled={inviting || !inviteEmail}>
                        {inviting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        <UserPlus className="w-4 h-4 mr-2" />
                        Invite
                    </Button>
                </div>
            </Card>

            {/* Members List */}
            <Card className="p-0 overflow-hidden">
                <div className="divide-y">
                    {members.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            You are the only member of this team.
                        </div>
                    ) : (
                        members.map((member) => (
                            <div key={member.id} className="p-4 flex items-center justify-between hover:bg-slate-50 bg-white">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600">
                                        {member.role === 'owner' ? 'OW' : 'MB'}
                                    </div>
                                    <div>
                                        <p className="font-medium">Member {member.id.substring(0, 4)}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <Shield className="w-3 h-3 text-slate-400" />
                                            <span className="text-xs text-slate-500 capitalize">{member.role}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs text-slate-400">
                                        Joined {new Date(member.joined_at).toLocaleDateString()}
                                    </span>
                                    <Badge variant="secondary">Active</Badge>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Card>

            <div className="bg-blue-50 p-4 rounded-lg flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Enterprise teams support up to 25 members. Sharing permissions apply to all campaigns and website reports within the organization.
                </p>
            </div>
        </div>
    );
}
