# OAuth Setup Instructions

## Google OAuth Configuration in Supabase

To enable Google OAuth login, you need to configure it in your Supabase Dashboard:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Find **Google** and click to configure
5. Enable the Google provider
6. Add your Google OAuth credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console

## Redirect URL Configuration

In the Supabase Google OAuth settings, add these **Authorized redirect URIs**:

### For Development:
```
http://localhost:3000/auth/callback
http://localhost:3001/auth/callback
```

### For Production:
```
https://your-domain.com/auth/callback
```

**Important**: The redirect URL must match exactly:
- Protocol: `http://` for localhost, `https://` for production
- Domain: Your app's domain (not Supabase's domain)
- Path: `/auth/callback`

## Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. **Configure OAuth Consent Screen** (do this first):
   - Go to **APIs & Services** → **OAuth consent screen**
   - Under **User Type**, select **External** (not Internal)
   - Click **Save and Continue**
   - Complete required fields (App name, Support email, etc.)
   - Save the changes
   - **Important**: If set to "Internal", you'll get "Error 403: org_internal" and only users from your Google Workspace organization can sign in
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Authorized redirect URIs: Add your Supabase callback URL:
   ```
   https://nfvmwjkrfigdojbjexkv.supabase.co/auth/v1/callback
   ```
7. Copy the **Client ID** and **Client Secret** to Supabase

**Note**: You do NOT need to enable Google+ API (it's deprecated). Google OAuth 2.0 works without it.

## Testing

1. Start your Next.js app: `npm run dev`
2. Visit `http://localhost:3000` (or `http://localhost:3001` if that's your port)
3. Click "Sign in with Gmail"
4. You should be redirected to Google for authentication
5. After authentication, you'll be redirected back to your app

## Troubleshooting

- **"Redirect URI mismatch"**: Make sure the redirect URL in Google Cloud Console matches exactly: `https://nfvmwjkrfigdojbjexkv.supabase.co/auth/v1/callback`
- **"Invalid redirect"**: Check that your app's callback URL is added to Supabase's authorized redirects
- **Port issues**: If using port 3001, make sure both Supabase and Google Cloud Console have the correct port in the redirect URL
- **"Error 403: org_internal"**: The OAuth consent screen is set to "Internal" user type. Change it to "External" in Google Cloud Console → APIs & Services → OAuth consent screen
- **"Legacy API keys are disabled"**: This error occurs when your Google Cloud project has restrictions blocking legacy APIs. To fix:
  1. Go to [Google Cloud Console](https://console.cloud.google.com/)
  2. Select your project
  3. Navigate to **APIs & Services** → **Credentials**
  4. Click on your OAuth 2.0 Client ID
  5. Under **API restrictions**, make sure it's set to **Don't restrict key** OR if restricted, ensure no APIs are blocking OAuth authentication
  6. Also check **APIs & Services** → **Enabled APIs** - ensure no API restrictions are blocking authentication
  7. If the issue persists, verify that your OAuth client doesn't have any application restrictions that might be causing this error

