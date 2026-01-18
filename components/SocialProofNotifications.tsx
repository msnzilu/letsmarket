'use client';

import { useState, useEffect } from 'react';
import { Users, Zap, CheckCircle, MapPin } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const NOTIFICATION_TIMEOUT = 15000;
const HIDE_TIMEOUT = 1000;

interface Notification {
    id: string | number;
    type: 'signup' | 'analysis';
    user: string;
    location: string;
    timestamp: number;
}

export default function SocialProofNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    // Initial load and shuffle
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Import JSON data
                const staticData = await import('@/lib/data/notifications.json');

                // Shuffle static data and assign random recent timestamps
                const now = Date.now();
                const processedStatic: Notification[] = staticData.default
                    .sort(() => Math.random() - 0.5)
                    .map((item: any, index: number) => ({
                        ...item,
                        id: `static-${index}`,
                        // Assign a random timestamp between 2 and 20 minutes ago
                        timestamp: now - (Math.floor(Math.random() * 18 * 60 * 1000) + 2 * 60 * 1000)
                    }));

                setNotifications(processedStatic);
            } catch (error) {
                console.error('Failed to load notification data:', error);
            }
        };

        const fetchDynamicStats = async () => {
            try {
                const res = await fetch('/api/stats');
                if (res.ok) {
                    const data = await res.json();
                    if (data.recentActivity && data.recentActivity.length > 0) {
                        const dynamicNotes: Notification[] = data.recentActivity.map((a: any) => ({
                            id: `dynamic-${a.id}`,
                            type: a.type === 'analysis' ? 'analysis' : 'signup',
                            user: a.user,
                            location: a.location,
                            timestamp: Date.now() - (Math.floor(Math.random() * 60 * 1000)), // Just now/under 1 min
                        }));

                        setNotifications(prev => [...dynamicNotes, ...prev]);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch dynamic notifications:', error);
            }
        };

        loadInitialData();
        fetchDynamicStats();

        const showTimeout = setTimeout(() => {
            setIsVisible(true);
        }, 5000);

        return () => clearTimeout(showTimeout);
    }, []);

    // Cycling logic
    useEffect(() => {
        if (notifications.length === 0) return;

        const interval = setInterval(() => {
            setIsVisible(false);

            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % notifications.length);
                setIsVisible(true);
            }, HIDE_TIMEOUT);

        }, NOTIFICATION_TIMEOUT);

        return () => clearInterval(interval);
    }, [notifications.length]);

    const formatTimeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);

        if (seconds < 60) return 'just now';

        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;

        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;

        return 'recently';
    };

    if (notifications.length === 0) return null;

    const current = notifications[currentIndex];
    const Icon = current.type === 'analysis' ? Zap : Users;

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
                            <Icon className="w-6 h-6 text-purple-600" />
                        </div>

                        <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-900 leading-tight">
                                {current.user} {current.type === 'signup' ? 'registered' : 'analyzed a site'}
                            </p>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                                <MapPin className="w-3 h-3" />
                                <span>{current.location}</span>
                                <span className="opacity-30">•</span>
                                <span>{formatTimeAgo(current.timestamp)}</span>
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
