"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let subscription: { unsubscribe: () => void } | null = null;
    
    try {
      const supabase = createSupabaseClient();

      // Get initial session
      supabase.auth.getSession().then(({ data: { session }, error }) => {
        if (!mounted) return;
        if (error) {
          console.error("Error getting session:", error);
          setLoading(false);
          return;
        }
        setUser(session?.user ?? null);
        setLoading(false);
      }).catch((error) => {
        if (!mounted) return;
        console.error("Error in getSession:", error);
        setLoading(false);
      });

      // Listen for auth changes
      const authStateChange = supabase.auth.onAuthStateChange((_event, session) => {
        if (!mounted) return;
        setUser(session?.user ?? null);
        setLoading(false);
      });
      
      subscription = authStateChange.data.subscription;

      return () => {
        mounted = false;
        subscription?.unsubscribe();
      };
    } catch (error) {
      console.error("Error initializing Supabase client:", error);
      setLoading(false);
      return () => {
        mounted = false;
        subscription?.unsubscribe();
      };
    }
  }, []);

  const signOut = async () => {
    try {
      const supabase = createSupabaseClient();
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

