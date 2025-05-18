import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';

const LiveStream = () => {
  const { userProfile, userRole } = useAuth();
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!userProfile || userRole !== 'creator') {
      navigate('/app', { replace: true });
    }
  }, [userProfile, userRole, navigate]);
  
  const handleStartLive = () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please add a title for your livestream",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Live started",
        description: "You're now live streaming to your followers",
      });
      navigate("/app");
    }, 1500);
  };
  
  const handleLovenseConnect = () => {
    window.open('https://api.lovense.com/console/v2/login', '_blank');
  };
  
  return (
    <div className="px-4 py-6">
      <header className="mb-6 flex items-center justify-between">
        <button onClick={() => navigate("/app")} className="text-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        <h1 className="text-xl font-bold">Go Live</h1>
        <div className="w-6"></div>
      </header>
      
      <div className="mb-6 rounded-lg bg-red-50 p-4 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-video text-red-500"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
        </div>
        <h2 className="mb-1 text-lg font-bold text-red-800">Live Stream</h2>
        <p className="text-sm text-red-600">
          Start streaming live to your followers
        </p>
      </div>
      
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium">Live Stream Title</label>
        <Input
          placeholder="What are you streaming about?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-4"
        />
      </div>
      
      {userRole === 'creator' && (
        <Button
          onClick={handleLovenseConnect}
          className="w-full mb-4 bg-pink-500 hover:bg-pink-600"
        >
          Connect Lovense Device
        </Button>
      )}
      
      <div className="space-y-2">
        <Button 
          onClick={handleStartLive} 
          className="w-full bg-red-500 hover:bg-red-600"
          disabled={isLoading || userRole !== 'creator'}
        >
          {isLoading ? "Starting..." : "Start Live Stream"}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => navigate("/app")} 
          className="w-full"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default LiveStream;
