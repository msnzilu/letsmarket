// lib/openai.ts

import OpenAI from 'openai';

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeWebsiteContent(content: string) {
    const systemPrompt = `You are a marketing psychology expert. Analyze the provided website content and score it on these 6 principles (0-100 each):

1. Social Proof: testimonials, user counts, case studies, logos
2. Loss Aversion: pain points, what they'll miss, costs of inaction  
3. Authority: credentials, years of experience, certifications, media mentions
4. Scarcity/Urgency: limited time, limited spots, countdown timers
5. Cognitive Ease: simple language, clear CTAs, easy to understand
6. Pricing Psychology: charm pricing ($99 not $100), anchoring, 3-tier structure

For each principle:
- Give a score 0-100
- Explain what's present and what's missing
- Provide specific examples from the content

Then generate:
- 5 headline variations (each using different psychology principle)
- 3 CTA variations
- Top 10 recommendations prioritized by impact

Return ONLY valid JSON with this exact structure:
{
  "overallScore": number,
  "principleScores": {
    "socialProof": {
      "name": "Social Proof",
      "score": number,
      "explanation": string,
      "examples": [string],
      "missing": [string]
    },
    "lossAversion": { same structure },
    "authority": { same structure },
    "scarcity": { same structure },
    "cognitiveEase": { same structure },
    "pricingPsychology": { same structure }
  },
  "generatedCopy": {
    "headlines": [
      {
        "copy": string,
        "principle": string,
        "impactScore": number (0-100),
        "difficulty": "easy" | "medium" | "hard"
      }
    ],
    "ctas": [
      {
        "copy": string,
        "principle": string,
        "impactScore": number,
        "difficulty": "easy" | "medium" | "hard"
      }
    ]
  },
  "recommendations": [
    {
      "title": string,
      "description": string,
      "principle": string,
      "impactScore": number,
      "difficulty": "easy" | "medium" | "hard",
      "implementation": string
    }
  ]
}`;

    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Analyze this website content:\n\n${content}` }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
    });

    const result = response.choices[0].message.content;
    return JSON.parse(result || '{}');
}