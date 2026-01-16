-- supabase/migrations/007_usage_increment_rpc.sql
-- Function to atomically increment analysis usage

CREATE OR REPLACE FUNCTION increment_analysis_usage(user_id_param UUID)
RETURNS VOID AS $$
BEGIN
    INSERT INTO usage_tracking (user_id, analyses_count, analyses_this_month, updated_at)
    VALUES (user_id_param, 1, 1, NOW())
    ON CONFLICT (user_id)
    DO UPDATE SET
        analyses_count = usage_tracking.analyses_count + 1,
        analyses_this_month = usage_tracking.analyses_this_month + 1,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
