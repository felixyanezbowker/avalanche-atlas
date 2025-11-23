# Database URL Fix Guide

## Error
"Invalid format for user or db_name"

## Solution

The `DATABASE_URL` format needs to be exactly correct. Here's how to fix it:

### Step 1: Get Your Project Reference

Your project reference is the part before `.supabase.co` in your `NEXT_PUBLIC_SUPABASE_URL`.

For example, if your `NEXT_PUBLIC_SUPABASE_URL` is:
```
https://nfvmwjkrfigdojbjexkv.supabase.co
```

Then your project reference is: `nfvmwjkrfigdojbjexkv`

### Step 2: Format DATABASE_URL Correctly

Use this exact format in your `.env.local`:

```
DATABASE_URL=postgresql://postgres:p7UHjGbsvbWdk4l2@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

**Replace `[YOUR-PROJECT-REF]` with your actual project reference.**

### Example

If your project reference is `nfvmwjkrfigdojbjexkv`, your `DATABASE_URL` should be:

```
DATABASE_URL=postgresql://postgres:p7UHjGbsvbWdk4l2@db.nfvmwjkrfigdojbjexkv.supabase.co:5432/postgres
```

### Important Notes

1. **No spaces** around the `=` sign
2. **No quotes** around the connection string
3. The password is: `p7UHjGbsvbWdk4l2` (no encoding needed)
4. The format is: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
5. Make sure `[PROJECT-REF]` matches your actual project reference

### Step 3: Verify Your .env.local File

Your `.env.local` should look like this (with your actual values):

```env
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
DATABASE_URL=postgresql://postgres:p7UHjGbsvbWdk4l2@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

### Step 4: Restart Dev Server

After updating `.env.local`:
1. Stop the dev server (Ctrl+C in terminal)
2. Restart with `pnpm dev`
3. Try submitting a report again

## Alternative: Use Connection Pooling (If Direct Connection Fails)

If the direct connection still doesn't work, try using Supabase's connection pooling:

1. Go to Supabase Dashboard → Settings → Database
2. Find the **Connection pooling** section
3. Copy the **Transaction** mode connection string
4. Use that instead of the direct connection string

The pooling URL format is:
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

## Troubleshooting

If you still get errors:

1. **Double-check the project reference** - It must match exactly
2. **Verify no extra spaces or characters** in DATABASE_URL
3. **Check Supabase Dashboard** → Settings → Database for the exact connection string format
4. **Try the connection pooling URL** instead of direct connection

