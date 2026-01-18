-- 008_ip_registration_limit.sql
-- Limit registration to one account per IP address

-- Table to track registration IPs
CREATE TABLE IF NOT EXISTS public.registration_ips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ip_address TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(ip_address)
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_registration_ips_ip ON public.registration_ips(ip_address);

-- Update the initialization function to include IP check
CREATE OR REPLACE FUNCTION public.initialize_user_subscription()
RETURNS TRIGGER AS $$
DECLARE
    headers JSON;
    user_ip TEXT;
BEGIN
    -- 1. Try to extract the IP address from request headers
    -- Supabase passes headers in the 'request.headers' setting
    BEGIN
        headers := current_setting('request.headers', true)::JSON;
        
        -- Try x-real-ip first, then x-forwarded-for
        user_ip := headers->>'x-real-ip';
        IF user_ip IS NULL THEN
            -- x-forwarded-for can be a list, take the first one
            user_ip := split_part(headers->>'x-forwarded-for', ',', 1);
        END IF;
        
        -- Trim any whitespace
        user_ip := trim(user_ip);
    EXCEPTION WHEN OTHERS THEN
        -- Fallback if headers cannot be parsed
        user_ip := NULL;
    END;

    -- 2. Enforce registration limit if IP is detected
    IF user_ip IS NOT NULL AND user_ip != '' THEN
        -- Check if this IP is already registered
        -- We use a subquery to avoid unique constraint violations in race conditions
        IF EXISTS (SELECT 1 FROM public.registration_ips WHERE ip_address = user_ip) THEN
            RAISE EXCEPTION 'Database error: Registration limit exceeded for this IP address.';
        END IF;

        -- Record the registration IP
        INSERT INTO public.registration_ips (user_id, ip_address)
        VALUES (NEW.id, user_ip);
    END IF;

    -- 3. Create free subscription
    INSERT INTO public.subscriptions (user_id, plan, status)
    VALUES (NEW.id, 'free'::subscription_plan, 'active'::subscription_status);
    
    -- 4. Create usage tracking
    INSERT INTO public.usage_tracking (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Ensure the trigger is still active (it should be from migration 002)
-- We don't need to recreate it if it already exists on auth.users
