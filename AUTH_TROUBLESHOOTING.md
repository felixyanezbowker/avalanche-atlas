# Authentication Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: Email/Password Sign Up Not Working

**Possible Causes:**

1. **Email confirmation required**
   - Supabase may require email confirmation before login
   - Check Supabase Dashboard → Authentication → Settings
   - Look for "Enable email confirmations" setting

2. **Check browser console for errors**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Look for red error messages
   - Share the error message

3. **Environment variables**
   - Verify `.env.local` has correct values
   - `NEXT_PUBLIC_SUPABASE_URL` should match your project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` should be the anon/public key

### Issue 2: Gmail OAuth Not Working

**Possible Causes:**

1. **Google OAuth not configured**
   - Go to Supabase Dashboard → Authentication → Providers
   - Check if Google provider is enabled
   - Verify Client ID and Secret are set

2. **Redirect URL mismatch**
   - Supabase Dashboard → Authentication → URL Configuration
   - Add Site URL: `http://localhost:3001`
   - Add Redirect URL: `http://localhost:3001/auth/callback`

3. **Google Cloud Console redirect URI**
   - Must be: `https://nfvmwjkrfigdojbjexkv.supabase.co/auth/v1/callback`

### Issue 3: "Error 403: org_internal" When Signing In with Gmail

**Problem:**
You see the error message: "avalanche-atlas is restricted to users within its organization - Error 403: org_internal"

**Cause:**
The OAuth consent screen in Google Cloud Console is set to "Internal" user type, which only allows users from your Google Workspace organization to sign in.

**Solution:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** → **OAuth consent screen**
4. Under **User Type**, change from **Internal** to **External**
5. Click **Save and Continue**
6. Complete any required fields:
   - **App name**: Your application name (e.g., "Avalanche Atlas")
   - **Support email**: Your email address
   - **Developer contact information**: Your email address
7. Click **Save and Continue** through any additional screens
8. Save the changes

**After making this change:**
- Try signing in with Gmail again
- The error should be resolved and any Google account should be able to sign in

**Note**: 
- If you're using a Google Workspace account, you may need to verify your app domain or add test users during development
- For production apps, you may need to submit your app for verification if you're requesting sensitive scopes

### Issue 4: "Legacy API keys are disabled" When Signing In with Gmail

**Problem:**
You see the error message: "Legacy API keys are disabled"

**Cause:**
This error occurs when your Google Cloud project has restrictions blocking legacy APIs or when API restrictions on your OAuth client are misconfigured. It can also happen if you're trying to use deprecated APIs like Google+ API.

**Solution:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID (the one you're using for Supabase)
5. Check the **API restrictions** section:
   - If set to **Restrict key**, make sure no APIs are blocking OAuth authentication
   - **Recommended**: Change to **Don't restrict key** for OAuth clients (this is safe for OAuth 2.0)
6. Also check **Application restrictions**:
   - Make sure they're not blocking your OAuth flow
   - If set to "HTTP referrers", ensure your Supabase callback URL is included
7. Click **Save**
8. **Important**: You do NOT need to enable Google+ API (it's deprecated). Google OAuth 2.0 works without it

**After making this change:**
- Wait a few minutes for changes to propagate
- Try signing in with Gmail again
- The error should be resolved

**Note**: 
- If you still see the error, try creating a new OAuth 2.0 Client ID with no API restrictions
- Make sure you're not enabling any deprecated APIs in your project

## Quick Fixes

### Fix 1: Disable Email Confirmation (For Testing)

1. Go to Supabase Dashboard
2. Authentication → Settings
3. Find "Enable email confirmations"
4. **Disable it** (for development/testing)
5. Try signing up again

### Fix 2: Check Supabase URL Configuration

1. Supabase Dashboard → Authentication → URL Configuration
2. Site URL: `http://localhost:3001`
3. Redirect URLs: Add `http://localhost:3001/auth/callback`
4. Save

### Fix 3: Verify Environment Variables

Check your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://nfvmwjkrfigdojbjexkv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (should start with eyJ)
```

**Important**: 
- No trailing slashes
- Must start with `https://`
- Anon key should be a long JWT token

### Fix 4: Check Browser Console

1. Open DevTools (F12)
2. Console tab
3. Try signing in
4. Look for errors like:
   - "Invalid API key"
   - "Network error"
   - "Redirect URI mismatch"

## Step-by-Step Debugging

### Step 1: Check Environment Variables

Run this in your terminal to verify (don't show the actual values):

```bash
# Check if env vars are loaded
echo $NEXT_PUBLIC_SUPABASE_URL
```

Or check `.env.local` file directly.

### Step 2: Test Supabase Connection

Open browser console and try:

```javascript
// This should work if Supabase is configured
const { createClient } = require('@supabase/supabase-js');
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
```

### Step 3: Check Supabase Dashboard

1. Go to Supabase Dashboard → Authentication → Users
2. Try signing up
3. Check if a user appears (even if unconfirmed)
4. This confirms Supabase is receiving the request

### Step 4: Check Network Tab

1. Open DevTools → Network tab
2. Try signing in
3. Look for requests to `supabase.co`
4. Check if they return 200 (success) or error codes

## What Error Messages Mean

- **"Invalid API key"**: Wrong `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **"Email not confirmed"**: Need to disable email confirmation or check email
- **"Invalid login credentials"**: Wrong email/password or user doesn't exist
- **"Redirect URI mismatch"**: OAuth redirect URL not configured correctly
- **"Network error"**: Can't reach Supabase (check URL)
- **"Error 403: org_internal"**: OAuth consent screen is set to "Internal" - change to "External" in Google Cloud Console
- **"Legacy API keys are disabled"**: API restrictions on OAuth client are blocking authentication - check API restrictions in Google Cloud Console and set to "Don't restrict key"

## Still Not Working?

Share:
1. The exact error message from the login page
2. Any errors from browser console (F12 → Console)
3. What happens when you click "Sign Up" or "Sign in with Gmail"
   - Does it show an error?
   - Does nothing happen?
   - Does it redirect somewhere?


