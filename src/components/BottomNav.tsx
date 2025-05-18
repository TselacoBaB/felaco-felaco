
import { Home, Search, PlusSquare, MessageSquare, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import UploadMenu from "./UploadMenu";

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

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white">
        <div className="flex h-16 items-center justify-around px-2">
          <Link
            to="/app"
            className={`flex flex-col items-center justify-center ${
              isActive("/app") ? "text-felaco-purple" : "text-gray-500"
            }`}
          >
            <Home
              size={24}
              className={`${isActive("/app") ? "fill-felaco-purple" : ""}`}
            />
            <span className="mt-1 text-xs">Home</span>
          </Link>

          <Link
            to="/app/explore"
            className={`flex flex-col items-center justify-center ${
              isActive("/app/explore") ? "text-felaco-purple" : "text-gray-500"
            }`}
          >
            <Search size={24} />
            <span className="mt-1 text-xs">Explore</span>
          </Link>

          <button
            onClick={toggleUploadMenu}
            className="flex flex-col items-center justify-center text-gray-500"
          >
            <PlusSquare size={24} />
            <span className="mt-1 text-xs">Upload</span>
          </button>

          <Link
            to="/app/messages"
            className={`flex flex-col items-center justify-center ${
              isActive("/app/messages") ? "text-felaco-purple" : "text-gray-500"
            }`}
          >
            <MessageSquare size={24} />
            <span className="mt-1 text-xs">Chats</span>
          </Link>

          <Link
            to="/app/profile"
            className={`flex flex-col items-center justify-center ${
              isActive("/app/profile") ? "text-felaco-purple" : "text-gray-500"
            }`}
          >
            {user?.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt="Profile"
                className="h-6 w-6 rounded-full"
              />
            ) : (
              <User size={24} />
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
