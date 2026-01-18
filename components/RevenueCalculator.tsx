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

    useEffect(() => {
        // Assume our AI can improve conversion by at least 25% (industry average for optimized social proof)
        const currentRevenue = traffic * (conversion / 100) * avgValue;
        const potentialRevenue = traffic * ((conversion * 1.25) / 100) * avgValue;
        const leak = potentialRevenue - currentRevenue;
        setLostRevenue(Math.round(leak));
    }, [traffic, conversion, avgValue]);

    return (
        <Card className="p-6 border-2 border-slate-100 shadow-xl bg-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-3 opacity-10">
                <AlertTriangle size={60} className="text-red-600" />
            </div>

            <div className="flex items-center gap-2 mb-6 text-red-600">
                <AlertTriangle size={20} />
                <span className="text-sm font-bold uppercase tracking-wider">Revenue Leak Detector</span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-6">
                How much revenue is your current copy losing?
            </h3>

            <div className="space-y-4">
                <div>
                    <Label className="text-xs font-semibold text-slate-500 uppercase">Monthly Traffic</Label>
                    <div className="flex items-center gap-3">
                        <Input
                            type="number"
                            value={traffic}
                            onChange={(e) => setTraffic(Number(e.target.value))}
                            className="bg-slate-50 border-none h-12 text-lg font-bold"
                        />
                        <span className="text-slate-400 text-sm w-12 text-right">Visits</span>
                    </div>
                </div>

                <div>
                    <Label className="text-xs font-semibold text-slate-500 uppercase">Current Conv. Rate (%)</Label>
                    <div className="flex items-center gap-3">
                        <Input
                            type="number"
                            step="0.1"
                            value={conversion}
                            onChange={(e) => setConversion(Number(e.target.value))}
                            className="bg-slate-50 border-none h-12 text-lg font-bold"
                        />
                        <span className="text-slate-400 text-sm w-12 text-right">%</span>
                    </div>
                </div>

                <div>
                    <Label className="text-xs font-semibold text-slate-500 uppercase">Avg. Customer Value ($)</Label>
                    <div className="flex items-center gap-3">
                        <Input
                            type="number"
                            value={avgValue}
                            onChange={(e) => setAvgValue(Number(e.target.value))}
                            className="bg-slate-50 border-none h-12 text-lg font-bold"
                        />
                        <span className="text-slate-400 text-sm w-12 text-right">$</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 p-6 bg-red-50 rounded-2xl border border-red-100">
                <p className="text-xs font-bold text-red-600 uppercase mb-2 tracking-widest text-center">Your Monthly Revenue Leak</p>
                <div className="flex items-center justify-center gap-2 text-4xl font-black text-red-600">
                    <DollarSign size={32} />
                    {lostRevenue.toLocaleString()}
                </div>
                <p className="text-center text-xs text-red-400 mt-2 font-medium">
                    *Based on a conservative 25% conversion lift using AI copy.
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
