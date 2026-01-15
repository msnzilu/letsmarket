-- supabase/migrations/005_teams.sql
-- Team Collaboration for Enterprise users

-- Organizations (Teams)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    branding JSONB DEFAULT '{}'::jsonb, -- White-label settings
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team Members
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(org_id, user_id)
);

-- Add org_id to existing tables (optional but recommended for shared resources)
ALTER TABLE websites ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id) ON DELETE SET NULL;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id) ON DELETE SET NULL;

-- RLS for Organizations
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own organizations"
    ON organizations FOR SELECT
    USING (
        owner_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM team_members WHERE org_id = organizations.id AND user_id = auth.uid())
    );

-- RLS for Team Members
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view their teammates"
    ON team_members FOR SELECT
    USING (EXISTS (SELECT 1 FROM team_members tm WHERE tm.org_id = team_members.org_id AND tm.user_id = auth.uid()));

-- Update RLS for Websites and Campaigns to support teams
CREATE POLICY "Shared team websites access"
    ON websites FOR SELECT
    USING (org_id IS NOT NULL AND EXISTS (SELECT 1 FROM team_members WHERE org_id = websites.org_id AND user_id = auth.uid()));

CREATE POLICY "Shared team campaigns access"
    ON campaigns FOR SELECT
    USING (org_id IS NOT NULL AND EXISTS (SELECT 1 FROM team_members WHERE org_id = campaigns.org_id AND user_id = auth.uid()));
