// app/contact/ContactClient.tsx

'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, MessageSquare, MapPin } from 'lucide-react';

export default function ContactClient() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In production, this would send to an API endpoint
        console.log('Contact form submitted:', formData);
        setSubmitted(true);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-16">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
                <p className="text-xl text-slate-600">
                    Have questions? We'd love to hear from you.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
                <Card className="p-6 text-center">
                    <Mail className="w-8 h-8 mx-auto text-brand-primary mb-3" />
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a href="mailto:support@lezmarket.io" className="text-brand-primary hover:underline">
                        support@lezmarket.io
                    </a>
                </Card>
                <Card className="p-6 text-center">
                    <MessageSquare className="w-8 h-8 mx-auto text-brand-secondary mb-3" />
                    <h3 className="font-semibold mb-1">Live Chat</h3>
                    <p className="text-slate-600 text-sm">Available Mon-Fri, 9am-5pm</p>
                </Card>
                <Card className="p-6 text-center">
                    <MapPin className="w-8 h-8 mx-auto text-green-600 mb-3" />
                    <h3 className="font-semibold mb-1">Location</h3>
                    <p className="text-slate-600 text-sm">Remote-first company</p>
                </Card>
            </div>

            <Card className="p-8 max-w-5xl mx-auto">
                {submitted ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
                        <p className="text-slate-600">
                            We'll get back to you within 24 hours.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary outline-none"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary outline-none"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Subject</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary outline-none"
                                value={formData.subject}
                                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Message</label>
                            <textarea
                                required
                                rows={5}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary outline-none resize-none"
                                value={formData.message}
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                            />
                        </div>
                        <Button type="submit" className="w-full" size="lg">
                            Send Message
                        </Button>
                    </form>
                )}
            </Card>
        </div>
    );
}
