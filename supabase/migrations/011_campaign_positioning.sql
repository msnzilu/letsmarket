-- Add positioning_focus column to campaigns table
ALTER TABLE campaigns 
ADD COLUMN positioning_focus TEXT;

COMMENT ON COLUMN campaigns.positioning_focus IS 'Optional focus/angle for the campaign content (e.g., Educational, Promotional)';
