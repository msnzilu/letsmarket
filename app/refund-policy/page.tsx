// app/refund-policy/page.tsx

import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Refund Policy - lez Market',
    description: 'Learn about our 14-day money-back guarantee and how to request a refund for your lez Market subscription.',
};

export default function RefundPolicy() {
    const lastUpdated = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
            <h1 className="text-4xl font-bold mb-4">Refund Policy</h1>
            <p className="text-slate-500 mb-12">Last updated: {lastUpdated}</p>

            <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed">
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">1. 14-Day Money-Back Guarantee</h2>
                    <p>
                        We want you to be completely satisfied with lez Market. If you are a first-time subscriber and
                        decide that our service isn't the right fit for you within the first 14 days of your initial
                        subscription, we will provide a full refund of your purchase.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Eligibility for Refunds</h2>
                    <p>To be eligible for a refund under our 14-day guarantee, you must meet the following criteria:</p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li>You must be a first-time subscriber to a paid plan.</li>
                        <li>The refund request must be submitted within 14 calendar days of your initial transaction.</li>
                        <li>You must not have exceeded 50% of your plan's monthly analysis limit (for transparency and to prevent abuse).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">3. How to Request a Refund</h2>
                    <p>
                        To request a refund, please contact our support team at
                        <a href="mailto:support@psychanalyze.com" className="text-purple-600 font-medium hover:underline mx-1">support@psychanalyze.com</a>
                        with the subject line "Refund Request". Please include:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li>The email address associated with your account.</li>
                        <li>Your transaction reference or ID.</li>
                        <li>A brief reason for your request (this helps us improve our service).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Processing Time</h2>
                    <p>
                        Once your refund request is received and approved, we will process it as soon as possible.
                        While we initiate the refund immediately, it may take 5-10 business days to appear on your bank statement
                        depending on your payment provider (Paystack or Paddle).
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Renewal Refunds</h2>
                    <p>
                        Unless required by law (e.g., EU data protection laws), subscription renewals are generally
                        non-refundable. We send reminder notifications before your subscription renews to give you ample
                        time to cancel if you no longer wish to use the service.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Abuse and Termination</h2>
                    <p>
                        We reserve the right to refuse a refund request if we reasonably believe that you are attempting
                        to abuse our refund policy (e.g., by repeatedly subscribing and requesting refunds). Accounts
                        terminated for violating our Terms of Service are not eligible for refunds.
                    </p>
                </section>
            </div>
        </div>
    );
}
