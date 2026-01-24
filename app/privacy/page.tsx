// app/privacy/page.tsx

import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Privacy Policy - lez Market',
    description: 'Our commitment to protecting your personal data and respecting your privacy.',
    robots: {
        index: false,
        follow: true,
    }
};

export default function PrivacyPolicy() {
    const lastUpdated = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-slate-500 mb-12">Last updated: {lastUpdated}</p>

            <div className="prose prose-slate max-w-none space-y-8">
                <section>
                    <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
                    <p className="text-slate-600 leading-relaxed">
                        Welcome to lez Market. We respect your privacy and are committed to protecting your personal data.
                        This Privacy Policy will inform you as to how we look after your personal data when you visit our website
                        and tell you about your privacy rights and how the law protects you.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">2. The Data We Collect</h2>
                    <p className="text-slate-600 leading-relaxed">
                        We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                    </p>
                    <ul className="list-disc pl-6 mt-4 text-slate-600 space-y-2">
                        <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                        <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
                        <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
                        <li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">3. How We Use Your Personal Data</h2>
                    <p className="text-slate-600 leading-relaxed">
                        We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                    </p>
                    <ul className="list-disc pl-6 mt-4 text-slate-600 space-y-2">
                        <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                        <li>Where it is necessary for our legitimate interests and your interests and fundamental rights do not override those interests.</li>
                        <li>Where we need to comply with a legal or regulatory obligation.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
                    <p className="text-slate-600 leading-relaxed">
                        We have put in place appropriate security measures to prevent your personal data from being accidentally lost,
                        used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal
                        data to those employees, agents, contractors and other third parties who have a business need to know.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">5. Contact Us</h2>
                    <p className="text-slate-600 leading-relaxed">
                        If you have any questions about this privacy policy or our privacy practices, please contact us at:
                        <a href="mailto:support@lezmarket.io" className="text-purple-600 hover:underline ml-1">support@lezmarket.io</a>
                    </p>
                </section>

                <section className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                    <h2 className="text-2xl font-bold mb-4">6. Data Deletion</h2>
                    <p className="text-slate-600 leading-relaxed mb-6">
                        You have the right to request the deletion of your personal data at any time.
                        You can submit a formal request through our automated portal:
                    </p>
                    <a
                        href="/data-deletion"
                        className="inline-flex items-center px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 hover:border-brand-primary hover:text-brand-primary transition-all shadow-sm"
                    >
                        Request Data Deletion
                    </a>
                </section>
            </div>
        </div>
    );
}
