import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

// Define the type of role a user can have
export type UserRole = "user" | "creator" | "admin" | "super-admin";

// Define the user profile type
interface UserProfile {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string;
  is_creator: boolean;
  role?: UserRole;
  // ...other fields as needed
}

// Define what the AuthContext will contain
interface AuthContextType {
  user: User | null;
  loading: boolean;
  userRole: UserRole;
  userProfile: UserProfile | null;
  signIn: (email: string, password: string) => Promise<{ error: string | null; user?: User | null }>;
  signUp: (email: string, password: string, metadata?: Partial<UserProfile>) => Promise<{ error: string | null; user?: User | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: string | null }>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component that wraps your app and makes auth object available
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>("user"); // Default role
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get session on initialization
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    fetchSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        
        // When user changes, fetch their profile and role
        if (session?.user) {
          fetchUserProfile(session.user.id);
        } else {
          setUserProfile(null);
          setUserRole("user");
        }

        setLoading(false);
      }
    );

    // Cleanup
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Fetch user profile and determine role
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUserProfile(profile as UserProfile);
      // Set role based on profile data
      if (profile.is_creator) {
        setUserRole("creator");
      } else if (profile.role && ["admin", "super-admin"].includes(profile.role)) {
        setUserRole(profile.role as UserRole);
      } else {
        setUserRole("user");
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUserRole("user"); // Default to basic user if there's an error
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return { error: error.message, user: null };
      // Fetch user profile and set role after sign in
      if (data.user) {
        await fetchUserProfile(data.user.id);
      }
      return { error: null, user: data.user };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { error: error.message, user: null };
      }
      return { error: 'Unknown error', user: null };
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, metadata?: Partial<UserProfile>) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata }
      });
      if (error) return { error: error.message, user: null };
      // Create wallet for the new user
      const userId = data.user?.id;
      if (userId) {
        await supabase.from('wallets').insert([
          { user_id: userId, type: metadata?.role || 'user' }
        ]);
        await fetchUserProfile(userId);
      }
      return { error: null, user: data.user };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { error: error.message, user: null };
      }
      return { error: 'Unknown error', user: null };
    }
  };

  // Sign out function
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Update user profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user?.id);
      // If successful, refresh the profile
      if (!error && user) {
        fetchUserProfile(user.id);
      }
      return { error: error ? error.message : null };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { error: error.message || "Unknown error" };
      }
      return { error: "Unknown error" };
    }
  };

  // Provider value
  const value = {
    user,
    loading,
    userRole,
    userProfile,
    signIn,
    signUp,
    signOut,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// In your login/signup page (e.g. src/pages/Auth.tsx), use this logic:
//
// import { useAuth } from "@/contexts/AuthContext";
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
//
// const { userRole, loading } = useAuth();
// const navigate = useNavigate();
// useEffect(() => {
//   if (!loading) {
//     if (userRole === "super-admin" || userRole === "admin") navigate("/admin");
//     else if (userRole === "creator") navigate("/app/creator-dashboard");
//     else if (userRole === "user") navigate("/app/dashboard");
//   }
// }, [userRole, loading, navigate]);
