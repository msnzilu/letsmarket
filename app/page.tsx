// app/page.tsx

import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Brain, Zap, TrendingUp, Users, CheckCircle, ShieldAlert, Award, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'lez Market - Turn Website Visitors Into Customers with AI',
  description: 'Analyze your website for 6 core conversion principles and get AI-powered copy that turns visitors into loyal customers in under 2 minutes.',
};

import { createClient } from '@/lib/supabase/server';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-16 md:pt-24 pb-20 md:pb-32 px-4 md:px-0">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-brand-secondary-light text-brand-primary rounded-full text-xs md:text-sm font-medium">
            Join 500+ marketers optimizing their websites
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent px-2">
            Turn Visitors Into Customers
          </h1>

          <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto px-4">
            Analyze your website for 6 core conversion principles and get AI-powered copy
            that turns visitors into customers. See what you're missing in under 2 minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
            {user ? (
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-lg px-12 bg-brand-primary hover:bg-brand-primary/90 py-6">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/signup" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto text-lg px-8 bg-brand-primary hover:bg-brand-primary/90 py-6">
                    Analyze Website Free
                  </Button>
                </Link>
                <Link href="/login" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="mt-12 flex flex-wrap justify-center items-center gap-6 md:gap-8 opacity-60 grayscale px-4">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <ShieldAlert className="w-5 h-5" />
              <span className="text-sm md:text-base font-semibold">GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <Award className="w-5 h-5" />
              <span className="text-sm md:text-base font-semibold">Industry Methodology</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <Zap className="w-5 h-5" />
              <span className="text-sm md:text-base font-semibold">Powered by GPT-4o</span>
            </div>
          </div>
        </div>
      </section>

      {/* Loss Aversion Section (Principle 2) */}
      <section className="py-20 px-4 bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-red-600 font-semibold mb-4">
            <AlertCircle className="w-5 h-5" />
            <span>The Cost of Inaction</span>
          </div>
          <h2 className="text-3xl font-bold mb-6">Stop Leaving Money on the Table</h2>
          <p className="text-lg text-slate-600 mb-8">
            Every day your website isn't optimized, you're losing potential customers to competitors
            who understand marketing psychology. Don't let poor copy be the reason your growth stalls.
          </p>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h4 className="font-bold text-red-600 mb-2">The Gain-Only Approach</h4>
              <p className="text-sm text-slate-500">Traditional tools tell you what to add. You're still guessing what works.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h4 className="font-bold text-green-600 mb-2">The Psychology Approach</h4>
              <p className="text-sm text-slate-500">We tell you exactly why people are leaving and how to stop the leak.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-brand-secondary-light rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-brand-primary">1</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Enter Your URL</h3>
              <p className="text-slate-600">
                Paste your website URL and our AI scrapes your homepage in seconds
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-brand-secondary-light rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-brand-primary">2</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Get Your Score</h3>
              <p className="text-slate-600">
                See how you score on 6 persuasion principles that drive conversions
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-brand-secondary-light rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-brand-primary">3</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Implement & Win</h3>
              <p className="text-slate-600">
                Copy optimized headlines and CTAs directly into your site
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            What You'll Get
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 flex gap-4">
              <Brain className="w-6 h-6 text-brand-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Conversion Breakdown</h3>
                <p className="text-sm text-slate-600">
                  Scores for Social Proof, Loss Aversion, Authority, Scarcity, Cognitive Ease, and Pricing Strategy
                </p>
              </div>
            </Card>

            <Card className="p-6 flex gap-4">
              <Zap className="w-6 h-6 text-brand-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">AI-Generated Copy</h3>
                <p className="text-slate-600">
                  5 headline variations and 3 CTA options optimized for conversion
                </p>
              </div>
            </Card>

            <Card className="p-6 flex gap-4">
              <TrendingUp className="w-6 h-6 text-brand-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Top 10 Recommendations</h3>
                <p className="text-slate-600">
                  Prioritized by impact with implementation difficulty ratings
                </p>
              </div>
            </Card>

            <Card className="p-6 flex gap-4">
              <Users className="w-6 h-6 text-brand-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Analysis History</h3>
                <p className="text-slate-600">
                  Track improvements over time and compare before/after results
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section (Principle 4 & 6: Scarcity & Pricing Psychology) */}
      <section className="py-20 px-4 bg-gradient-to-r from-brand-primary to-brand-secondary">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="inline-block mb-6 px-4 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
            ⚡ Beta Phase: First 1,000 users get Pro features free
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Boost Your Conversions?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Get your first analysis completely free. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-7">
                Start Free Analysis Now
              </Button>
            </Link>
            <div className="text-white/80 text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>1 free credit available</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}