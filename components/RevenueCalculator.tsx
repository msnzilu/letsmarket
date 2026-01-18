'use client';

// components/RevenueCalculator.tsx
import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

export default function RevenueCalculator() {
    const [traffic, setTraffic] = useState(5000);
    const [conversion, setConversion] = useState(2);
    const [avgValue, setAvgValue] = useState(50);
    const [lostRevenue, setLostRevenue] = useState(0);
    const [potentialLift, setPotentialLift] = useState(25);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch recent websites/analyses from dashboard logic or a new endpoint
                // For now we use subscription endpoint which might have usage data
                const res = await fetch('/api/subscription');
                if (res.ok) {
                    const data = await res.json();

                    // If the user has analyses, we could potentially derive some data
                    // But usually, traffic/conversion/value are user-provided.
                    // If we had a 'latest_analysis' we could adjust the lift.
                }

                // In a real scenario, we might have an endpoint for the user's specific business metrics
                // For now, we'll keep defaults but make the LIFT estimation dynamic if we find an analysis
                const statsRes = await fetch('/api/stats');
                if (statsRes.ok) {
                    const stats = await statsRes.json();
                    // If the platform average optimization is low, maybe lift is higher
                    // setPotentialLift(calculateLift(stats.avgScore));
                }

            } catch (error) {
                console.error('Failed to fetch calculator data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const currentRevenue = traffic * (conversion / 100) * avgValue;
        const potentialRevenue = traffic * ((conversion * (1 + potentialLift / 100)) / 100) * avgValue;
        const leak = potentialRevenue - currentRevenue;
        setLostRevenue(Math.round(leak));
    }, [traffic, conversion, avgValue, potentialLift]);

    return (
        <Card className="p-6 border-2 border-slate-100 shadow-xl bg-white overflow-hidden relative transition-colors duration-300">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <DollarSign size={120} className="text-slate-900" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-6">
                Most websites lose <span className="text-red-600">22-30%</span> of revenue to unoptimized copy.
            </h3>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Monthly Traffic</label>
                    <div className="flex items-center gap-3">
                        <input
                            type="range"
                            min="1000"
                            max="100000"
                            step="1000"
                            value={traffic}
                            onChange={(e) => setTraffic(Number(e.target.value))}
                            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
                        />
                        <span className="font-mono font-bold text-slate-900 w-20 text-right">{traffic.toLocaleString()}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Conversion Rate (%)</label>
                    <div className="flex items-center gap-3">
                        <input
                            type="range"
                            min="0.1"
                            max="10"
                            step="0.1"
                            value={conversion}
                            onChange={(e) => setConversion(Number(e.target.value))}
                            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
                        />
                        <span className="font-mono font-bold text-slate-900 w-20 text-right">{conversion}%</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg. Order Value ($)</label>
                    <div className="flex items-center gap-3">
                        <input
                            type="range"
                            min="10"
                            max="1000"
                            step="10"
                            value={avgValue}
                            onChange={(e) => setAvgValue(Number(e.target.value))}
                            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
                        />
                        <span className="font-mono font-bold text-slate-900 w-20 text-right">${avgValue}</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 p-6 bg-red-50 rounded-2xl border border-red-100">
                <p className="text-xs font-bold text-red-600 uppercase mb-2 tracking-widest text-center">Estimated Annual Revenue Leak</p>
                <div className="flex items-center justify-center gap-2 text-4xl font-black text-red-600">
                    <DollarSign size={32} />
                    {(lostRevenue * 12).toLocaleString()}
                </div>
                <p className="text-center text-xs text-red-400 mt-2 font-medium">
                    *Based on industry standard 25% lift from psychological optimization.
                </p>
            </div>

            <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <TrendingUp size={16} className="text-green-500" />
                    <span>Potential Monthly Increase: <b>${(lostRevenue).toLocaleString()}</b></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <ArrowRight size={16} className="text-purple-500" />
                    <span>Stop the leak with targeted psychology.</span>
                </div>
            </div>
        </Card>
    );
}
