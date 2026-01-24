'use client';

// components/CopySection.tsx
// Client component wrapper for copy cards with post modal

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CopyCard from '@/components/CopyCard';
import PostComposerModal from '@/components/PostComposerModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HeadlineVariation, CTAVariation, ValueProp, PainPoint, PostDraft } from '@/types';

interface CopySectionProps {
    headlines: HeadlineVariation[];
    ctas: CTAVariation[];
    valueProps: ValueProp[];
    painPoints: PainPoint[];
    postDrafts: PostDraft[];
    analysisId: string;
}

export default function CopySection({
    headlines = [],
    ctas = [],
    valueProps = [],
    painPoints = [],
    postDrafts = [],
    analysisId
}: CopySectionProps) {
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
                <TabsList className="hidden md:flex">
                    <TabsTrigger value="headlines">Headlines ({headlines.length})</TabsTrigger>
                    <TabsTrigger value="ctas">CTAs ({ctas.length})</TabsTrigger>
                    <TabsTrigger value="valueProps">Value Props ({valueProps.length})</TabsTrigger>
                    <TabsTrigger value="painPoints">Pain Points ({painPoints.length})</TabsTrigger>
                    <TabsTrigger value="postDrafts">Post Drafts ({postDrafts.length})</TabsTrigger>
                </TabsList>

                {/* Mobile optimization: simpler tab list if many tabs */}
                <TabsList className="md:hidden overflow-x-auto justify-start">
                    <TabsTrigger value="headlines">Headlines</TabsTrigger>
                    <TabsTrigger value="ctas">CTAs</TabsTrigger>
                    <TabsTrigger value="valueProps">Value</TabsTrigger>
                    <TabsTrigger value="painPoints">Pain</TabsTrigger>
                    <TabsTrigger value="postDrafts">Posts</TabsTrigger>
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

                <TabsContent value="valueProps" className="space-y-4 mt-4">
                    {valueProps.map((vp, i) => (
                        <div key={i} className="p-4 border rounded-lg bg-white shadow-sm">
                            <h3 className="font-semibold text-brand-primary mb-1">{vp.copy}</h3>
                            <p className="text-sm text-slate-600">{vp.description}</p>
                            <Button variant="ghost" size="sm" className="mt-2 text-xs" onClick={() => handlePost(vp.copy, 'headline')}>
                                Use as Headline
                            </Button>
                        </div>
                    ))}
                </TabsContent>

                <TabsContent value="painPoints" className="space-y-4 mt-4">
                    {painPoints.map((pp, i) => (
                        <div key={i} className="p-4 border rounded-lg bg-white shadow-sm">
                            <h3 className="font-semibold text-red-600 mb-1">{pp.copy}</h3>
                            <p className="text-sm text-slate-600">{pp.description}</p>
                            <Button variant="ghost" size="sm" className="mt-2 text-xs" onClick={() => handlePost(pp.copy, 'headline')}>
                                Use as Headline
                            </Button>
                        </div>
                    ))}
                </TabsContent>

                <TabsContent value="postDrafts" className="space-y-4 mt-4">
                    {postDrafts.map((draft, i) => (
                        <div key={i} className="p-4 border rounded-lg bg-white shadow-sm">
                            <div className="flex justify-between items-center mb-2">
                                <Badge variant="secondary">{draft.platform}</Badge>
                                <span className="text-[10px] text-slate-400">{draft.copy.length} characters</span>
                            </div>
                            <p className="text-slate-700 italic border-l-4 border-slate-200 pl-4 py-2">{draft.copy}</p>
                            <Button variant="outline" size="sm" className="mt-2" onClick={() => handlePost(draft.copy, 'headline')}>
                                Schedule this Post
                            </Button>
                        </div>
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
