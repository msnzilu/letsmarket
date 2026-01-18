'use client';

import { useState, useEffect } from 'react';
import { Users, Zap, CheckCircle, MapPin } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// components/SocialProofNotifications.tsx

const NOTIFICATIONS = [
    {
        id: 1,
        type: 'signup',
        user: 'Alex M.',
        location: 'Oslo, Norway',
        time: '2 minutes ago',
        icon: Users,
    },
    {
        id: 2,
        type: 'analysis',
        user: 'Sarah K.',
        location: 'New York, USA',
        time: '5 minutes ago',
        icon: Zap,
    },
    {
        id: 3,
        type: 'signup',
        user: 'Marco R.',
        location: 'Milan, Italy',
        time: '8 minutes ago',
        icon: Users,
    },
    {
        id: 4,
        type: 'analysis',
        user: 'Elena S.',
        location: 'Madrid, Spain',
        time: '12 minutes ago',
        icon: CheckCircle,
    },
    {
        id: 5,
        type: 'signup',
        user: 'James T.',
        location: 'London, UK',
        time: '15 minutes ago',
        icon: Users,
    }
];

export default function SocialProofNotifications() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const showTimeout = setTimeout(() => {
            setIsVisible(true);
        }, 5000); // Initial delay

        const interval = setInterval(() => {
            setIsVisible(false);

            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % NOTIFICATIONS.length);
                setIsVisible(true);
            }, 1000); // Time to hide before showing next

        }, 15000); // Show each for 15s

        return () => {
            clearTimeout(showTimeout);
            clearInterval(interval);
        };
    }, []);

    const current = NOTIFICATIONS[currentIndex];

    return (
        <div className="fixed bottom-6 left-6 z-40 pointer-events-none sm:block hidden">
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, x: -50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -50, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="bg-white border-2 border-slate-100 shadow-2xl rounded-2xl p-4 flex items-center gap-4 max-w-[320px] pointer-events-auto"
                    >
                        <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                            <current.icon className="w-6 h-6 text-purple-600" />
                        </div>

                        <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-900 leading-tight">
                                {current.user} {current.type === 'signup' ? 'registered' : 'analyzed a site'}
                            </p>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                                <MapPin className="w-3 h-3" />
                                <span>{current.location}</span>
                                <span className="opacity-30">•</span>
                                <span>{current.time}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsVisible(false)}
                            className="text-slate-300 hover:text-slate-500 transition-colors p-1"
                        >
                            <span className="sr-only">Close</span>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
