# Authentication Fix Guide

## Issue: Sign-Up and Google OAuth Not Working

This guide will help you fix both sign-up and Google OAuth authentication issues.

## Fix 1: Sign-Up Issues

### Problem
Sign-up may not work if email confirmation is required in Supabase.

### Solution

**Option A: Disable Email Confirmation (Recommended for Development)**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Settings**
4. Find **"Enable email confirmations"**
5. **Disable it** (toggle OFF)
6. Save changes
7. Try signing up again

**Option B: Keep Email Confirmation Enabled**

If you want to keep email confirmation enabled:
1. After signing up, check your email inbox
2. Look for a confirmation email from Supabase
3. Click the confirmation link
4. Then try signing in

### Additional Checks

1. **Verify Site URL in Supabase**:
   - Go to **Authentication** → **URL Configuration**
   - Set **Site URL** to: `http://localhost:3001` (or your dev port)
   - Add to **Redirect URLs**: `http://localhost:3001/auth/callback`
   - Save

2. **Check Browser Console**:
   - Open DevTools (F12)
   - Check Console tab for errors
   - Share any error messages you see

## Fix 2: Google OAuth Issues

### Problem
Google OAuth requires configuration in both Supabase and Google Cloud Console.

### Solution

**Step 1: Configure Supabase**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Find **Google** and click to configure
5. **Enable** the Google provider (toggle ON)
6. You'll need to add:
   - **Client ID** (from Google Cloud Console)
   - **Client Secret** (from Google Cloud Console)

**Step 2: Configure Google Cloud Console**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. **Configure OAuth Consent Screen** (do this first):
   - Go to **APIs & Services** → **OAuth consent screen**
   - Under **User Type**, select **External** (not Internal)
   - Click **Save and Continue**
   - Complete required fields (App name, Support email, etc.)
   - Save the changes
4. Create OAuth Credentials:
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Name: "Avalanche Atlas" (or any name)
   - **Authorized redirect URIs**: Add this EXACT URL:
     ```
     https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
     ```
     Replace `YOUR_PROJECT_REF` with your actual Supabase project reference (found in your Supabase URL)
   - Click **Create**
5. Copy the **Client ID** and **Client Secret**
6. Paste them into Supabase Dashboard → Authentication → Providers → Google

**Step 3: Configure Supabase Redirect URLs**

1. In Supabase Dashboard → **Authentication** → **URL Configuration**
2. **Site URL**: `http://localhost:3001` (or your dev port)
3. **Redirect URLs**: Add:
   ```
   http://localhost:3001/auth/callback
   ```
4. Save

**Step 4: Test**

1. Restart your dev server: `npm run dev`
2. Go to `http://localhost:3001/login`
3. Click "Sign in with Gmail"
4. You should be redirected to Google
5. After authentication, you'll be redirected back to your app

### Common Google OAuth Errors

**"Redirect URI mismatch"**
- Check that the redirect URI in Google Cloud Console matches EXACTLY: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
- No trailing slashes
- Must use `https://` (not `http://`)

**"OAuth client not found"**
- Verify Client ID and Secret are correct in Supabase
- Make sure you copied them from the correct Google Cloud project

**"Invalid redirect"**
- Check Supabase → Authentication → URL Configuration
- Make sure `http://localhost:3001/auth/callback` is in the Redirect URLs list

**"Error 403: org_internal"**
- This error occurs when the OAuth consent screen is set to "Internal" user type, which restricts access to only users within your Google Workspace organization
- **Fix**: 
  1. Go to [Google Cloud Console](https://console.cloud.google.com/)
  2. Select your project
  3. Navigate to **APIs & Services** → **OAuth consent screen**
  4. Under **User Type**, change from **Internal** to **External**
  5. Click **Save and Continue**
  6. Complete any required fields (App name, Support email, etc.)
  7. Save the changes
- **Note**: If you're using a Google Workspace account, you may need to verify your app domain or add test users during development

**"Legacy API keys are disabled"**
- This error occurs when your Google Cloud project has restrictions blocking legacy APIs or when API restrictions are misconfigured
- **Fix**:
  1. Go to [Google Cloud Console](https://console.cloud.google.com/)
  2. Select your project
  3. Navigate to **APIs & Services** → **Credentials**
  4. Click on your OAuth 2.0 Client ID
  5. Under **API restrictions**, check the current setting:
     - If set to **Restrict key**, make sure no APIs are blocking OAuth authentication, OR
     - Change to **Don't restrict key** (recommended for OAuth clients)
  6. Click **Save**
  7. Also verify **Application restrictions** - make sure they're not blocking your OAuth flow
  8. **Important**: You do NOT need to enable Google+ API (it's deprecated). Google OAuth 2.0 works without it

## Quick Checklist

- [ ] Supabase email confirmation disabled (for dev) OR email confirmation working
- [ ] Supabase Site URL set to `http://localhost:3001`
- [ ] Supabase Redirect URL includes `http://localhost:3001/auth/callback`
- [ ] Google OAuth provider enabled in Supabase
- [ ] Google Cloud Console OAuth credentials created
- [ ] Google Cloud Console redirect URI set to `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
- [ ] Client ID and Secret added to Supabase
- [ ] Dev server restarted after changes

## Testing

1. **Test Sign-Up**:
   - Go to `/login`
   - Click "Don't have an account? Sign up"
   - Enter email and password
   - Click "Sign Up"
   - Should either sign you in immediately OR show message to check email

2. **Test Google OAuth**:
   - Go to `/login`
   - Click "Sign in with Gmail"
   - Should redirect to Google login
   - After login, should redirect back to your app

## Still Not Working?

1. **Check Browser Console** (F12 → Console tab)
   - Look for red error messages
   - Share the exact error message

2. **Check Terminal Output**
   - Look for server errors
   - Share any error messages

3. **Verify Environment Variables**
   - Check `.env.local` has correct values:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
     ```
   - No trailing slashes
   - Must start with `https://`

4. **Check Supabase Dashboard**
   - Go to Authentication → Users
   - See if sign-up attempts are being logged
   - Check for any error messages

