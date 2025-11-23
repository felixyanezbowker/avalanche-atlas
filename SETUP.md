# Setup Guide for Avalanche Atlas

## Database Setup

### 1. Create Tables

Run the Drizzle migrations or manually create the tables:

```sql
-- Create enums
CREATE TYPE slope_aspect AS ENUM ('N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW');
CREATE TYPE trigger_type AS ENUM ('natural', 'accidental', 'remote', 'unknown');

-- Create avalanches table
CREATE TABLE avalanches (
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

-- Create comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  avalanche_id UUID NOT NULL REFERENCES avalanches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_public BOOLEAN NOT NULL DEFAULT true
);

-- Create indexes
CREATE INDEX idx_comments_avalanche_id ON comments(avalanche_id);
CREATE INDEX idx_avalanches_reported_at ON avalanches(reported_at DESC);
CREATE INDEX idx_avalanches_is_public ON avalanches(is_public);
```

### 2. Set up Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE avalanches ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Public read access for avalanches
CREATE POLICY "Public can view public avalanches"
  ON avalanches FOR SELECT
  USING (is_public = true);

-- Authenticated users can insert avalanches
CREATE POLICY "Authenticated users can insert avalanches"
  ON avalanches FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Users can update their own avalanches
CREATE POLICY "Users can update own avalanches"
  ON avalanches FOR UPDATE
  USING (auth.uid() = reporter_id OR auth.jwt() ->> 'email' LIKE '%admin%');

-- Public read access for comments
CREATE POLICY "Public can view public comments"
  ON comments FOR SELECT
  USING (is_public = true);

-- Authenticated users can insert comments
CREATE POLICY "Authenticated users can insert comments"
  ON comments FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
```

### 3. Set up Storage

1. Go to Supabase Dashboard → Storage
2. Create a new bucket named `avalanche-photos`
3. Set it to **Public**
4. Configure policies:
   - Public read access
   - Authenticated users can upload

```sql
-- Storage policies (if using SQL)
CREATE POLICY "Public read access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avalanche-photos');

CREATE POLICY "Authenticated users can upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avalanche-photos' AND auth.role() = 'authenticated');
```

## Authentication Setup

### Google OAuth

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Google provider
3. Add your Google OAuth credentials:
   - Client ID
   - Client Secret
4. Add authorized redirect URL: `https://your-project.supabase.co/auth/v1/callback`

### Email/Password

Email/password authentication is enabled by default in Supabase.

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

## Running Migrations

If using Drizzle:

```bash
# Generate migrations from schema
npm run db:generate

# Push to database
npm run db:push

# Or use Drizzle Studio to inspect
npm run db:studio
```

## Testing the Setup

1. Start the dev server: `npm run dev`
2. Visit `http://localhost:3000`
3. Try submitting a report (you'll need to sign in first)
4. Check that photos upload correctly to Supabase Storage

