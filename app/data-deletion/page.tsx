'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Shield, Send, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function DataDeletionPage() {
    const [email, setEmail] = useState('');
    const [details, setDetails] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/data-deletion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, details }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to submit request');
            }

            setSubmitted(true);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-4 px-4">
            <div className="max-w-4xl mx-auto">
                <Link href="/privacy" className="inline-flex items-center text-sm text-slate-500 hover:text-brand-primary mb-8 group">
                    <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                    Back to Privacy Policy
                </Link>

                <Card className="p-8 md:p-12 shadow-xl border-none">
                    <div className="w-16 h-16 bg-brand-secondary-light rounded-2xl flex items-center justify-center mb-8">
                        <Shield className="w-8 h-8 text-brand-primary" />
                    </div>

                    <h1 className="text-3xl font-bold text-slate-900 mb-4">
                        Data Deletion Request
                    </h1>
                    <p className="text-slate-600 mb-8 leading-relaxed">
                        In accordance with GDPR and other data protection regulations, you have the right to request the deletion of your personal data held by lez Market. Please fill out the form below, and our team will process your request within 30 days.
                    </p>

                    {submitted ? (
                        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-300">
                            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-green-900 mb-2">Request Received</h2>
                            <p className="text-green-700">
                                Thank you. Your request for data deletion has been submitted successfully.
                                We will send a confirmation email once the process is complete.
                            </p>
                            <Button
                                variant="outline"
                                className="mt-8"
                                onClick={() => window.location.href = '/'}
                            >
                                Return Home
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                                    Your Email Address
                                </label>
                                <Input
                                    type="email"
                                    required
                                    placeholder="email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-12 border-slate-200 focus:ring-brand-primary"
                                />
                                <p className="text-[10px] text-slate-400">
                                    We need this to identify your account and confirm deletion.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                                    Additional Context (Optional)
                                </label>
                                <Textarea
                                    placeholder="e.g., Please delete all website analyses associated with my account."
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                    className="min-h-[120px] border-slate-200 focus:ring-brand-primary"
                                />
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-4 text-red-700 text-sm">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <p>{error}</p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-lg rounded-xl shadow-lg shadow-brand-primary/20 transition-all"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5 mr-2" />
                                        Submit Deletion Request
                                    </>
                                )}
                            </Button>

                            <p className="text-[10px] text-center text-slate-400 mt-8">
                                By submitting this form, you authorize lez Market to identify and delete all personal data associated with the provided email address. This action is permanent and cannot be undone.
                            </p>
                        </form>
                    )}
                </Card>
            </div>
        </div>
    );
}
