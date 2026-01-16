import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, TrendingUp, AlertCircle, ExternalLink, MinusCircle, PlusCircle } from 'lucide-react';
import { getPrincipleBySlug, getAllPrincipleSlugs, getPrincipleSlug } from '@/lib/principles-data';
import { createClient } from '@/lib/supabase/server';
import { Analysis, Website } from '@/types';

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

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch user's latest analysis if logged in
    let userAnalysis = null;
    let websiteUrl = "";

    if (user) {
        const { data: website } = await supabase
            .from('websites')
            .select(`
                *,
                analyses (*)
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (website && website.analyses && website.analyses.length > 0) {
            // Sort analyses by created_at in JS as a fallback or if needed, though Supabase is preferred
            userAnalysis = website.analyses.sort((a: any, b: any) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )[0] as Analysis;
            websiteUrl = website.url;
        }
    }

    // Map principle name to analysis principle_scores key
    // The principles in principle_scores are: socialProof, lossAversion, authority, scarcity, cognitiveEase, pricingPsychology
    const slugToKeyMap: Record<string, string> = {
        'social-proof': 'socialProof',
        'loss-aversion': 'lossAversion',
        'authority': 'authority',
        'scarcity': 'scarcity',
        'cognitive-ease': 'cognitiveEase',
        'pricing-psychology': 'pricingPsychology'
    };

    const analysisKey = slugToKeyMap[slug];
    const userPrincipleData = userAnalysis?.principle_scores[analysisKey as keyof typeof userAnalysis.principle_scores];

    // Filter recommendations for this principle
    const relevantRecommendations = userAnalysis?.recommendations.filter(
        (rec) => getPrincipleSlug(rec.principle) === slug
    ) || [];

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
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <Link href="/dashboard">
                    <Button variant="ghost">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>
                </Link>

                {userAnalysis && (
                    <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
                        <span>Analysis for: <strong>{websiteUrl}</strong></span>
                        <Link href={`/dashboard/${userAnalysis.id}`} className="text-blue-600 hover:underline flex items-center gap-1 ml-2">
                            View Full Report <ExternalLink size={12} />
                        </Link>
                    </div>
                )}
            </div>

            <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                    <Icon className={`w-10 h-10 ${colors.text}`} />
                    <h1 className="text-4xl font-bold">{principle.name}</h1>
                </div>
                <p className="text-xl text-slate-600">{principle.description}</p>
            </div>

            {/* What is [Principle] */}
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
                <Card className={`lg:col-span-2 p-6 ${colors.bgGradient}`}>
                    <h2 className="text-2xl font-bold mb-3">What is {principle.name}?</h2>
                    <p className="text-slate-700 mb-4">{principle.whatIs}</p>
                    <Badge variant="secondary" className="text-sm">
                        {principle.impactStat}
                    </Badge>
                </Card>

                <Card className="p-6 border-blue-200 bg-white">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <TrendingUp size={20} className="text-blue-600" />
                        {userAnalysis ? 'Your Analysis' : 'Personalize This'}
                    </h3>

                    {userAnalysis ? (
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium text-slate-600">Your Score</span>
                                    <span className={`text-2xl font-bold ${(userPrincipleData?.score || 0) < 40 ? 'text-red-500' :
                                            (userPrincipleData?.score || 0) < 70 ? 'text-yellow-600' : 'text-green-600'
                                        }`}>
                                        {userPrincipleData?.score}/100
                                    </span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all ${(userPrincipleData?.score || 0) < 40 ? 'bg-red-500' :
                                                (userPrincipleData?.score || 0) < 70 ? 'bg-yellow-500' : 'bg-green-500'
                                            }`}
                                        style={{ width: `${userPrincipleData?.score}%` }}
                                    ></div>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 italic">
                                "{userPrincipleData?.explanation}"
                            </p>
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-sm text-slate-600 mb-4">
                                Run an analysis to see how well {principle.name} is used on your website.
                            </p>
                            <Link href="/">
                                <Button size="sm" className="w-full">Analyze Website</Button>
                            </Link>
                        </div>
                    )}
                </Card>
            </div>

            {/* User-Specific Recommendations (If available) */}
            {userAnalysis && relevantRecommendations.length > 0 && (
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <CheckCircle className="text-green-600" />
                        Recommendations for Your Site
                    </h2>
                    <div className="grid gap-4">
                        {relevantRecommendations.map((rec, i) => (
                            <Card key={i} className="p-5 border-l-4 border-l-blue-500">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg">{rec.title}</h3>
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">
                                        Impact Score: {rec.impactScore}
                                    </Badge>
                                </div>
                                <p className="text-slate-600 mb-3">{rec.description}</p>
                                <div className="bg-slate-50 p-3 rounded-lg text-sm border border-slate-100">
                                    <span className="font-semibold text-slate-700 block mb-1">Implementation:</span>
                                    {rec.implementation}
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Analysis Examples & Missing (If available) */}
            {userAnalysis && userPrincipleData && (
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    <Card className="p-6 border-green-100 bg-green-50/30">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-green-700">
                            <PlusCircle size={20} />
                            What you have
                        </h3>
                        {userPrincipleData.examples.length > 0 ? (
                            <ul className="space-y-2">
                                {userPrincipleData.examples.map((ex, i) => (
                                    <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                                        {ex}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-slate-500 italic">No examples detected during analysis.</p>
                        )}
                    </Card>

                    <Card className="p-6 border-red-100 bg-red-50/30">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-red-700">
                            <MinusCircle size={20} />
                            What is missing
                        </h3>
                        {userPrincipleData.missing.length > 0 ? (
                            <ul className="space-y-2">
                                {userPrincipleData.missing.map((ms, i) => (
                                    <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                                        {ms}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-slate-500 italic">Everything seems to be covered!</p>
                        )}
                    </Card>
                </div>
            )}

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
