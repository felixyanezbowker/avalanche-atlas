# Legacy API Keys Fix - Implementation Complete

## Changes Made

1. ✅ Updated `@supabase/ssr` from `^0.1.0` to `^0.5.0` in `package.json`
2. ✅ Verified browser client implementation is correct (no cookie config needed for browser)
3. ✅ Server-side clients already properly configured with cookie handling

## Critical Next Steps

### 1. Install Updated Dependencies

```bash
npm install
```

This will install the updated `@supabase/ssr` package (v0.5.0+) which properly supports Supabase's new API key system.

### 2. Verify API Keys in Supabase Dashboard

**IMPORTANT**: Supabase has migrated to new API key formats:

- **❌ Legacy format (DISABLED)**: `eyJ...` (JWT tokens starting with `eyJ`)
- **✅ New format (REQUIRED)**: 
  - `sb_publishable_...` (publishable/anonymous keys)
  - `sb_secret_...` (secret/service role keys)

**Steps to verify:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **API**
4. Look for **Project API keys** section
5. You should see:
   - **Publishable key** (starts with `sb_publishable_...`)
   - **Secret key** (starts with `sb_secret_...`)

**If you see "anon" and "service_role" keys**, those are legacy and will cause the error.

### 3. Update `.env.local` File

Update your `.env.local` file with the **new** API keys:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...  # NEW FORMAT - starts with sb_publishable_
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...  # NEW FORMAT - starts with sb_secret_
DATABASE_URL=postgresql://...
```

**DO NOT use** keys that start with `eyJ` - those are legacy and disabled.

### 4. Clear Build Cache

```bash
# Delete Next.js build cache
rm -rf .next

# Or on Windows:
# rmdir /s .next
```

### 5. Restart Dev Server

```bash
npm run dev
```

## Testing

After completing the above steps:

1. **Test Email/Password Signup**
   - Go to `/login`
   - Click "Don't have an account? Sign up"
   - Try creating an account
   - Should work without "Legacy API keys are disabled" error

2. **Test Google OAuth Signup**
   - Go to `/login`
   - Click "Sign in with Gmail"
   - Should redirect to Google and work without errors

## Troubleshooting

If you still see the error after these steps:

1. **Double-check API key format**:
   - Publishable key MUST start with `sb_publishable_`
   - Secret key MUST start with `sb_secret_`
   - If keys start with `eyJ`, they are legacy and won't work

2. **Verify environment variables are loaded**:
   - Check browser console (F12) → Network tab
   - Look for requests to Supabase
   - Check request headers to see which API key is being sent

3. **Check Supabase Dashboard**:
   - Ensure legacy API keys are disabled in your project settings
   - Verify new keys are active

4. **Clear browser cache**:
   - Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
   - Clear browser cookies for localhost

## Summary

The code changes are complete. The remaining issue is likely that your `.env.local` file still contains legacy API keys (`eyJ...` format). You must update them to the new format (`sb_publishable_...` and `sb_secret_...`) from your Supabase Dashboard.

