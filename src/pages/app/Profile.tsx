import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("posts");
  
  // Mock grid data (would be fetched from API in a real app)
  const postItems = Array.from({ length: 9 }, (_, i) => i + 1);
  
  return (
    <div className="pb-6">
      <header className="border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{user?.user_metadata?.username || "Profile"}</h1>
          <div className="flex gap-4">
            <button className="text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-square"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
            </button>
            <button className="text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
          </div>
        </div>
      </header>
      
      <div className="px-4 py-6">
        <div className="flex items-center">
          <div className="mr-6">
            <div className="h-20 w-20 rounded-full bg-gray-300">
              {user?.user_metadata?.avatar_url ? (
                <img 
                  src={user.user_metadata.avatar_url} 
                  alt="Profile" 
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-300">
                  <span className="text-2xl font-bold text-gray-600">{(user?.user_metadata?.username || 'U')[0].toUpperCase()}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-1 justify-around text-center">
            <div>
              <p className="text-lg font-bold">0</p>
              <p className="text-sm text-gray-500">Posts</p>
            </div>
            <div>
              <p className="text-lg font-bold">0</p>
              <p className="text-sm text-gray-500">Followers</p>
            </div>
            <div>
              <p className="text-lg font-bold">0</p>
              <p className="text-sm text-gray-500">Following</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="font-medium">{user?.user_metadata?.full_name || "User"}</p>
          <p className="text-sm text-gray-500">Bio goes here...</p>
        </div>
        
        <div className="mt-4 flex gap-2">
          <Link to="/app/profile/edit" className="flex-1">
            <Button variant="outline" className="w-full">Edit Profile</Button>
          </Link>
          
          <Button variant="outline" onClick={signOut} className="px-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
          </Button>
        </div>
        
        <div className="mt-4">
          <Link to="/app/settings" className="flex-1">
            <Button variant="outline" className="w-full">Settings</Button>
          </Link>
        </div>
      </div>
      
      <div className="border-t border-gray-200">
        <div className="grid grid-cols-3 border-b border-gray-200">
          <button 
            className={`py-3 ${activeTab === 'posts' ? 'border-b-2 border-black' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-grid mx-auto"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
          </button>
          <button 
            className={`py-3 ${activeTab === 'reels' ? 'border-b-2 border-black' : ''}`}
            onClick={() => setActiveTab('reels')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-video mx-auto"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
          </button>
          <button 
            className={`py-3 ${activeTab === 'tagged' ? 'border-b-2 border-black' : ''}`}
            onClick={() => setActiveTab('tagged')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-tag mx-auto"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>
          </button>
        </div>
        
        <div className="mt-1 grid grid-cols-3 gap-1 px-1">
          {activeTab === 'posts' && postItems.map((item) => (
            <div key={item} className="aspect-square w-full bg-gray-200"></div>
          ))}
          {activeTab === 'reels' && (
            <div className="col-span-3 pt-10 text-center text-gray-500">
              <p>No reels yet</p>
            </div>
          )}
          {activeTab === 'tagged' && (
            <div className="col-span-3 pt-10 text-center text-gray-500">
              <p>No tagged posts</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
