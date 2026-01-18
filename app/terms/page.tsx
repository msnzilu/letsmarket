// app/terms/page.tsx

import React from 'react';

export default function TermsOfService() {
    const lastUpdated = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-slate-500 mb-12">Last updated: {lastUpdated}</p>

            <div className="prose prose-slate max-w-none space-y-8">
                <section>
                    <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
                    <p className="text-slate-600 leading-relaxed">
                        By accessing or using LetsMarket, you agree to be bound by these Terms of Service.
                        If you disagree with any part of the terms, you may not access the service.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">2. Use License</h2>
                    <p className="text-slate-600 leading-relaxed">
                        Permission is granted to temporarily use the materials on LetsMarket for personal,
                        non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">3. Disclaimer</h2>
                    <p className="text-slate-600 leading-relaxed">
                        The materials on LetsMarket are provided on an 'as is' basis. LetsMarket makes no warranties,
                        expressed or implied, and hereby disclaims and negates all other warranties including, without limitation,
                        implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement
                        of intellectual property or other violation of rights.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">4. Limitations</h2>
                    <p className="text-slate-600 leading-relaxed">
                        In no event shall LetsMarket or its suppliers be liable for any damages (including, without limitation,
                        damages for loss of data or profit, or due to business interruption) arising out of the use or inability
                        to use the materials on LetsMarket.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">5. Governing Law</h2>
                    <p className="text-slate-600 leading-relaxed">
                        These terms and conditions are governed by and construed in accordance with the laws and you
                        irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                    </p>
                </section>
            </div>
        </div>
    );
}
