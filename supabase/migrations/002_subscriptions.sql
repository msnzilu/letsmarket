-- 002_subscriptions.sql
-- Subscription and usage tracking tables

-- ============================================
-- Subscription Plans Enum
-- ============================================
CREATE TYPE subscription_plan AS ENUM ('free', 'pro', 'enterprise');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'trialing');

-- ============================================
-- Subscriptions Table
-- ============================================
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan subscription_plan DEFAULT 'free' NOT NULL,
    status subscription_status DEFAULT 'active' NOT NULL,
    
    -- Paystack fields
    paystack_customer_id TEXT,
    paystack_subscription_code TEXT,
    paystack_plan_code TEXT,
    
    -- Billing period
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    UNIQUE(user_id)
);

-- ============================================
-- Usage Tracking Table
-- ============================================
CREATE TABLE IF NOT EXISTS usage_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Usage counters
    analyses_count INTEGER DEFAULT 0 NOT NULL,
    analyses_this_month INTEGER DEFAULT 0 NOT NULL,
    posts_count INTEGER DEFAULT 0 NOT NULL,
    posts_this_month INTEGER DEFAULT 0 NOT NULL,
    
    -- Reset tracking
    month_reset_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    UNIQUE(user_id)
);

-- ============================================
-- Payment History Table
-- ============================================
CREATE TABLE IF NOT EXISTS payment_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Payment details
    amount INTEGER NOT NULL, -- in kobo/cents
    currency TEXT DEFAULT 'USD' NOT NULL,
    status TEXT NOT NULL, -- success, failed, pending
    
    -- Paystack fields
    paystack_reference TEXT UNIQUE,
    paystack_transaction_id TEXT,
    
    -- Metadata
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_usage_tracking_user_id ON usage_tracking(user_id);
CREATE INDEX idx_payment_history_user_id ON payment_history(user_id);

-- ============================================
-- Row Level Security
-- ============================================
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- Subscriptions: users can only read their own
CREATE POLICY "Users can view own subscription"
    ON subscriptions FOR SELECT
    USING (auth.uid() = user_id);

-- Usage: users can only read their own
CREATE POLICY "Users can view own usage"
    ON usage_tracking FOR SELECT
    USING (auth.uid() = user_id);

-- Payments: users can only read their own
CREATE POLICY "Users can view own payments"
    ON payment_history FOR SELECT
    USING (auth.uid() = user_id);

-- ============================================
-- Updated At Trigger
-- ============================================
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usage_tracking_updated_at
    BEFORE UPDATE ON usage_tracking
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Function: Initialize user subscription on signup
-- ============================================
CREATE OR REPLACE FUNCTION initialize_user_subscription()
RETURNS TRIGGER AS $$
BEGIN
    -- Create free subscription
    INSERT INTO public.subscriptions (user_id, plan, status)
    VALUES (NEW.id, 'free'::subscription_plan, 'active'::subscription_status);
    
    -- Create usage tracking
    INSERT INTO public.usage_tracking (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger on user creation
CREATE TRIGGER on_auth_user_created_subscription
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION initialize_user_subscription();
