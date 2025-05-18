import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "user" | "creator" | "admin";
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading, userRole } = useAuth();
  const navigate = useNavigate();
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      // Prevent back navigation to protected routes after logout
      navigate('/auth', { replace: true });
      // Remove all history entries except /auth
      window.history.pushState(null, '', '/auth');
      const handlePopState = () => {
        navigate('/auth', { replace: true });
      };
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    } else if (!loading && user) {
      // If a specific role is required, check if user has that role
      if (requiredRole && userRole !== requiredRole) {
        // If creator role is required but user is not a creator, redirect to creator application
        if (requiredRole === "creator" && userRole === "user") {
          navigate("/creator-application");
        } else {
          // For any other unauthorized role access, redirect to home
          navigate("/app");
        }
      } else {
        // Animation effect when the protected content is loaded
        setTimeout(() => setAnimateIn(true), 100);
      }
    }
  }, [user, loading, navigate, requiredRole, userRole]);

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-white">
        <div className="h-14 w-14 animate-spin rounded-full border-b-2 border-t-2 border-felaco-purple"></div>
        <div className="mt-6 text-center">
          <p className="text-lg font-medium text-felaco-purple">Loading</p>
          <p className="mt-2 text-sm text-gray-500">Preparing your personalized experience...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;
  
  // If role check fails, don't render the children
  if (requiredRole && userRole !== requiredRole) return null;

  return (
    <div className={`transition-all duration-500 ease-in-out ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
      {children}
    </div>
  );
};

export default ProtectedRoute;
