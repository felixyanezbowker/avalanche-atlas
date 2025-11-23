# How to Get the Correct DATABASE_URL from Supabase

## Quick Fix

The DNS error means we need the exact connection string from your Supabase Dashboard.

### Steps:

1. **Go to Supabase Dashboard**
   - Visit https://supabase.com/dashboard
   - Select your project (`nfvmwjkrfigdojbjexkv`)

2. **Get Connection String**
   - Navigate to **Settings** → **Database**
   - Scroll down to **Connection string** section
   - You'll see options:
     - **URI** (direct connection)
     - **Connection pooling** (recommended)

3. **Copy the Connection String**
   - **Option A (Recommended)**: Use **Connection pooling** → **Transaction** mode
     - Click "Copy" next to the connection string
     - It will look like: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`
   
   - **Option B**: Use **URI** (direct connection)
     - Click "Copy" next to the URI
     - It will look like: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

4. **Update .env.local**
   - Replace the `DATABASE_URL` line with the copied connection string
   - Make sure it includes your password: `p7UHjGbsvbWdk4l2`
   - The format should be exactly as copied from Supabase

5. **Restart Dev Server**
   - Stop server (Ctrl+C)
   - Run `pnpm dev`
   - Try submitting a report again

## Why This Happens

- Supabase projects can have different regions (us-east-1, eu-west-1, etc.)
- Connection pooling URLs include the region in the hostname
- The exact format varies by project and region
- The dashboard provides the correct connection string for your specific project

## Current Status

I've updated your `.env.local` to use connection pooling format, but the region (`us-east-1`) might be wrong. 

**Please get the exact connection string from your Supabase Dashboard** and replace the `DATABASE_URL` in `.env.local` with it.

