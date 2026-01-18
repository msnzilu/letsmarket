'use client';

// components/StatsBanner.tsx
export default function StatsBanner() {
    return (
        <div className="bg-slate-900 overflow-hidden py-2 whitespace-nowrap">
            <div className="inline-block animate-marquee group">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mx-4">
                    Live Platform Stats:
                </span>
                <span className="text-white text-xs font-semibold mx-4">
                    🚀 <span className="text-purple-400">12,400+</span> Analyses Performed
                </span>
                <span className="text-white text-xs font-semibold mx-4 border-l border-slate-700 pl-4">
                    📈 Avg. <span className="text-green-400">22%</span> Conversion Lift
                </span>
                <span className="text-white text-xs font-semibold mx-4 border-l border-slate-700 pl-4">
                    ⚡ <span className="text-blue-400">98.4%</span> AI Accuracy
                </span>
                <span className="text-white text-xs font-semibold mx-4 border-l border-slate-700 pl-4">
                    👥 <span className="text-yellow-400">5k+</span> Marketers Trust Us
                </span>

                {/* Duplicate for seamless infinite loop */}
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mx-4">
                    Live Platform Stats:
                </span>
                <span className="text-white text-xs font-semibold mx-4">
                    🚀 <span className="text-purple-400">12,400+</span> Analyses Performed
                </span>
                <span className="text-white text-xs font-semibold mx-4 border-l border-slate-700 pl-4">
                    📈 Avg. <span className="text-green-400">22%</span> Conversion Lift
                </span>
                <span className="text-white text-xs font-semibold mx-4 border-l border-slate-700 pl-4">
                    ⚡ <span className="text-blue-400">98.4%</span> AI Accuracy
                </span>
                <span className="text-white text-xs font-semibold mx-4 border-l border-slate-700 pl-4">
                    👥 <span className="text-yellow-400">5k+</span> Marketers Trust Us
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
