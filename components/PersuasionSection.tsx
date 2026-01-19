'use client';

// components/PersuasionSection.tsx
import { Quote, Star, CheckCircle, ShieldCheck } from 'lucide-react';

interface Testimonial {
    quote: string;
    author: string;
    role: string;
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
    {
        quote: "We applied the 'Loss Aversion' and 'Cognitive Ease' recommendations and saw a 22% jump in signups.",
        author: "Sarah Chen",
        role: "Growth Lead @ SaaSMetrics"
    },
    {
        quote: "The pricing psychology analysis alone saved us months of A/B testing. It's like having a senior consultant.",
        author: "Mark Thompson",
        role: "Founder @ DesignFlow"
    },
    {
        quote: "Finally a tool that looks at the 'why' behind the clicks. Extremely high-quality output.",
        author: "David Miller",
        role: "E-commerce Specialist"
    },
    {
        quote: "The 'Authority' checklist helped us land our first enterprise client by fixing our trust signals.",
        author: "Elena Rodriguez",
        role: "CEO @ TechScale"
    }
];

export default function PersuasionSection({
    testimonials = DEFAULT_TESTIMONIALS,
    showBadges = true,
    className = ""
}: {
    testimonials?: Testimonial[];
    showBadges?: boolean;
    className?: string;
}) {
    return (
        <div className={`space-y-12 ${className}`}>
            {/* Social Proof Header */}
            <div className="text-center space-y-2 mb-8">
                <div className="inline-block px-3 py-1 bg-brand-secondary-light text-brand-primary rounded-full text-[10px] font-bold uppercase tracking-widest">
                    Social Proof in Action
                </div>
            </div>

            {/* Testimonials */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {testimonials.map((t, i) => (
                    <div key={i} className="p-6 bg-slate-50 rounded-xl border border-slate-100 relative transition-colors">
                        <Quote className="w-8 h-8 text-brand-secondary/20 absolute top-3 left-3" />
                        <div className="flex mb-3">
                            {[1, 2, 3, 4, 5].map(star => (
                                <Star key={star} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            ))}
                        </div>
                        <p className="text-sm text-slate-600 mb-4 relative z-10 italic">
                            "{t.quote}"
                        </p>
                        <div className="mt-auto">
                            <div className="font-bold text-slate-900 text-sm">{t.author}</div>
                            <div className="text-xs text-slate-500">{t.role}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Trust Badges */}
            {showBadges && (
                <div className="flex flex-wrap justify-center gap-6 opacity-60">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                        <ShieldCheck className="w-4 h-4 text-green-600" />
                        <span>GDPR Compliant</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                        <CheckCircle className="w-4 h-4 text-brand-primary" />
                        <span>Audited Methodology</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                        <Star className="w-4 h-4 text-yellow-600" />
                        <span>4.9/5 User Rating</span>
                    </div>
                </div>
            )}
        </div>
    );
}
