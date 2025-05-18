// Role-based access helper for your app
export function getUserRole(user: { user_metadata?: { role?: string } } | null): string {
  return user?.user_metadata?.role || 'user';
}
// Usage: const role = getUserRole(user); if (role === 'super-admin') { ... }
