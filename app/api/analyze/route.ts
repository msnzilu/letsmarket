// app/api/analyze/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { scrapeWebsite, validateUrl, normalizeUrl } from '@/lib/scraper';
import { analyzeWebsiteContent } from '@/lib/openai';

export async function POST(request: NextRequest) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json(
                { error: 'URL is required' },
                { status: 400 }
            );
        }

        // Validate and normalize URL
        const normalizedUrl = normalizeUrl(url);
        if (!validateUrl(normalizedUrl)) {
            return NextResponse.json(
                { error: 'Invalid URL format' },
                { status: 400 }
            );
        }

        // Get authenticated user
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Check if user has exceeded analysis limit (3 per free tier)
        const { count } = await supabase
            .from('websites')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);

        if (count && count >= 3) {
            return NextResponse.json(
                { error: 'Free tier limit reached (3 websites). Delete a website to analyze a new one.' },
                { status: 403 }
            );
        }

        // Step 1: Scrape the website
        const websiteContent = await scrapeWebsite(normalizedUrl);

        if (!websiteContent || websiteContent.length < 100) {
            return NextResponse.json(
                { error: 'Unable to extract sufficient content from the website' },
                { status: 400 }
            );
        }

        // Step 2: Analyze with OpenAI
        const analysis = await analyzeWebsiteContent(websiteContent);

        // Step 3: Save to database
        // First, create or get the website record
        const { data: existingWebsite } = await supabase
            .from('websites')
            .select('id')
            .eq('url', normalizedUrl)
            .eq('user_id', user.id)
            .single();

        let websiteId: string;

        if (existingWebsite) {
            websiteId = existingWebsite.id;
            // Update the updated_at timestamp
            await supabase
                .from('websites')
                .update({ updated_at: new Date().toISOString() })
                .eq('id', websiteId);
        } else {
            const { data: newWebsite, error: websiteError } = await supabase
                .from('websites')
                .insert({
                    user_id: user.id,
                    url: normalizedUrl,
                })
                .select()
                .single();

            if (websiteError || !newWebsite) {
                throw new Error('Failed to save website');
            }

            websiteId = newWebsite.id;
        }

        // Save the analysis
        const { data: analysisData, error: analysisError } = await supabase
            .from('analyses')
            .insert({
                website_id: websiteId,
                overall_score: analysis.overallScore,
                principle_scores: analysis.principleScores,
                generated_copy: analysis.generatedCopy,
                recommendations: analysis.recommendations,
            })
            .select()
            .single();

        if (analysisError || !analysisData) {
            throw new Error('Failed to save analysis');
        }

        return NextResponse.json({
            success: true,
            analysis: analysisData,
            websiteId,
        });

    } catch (error: any) {
        console.error('Analysis error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to analyze website' },
            { status: 500 }
        );
    }
}