import { useEffect, useState, useCallback, createContext, useContext, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAdminRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      if (error) {
        console.error("Error checking admin role:", error);
        return false;
      }
      return !!data;
    } catch (err) {
      console.error("Error in checkAdminRole:", err);
      return false;
    }
  };

  useEffect(() => {
    let cancelled = false;

    const resolveAuth = async (currentSession: Session | null, event?: string) => {
      if (cancelled) return;
      
      // If the token is just refreshing, we don't want to show a loading screen 
      // because that unmounts the dashboard and causes severe UI lag.
      if (event === "TOKEN_REFRESHED") {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        return;
      }

      try {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          const adminStatus = await checkAdminRole(currentSession.user.id);
          if (!cancelled) setIsAdmin(adminStatus);
        } else {
          if (!cancelled) setIsAdmin(false);
        }
      } catch (err) {
        console.error("Error resolving auth session:", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    // 1. Initial check on mount
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (!cancelled) {
        resolveAuth(initialSession);
      }
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (cancelled) return;
        await resolveAuth(session, event);
      }
    );

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/account`,
      },
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
