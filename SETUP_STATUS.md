# Supabase Setup Status

## ✅ Completed Steps

### 1. Database Schema Policies
- ✅ Database tables created (`avalanches`, `comments`)
- ✅ Enums created (`slope_aspect`, `trigger_type`)
- ✅ Indexes created for performance
- ✅ Row Level Security (RLS) policies enabled and configured
  - Public read access for avalanches and comments
  - Authenticated users can insert
  - Users can update/delete their own records
  - Admin access configured

### 2. Environment Variables
- ✅ `.env.local` file exists
- ⚠️ **Action Required**: Verify the following variables are set:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `DATABASE_URL`

### 3. Development Server
- ✅ Dev server started (`npm run dev`)
- ⚠️ **Action Required**: Verify server is running at `http://localhost:3000` (or `http://localhost:3001` if configured)

## ⏳ Manual Steps Required

### Storage Bucket Setup (Required for Photo Uploads)

**Status**: ⏳ Pending

**Steps to Complete**:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Storage**
4. Click **"New bucket"**
5. Configure the bucket:
   - **Name**: `avalanche-photos` (must match exactly)
   - **Public**: Toggle ON (make it public)
   - Click **"Create bucket"**

6. Add Storage Policies:
   - Go to the **Policies** tab for the `avalanche-photos` bucket
   
   **Policy 1: Public Read Access**
   - Policy name: `Public read access`
   - Allowed operation: `SELECT`
   - Policy definition: `true`
   - Click **Save**
   
   **Policy 2: Authenticated Upload**
   - Policy name: `Authenticated upload`
   - Allowed operation: `INSERT`
   - Policy definition: `auth.role() = 'authenticated'`
   - Click **Save**

**Why This Is Required**: 
- Photo uploads will fail without this bucket
- The application code references `avalanche-photos` bucket in `src/actions/avalanches.ts`
- Without public read access, uploaded photos won't be viewable

## 🧪 Testing Checklist

Once storage bucket is set up, test the following:

- [ ] **Home Page**: Visit `http://localhost:3000` (or configured port)
  - Should show navigation bar
  - Should show "Recent Avalanches" heading
  - Should show empty state or existing reports

- [ ] **Authentication**: 
  - Click "Sign In" in navigation
  - Create account with email/password
  - Verify login works

- [ ] **Submit Report**:
  - Click "Submit Report" button
  - Fill out the form with test data
  - Upload a photo (optional)
  - Submit and verify redirect to home page
  - Verify new report appears in list

- [ ] **View Report Details**:
  - Click on a report card
  - Verify all fields display correctly
  - Verify photo displays (if uploaded)

- [ ] **Comments**:
  - Add a comment to a report
  - Verify comment appears
  - Test comment search functionality

- [ ] **Edit Report**:
  - Edit your own report
  - Verify changes save correctly

## 📝 Next Steps

1. **Complete Storage Bucket Setup** (see above)
2. **Verify Environment Variables** are correctly set in `.env.local`
3. **Test Application** using the checklist above
4. **Optional**: Configure Google OAuth (see `OAUTH_SETUP.md`)

## 🐛 Troubleshooting

### "Photo upload failed"
- Verify `avalanche-photos` bucket exists
- Verify bucket is set to Public
- Verify storage policies are configured correctly

### "Missing Supabase environment variables"
- Check `.env.local` file exists
- Verify all required variables are set
- Restart dev server after adding variables

### "Error loading avalanche reports"
- Verify database tables exist in Supabase Dashboard
- Check `DATABASE_URL` is correct
- Verify RLS policies allow public read access

### Server not starting
- Check if port 3000 (or configured port) is already in use
- Verify Node.js and npm are installed
- Check for syntax errors in code

## 📚 Reference Files

- `SETUP_INSTRUCTIONS.md` - Detailed setup guide
- `database-setup.sql` - Database schema SQL
- `OAUTH_SETUP.md` - Google OAuth configuration
- `AUTH_TROUBLESHOOTING.md` - Authentication troubleshooting

