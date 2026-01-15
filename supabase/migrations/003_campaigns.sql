-- 003_campaigns.sql
-- Campaign automation tables

-- ============================================
-- Campaigns Table
-- ============================================
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Campaign details
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'draft' NOT NULL, -- draft, active, paused, completed
    
    -- Source for content generation
    analysis_id UUID REFERENCES analyses(id) ON DELETE SET NULL,
    website_id UUID REFERENCES websites(id) ON DELETE SET NULL,
    
    -- Schedule configuration (cron-like)
    schedule_type TEXT DEFAULT 'weekly' NOT NULL, -- daily, weekly, custom
    schedule_days INTEGER[] DEFAULT '{1}', -- 0=Sun, 1=Mon, etc
    schedule_time TIME DEFAULT '09:00:00' NOT NULL,
    schedule_timezone TEXT DEFAULT 'UTC' NOT NULL,
    
    -- Content settings
    content_types TEXT[] DEFAULT '{post}', -- post, thread, story
    posts_per_week INTEGER DEFAULT 3,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    next_post_at TIMESTAMPTZ,
    last_posted_at TIMESTAMPTZ
);

-- ============================================
-- Campaign Accounts (which social accounts to post to)
-- ============================================
CREATE TABLE IF NOT EXISTS campaign_accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    connection_id UUID NOT NULL REFERENCES social_connections(id) ON DELETE CASCADE,
    
    -- Platform-specific settings
    enabled BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    UNIQUE(campaign_id, connection_id)
);

-- ============================================
-- Campaign Posts (AI-generated posts)
-- ============================================
CREATE TABLE IF NOT EXISTS campaign_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    
    -- Content
    content TEXT NOT NULL,
    content_type TEXT DEFAULT 'post' NOT NULL,
    platform TEXT NOT NULL, -- linkedin, x, facebook, etc
    
    -- Status
    status TEXT DEFAULT 'pending' NOT NULL, -- pending, scheduled, published, failed
    scheduled_for TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    
    -- If published
    platform_post_id TEXT,
    platform_post_url TEXT,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    error_message TEXT
);

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_next_post ON campaigns(next_post_at);
CREATE INDEX idx_campaign_posts_campaign_id ON campaign_posts(campaign_id);
CREATE INDEX idx_campaign_posts_status ON campaign_posts(status);
CREATE INDEX idx_campaign_posts_scheduled ON campaign_posts(scheduled_for);

-- ============================================
-- Row Level Security
-- ============================================
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_posts ENABLE ROW LEVEL SECURITY;

-- Campaigns: users can manage their own
CREATE POLICY "Users can manage own campaigns"
    ON campaigns FOR ALL
    USING (auth.uid() = user_id);

-- Campaign accounts: users can manage via campaign ownership
CREATE POLICY "Users can manage campaign accounts"
    ON campaign_accounts FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM campaigns 
            WHERE campaigns.id = campaign_accounts.campaign_id 
            AND campaigns.user_id = auth.uid()
        )
    );

-- Campaign posts: users can view via campaign ownership
CREATE POLICY "Users can manage campaign posts"
    ON campaign_posts FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM campaigns 
            WHERE campaigns.id = campaign_posts.campaign_id 
            AND campaigns.user_id = auth.uid()
        )
    );

-- ============================================
-- Updated At Trigger
-- ============================================
CREATE TRIGGER update_campaigns_updated_at
    BEFORE UPDATE ON campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
