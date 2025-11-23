<!-- 01dfa14e-7eb7-4de2-b6b1-e20c1885da75 50cdead6-715b-4077-b9ef-4c25deaaff52 -->
# Fix Database Connection Error

## Problem

When submitting a report, getting error: "password authentication failed for user 'postgres'"

## Root Cause

The `DATABASE_URL` in `.env.local` contains an incorrect password. The connection string format is correct, but the password doesn't match what's configured in Supabase.

## Solution Steps

### 1. Get Correct Database Password from Supabase

- Go to [Supabase Dashboard](https://supabase.com/dashboard)
- Select your project
- Navigate to **Settings** → **Database**
- Look for **Connection string** or **Database password**
- If you don't see the password, you may need to reset it:
  - Click **Reset database password** (if available)
  - Copy the new password

### 2. Update DATABASE_URL in .env.local

The format should be:

```
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

Replace:

- `[PASSWORD]` with your actual database password from Supabase
- `[PROJECT-REF]` with your project reference (the part before `.supabase.co` in your project URL)

**Important**:

- URL-encode special characters in the password if needed (e.g., `@` becomes `%40`, `#` becomes `%23`)
- The password might contain special characters that need encoding

### 3. Alternative: Use Connection Pooling URL

Supabase also provides a connection pooling URL that might be more reliable:

- In Supabase Dashboard → Settings → Database
- Look for **Connection pooling** section
- Use the **Transaction** or **Session** mode connection string
- Format: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`

### 4. Restart Dev Server

After updating `.env.local`:

- Stop the dev server (Ctrl+C)
- Restart with `pnpm dev`
- The new DATABASE_URL will be loaded

## Files to Modify

- `.env.local` - Update `DATABASE_URL` with correct password

## Verification

After fixing, test by:

1. Submitting a new avalanche report
2. Should work without password authentication error