-- supabase/migrations/009_generic_payment_fields.sql
-- Genericize payment fields for multi-provider support

-- Update subscriptions table
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'paystack';
ALTER TABLE subscriptions RENAME COLUMN paystack_customer_id TO provider_customer_id;
ALTER TABLE subscriptions RENAME COLUMN paystack_subscription_code TO provider_subscription_id;
ALTER TABLE subscriptions RENAME COLUMN paystack_plan_code TO provider_plan_id;

-- Update payment_history table
ALTER TABLE payment_history ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'paystack';
ALTER TABLE payment_history RENAME COLUMN paystack_reference TO provider_reference;

-- Add index for provider search if needed
CREATE INDEX IF NOT EXISTS idx_subscriptions_provider ON subscriptions(provider);
CREATE INDEX IF NOT EXISTS idx_payment_history_provider ON payment_history(provider);

-- Update existing records to explicitly set provider if they have IDs
UPDATE subscriptions SET provider = 'paystack' WHERE provider_customer_id IS NOT NULL;
UPDATE payment_history SET provider = 'paystack' WHERE provider_reference IS NOT NULL;
