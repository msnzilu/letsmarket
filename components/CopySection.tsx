'use client';

// components/CopySection.tsx
// Client component wrapper for copy cards with post modal

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CopyCard from '@/components/CopyCard';
import PostComposerModal from '@/components/PostComposerModal';
import { HeadlineVariation, CTAVariation } from '@/types';

interface CopySectionProps {
    headlines: HeadlineVariation[];
    ctas: CTAVariation[];
    analysisId: string;
}

export default function CopySection({ headlines, ctas, analysisId }: CopySectionProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedContent, setSelectedContent] = useState('');
    const [selectedType, setSelectedType] = useState<'headline' | 'cta'>('headline');

    const handlePost = (content: string, type: 'headline' | 'cta') => {
        setSelectedContent(content);
        setSelectedType(type);
        setModalOpen(true);
    };

    return (
        <>
            <Tabs defaultValue="headlines">
                <TabsList>
                    <TabsTrigger value="headlines">Headlines ({headlines.length})</TabsTrigger>
                    <TabsTrigger value="ctas">CTAs ({ctas.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="headlines" className="space-y-4 mt-4">
                    {headlines.map((headline, i) => (
                        <CopyCard key={i} copy={headline} type="headline" onPost={handlePost} />
                    ))}
                </TabsContent>

                <TabsContent value="ctas" className="space-y-4 mt-4">
                    {ctas.map((cta, i) => (
                        <CopyCard key={i} copy={cta} type="cta" onPost={handlePost} />
                    ))}
                </TabsContent>
            </Tabs>

            <PostComposerModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                initialContent={selectedContent}
                copyType={selectedType}
                analysisId={analysisId}
            />
        </>
    );
}
