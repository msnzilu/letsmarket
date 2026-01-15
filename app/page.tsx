// app/page.tsx

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Brain, Zap, TrendingUp, Users, CheckCircle } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4">
        <div className="w-full mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            Join 500+ marketers optimizing their websites
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Turn Visitors Into Customers
          </h1>

          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Analyze your website for 6 core conversion principles and get AI-powered copy
            that turns visitors into customers. See what you're missing in under 2 minutes.
          </p>

          <div className="flex gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8">
                Analyze Your Website Free
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Sign In
              </Button>
            </Link>
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
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Enter Your URL</h3>
              <p className="text-slate-600">
                Paste your website URL and our AI scrapes your homepage in seconds
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Get Your Score</h3>
              <p className="text-slate-600">
                See how you score on 6 persuasion principles that drive conversions
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
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
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            What You'll Get
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 flex gap-4">
              <Brain className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Conversion Breakdown</h3>
                <p className="text-sm text-slate-600">
                  Scores for Social Proof, Loss Aversion, Authority, Scarcity, Cognitive Ease, and Pricing Strategy
                </p>
              </div>
            </Card>

            <Card className="p-6 flex gap-4">
              <Zap className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">AI-Generated Copy</h3>
                <p className="text-slate-600">
                  5 headline variations and 3 CTA options optimized for conversion
                </p>
              </div>
            </Card>

            <Card className="p-6 flex gap-4">
              <TrendingUp className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Top 10 Recommendations</h3>
                <p className="text-slate-600">
                  Prioritized by impact with implementation difficulty ratings
                </p>
              </div>
            </Card>

            <Card className="p-6 flex gap-4">
              <Users className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
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

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Boost Your Conversions?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of marketers using AI to optimize their websites
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Start Free Analysis Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}