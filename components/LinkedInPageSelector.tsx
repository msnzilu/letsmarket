// components/LinkedInPageSelector.tsx
// Modal for selecting which LinkedIn page to post to

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Building2, User, Check, X } from 'lucide-react';

interface Page {
    id: string;
    name: string;
    type: 'personal' | 'organization';
}

interface LinkedInPageSelectorProps {
    connectionId: string;
    isOpen: boolean;
    onClose: () => void;
    onSelect: (pageId: string, pageName: string) => void;
}

export default function LinkedInPageSelector({
    connectionId,
    isOpen,
    onClose,
    onSelect,
}: LinkedInPageSelectorProps) {
    const [pages, setPages] = useState<Page[]>([]);
    const [currentSelection, setCurrentSelection] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedPage, setSelectedPage] = useState<Page | null>(null);

    useEffect(() => {
        if (isOpen && connectionId) {
            fetchPages();
        }
    }, [isOpen, connectionId]);

    const fetchPages = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/connections/${connectionId}/pages`);
            const data = await res.json();

            if (data.pages) {
                setPages(data.pages);
                setCurrentSelection(data.currentSelection);

                // Pre-select the current page
                const current = data.pages.find((p: Page) => p.id === data.currentSelection);
                if (current) {
                    setSelectedPage(current);
                }
            }
        } catch (error) {
            console.error('Error fetching pages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!selectedPage) return;

        setSaving(true);
        try {
            const res = await fetch(`/api/connections/${connectionId}/pages`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pageId: selectedPage.id,
                    pageName: selectedPage.name,
                }),
            });

            if (res.ok) {
                onSelect(selectedPage.id, selectedPage.name);
                onClose();
            }
        } catch (error) {
            console.error('Error saving page selection:', error);
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Select LinkedIn Page</h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Choose where to publish your posts
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[400px] overflow-y-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
                            <p className="text-sm text-slate-500 mt-2">Loading pages...</p>
                        </div>
                    ) : pages.length === 0 ? (
                        <div className="text-center py-8">
                            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-600">No LinkedIn pages found</p>
                            <p className="text-sm text-slate-400 mt-1">
                                You need to be an admin of a LinkedIn Company Page
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {pages.map((page) => (
                                <button
                                    key={page.id}
                                    onClick={() => setSelectedPage(page)}
                                    className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${selectedPage?.id === page.id
                                        ? 'border-brand-primary bg-brand-secondary-light'
                                        : 'border-slate-200 hover:border-brand-secondary hover:bg-slate-50'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${page.type === 'organization'
                                        ? 'bg-brand-secondary-light text-brand-primary'
                                        : 'bg-slate-100 text-slate-600'
                                        }`}>
                                        {page.type === 'organization' ? (
                                            <Building2 className="w-5 h-5" />
                                        ) : (
                                            <User className="w-5 h-5" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-slate-900 truncate">
                                            {page.name}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {page.type === 'organization' ? 'Company Page' : 'Personal Profile'}
                                        </p>
                                    </div>
                                    {selectedPage?.id === page.id && (
                                        <Check className="w-5 h-5 text-brand-primary flex-shrink-0" />
                                    )}
                                    {currentSelection === page.id && selectedPage?.id !== page.id && (
                                        <Badge variant="secondary" className="text-[10px]">Current</Badge>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!selectedPage || saving || selectedPage.id === currentSelection}
                        className="bg-brand-primary hover:bg-brand-primary/90"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                Saving...
                            </>
                        ) : (
                            'Save Selection'
                        )}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
