import { Home, Search, PlusSquare, MessageSquare, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import UploadMenu from "./UploadMenu";

// Use a custom type for the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const BottomNav = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [showUploadMenu, setShowUploadMenu] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleUploadMenu = () => {
    setShowUploadMenu(!showUploadMenu);
  };

  // PWA install prompt
  useEffect(() => {
    let deferredPrompt: BeforeInstallPromptEvent | null = null;
    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e as BeforeInstallPromptEvent;
      // Show custom install banner or prompt
      if (window.confirm('Install Felaco for a better experience?')) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(() => {
          deferredPrompt = null;
        });
      }
    };
    window.addEventListener('beforeinstallprompt', handler as EventListener);
    return () => window.removeEventListener('beforeinstallprompt', handler as EventListener);
  }, []);

  return (
    <>
      <nav className="fixed bottom-4 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <div className="flex h-16 items-center justify-around px-6 py-2 bg-white rounded-2xl shadow-lg pointer-events-auto w-[95vw] max-w-xl border border-gray-200"
          style={{ boxShadow: '0 4px 24px 0 rgba(80, 80, 180, 0.08)' }}>
          <Link
            to="/app"
            className={`flex flex-col items-center justify-center transition-colors ${isActive("/app") ? "text-felaco-purple" : "text-gray-500"}`}
          >
            <Home
              size={28}
              className={`transition-colors ${isActive("/app") ? "stroke-felaco-purple" : "stroke-gray-400"}`}
              fill={isActive("/app") ? "#a78bfa" : "none"}
            />
            <span className="mt-1 text-xs">Home</span>
          </Link>

          <Link
            to="/app/explore"
            className={`flex flex-col items-center justify-center transition-colors ${isActive("/app/explore") ? "text-felaco-purple" : "text-gray-500"}`}
          >
            <Search
              size={28}
              className={`transition-colors ${isActive("/app/explore") ? "stroke-felaco-purple" : "stroke-gray-400"}`}
              fill={isActive("/app/explore") ? "#a78bfa" : "none"}
            />
            <span className="mt-1 text-xs">Explore</span>
          </Link>

          <button
            onClick={toggleUploadMenu}
            className="flex flex-col items-center justify-center transition-colors text-gray-500 focus:outline-none"
            aria-label="Upload"
            style={{ outline: 'none' }}
          >
            <PlusSquare
              size={32}
              className={`transition-colors ${showUploadMenu ? "stroke-felaco-purple" : "stroke-gray-400"}`}
              fill={showUploadMenu ? "#a78bfa" : "none"}
            />
            <span className="mt-1 text-xs">Upload</span>
          </button>

          <Link
            to="/app/messages"
            className={`flex flex-col items-center justify-center transition-colors ${isActive("/app/messages") ? "text-felaco-purple" : "text-gray-500"}`}
          >
            <MessageSquare
              size={28}
              className={`transition-colors ${isActive("/app/messages") ? "stroke-felaco-purple" : "stroke-gray-400"}`}
              fill={isActive("/app/messages") ? "#a78bfa" : "none"}
            />
            <span className="mt-1 text-xs">Chats</span>
          </Link>

          <Link
            to="/app/profile"
            className={`flex flex-col items-center justify-center transition-colors ${isActive("/app/profile") ? "text-felaco-purple" : "text-gray-500"}`}
          >
            {user?.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt="Profile"
                className="h-7 w-7 rounded-full border-2 border-felaco-purple"
              />
            ) : (
              <User
                size={28}
                className={`transition-colors ${isActive("/app/profile") ? "stroke-felaco-purple" : "stroke-gray-400"}`}
                fill={isActive("/app/profile") ? "#a78bfa" : "none"}
              />
            )}
            <span className="mt-1 text-xs">Profile</span>
          </Link>
        </div>
      </nav>
      {showUploadMenu && <UploadMenu onClose={() => setShowUploadMenu(false)} />}
    </>
  );
};

export default BottomNav;
