// components/Footer.tsx

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Linkedin, Instagram, Mail } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 text-slate-300">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link href="/" className="flex items-center space-x-2 mb-4">
                            <Image
                                src="/logo/site-logo.png"
                                alt="lez Market Logo"
                                width={130}
                                height={100}
                                className="w-25 h-15 rounded-lg"
                            />
                        </Link>
                        <p className="text-sm text-slate-400">
                            Turn clicks into customers. Automate the art of persuasion.
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Product</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/analyze" className="hover:text-white transition-colors">
                                    Analyze Website
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard" className="hover:text-white transition-colors">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/connections" className="hover:text-white transition-colors">
                                    Social Connections
                                </Link>
                            </li>
                            <li>
                                <Link href="/posts" className="hover:text-white transition-colors">
                                    Scheduled Posts
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Resources</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/docs" className="hover:text-white transition-colors">
                                    Documentation
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="hover:text-white transition-colors">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="/pricing" className="hover:text-white transition-colors">
                                    Pricing
                                </Link>
                            </li>
                            {/* <li>
                                <Link href="/docs#api-auth" className="hover:text-white transition-colors">
                                    API
                                </Link>
                            </li> */}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Company</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/about" className="hover:text-white transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-white transition-colors">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="hover:text-white transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-white transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="/refund-policy" className="hover:text-white transition-colors">
                                    Refund Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/cookies" className="hover:text-white transition-colors">
                                    Cookie Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-slate-400">
                        © {currentYear} lez Market. All rights reserved.
                    </p>

                    {/* Social Links */}
                    <div className="flex items-center gap-4">
                        <a
                            href="#"
                            className="text-slate-400 hover:text-white transition-colors"
                            aria-label="Facebook"
                        >
                            <Facebook className="w-5 h-5" />
                        </a>
                        <a
                            href="#"
                            className="text-slate-400 hover:text-white transition-colors"
                            aria-label="Twitter"
                        >
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a
                            href="#"
                            className="text-slate-400 hover:text-white transition-colors"
                            aria-label="LinkedIn"
                        >
                            <Linkedin className="w-5 h-5" />
                        </a>
                        <a
                            href="#"
                            className="text-slate-400 hover:text-white transition-colors"
                            aria-label="Instagram"
                        >
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a
                            href="mailto:support@lezmarket.io"
                            className="text-slate-400 hover:text-white transition-colors"
                            aria-label="Email"
                        >
                            <Mail className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
