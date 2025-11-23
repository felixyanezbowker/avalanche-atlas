# Quick Setup Instructions

Follow these steps to get Avalanche Atlas fully functional.

## Step 1: Database Setup (Required - 10 minutes)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor**
4. Open the file `database-setup.sql` in this repository
5. Copy and paste the entire SQL script into the SQL Editor
6. Click **Run** (or press Ctrl+Enter)
7. Verify success - you should see "Success. No rows returned"

This creates:
- Database tables (`avalanches`, `comments`)
- Enums (`slope_aspect`, `trigger_type`)
- Indexes for performance
- Row Level Security (RLS) policies

## Step 2: Storage Setup (Required - 3 minutes)

1. In Supabase Dashboard, go to **Storage**
2. Click **New bucket**
3. Name: `avalanche-photos`
4. Set to **Public** (toggle switch)
5. Click **Create bucket**
6. Go to **Policies** tab for the bucket
7. Add policy:
   - Policy name: "Public read access"
   - Allowed operation: SELECT
   - Policy definition: `true` (allows public read)
8. Add another policy:
   - Policy name: "Authenticated upload"
   - Allowed operation: INSERT
   - Policy definition: `auth.role() = 'authenticated'`

## Step 3: Verify Environment Variables

Make sure your `.env.local` file has all required variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://nfvmwjkrfigdojbjexkv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=postgresql://postgres:password@db.nfvmwjkrfigdojbjexkv.supabase.co:5432/postgres
```

## Step 4: Test the Application

1. Make sure your dev server is running: `npm run dev`
2. Visit `http://localhost:3001`
3. You should see:
   - Navigation bar with "Submit Report" button
   - "Recent Avalanches" heading
   - Either a list of avalanches or "No avalanche reports yet" message

## Step 5: Test Authentication (Optional)

1. Click "Sign In" in the navigation
2. Try creating an account with email/password
3. Or configure Google OAuth (see `OAUTH_SETUP.md`)

## Step 6: Test Submit Functionality

1. Sign in to your account
2. Click "Submit Report"
3. Fill out the form with test data
4. Upload a photo (optional)
5. Submit
6. You should be redirected to home page and see your new report

## Troubleshooting

### "Error loading avalanche reports"
- Check that database tables were created successfully
- Verify `DATABASE_URL` in `.env.local` is correct
- Check Supabase Dashboard → Database → Tables to see if tables exist

### "Photo upload failed"
- Verify storage bucket `avalanche-photos` exists
- Check bucket is set to Public
- Verify storage policies are set correctly

### "User must be authenticated"
- Make sure you're signed in
- Check that RLS policies allow authenticated users to insert

### Authentication not working
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Check browser console for errors
- Verify Supabase Authentication is enabled in Dashboard

## Next Steps

Once everything is working:
- Test all features: view, submit, edit, comment
- Configure Google OAuth for easier login (optional)
- Customize styling if needed
- Deploy to production when ready





