-- g:\Desktop\letsmarket\supabase\migrations\006_fix_recursion.sql
-- Fix infinite recursion in team_members and organizations policies

-- 1. Drop the problematic policies
DROP POLICY IF EXISTS "Members can view their teammates" ON team_members;
DROP POLICY IF EXISTS "Users can view their own organizations" ON organizations;
DROP POLICY IF EXISTS "Shared team websites access" ON websites;
DROP POLICY IF EXISTS "Shared team campaigns access" ON campaigns;

-- 2. Create a security definer function to break recursion
-- This function will run with the privileges of the creator (bypass RLS)
CREATE OR REPLACE FUNCTION get_my_orgs()
RETURNS SETOF UUID AS $$
    SELECT org_id FROM team_members WHERE user_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- 3. Organizations: Fix recursion
CREATE POLICY "Users can view organizations"
    ON organizations FOR SELECT
    USING (
        owner_id = auth.uid() OR
        id IN (SELECT get_my_orgs())
    );

-- 4. Team Members: Fix recursion
CREATE POLICY "Users can view team_members"
    ON team_members FOR SELECT
    USING (
        user_id = auth.uid() OR
        org_id IN (SELECT get_my_orgs()) OR
        EXISTS (
            SELECT 1 FROM organizations
            WHERE id = team_members.org_id
            AND owner_id = auth.uid()
        )
    );

-- 5. Shared Access for Websites and Campaigns
CREATE POLICY "Shared team websites access"
    ON websites FOR SELECT
    USING (
        org_id IS NOT NULL AND (
            org_id IN (SELECT get_my_orgs()) OR
            EXISTS (SELECT 1 FROM organizations WHERE id = websites.org_id AND owner_id = auth.uid())
        )
    );

CREATE POLICY "Shared team campaigns access"
    ON campaigns FOR SELECT
    USING (
        org_id IS NOT NULL AND (
            org_id IN (SELECT get_my_orgs()) OR
            EXISTS (SELECT 1 FROM organizations WHERE id = campaigns.org_id AND owner_id = auth.uid())
        )
    );
