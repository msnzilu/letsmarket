// app/api/analyze/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { scrapeWebsite, validateUrl, normalizeUrl } from '@/lib/scraper';
import { analyzeWebsiteContent } from '@/lib/openai';
import { getEffectivePlan, getPlanLimits } from '@/lib/subscription';

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

        // Check if user has exceeded analysis limit (persistent tracking)
        const { data: subscription, error: subError } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (subError && subError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            console.error('Subscription fetch error:', subError);
        }

        const { data: usage, error: usageError } = await supabase
            .from('usage_tracking')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (usageError && usageError.code !== 'PGRST116') {
            console.error('Usage fetch error:', usageError);
        }

        const plan = getEffectivePlan(subscription);
        const limits = getPlanLimits(plan);
        const currentUsageCount = usage?.analyses_count || 0;

        console.log(`Analyzing for user ${user.id}: Plan=${plan}, Count=${currentUsageCount}, Limit=${limits.analyses_total}`);

        if (currentUsageCount >= limits.analyses_total) {
            return NextResponse.json(
                { error: `Analysis limit reached (${limits.analyses_total} analyses). Please upgrade to continue.` },
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

        // Step 4: Increment usage counters (Atomic increment via RPC)
        const { error: rpcError } = await supabase.rpc('increment_analysis_usage', {
            user_id_param: user.id
        });

        if (rpcError) {
            console.error('CRITICAL: Failed to increment usage tracking. Ensure migration 007 is applied:', rpcError);
            throw new Error('System error: Unable to track usage. Please apply migration 007 to your database.');
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