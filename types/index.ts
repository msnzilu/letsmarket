// types/index.ts

export interface PrincipleScore {
    name: string;
    score: number;
    explanation: string;
    examples: string[];
    missing: string[];
}

export interface PrincipleScores {
    socialProof: PrincipleScore;
    lossAversion: PrincipleScore;
    authority: PrincipleScore;
    scarcity: PrincipleScore;
    cognitiveEase: PrincipleScore;
    pricingPsychology: PrincipleScore;
}

export interface GeneratedCopy {
    headlines: HeadlineVariation[];
    ctas: CTAVariation[];
    valueProps: ValueProp[];
    painPoints: PainPoint[];
    postDrafts: PostDraft[];
}

export interface ValueProp {
    copy: string;
    description: string;
}

export interface PainPoint {
    copy: string;
    description: string;
}

export interface PostDraft {
    copy: string;
    platform: string;
}

export interface HeadlineVariation {
    copy: string;
    principle: string;
    impactScore: number;
    difficulty: 'easy' | 'medium' | 'hard';
}

export interface CTAVariation {
    copy: string;
    principle: string;
    impactScore: number;
    difficulty: 'easy' | 'medium' | 'hard';
}

export interface Recommendation {
    title: string;
    description: string;
    principle: string;
    impactScore: number;
    difficulty: 'easy' | 'medium' | 'hard';
    implementation: string;
}

export interface Analysis {
    id: string;
    website_id: string;
    overall_score: number;
    principle_scores: PrincipleScores;
    generated_copy: GeneratedCopy;
    recommendations: Recommendation[];
    created_at: string;
}

export interface Website {
    id: string;
    user_id: string;
    url: string;
    created_at: string;
    updated_at: string;
    analyses?: Analysis[];
}

export interface User {
    id: string;
    email: string;
}

// Social Media Types
export type Platform = 'facebook' | 'instagram' | 'x' | 'linkedin' | 'tiktok' | 'reddit' | 'threads';

export type PostStatus = 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed';

export type CopyType = 'headline' | 'cta' | 'custom';

export interface SocialConnection {
    id: string;
    user_id: string;
    platform: Platform;
    platform_user_id: string;
    access_token: string;
    refresh_token?: string;
    token_expires_at?: string;
    account_name?: string;
    account_username?: string;
    account_avatar?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ScheduledPost {
    id: string;
    user_id: string;
    analysis_id?: string;
    connection_id: string;
    content: string;
    copy_type?: CopyType;
    media_url?: string;
    scheduled_for?: string;
    published_at?: string;
    status: PostStatus;
    platform_post_id?: string;
    platform_post_url?: string;
    error_message?: string;
    created_at: string;
    // Joined data
    connection?: SocialConnection;
}

// Platform metadata for UI
export const PLATFORM_CONFIG: Record<Platform, {
    name: string;
    icon: string;
    color: string;
    maxLength: number;
    supportsMedia: boolean;
}> = {
    facebook: { name: 'Facebook', icon: 'facebook', color: '#1877F2', maxLength: 63206, supportsMedia: true },
    instagram: { name: 'Instagram', icon: 'instagram', color: '#E4405F', maxLength: 2200, supportsMedia: true },
    x: { name: 'X', icon: 'twitter', color: '#000000', maxLength: 280, supportsMedia: true },
    linkedin: { name: 'LinkedIn', icon: 'linkedin', color: '#0A66C2', maxLength: 3000, supportsMedia: true },
    tiktok: { name: 'TikTok', icon: 'music', color: '#000000', maxLength: 2200, supportsMedia: true },
    reddit: { name: 'Reddit', icon: 'message-circle', color: '#FF4500', maxLength: 40000, supportsMedia: true },
    threads: { name: 'Threads', icon: 'at-sign', color: '#000000', maxLength: 500, supportsMedia: true },
};

export interface Campaign {
    id: string;
    user_id: string;
    name: string;
    description?: string;
    analysis_id: string;
    website_id: string;
    status: 'draft' | 'active' | 'paused' | 'completed';
    schedule_type: 'daily' | 'weekly';
    schedule_days: number[];
    schedule_time: string;
    posts_per_week: number;
    positioning_focus?: string;
    created_at: string;
    next_post_at?: string;
}
