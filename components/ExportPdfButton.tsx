// components/ExportPdfButton.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2, Lock } from 'lucide-react';
import { Plan } from '@/lib/subscription';
import { useUpgradeModal } from '@/hooks/use-upgrade-modal';

interface ExportPdfButtonProps {
    analysisId: string;
    plan: Plan;
}

export default function ExportPdfButton({ analysisId, plan }: ExportPdfButtonProps) {
    const [loading, setLoading] = useState(false);
    const { onOpen } = useUpgradeModal();

    const isPro = plan === 'pro' || plan === 'enterprise';

    const handleExport = async () => {
        if (!isPro) {
            onOpen();
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`/api/analysis/${analysisId}/export`);

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || data.error || 'Failed to export PDF');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `lezMarket_Report_${analysisId.slice(0, 8)}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error: any) {
            console.error('Export error:', error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant={isPro ? "outline" : "secondary"}
            onClick={handleExport}
            disabled={loading}
            className={!isPro ? "text-slate-500" : ""}
        >
            {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : isPro ? (
                <Download className="w-4 h-4 mr-2" />
            ) : (
                <Lock className="w-4 h-4 mr-2 opacity-50" />
            )}
            Download PDF Report
        </Button>
    );
}
