// app/terms/page.tsx

export default function TermsPage() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
            <p className="text-slate-600 mb-8">Last updated: January 2026</p>

            <div className="prose prose-slate max-w-none space-y-8">
                <section>
                    <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                    <p className="text-slate-700 leading-relaxed">
                        By accessing or using LetsMarket, you agree to be bound by these Terms of Service.
                        If you do not agree to these terms, please do not use our services.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
                    <p className="text-slate-700 leading-relaxed">
                        LetsMarket provides AI-powered website analysis based on marketing psychology
                        principles, generates optimized copy suggestions, and enables social media
                        content scheduling. We reserve the right to modify or discontinue features at any time.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
                    <p className="text-slate-700 leading-relaxed mb-4">When you create an account, you agree to:</p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-700">
                        <li>Provide accurate and complete information</li>
                        <li>Maintain the security of your password</li>
                        <li>Accept responsibility for all activities under your account</li>
                        <li>Notify us immediately of any unauthorized use</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use</h2>
                    <p className="text-slate-700 leading-relaxed mb-4">You agree not to:</p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-700">
                        <li>Use the service for any illegal purpose</li>
                        <li>Analyze websites you don't own or have permission to analyze</li>
                        <li>Attempt to circumvent any security measures</li>
                        <li>Interfere with the proper functioning of the service</li>
                        <li>Use automated systems to access the service without permission</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
                    <p className="text-slate-700 leading-relaxed">
                        The service, including its original content, features, and functionality,
                        is owned by LetsMarket and protected by international copyright, trademark,
                        and other intellectual property laws. AI-generated content created through
                        our service is licensed to you for your use.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">6. Payment Terms</h2>
                    <p className="text-slate-700 leading-relaxed">
                        Paid subscriptions are billed in advance on a monthly or annual basis.
                        Refunds are available within 14 days of purchase. You may cancel your
                        subscription at any time, with access continuing until the end of your
                        billing period.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
                    <p className="text-slate-700 leading-relaxed">
                        LetsMarket shall not be liable for any indirect, incidental, special,
                        consequential, or punitive damages resulting from your use of or inability
                        to use the service. Our total liability shall not exceed the amount paid
                        by you in the twelve months preceding the claim.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
                    <p className="text-slate-700 leading-relaxed">
                        We reserve the right to modify these terms at any time. We will notify
                        users of any material changes via email or through the service.
                        Continued use after changes constitutes acceptance of the new terms.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">9. Contact</h2>
                    <p className="text-slate-700 leading-relaxed">
                        For questions about these Terms, contact us at{' '}
                        <a href="mailto:legal@psychanalyze.com" className="text-purple-600 hover:underline">
                            legal@psychanalyze.com
                        </a>
                    </p>
                </section>
            </div>
        </div>
    );
}
