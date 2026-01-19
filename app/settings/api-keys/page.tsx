// app/settings/api-keys/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Key, Copy, Trash2, Loader2, AlertCircle, Check } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

interface ApiKey {
    id: string;
    name: string;
    key_prefix: string;
    last_used_at: string | null;
    created_at: string;
    expires_at: string | null;
}

export default function ApiKeysPage() {
    const { plan, isLoading: subLoading } = useSubscription();
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [newKeyName, setNewKeyName] = useState('');
    const [creating, setCreating] = useState(false);
    const [generatedKey, setGeneratedKey] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (plan === 'enterprise') {
            fetchKeys();
        } else if (!subLoading) {
            setLoading(false);
        }
    }, [plan, subLoading]);

    const fetchKeys = async () => {
        try {
            const res = await fetch('/api/api-keys');
            const data = await res.json();
            setKeys(data.keys || []);
        } catch (error) {
            console.error('Failed to fetch keys:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newKeyName) return;
        setCreating(true);
        try {
            const res = await fetch('/api/api-keys', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newKeyName }),
            });
            const data = await res.json();
            if (data.key) {
                setGeneratedKey(data.key);
                setNewKeyName('');
                fetchKeys();
            } else {
                alert(data.error || 'Failed to create key');
            }
        } catch (error) {
            console.error('Create error:', error);
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this API key? Applications using it will stop working.')) return;
        try {
            await fetch('/api/api-keys', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            fetchKeys();
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const copyToClipboard = () => {
        if (!generatedKey) return;
        navigator.clipboard.writeText(generatedKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (subLoading || loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
            </div>
        );
    }

    if (plan !== 'enterprise') {
        return (
            <Card className="p-8 text-center border-dashed border-2">
                <div className="bg-brand-secondary-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Key className="w-8 h-8 text-brand-primary" />
                </div>
                <h2 className="text-xl font-bold mb-2">Public API Access</h2>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">
                    API access is an Enterprise feature. Programmatically analyze websites and manage campaigns through our REST API.
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
                    <h1 className="text-2xl font-bold mb-1">API Keys</h1>
                    <p className="text-slate-600">Manage keys for programmatic access to lez Market</p>
                </div>
            </div>

            {/* Create New Key */}
            <Card className="p-6">
                <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-slate-500">Create New Key</h3>
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Key name (e.g. My App)"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none"
                    />
                    <Button onClick={handleCreate} disabled={creating || !newKeyName}>
                        {creating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Generate Key
                    </Button>
                </div>
            </Card>

            {/* Modal for fresh key */}
            {generatedKey && (
                <Card className="p-6 bg-brand-secondary-light border-brand-primary/20">
                    <div className="flex items-start gap-4">
                        <div className="bg-brand-secondary-light p-2 rounded-lg">
                            <AlertCircle className="w-6 h-6 text-brand-primary" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-brand-primary mb-1">New API Key Generated</h3>
                            <p className="text-sm text-brand-primary mb-4">
                                Copy this key now. For security purposes, it will never be shown again.
                            </p>
                            <div className="flex gap-2">
                                <code className="flex-1 bg-white p-2 rounded border border-brand-primary/20 break-all text-sm font-mono">
                                    {generatedKey}
                                </code>
                                <Button size="sm" onClick={copyToClipboard} variant="outline" className="bg-white">
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </Button>
                            </div>
                            <Button size="sm" variant="ghost" className="mt-4 text-xs" onClick={() => setGeneratedKey(null)}>
                                I have saved this key
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Keys Table */}
            <Card className="overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-xs font-semibold uppercase text-slate-500">Name</th>
                            <th className="px-6 py-3 text-xs font-semibold uppercase text-slate-500">Prefix</th>
                            <th className="px-6 py-3 text-xs font-semibold uppercase text-slate-500">Created</th>
                            <th className="px-6 py-3 text-xs font-semibold uppercase text-slate-500">Last Used</th>
                            <th className="px-6 py-3 text-xs font-semibold uppercase text-slate-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {keys.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                    No API keys found. Create one to get started.
                                </td>
                            </tr>
                        ) : (
                            keys.map((key) => (
                                <tr key={key.id} className="hover:bg-slate-50 bg-white">
                                    <td className="px-6 py-4 font-medium">{key.name}</td>
                                    <td className="px-6 py-4">
                                        <code className="bg-slate-100 px-2 py-0.5 rounded text-xs">
                                            {key.key_prefix}...
                                        </code>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {new Date(key.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {key.last_used_at ? new Date(key.last_used_at).toLocaleDateString() : 'Never'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => handleDelete(key.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </Card>
        </div>
    );
}
