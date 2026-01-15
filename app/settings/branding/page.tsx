// app/settings/branding/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Palette, Image as ImageIcon, Globe, Loader2, Save, Upload } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

export default function BrandingPage() {
    const { plan, isLoading: subLoading } = useSubscription();
    const [saving, setSaving] = useState(false);
    const [branding, setBranding] = useState({
        companyName: '',
        primaryColor: '#7c3aed',
        website: '',
        showPoweredBy: false,
    });

    if (subLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    if (plan !== 'enterprise') {
        return (
            <Card className="p-8 text-center border-dashed border-2">
                <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Palette className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold mb-2">White-Label Reports</h2>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">
                    Remove LetsMarket branding from your reports. Add your own logo, company name, and custom colors to professional PDF exports.
                </p>
                <Button onClick={() => window.location.href = '/pricing'}>
                    Upgrade to Enterprise
                </Button>
            </Card>
        );
    }

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            alert('Branding settings saved!');
        }, 1000);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold mb-1">Branding & White-Label</h1>
                <p className="text-slate-600">Customize how your reports and dashboard appear to clients</p>
            </div>

            <Card className="p-6">
                <div className="space-y-6">
                    {/* Company Info */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Company Name</label>
                            <input
                                type="text"
                                placeholder="Acme Marketing"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                value={branding.companyName}
                                onChange={(e) => setBranding({ ...branding, companyName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Support Website</label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="https://support.acme.com"
                                    className="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    value={branding.website}
                                    onChange={(e) => setBranding({ ...branding, website: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Logo Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Company Logo</label>
                        <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:border-purple-300 transition-colors cursor-pointer bg-slate-50">
                            <ImageIcon className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                            <p className="text-sm text-slate-500 mb-2">Click to upload logo or drag and drop</p>
                            <p className="text-xs text-slate-400">SVG, PNG or JPG (max. 2MB). Recommended: 200x50px</p>
                        </div>
                    </div>

                    {/* Color Picker */}
                    <div className="space-y-4 pt-4 border-t">
                        <h3 className="font-semibold text-slate-800">Report Theme</h3>
                        <div className="flex items-center gap-6">
                            <div className="space-y-2">
                                <label className="text-xs text-slate-500 uppercase tracking-wider">Primary Color</label>
                                <div className="flex gap-3 items-center">
                                    <input
                                        type="color"
                                        className="w-10 h-10 rounded cursor-pointer"
                                        value={branding.primaryColor}
                                        onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                                    />
                                    <code className="text-sm font-mono text-slate-600 uppercase">{branding.primaryColor}</code>
                                </div>
                            </div>
                            <div className="space-y-2 flex-1">
                                <label className="text-xs text-slate-500 uppercase tracking-wider">Report Header</label>
                                <div className="h-10 bg-slate-100 rounded border border-slate-200 flex items-center px-4">
                                    <div
                                        className="w-4 h-4 rounded-full mr-2"
                                        style={{ backgroundColor: branding.primaryColor }}
                                    />
                                    <span className="text-xs font-bold text-slate-400">YOUR REPORT PREVIEW</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Toggles */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <div>
                            <p className="font-semibold text-slate-800">Powered by LetsMarket</p>
                            <p className="text-xs text-slate-500">Enable or disable the "Powered by" badge in report footers</p>
                        </div>
                        <div
                            className={`w-12 h-6 rounded-full transition-colors cursor-pointer relative ${branding.showPoweredBy ? 'bg-purple-600' : 'bg-slate-300'}`}
                            onClick={() => setBranding({ ...branding, showPoweredBy: !branding.showPoweredBy })}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${branding.showPoweredBy ? 'left-7' : 'left-1'}`} />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-6 border-t flex justify-end">
                        <Button onClick={handleSave} disabled={saving} className="bg-purple-600 hover:bg-purple-700">
                            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Save Branding
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
