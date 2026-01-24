// lib/campaign-generator.ts
// AI-powered campaign post generation

import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

interface AnalysisData {
    overall_score: number;
    principle_scores: Record<string, any>;
    generated_copy: {
        headlines: string[];
        ctas: string[];
        value_props: string[];
    };
}

interface GeneratedPost {
    content: string;
    platform: string;
    contentType: string;
}

const PLATFORM_LIMITS = {
    x: 280, // Standard limit for unverified accounts
    linkedin: 3000,
    facebook: 500,
    instagram: 2200,
    tiktok: 150,
    reddit: 300,
};

const PLATFORM_STYLES = {
    x: 'concise and punchy, max 280 characters, absolutely no hashtags, conversational tone, use questions or bold statements to drive engagement',
    linkedin: 'professional, insightful, story-driven, use line breaks for readability, include relevant hashtags at the end',
    facebook: 'friendly, engaging, ask questions, encourage comments and shares',
    instagram: 'visual-focused caption, use emojis sparingly, 3-5 hashtags at end, storytelling approach',
    tiktok: 'trendy, casual, hook in first line, use trending phrases',
    reddit: 'authentic, value-first, no self-promotion feel, community-focused',
};

export async function generateCampaignPosts({
    analysis,
    platforms,
    postsPerPlatform = 3,
    contentTypes = ['post'],
    websiteUrl,
}: {
    analysis: AnalysisData;
    platforms: string[];
    postsPerPlatform?: number;
    contentTypes?: string[];
    websiteUrl?: string;
}): Promise<GeneratedPost[]> {
    const posts: GeneratedPost[] = [];

    // Log what data we're working with
    console.log('Generating posts with context:', {
        websiteUrl,
        headlines: analysis.generated_copy?.headlines?.slice(0, 3),
        ctas: analysis.generated_copy?.ctas?.slice(0, 3),
        value_props: analysis.generated_copy?.value_props?.slice(0, 3),
    });

    for (const platform of platforms) {
        const limit = PLATFORM_LIMITS[platform as keyof typeof PLATFORM_LIMITS] || 500;
        const style = PLATFORM_STYLES[platform as keyof typeof PLATFORM_STYLES] || 'professional';

        // Build context from available data - headlines and ctas are objects with 'copy' property
        const headlinesList = analysis.generated_copy?.headlines || [];
        const ctasList = analysis.generated_copy?.ctas || [];
        const valuePropsList = analysis.generated_copy?.value_props || [];

        // Extract the actual copy text from objects (they have {copy, principle, impactScore, difficulty})
        const headlines = headlinesList
            .slice(0, 5)
            .map((h: any) => typeof h === 'string' ? h : h.copy)
            .filter(Boolean)
            .join(' | ');

        const ctas = ctasList
            .slice(0, 5)
            .map((c: any) => typeof c === 'string' ? c : c.copy)
            .filter(Boolean)
            .join(' | ');

        const valueProps = valuePropsList
            .slice(0, 3)
            .map((v: any) => typeof v === 'string' ? v : v.copy || v)
            .filter(Boolean)
            .join(' | ');

        const hasContext = headlines || ctas || valueProps;

        console.log(`[${platform}] Building prompt with:`, {
            websiteUrl,
            headlines: headlines.substring(0, 100),
            ctas: ctas.substring(0, 100),
            hasContext,
        });

        const prompt = `You are a social media marketing expert creating posts for a specific business.

WEBSITE URL: ${websiteUrl || 'Unknown'}
${headlines ? `\nHEADLINES FROM THIS WEBSITE:\n${headlines}` : ''}
${ctas ? `\nCALL-TO-ACTIONS FROM THIS WEBSITE:\n${ctas}` : ''}
${valueProps ? `\nVALUE PROPOSITIONS:\n${valueProps}` : ''}

YOUR TASK: Create ${postsPerPlatform} ${platform} posts that promote THIS SPECIFIC BUSINESS.

CRITICAL REQUIREMENTS:
1. Posts MUST directly relate to the headlines, CTAs, or value propositions above
2. Posts MUST be about what ${websiteUrl} actually offers
3. DO NOT write generic content - reference specific features/benefits from the data above
4. Maximum ${limit} characters per post
5. Style: ${style}

Return JSON: {"posts": [{"content": "post text here"}]}`;

        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: `You create targeted social media posts for ${websiteUrl}. You MUST use the headlines and CTAs provided to create relevant, specific posts about this business. Never generate generic or unrelated content.`
                    },
                    { role: 'user', content: prompt },
                ],
                temperature: 0.7,
                response_format: { type: 'json_object' },
            });

            const content = response.choices[0]?.message?.content;
            if (content) {
                const parsed = JSON.parse(content);
                const generatedPosts = parsed.posts || parsed;

                if (Array.isArray(generatedPosts)) {
                    for (const post of generatedPosts) {
                        posts.push({
                            content: post.content || post,
                            platform,
                            contentType: 'post',
                        });
                    }
                }
            }
        } catch (error) {
            console.error(`Error generating posts for ${platform}:`, error);
            // Re-throw the error so the API can return it to the client for debugging
            throw error;
        }
    }

    return posts;
}

export async function generateSinglePost({
    analysis,
    platform,
    topic,
}: {
    analysis: AnalysisData;
    platform: string;
    topic?: string;
}): Promise<string> {
    const limit = PLATFORM_LIMITS[platform as keyof typeof PLATFORM_LIMITS] || 500;
    const style = PLATFORM_STYLES[platform as keyof typeof PLATFORM_STYLES] || 'professional';

    const prompt = `Generate a single ${platform} post.
Topic: ${topic || 'Promote the product/service'}
Max ${limit} characters.
Style: ${style}
Based on: ${analysis.generated_copy?.value_props?.[0] || 'marketing content'}

Return only the post text, nothing else.`;

    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 300,
    });

    return response.choices[0]?.message?.content || '';
}
