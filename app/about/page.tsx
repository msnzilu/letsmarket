
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Target, Zap, Shield, Users } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="max-w-6xl mx-auto px-4 py-16">
            {/* Hero */}
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4">About LetsMarket</h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                    We're on a mission to help marketers leverage psychology principles
                    to create more effective, conversion-optimized content.
                </p>
            </div>

            {/* Mission */}
            <Card className="p-8 mb-12 bg-gradient-to-br from-purple-50 to-blue-50">
                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                <p className="text-slate-700 leading-relaxed">
                    Every great marketing campaign is rooted in persuasion. We built LetsMarket
                    to democratize access to these powerful principles, making it easy for anyone
                    to analyze their website and generate copy that truly resonates with their audience.
                </p>
            </Card>

            {/* Values */}
            <h2 className="text-2xl font-bold mb-8 text-center">What We Stand For</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-16">
                <Card className="p-6">
                    <Target className="w-10 h-10 text-purple-600 mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Data-Driven Results</h3>
                    <p className="text-slate-600">
                        Every recommendation is backed by proven psychological principles and real-world testing.
                    </p>
                </Card>
                <Card className="p-6">
                    <Zap className="w-10 h-10 text-blue-600 mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Speed & Simplicity</h3>
                    <p className="text-slate-600">
                        Get actionable insights in seconds, not hours. No complex setup required.
                    </p>
                </Card>
                <Card className="p-6">
                    <Shield className="w-10 h-10 text-green-600 mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Privacy First</h3>
                    <p className="text-slate-600">
                        Your data is yours. We never share your website content or analysis results.
                    </p>
                </Card>
                <Card className="p-6">
                    <Users className="w-10 h-10 text-orange-600 mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Built for Teams</h3>
                    <p className="text-slate-600">
                        Whether solo or enterprise, our tools scale with your needs.
                    </p>
                </Card>
            </div>

            {/* CTA */}
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
                <p className="text-slate-600 mb-6">
                    Join 500+ marketers already optimizing their websites with LetsMarket.
                </p>
                <Link href="/signup">
                    <Button size="lg">Start Free Trial</Button>
                </Link>
            </div>
        </div>
    );
}
