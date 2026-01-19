'use client';

import { useEffect, useState } from 'react';

// components/StatsBanner.tsx
export default function StatsBanner() {
    const [stats, setStats] = useState({
        totalAnalyses: 12400,
        avgConversionLift: 22,
        avgScore: 72,
        totalUsers: 5000
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/stats');
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="bg-slate-900 overflow-hidden py-2 whitespace-nowrap">
            <div className="inline-block animate-marquee group">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mx-4">
                    Live Platform Stats:
                </span>
                <span className="text-white text-xs font-semibold mx-4">
                    🚀 <span className="text-brand-primary">{stats.totalAnalyses.toLocaleString()}+</span> Analyses Performed
                </span>
                <span className="text-white text-xs font-semibold mx-4 border-l border-slate-700 pl-4">
                    📈 Avg. <span className="text-green-400">{stats.avgConversionLift}%</span> Conversion Lift
                </span>
                <span className="text-white text-xs font-semibold mx-4 border-l border-slate-700 pl-4">
                    ⚡ <span className="text-brand-secondary">{stats.avgScore}%</span> Avg. Optimization
                </span>
                <span className="text-white text-xs font-semibold mx-4 border-l border-slate-700 pl-4">
                    👥 <span className="text-yellow-400">{(stats.totalUsers / 1000).toFixed(1)}k+</span> Marketers Trust Us
                </span>

                {/* Duplicate for seamless infinite loop */}
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mx-4 ml-8">
                    Live Platform Stats:
                </span>
                <span className="text-white text-xs font-semibold mx-4">
                    🚀 <span className="text-purple-400">{stats.totalAnalyses.toLocaleString()}+</span> Analyses Performed
                </span>
                <span className="text-white text-xs font-semibold mx-4 border-l border-slate-700 pl-4">
                    📈 Avg. <span className="text-green-400">{stats.avgConversionLift}%</span> Conversion Lift
                </span>
                <span className="text-white text-xs font-semibold mx-4 border-l border-slate-700 pl-4">
                    ⚡ <span className="text-blue-400">{stats.avgScore}%</span> Avg. Optimization
                </span>
                <span className="text-white text-xs font-semibold mx-4 border-l border-slate-700 pl-4">
                    👥 <span className="text-yellow-400">{(stats.totalUsers / 1000).toFixed(1)}k+</span> Marketers Trust Us
                </span>
            </div>

            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    display: inline-block;
                    animation: marquee 30s linear infinite;
                }
                .group:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
}
