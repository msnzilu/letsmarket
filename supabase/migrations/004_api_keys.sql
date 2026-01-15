-- supabase/migrations/004_api_keys.sql
-- API Key management for Enterprise users

CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    key_hash TEXT NOT NULL, -- SHA-256 hash of the key
    key_prefix TEXT NOT NULL, -- First 8 characters for display (e.g. lm_live_...)
    name TEXT NOT NULL,
    last_used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    UNIQUE(key_hash)
);

-- Index for searching by hash
CREATE INDEX idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);

-- RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own API keys"
    ON api_keys FOR ALL
    USING (auth.uid() = user_id);

-- Function to verify API key and get user
CREATE OR REPLACE FUNCTION verify_api_key(provided_hash TEXT)
RETURNS TABLE(user_id UUID, plan TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT ak.user_id, s.plan::TEXT
    FROM api_keys ak
    JOIN subscriptions s ON s.user_id = ak.user_id
    WHERE ak.key_hash = provided_hash
    AND (ak.expires_at IS NULL OR ak.expires_at > NOW())
    AND s.status IN ('active', 'trialing');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
