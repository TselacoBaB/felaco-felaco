
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const StoryUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast({
        title: "No image selected",
        description: "Please select an image for your story",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Story created",
        description: "Your story has been posted successfully",
      });
      navigate("/app");
    }, 1500);
  };
  
  return (
    <div className="px-4 py-6">
      <header className="mb-6 flex items-center justify-between">
        <button onClick={() => navigate("/app")} className="text-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        <h1 className="text-xl font-bold">New Story</h1>
        <button 
          className="text-felaco-purple disabled:opacity-50"
          disabled={!selectedFile || isLoading}
          onClick={handleSubmit}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
        </button>
      </header>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          {preview ? (
            <div className="relative aspect-[9/16] w-full overflow-hidden rounded-lg">
              <img 
                src={preview} 
                alt="Preview" 
                className="h-full w-full object-cover"
              />
              <button 
                type="button"
                className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white"
                onClick={() => {
                  setSelectedFile(null);
                  setPreview(null);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
          ) : (
            <div className="flex aspect-[9/16] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-image text-gray-400"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
              <p className="mt-4 text-sm text-gray-500">Click to select an image</p>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </div>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="w-full rounded-full bg-felaco-gradient"
          disabled={!selectedFile || isLoading}
        >
          {isLoading ? "Posting..." : "Share to Story"}
        </Button>
      </form>
    </div>
  );
};

export default StoryUpload;
