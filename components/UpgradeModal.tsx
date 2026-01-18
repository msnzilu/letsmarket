'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Zap, Rocket, Globe, Users, BarChart3, Shield, RefreshCw } from 'lucide-react';
import { useUpgradeModal } from '@/hooks/use-upgrade-modal';
import { Button } from './ui/button';
import Link from 'next/link';

const features = [
    {
        title: 'Unlimited Analyses',
        description: 'Remove the 1-website limit and analyze your entire portfolio.',
        icon: BarChart3,
        color: 'text-blue-500'
    },
    {
        title: '5+ Social Accounts',
        description: 'Connect all your marketing channels (X, FB, LinkedIn, etc.).',
        icon: Globe,
        color: 'text-green-500'
    },
    {
        title: 'Advanced AI Context',
        description: 'Higher quality copy generation with deeper psychological grounding.',
        icon: Zap,
        color: 'text-yellow-500'
    },
    {
        title: 'Priority Support',
        description: 'Get help within 2 hours with a dedicated success manager.',
        icon: Shield,
        color: 'text-purple-500'
    }
];

export default function UpgradeModal() {
    const { isOpen, onClose } = useUpgradeModal();

    return (
        <AnimatePresence>
            {isOpen && (
                <Dialog.Root open={isOpen} onOpenChange={onClose}>
                    <Dialog.Portal forceMount>
                        <Dialog.Overlay asChild>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
                            />
                        </Dialog.Overlay>
                        <Dialog.Content asChild>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-3xl shadow-2xl z-[101] overflow-hidden border border-slate-100"
                            >
                                <div className="absolute right-6 top-6 z-10">
                                    <button
                                        onClick={onClose}
                                        className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="flex flex-col md:flex-row h-full">
                                    {/* Left Side - Visual & Promo */}
                                    <div className="md:w-[40%] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 text-white flex flex-col justify-between">
                                        <div>
                                            <div className="w-12 h-12 bg-white/20 rounded-2xl backdrop-blur-md flex items-center justify-center mb-6">
                                                <Rocket size={24} />
                                            </div>
                                            <Dialog.Title className="text-3xl font-black mb-2 tracking-tight">
                                                Upgrade to Pro
                                            </Dialog.Title>
                                            <Dialog.Description className="text-indigo-100 text-sm font-medium">
                                                Unlock the full potential of AI-driven marketing and scale your results.
                                            </Dialog.Description>
                                        </div>

                                        <div className="space-y-4 mt-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                                                    <Check size={12} />
                                                </div>
                                                <span className="text-xs font-bold uppercase tracking-wider">Billed monthly or yearly</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                                                    <Check size={12} />
                                                </div>
                                                <span className="text-xs font-bold uppercase tracking-wider">Cancel anytime</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                                                    <Check size={12} />
                                                </div>
                                                <span className="text-xs font-bold uppercase tracking-wider">Priority support</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Side - Features & CTA */}
                                    <div className="md:w-[60%] p-8 bg-white">
                                        <div className="space-y-6">
                                            <h3 className="text-sm font-black text-slate-900 border-b pb-4 uppercase tracking-[0.2em]">Features Included:</h3>

                                            <div className="grid gap-6">
                                                {features.map((feature, i) => (
                                                    <div key={i} className="flex gap-4">
                                                        <div className={`p-2 rounded-lg bg-slate-50 ${feature.color}`}>
                                                            <feature.icon size={20} />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-black text-slate-800 text-sm tracking-tight">{feature.title}</h4>
                                                            <p className="text-xs text-slate-500 mt-0.5 font-medium leading-relaxed">{feature.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-10 space-y-4">
                                            <Link href="/pricing" onClick={onClose} className="block">
                                                <Button className="w-full h-14 text-lg bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 transition-all font-black uppercase tracking-widest">
                                                    View Plans & Pricing
                                                </Button>
                                            </Link>
                                            <div className="flex items-center justify-center gap-2 text-green-600 font-bold text-[10px] uppercase tracking-wider">
                                                <RefreshCw size={12} />
                                                14-Day Money-Back Guarantee
                                            </div>
                                            <p className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1 font-bold uppercase tracking-widest">
                                                <Shield size={10} />
                                                Secure checkout powered by {process.env.NEXT_PUBLIC_PAYMENT_GATEWAY === 'paddle' ? 'Paddle' : 'Paystack'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </Dialog.Content>
                    </Dialog.Portal>
                </Dialog.Root>
            )}
        </AnimatePresence>
    );
}
