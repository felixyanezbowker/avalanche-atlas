"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createSupabaseClient();

  // Check for error from OAuth callback
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name || email.split("@")[0],
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        
        if (error) {
          throw error;
        }
        
        // Check if email confirmation is required
        if (data.user && !data.session) {
          setError(
            "Account created! Please check your email to confirm your account before signing in. " +
            "If you don't see the email, check your spam folder."
          );
          // Clear form after successful signup
          setEmail("");
          setPassword("");
          setName("");
        } else if (data.session) {
          // User is automatically signed in (email confirmation disabled)
          const redirect = searchParams.get("redirect") || "/";
          router.push(redirect);
          router.refresh();
        } else {
          setError("Sign up failed. Please try again.");
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          // Provide more helpful error messages
          if (error.message.includes("Invalid login credentials")) {
            throw new Error("Invalid email or password. Please try again.");
          } else if (error.message.includes("Email not confirmed")) {
            throw new Error("Please check your email and confirm your account before signing in.");
          }
          throw error;
        }
        
        if (!data.session) {
          throw new Error("Sign in failed. Please try again.");
        }
        
        const redirect = searchParams.get("redirect") || "/";
        router.push(redirect);
        router.refresh();
      }
    } catch (err: any) {
      console.error("Email sign-in error:", err);
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const redirectTo = searchParams.get("redirect") || "/";
      const callbackUrl = `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`;
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl,
        },
      });
      
      if (error) {
        console.error("OAuth error:", error);
        if (error.message.includes("not configured") || error.message.includes("disabled")) {
          throw new Error(
            "Google OAuth is not configured. Please configure it in your Supabase Dashboard: " +
            "Authentication → Providers → Google"
          );
        }
        throw error;
      }
      
      // If OAuth redirects, the loading state will be handled by the redirect
      // If there's no redirect URL, it means OAuth isn't configured
      if (!data?.url) {
        throw new Error(
          "Google OAuth is not configured. Please check your Supabase Dashboard: " +
          "Authentication → Providers → Google. Make sure to enable the provider and add " +
          "your Google OAuth credentials."
        );
      }
      
      // Redirect to Google OAuth page
      window.location.href = data.url;
    } catch (err: any) {
      console.error("Google sign-in error:", err);
      setError(err.message || "Failed to sign in with Google. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">Avalanche Atlas</h1>
        <h2 className="text-xl font-semibold text-center mb-6 text-gray-900 dark:text-gray-100">
          {isSignUp ? "Create Account" : "Sign In"}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full mb-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Sign in with Gmail"}
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">Or</span>
          </div>
        </div>

        <form onSubmit={handleEmailSignIn} className="space-y-4">
          {isSignUp && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                Name (optional)
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
              setEmail("");
              setPassword("");
              setName("");
            }}
            className="text-sm text-blue-600 hover:text-blue-500 hover:underline cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
          >
            {isSignUp
              ? "Already have an account? Sign in"
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}

