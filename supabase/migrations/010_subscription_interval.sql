-- supabase/migrations/010_subscription_interval.sql
-- Add billing interval to subscriptions table

CREATE TYPE billing_interval AS ENUM ('month', 'year');

ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS interval billing_interval DEFAULT 'month' NOT NULL;

-- Update existing subscriptions (default to month)
UPDATE subscriptions SET interval = 'month' WHERE interval IS NULL;
