// app/about/page.tsx

import { Metadata } from 'next';
import Link from 'next/link';
import { Target, Users, Zap, Award, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const metadata: Metadata = {
    title: 'About Us - lez Market Conversion AI',
    description: 'Learn about our mission to humanize AI marketing and help businesses grow through conversion psychology and behavioral economics.',
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden bg-slate-900 text-white">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-primary to-transparent blur-3xl" />
                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-5xl md:text-6xl font-black mb-6">
                        We're on a Mission to <span className="text-brand-secondary">Humanize AI Marketing</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                        lez Market was born from a simple observation: Most AI marketing tools focus on quantity. We focus on <b>Conversion Psychology</b>.
                    </p>
                </div>
            </section>

            {/* Philosophy */}
            <section className="py-24 max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Why We Build</h2>
                        <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                            Great marketing isn't about more emails or more posts. It's about shifting the <b>psychological state</b> of your visitor from "Curiosity" to "Commitment".
                        </p>
                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            Our platform uses advanced GPT-4o models trained on decades of conversion optimization research, behavioral economics, and neuromarketing principles.
                        </p>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-brand-secondary-light rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Target className="text-brand-primary" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Precision Analysis</h4>
                                    <p className="text-sm text-slate-500">We don't just find mistakes; we find opportunities to apply Social Proof, Scarcity, and Authority.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-brand-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Zap className="text-brand-secondary" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Instant Execution</h4>
                                    <p className="text-sm text-slate-500">Go from analysis to ready-to-use marketing assets in under 60 seconds.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 bg-brand-primary rounded-3xl rotate-3 opacity-5" />
                        <div className="relative bg-slate-50 rounded-3xl p-12 border-2 border-slate-100">
                            <div className="text-center mb-12">
                                <div className="text-4xl font-black text-slate-900 mb-2">10M+</div>
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Words Analyzed</p>
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-slate-900 mb-1">12k+</div>
                                    <p className="text-xs text-slate-400 font-semibold uppercase">Analyses</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-slate-900 mb-1">22%</div>
                                    <p className="text-xs text-slate-400 font-semibold uppercase">Avg Lift</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-slate-900 mb-1">98%</div>
                                    <p className="text-xs text-slate-400 font-semibold uppercase">Accuracy</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-slate-900 mb-1">5k+</div>
                                    <p className="text-xs text-slate-400 font-semibold uppercase">Users</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Principles */}
            <section className="bg-slate-50 py-24">
                <div className="max-w-7xl mx-auto px-4 text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Values</h2>
                    <p className="text-slate-500">The pillars that define every feature we build.</p>
                </div>
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <Card className="p-8 border-none shadow-sm h-full">
                        <Users className="w-10 h-10 mx-auto mb-6 text-brand-primary" />
                        <h3 className="text-xl font-bold mb-4">Empathy First</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">We build tools that respect the user's intelligence and time, avoiding "spammy" AI tactics.</p>
                    </Card>
                    <Card className="p-8 border-none shadow-sm h-full">
                        <Award className="w-10 h-10 mx-auto mb-6 text-brand-secondary" />
                        <h3 className="text-xl font-bold mb-4">Data-Driven Design</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">Every recommendation is backed by established behavioral economic principles.</p>
                    </Card>
                    <Card className="p-8 border-none shadow-sm h-full">
                        <Zap className="text-yellow-500 w-10 h-10 mx-auto mb-6" />
                        <h3 className="text-xl font-bold mb-4">Frictionless Flow</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">Complexity is the enemy of action. We distill complex data into simple, actionable steps.</p>
                    </Card>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 text-center max-w-4xl mx-auto px-4">
                <h2 className="text-4xl font-black text-slate-900 mb-8">Ready to transform your marketing?</h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/analyze" className="px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                        Start Free Analysis <ArrowRight size={18} />
                    </Link>
                    <Link href="/pricing" className="px-8 py-4 border-2 border-slate-200 text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition-all">
                        View Pricing
                    </Link>
                </div>
            </section>
        </div>
    );
}
