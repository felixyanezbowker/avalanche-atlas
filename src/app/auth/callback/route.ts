import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");
  const redirectTo = requestUrl.searchParams.get("redirect") || "/";

  // Handle OAuth errors
  if (error) {
    console.error("OAuth error:", error, errorDescription);
    const errorMessage = errorDescription || error || "Authentication failed";
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errorMessage)}`, requestUrl.origin)
    );
  }

  // Handle code exchange
  if (code) {
    try {
      const cookieStore = await cookies();
      
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error("Missing Supabase environment variables");
      }
      
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
              try {
                cookiesToSet.forEach(({ name, value, options }) =>
                  cookieStore.set(name, value, options)
                );
              } catch {
                // The `setAll` method was called from a Route Handler.
                // This can be ignored if you have middleware refreshing
                // user sessions.
              }
            },
          },
        }
      );
      
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (exchangeError) {
        console.error("Code exchange error:", exchangeError);
        return NextResponse.redirect(
          new URL(`/login?error=${encodeURIComponent(exchangeError.message)}`, requestUrl.origin)
        );
      }
    } catch (err: any) {
      console.error("Unexpected error during code exchange:", err);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(err.message || "Authentication failed")}`, requestUrl.origin)
      );
    }
  } else {
    // No code provided
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent("No authorization code provided")}`, requestUrl.origin)
    );
  }

  return NextResponse.redirect(new URL(redirectTo, requestUrl.origin));
}

