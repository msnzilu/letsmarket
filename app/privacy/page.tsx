// app/privacy/page.tsx

export default function PrivacyPage() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
            <p className="text-slate-600 mb-8">Last updated: January 2026</p>

            <div className="prose prose-slate max-w-none space-y-8">
                <section>
                    <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
                    <p className="text-slate-700 leading-relaxed">
                        We collect information you provide directly to us, such as when you create an account,
                        use our services, or contact us for support. This may include your name, email address,
                        and website URLs you submit for analysis.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
                    <p className="text-slate-700 leading-relaxed mb-4">We use the information we collect to:</p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-700">
                        <li>Provide, maintain, and improve our services</li>
                        <li>Process transactions and send related information</li>
                        <li>Send technical notices and support messages</li>
                        <li>Respond to your comments and questions</li>
                        <li>Analyze usage patterns to improve user experience</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
                    <p className="text-slate-700 leading-relaxed">
                        We do not sell, trade, or rent your personal information to third parties.
                        We may share your information only in the following circumstances: with your consent,
                        to comply with legal obligations, or to protect our rights and safety.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
                    <p className="text-slate-700 leading-relaxed">
                        We implement appropriate technical and organizational measures to protect your
                        personal data against unauthorized access, alteration, disclosure, or destruction.
                        This includes encryption of data in transit and at rest.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
                    <p className="text-slate-700 leading-relaxed mb-4">You have the right to:</p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-700">
                        <li>Access your personal data</li>
                        <li>Correct inaccurate data</li>
                        <li>Request deletion of your data</li>
                        <li>Export your data in a portable format</li>
                        <li>Opt out of marketing communications</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">6. Cookies</h2>
                    <p className="text-slate-700 leading-relaxed">
                        We use cookies and similar technologies to enhance your experience,
                        analyze usage, and assist in our marketing efforts. You can control
                        cookie preferences through your browser settings.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
                    <p className="text-slate-700 leading-relaxed">
                        If you have questions about this Privacy Policy, please contact us at{' '}
                        <a href="mailto:privacy@psychanalyze.com" className="text-purple-600 hover:underline">
                            privacy@psychanalyze.com
                        </a>
                    </p>
                </section>
            </div>
        </div>
    );
}
