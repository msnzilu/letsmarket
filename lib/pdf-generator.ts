// lib/pdf-generator.ts
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Recommendation {
    title: string;
    description: string;
    implementation: string;
    principle: string;
    impactScore: number;
    difficulty: string;
}

interface AnalysisData {
    overall_score: number;
    principle_scores: Record<string, { score: number; feedback: string }>;
    generated_copy: {
        headlines: string[];
        ctas: string[];
        value_props: string[];
    };
    recommendations: Recommendation[];
}

export async function generateAnalysisPDF(analysis: AnalysisData, websiteUrl: string): Promise<Uint8Array> {
    // @ts-ignore - autoTable is added by the import
    const doc = new jsPDF();

    const brandPrimary = [0, 139, 139]; // Dark Cyan (matched to brand-primary)

    // Header
    doc.setFontSize(24);
    doc.setTextColor(brandPrimary[0], brandPrimary[1], brandPrimary[2]);
    doc.text('lez Market Report', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Website: ${websiteUrl}`, 105, 30, { align: 'center' });
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 37, { align: 'center' });

    // Divider
    doc.setDrawColor(226, 232, 240);
    doc.line(20, 45, 190, 45);

    // Overall Score
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text('Conversion Score', 20, 60);

    doc.setFontSize(48);
    doc.setTextColor(brandPrimary[0], brandPrimary[1], brandPrimary[2]);
    doc.text(`${analysis.overall_score}`, 20, 85);
    doc.setFontSize(16);
    doc.setTextColor(100, 100, 100);
    doc.text('/ 100', 55, 85);

    // Scoring Table
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text('Analysis Breakdown', 20, 105);

    const tableBody = Object.entries(analysis.principle_scores || {}).map(([name, data]) => [
        name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, ' '),
        `${data.score}/10`,
        data.feedback
    ]);

    // @ts-ignore
    // @ts-ignore
    autoTable(doc, {
        startY: 112,
        head: [['Principle', 'Score', 'Feedback']],
        body: tableBody,
        theme: 'striped',
        headStyles: { fillColor: brandPrimary as [number, number, number], textColor: 255 },
        styles: { fontSize: 10, cellPadding: 5 },
        columnStyles: {
            0: { cellWidth: 40, fontStyle: 'bold' },
            1: { cellWidth: 20, halign: 'center' },
            2: { cellWidth: 'auto' }
        }
    });

    // @ts-ignore
    let currentY = doc.lastAutoTable.finalY + 15;

    // Recommendations
    if (currentY > 250) {
        doc.addPage();
        currentY = 20;
    }

    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text('Key Recommendations', 20, currentY);
    currentY += 10;

    (analysis.recommendations || []).forEach((rec, i) => {
        // Title
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        const titleText = `${i + 1}. ${rec.title}`;

        // Description
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        doc.setFont('helvetica', 'normal');
        const descText = doc.splitTextToSize(rec.description, 170);

        // Implementation
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        const implText = doc.splitTextToSize(`How to implement: ${rec.implementation}`, 165);

        const totalHeight = 6 + (descText.length * 5) + 3 + (implText.length * 4) + 8;

        if (currentY + totalHeight > 280) {
            doc.addPage();
            currentY = 20;
        }

        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text(titleText, 20, currentY);
        currentY += 6;

        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        doc.setFont('helvetica', 'normal');
        doc.text(descText, 20, currentY);
        currentY += (descText.length * 5) + 3;

        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(implText, 25, currentY);
        currentY += (implText.length * 4) + 8;
    });

    // Copy Suggestions
    if (currentY > 240) {
        doc.addPage();
        currentY = 20;
    } else {
        currentY += 5;
    }

    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text('Optimized Copy', 20, currentY);
    currentY += 12;

    const copy = analysis.generated_copy || {};

    // Headlines
    if (copy.headlines?.length) {
        doc.setFontSize(12);
        doc.setTextColor(brandPrimary[0], brandPrimary[1], brandPrimary[2]);
        doc.text('High-Converting Headlines', 20, currentY);
        currentY += 8;
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        copy.headlines.forEach(h => {
            if (currentY > 275) { doc.addPage(); currentY = 20; }
            doc.text(`- ${h}`, 25, currentY);
            currentY += 6;
        });
        currentY += 5;
    }

    // CTAs
    if (copy.ctas?.length) {
        if (currentY > 270) { doc.addPage(); currentY = 20; }
        doc.setFontSize(12);
        doc.setTextColor(brandPrimary[0], brandPrimary[1], brandPrimary[2]);
        doc.text('Powerful Calls to Action', 20, currentY);
        currentY += 8;
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        copy.ctas.forEach(c => {
            if (currentY > 275) { doc.addPage(); currentY = 20; }
            doc.text(`- ${c}`, 25, currentY);
            currentY += 6;
        });
    }

    // Final touch: Page numbers
    const totalPages = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`lezMarket.io | Page ${i} of ${totalPages}`, 105, 290, { align: 'center' });
    }

    return new Uint8Array(doc.output('arraybuffer'));
}
