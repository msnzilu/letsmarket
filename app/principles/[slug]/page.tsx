import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';
import { getPrincipleBySlug, getAllPrincipleSlugs } from '@/lib/principles-data';

export async function generateStaticParams() {
    return getAllPrincipleSlugs().map((slug) => ({
        slug: slug,
    }));
}

export default async function PrinciplePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const principle = getPrincipleBySlug(slug);

    if (!principle) {
        notFound();
    }

    const Icon = principle.icon;
    const colorClasses = {
        purple: { text: 'text-purple-600', bg: 'bg-purple-100', gradient: 'from-purple-600 to-blue-600', bgGradient: 'bg-gradient-to-br from-purple-50 to-blue-50', border: 'border-purple-500' },
        red: { text: 'text-red-600', bg: 'bg-red-100', gradient: 'from-red-600 to-orange-600', bgGradient: 'bg-gradient-to-br from-red-50 to-orange-50', border: 'border-red-500' },
        blue: { text: 'text-blue-600', bg: 'bg-blue-100', gradient: 'from-blue-600 to-indigo-600', bgGradient: 'bg-gradient-to-br from-blue-50 to-indigo-50', border: 'border-blue-500' },
        orange: { text: 'text-orange-600', bg: 'bg-orange-100', gradient: 'from-orange-600 to-yellow-600', bgGradient: 'bg-gradient-to-br from-orange-50 to-yellow-50', border: 'border-orange-500' },
        green: { text: 'text-green-600', bg: 'bg-green-100', gradient: 'from-green-600 to-emerald-600', bgGradient: 'bg-gradient-to-br from-green-50 to-emerald-50', border: 'border-green-500' },
        emerald: { text: 'text-emerald-600', bg: 'bg-emerald-100', gradient: 'from-emerald-600 to-teal-600', bgGradient: 'bg-gradient-to-br from-emerald-50 to-teal-50', border: 'border-emerald-500' },
    };

    const colors = colorClasses[principle.color as keyof typeof colorClasses];

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            {/* Header */}
            <Link href="/dashboard">
                <Button variant="ghost" className="mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Button>
            </Link>

            <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                    <Icon className={`w-10 h-10 ${colors.text}`} />
                    <h1 className="text-4xl font-bold">{principle.name}</h1>
                </div>
                <p className="text-xl text-slate-600">{principle.description}</p>
            </div>

            {/* What is [Principle] */}
            <Card className={`p-6 mb-6 ${colors.bgGradient}`}>
                <h2 className="text-2xl font-bold mb-3">What is {principle.name}?</h2>
                <p className="text-slate-700 mb-4">{principle.whatIs}</p>
                <Badge variant="secondary" className="text-sm">
                    {principle.impactStat}
                </Badge>
            </Card>

            {/* Types/Strategies */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">
                    {principle.slug === 'pricing-psychology' ? 'Key Pricing Strategies' : 
                     principle.slug === 'scarcity' ? 'Types of Scarcity & Urgency' :
                     principle.slug === 'cognitive-ease' ? 'Key Factors for Cognitive Ease' :
                     principle.slug === 'authority' ? 'Types of Authority Signals' :
                     principle.slug === 'social-proof' ? 'Types of Social Proof' :
                     'Ways to Apply ' + principle.name}
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                    {principle.types.map((type, index) => {
                        const TypeIcon = type.icon;
                        return (
                            <Card key={index} className="p-5">
                                <div className="flex items-start gap-3">
                                    <TypeIcon className={`w-6 h-6 ${colors.text} flex-shrink-0 mt-1`} />
                                    <div>
                                        <h3 className="font-semibold mb-2">{type.title}</h3>
                                        <p className="text-sm text-slate-600">{type.description}</p>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Implementation Guide */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">How to Implement</h2>
                <div className="space-y-4">
                    {principle.steps.map((step, index) => (
                        <Card key={index} className="p-6">
                            <div className="flex items-start gap-4">
                                <div className={`w-8 h-8 ${colors.bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                                    <span className={`font-bold ${colors.text}`}>{index + 1}</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                                    <p className="text-slate-600 mb-3">{step.description}</p>

                                    {step.example && (
                                        <>
                                            {step.example.type === 'code' && (
                                                <div className={`bg-slate-50 p-4 rounded-lg border-l-4 border-${principle.color}-500`}>
                                                    <p className="text-sm text-slate-700 whitespace-pre-line">
                                                        {step.example.content}
                                                    </p>
                                                </div>
                                            )}

                                            {step.example.type === 'comparison' && (
                                                <div className="grid md:grid-cols-2 gap-3">
                                                    <div className="bg-red-50 p-3 rounded-lg">
                                                        <p className="text-xs text-red-700 font-semibold mb-1">
                                                            {step.example.content.bad.startsWith('$') ? 'Less Effective' : '❌ Poor'}
                                                        </p>
                                                        <p className={step.example.content.bad.startsWith('$') ? 'text-2xl font-bold' : 'text-sm'}>
                                                            {step.example.content.bad}
                                                        </p>
                                                    </div>
                                                    <div className="bg-green-50 p-3 rounded-lg">
                                                        <p className="text-xs text-green-700 font-semibold mb-1">
                                                            ✓ {step.example.content.good.startsWith('$') ? 'More Effective' : 'Good'}
                                                        </p>
                                                        <p className={step.example.content.good.startsWith('$') ? 'text-2xl font-bold' : 'text-sm'}>
                                                            {step.example.content.good}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {step.example.type === 'visual' && (
                                                <div className="bg-slate-50 p-4 rounded-lg">
                                                    <p className="text-sm font-semibold text-slate-700 whitespace-pre-line">
                                                        {step.example.content}
                                                    </p>
                                                </div>
                                            )}

                                            {step.example.type === 'list' && (
                                                <ul className="text-sm text-slate-600 space-y-1">
                                                    {step.example.content.map((item: string, i: number) => (
                                                        <li key={i}>• {item}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </>
                                    )}

                                    {(step.difficulty || step.impact) && (
                                        <Badge variant="outline" className="text-sm mt-2">
                                            {step.difficulty && `Difficulty: ${step.difficulty}`}
                                            {step.difficulty && step.impact && ' • '}
                                            {step.impact && `Impact: ${step.impact}`}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Best Practices */}
            <Card className={`p-6 mb-6 border-l-4 ${colors.border}`}>
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <TrendingUp className={`w-5 h-5 ${colors.text}`} />
                    Best Practices
                </h2>
                <ul className="space-y-2 text-slate-700">
                    {principle.bestPractices.map((practice, index) => (
                        <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span dangerouslySetInnerHTML={{ __html: practice.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                        </li>
                    ))}
                </ul>
            </Card>

            {/* Warning (if exists) */}
            {principle.warning && (
                <Card className="p-6 mb-6 bg-yellow-50 border-l-4 border-yellow-500">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-lg mb-2">{principle.warning.title}</h3>
                            <p className="text-slate-700">{principle.warning.content}</p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Examples (if exists) */}
            {principle.examples && (
                <Card className="p-6 mb-6 bg-slate-50">
                    <h2 className="text-xl font-bold mb-3">Real-World Examples</h2>
                    <div className="space-y-3 text-sm text-slate-700">
                        {principle.examples.map((example, index) => (
                            <div key={index} className="flex items-start gap-2">
                                <span className={colors.text}>•</span>
                                <span dangerouslySetInnerHTML={{ __html: example.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* CTA */}
            <Card className={`p-6 text-center bg-gradient-to-br ${colors.gradient} text-white`}>
                <h3 className="text-2xl font-bold mb-2">
                    Ready to {principle.slug === 'cognitive-ease' ? 'Simplify Your Site' : 
                              principle.slug === 'pricing-psychology' ? 'Optimize Your Pricing' :
                              principle.slug === 'scarcity' ? 'Create Real Urgency' :
                              principle.slug === 'authority' ? 'Build Authority' :
                              principle.slug === 'loss-aversion' ? 'Reduce Purchase Anxiety' :
                              'Apply ' + principle.name}?
                </h3>
                <p className="mb-4 opacity-90">
                    Go back to your analysis and {principle.slug === 'pricing-psychology' ? 'apply these pricing strategies' : 'start implementing these changes'}
                </p>
                <Link href="/dashboard">
                    <Button size="lg" variant="secondary">
                        View Your Analysis
                    </Button>
                </Link>
            </Card>
        </div>
    );
}
