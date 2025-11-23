-- Avalanche Atlas Database Setup
-- Run this in Supabase Dashboard → SQL Editor

-- Step 1: Create enums
-- Note: If these types already exist, the error will be caught and ignored
DO $$ BEGIN
  CREATE TYPE slope_aspect AS ENUM ('N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE trigger_type AS ENUM ('natural', 'accidental', 'remote', 'unknown');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Step 2: Create avalanches table
CREATE TABLE IF NOT EXISTS avalanches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reported_at TIMESTAMPTZ NOT NULL,
  location_name TEXT,
  region TEXT NOT NULL,
  elevation_m INTEGER,
  slope_aspect slope_aspect NOT NULL,
  avalanche_size INTEGER NOT NULL,
  avalanche_size_label TEXT,
  trigger_type trigger_type NOT NULL,
  map_url TEXT,
  photo_url TEXT,
  additional_comments TEXT,
  reporter_id UUID NOT NULL REFERENCES auth.users(id),
  reporter_name TEXT,
  is_public BOOLEAN NOT NULL DEFAULT true
);

-- Step 3: Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  avalanche_id UUID NOT NULL REFERENCES avalanches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_public BOOLEAN NOT NULL DEFAULT true
);

-- Step 4: Create indexes
CREATE INDEX IF NOT EXISTS idx_comments_avalanche_id ON comments(avalanche_id);
CREATE INDEX IF NOT EXISTS idx_avalanches_reported_at ON avalanches(reported_at DESC);
CREATE INDEX IF NOT EXISTS idx_avalanches_is_public ON avalanches(is_public);

-- Step 5: Enable Row Level Security
ALTER TABLE avalanches ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Step 6: Create RLS policies for avalanches
-- Public read access
CREATE POLICY "Public can view public avalanches"
  ON avalanches FOR SELECT
  USING (is_public = true);

-- Authenticated users can insert
CREATE POLICY "Authenticated users can insert avalanches"
  ON avalanches FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Users can update their own avalanches (or admins)
CREATE POLICY "Users can update own avalanches"
  ON avalanches FOR UPDATE
  USING (
    auth.uid() = reporter_id 
    OR auth.jwt() ->> 'email' LIKE '%admin%'
  );

-- Users can delete their own avalanches (or admins)
CREATE POLICY "Users can delete own avalanches"
  ON avalanches FOR DELETE
  USING (
    auth.uid() = reporter_id 
    OR auth.jwt() ->> 'email' LIKE '%admin%'
  );

-- Step 7: Create RLS policies for comments
-- Public read access
CREATE POLICY "Public can view public comments"
  ON comments FOR SELECT
  USING (is_public = true);

-- Authenticated users can insert
CREATE POLICY "Authenticated users can insert comments"
  ON comments FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Users can update their own comments
CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  USING (auth.uid() = user_id);
