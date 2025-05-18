// Normalizes a Supabase user object to the AuthUser interface for Redux
import { User } from "@supabase/supabase-js";
import { AuthUser } from "../slices/authSlice";

export function normalizeAuthUser(user: User): AuthUser {
  return {
    id: user.id,
    email: user.email ?? "",
    username: user.user_metadata?.username ?? undefined,
    fullName: user.user_metadata?.full_name ?? undefined,
    avatarUrl: user.user_metadata?.avatar_url ?? undefined,
    role: user.user_metadata?.role ?? undefined,
    // Add more fields as needed
  };
}
