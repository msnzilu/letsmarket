'use client';

import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Copy, Check, Send } from 'lucide-react';
import { getDifficultyColor } from '@/lib/utils';
import { HeadlineVariation, CTAVariation } from '@/types';

interface CopyCardProps {
    copy: HeadlineVariation | CTAVariation;
    type: 'headline' | 'cta';
    onPost?: (content: string, type: 'headline' | 'cta') => void;
}

export default function CopyCard({ copy, type, onPost }: CopyCardProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(copy.copy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                    <p className="font-medium text-lg mb-2">{copy.copy}</p>

                    <div className="flex gap-2 flex-wrap">
                        <Badge variant="secondary">{copy.principle}</Badge>
                        <Badge className={getDifficultyColor(copy.difficulty)}>
                            {copy.difficulty}
                        </Badge>
                        <Badge variant="outline">
                            Impact: {copy.impactScore}/100
                        </Badge>
                    </div>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCopy}
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4 mr-1" />
                                Copied
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4 mr-1" />
                                Copy
                            </>
                        )}
                    </Button>
                    {onPost && (
                        <Button
                            size="sm"
                            onClick={() => onPost(copy.copy, type)}
                            className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white"
                        >
                            <Send className="w-4 h-4 mr-1" />
                            Post
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
}