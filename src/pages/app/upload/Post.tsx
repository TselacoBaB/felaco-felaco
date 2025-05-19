import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import BottomNav from "@/components/BottomNav";

const PostUpload = () => {
  const { user, userRole } = useAuth();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [postType, setPostType] = useState("image");
  const [visibility, setVisibility] = useState("public");
  const [isLoading, setIsLoading] = useState(false);
  const [locked, setLocked] = useState(false); // For paywall toggle
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
      setPreviews(files.map(file => URL.createObjectURL(file)));
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
      setPreviews(prev => [...prev, ...files.map(file => URL.createObjectURL(file))]);
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
      setPreviews(prev => [...prev, ...files.map(file => URL.createObjectURL(file))]);
    }
  };

  const handleAddImage = () => {
    if (imageInputRef.current) {
      imageInputRef.current.accept = "image/*";
      imageInputRef.current.click();
    }
  };
  const handleAddVideo = () => {
    if (videoInputRef.current) {
      videoInputRef.current.accept = "video/*";
      videoInputRef.current.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      toast({ title: "No media selected", description: "Please select at least one file.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      // Upload all files to Supabase Storage using the reusable uploadFile util
      const mediaUrls: string[] = [];
      for (const file of selectedFiles) {
        const result = await import("@/lib/uploadFile").then(m => m.uploadFile(file, user?.id || "anon"));
        if (!result || !result.publicUrl) throw new Error('Failed to upload file');
        mediaUrls.push(result.publicUrl);
      }
      // Insert post metadata
      interface PostInsert {
        creator_id: string;
        type: 'image' | 'video' | 'reel' | 'story' | 'text';
        content_url: string | null;
        caption: string | null;
        tags: string[];
        nsfw: boolean;
        expires_at: string | null;
        view_count: number;
        likes: string[];
        shares: number;
        saves: string[];
        locked?: boolean;
      }
      const postInsert: PostInsert = {
        creator_id: user?.id || '',
        type: (postType === 'multi-image' ? 'image' : postType === 'audio' ? 'video' : postType) as 'image' | 'video' | 'reel' | 'story' | 'text',
        content_url: mediaUrls[0] || null,
        caption: description || null,
        tags: tags.split(",").map(t => t.trim()).filter(Boolean),
        nsfw: false,
        expires_at: postType === 'story' ? new Date(Date.now() + 24*60*60*1000).toISOString() : null,
        view_count: 0,
        likes: [],
        shares: 0,
        saves: [],
      };
      if (userRole === 'creator') {
        postInsert.locked = locked;
      }
      const { error: insertError } = await supabase.from("posts").insert(postInsert);
      if (insertError) throw insertError;
      toast({ title: "Post created", description: "Your post has been shared successfully" });
      navigate("/app");
    } catch (err: unknown) {
      let message = "An unknown error occurred";
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === "string") {
        message = err;
      }
      toast({ title: "Upload failed", description: message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-50 pb-20">
      <div className="w-full max-w-lg mx-auto px-2 sm:px-4 pt-6 flex flex-col items-center">
        <div className="flex flex-col items-center mb-10">
          <img src="/lovable-uploads/icon_logo_f.png" alt="Felaco Logo" className="w-12 h-12 mb-1 rounded-full shadow" />
          <span className="text-2xl font-bold bg-gradient-to-r from-felaco-purple to-felaco-pink bg-clip-text text-transparent tracking-tight">Felaco</span>
        </div>
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-4">
          <div className="w-full flex flex-col items-center">
            <label className="mb-1 font-medium">Media</label>
            <div className="flex flex-wrap gap-2 mb-2 justify-center">
              {/* Hidden file inputs for image and video */}
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="hidden"
              />
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                multiple
                onChange={handleVideoSelect}
                className="hidden"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*,audio/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              {/* Previews with type badge */}
              {previews.map((src, i) => {
                const file = selectedFiles[i];
                let badge = null;
                if (file?.type.startsWith("video")) badge = <span className="absolute bottom-1 left-1 bg-felaco-purple text-white text-xs px-2 py-0.5 rounded">Video</span>;
                else if (file?.type.startsWith("audio")) badge = <span className="absolute bottom-1 left-1 bg-felaco-pink text-white text-xs px-2 py-0.5 rounded">Audio</span>;
                else if (file?.type.startsWith("image")) badge = <span className="absolute bottom-1 left-1 bg-felaco-blue text-white text-xs px-2 py-0.5 rounded">Image</span>;
                return (
                  <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border">
                    {file?.type.startsWith("video") ? (
                      <video src={src} className="w-full h-full object-cover" controls />
                    ) : file?.type.startsWith("audio") ? (
                      <audio src={src} className="w-full h-full" controls />
                    ) : (
                      <img src={src} alt="Preview" className="w-full h-full object-cover" />
                    )}
                    {badge}
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1"
                      onClick={() => {
                        setSelectedFiles(files => files.filter((_, idx) => idx !== i));
                        setPreviews(previews => previews.filter((_, idx) => idx !== i));
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                  </div>
                );
              })}
              {/* Add Image button */}
              <button
                type="button"
                className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-400 hover:bg-gray-100"
                onClick={() => imageInputRef.current?.click()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
                <span className="text-xs mt-1">Add Image</span>
              </button>
              {/* Add Video button */}
              <button
                type="button"
                className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-400 hover:bg-gray-100"
                onClick={() => videoInputRef.current?.click()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
                <span className="text-xs mt-1">Add Video</span>
              </button>
              {/* Fallback: Add Any Media */}
              <button
                type="button"
                className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-400 hover:bg-gray-100"
                onClick={() => fileInputRef.current?.click()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
                <span className="text-xs mt-1">Add Media</span>
              </button>
            </div>
          </div>
          {/* Show current files being uploaded */}
          {selectedFiles.length > 0 && (
            <div className="w-full mb-2 flex flex-col gap-1 items-center">
              <div className="w-full text-sm font-medium mb-1 text-gray-700">Files to upload:</div>
              <ul className="w-full flex flex-col gap-1">
                {selectedFiles.map((file, i) => (
                  <li key={i} className="flex items-center justify-between bg-gray-100 rounded px-3 py-1 text-xs">
                    <span className="truncate max-w-[60%]" title={file.name}>{file.name}</span>
                    <span className="ml-2 px-2 py-0.5 rounded bg-felaco-blue/10 text-felaco-blue font-semibold">
                      {file.type.startsWith('image') ? 'Image' : file.type.startsWith('video') ? 'Video' : file.type.startsWith('audio') ? 'Audio' : 'File'}
                    </span>
                    <button
                      type="button"
                      className="ml-2 text-red-500 hover:text-red-700"
                      onClick={() => {
                        setSelectedFiles(files => files.filter((_, idx) => idx !== i));
                        setPreviews(previews => previews.filter((_, idx) => idx !== i));
                      }}
                      aria-label="Remove file"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="w-full">
            <label className="mb-1 font-medium">Title</label>
            <input
              type="text"
              placeholder="Title (optional)"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full rounded border px-3 py-2"
            />
          </div>
          <div className="w-full">
            <label className="mb-1 font-medium">Description</label>
            <Textarea
              placeholder="Description (optional)"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="min-h-24 w-full"
            />
          </div>
          <div className="w-full">
            <label className="mb-1 font-medium">Tags</label>
            <input
              type="text"
              placeholder="Tags (comma separated, optional)"
              value={tags}
              onChange={e => setTags(e.target.value)}
              className="w-full rounded border px-3 py-2"
            />
          </div>
          {/* Type selector as colorful buttons */}
          <div className="flex gap-2 mb-4 w-full justify-center">
            {['image', 'video', 'audio'].map((typeOpt) => {
              // Highlight if any selected file matches this type
              const isActive = selectedFiles.some(f => f.type.startsWith(typeOpt));
              let color = '';
              if (typeOpt === 'image') color = 'bg-felaco-blue hover:bg-felaco-blue/80';
              if (typeOpt === 'video') color = 'bg-felaco-purple hover:bg-felaco-purple/80';
              if (typeOpt === 'audio') color = 'bg-felaco-pink hover:bg-felaco-pink/80';
              return (
                <button
                  key={typeOpt}
                  type="button"
                  className={`px-4 py-2 rounded-full text-white font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${color} ${isActive ? 'ring-4 ring-felaco-yellow scale-105' : ''}`}
                  onClick={() => setPostType(typeOpt)}
                  aria-pressed={postType === typeOpt}
                >
                  {typeOpt.charAt(0).toUpperCase() + typeOpt.slice(1)}
                  {isActive && <span className="ml-2 text-xs">●</span>}
                </button>
              );
            })}
          </div>
          {userRole === 'creator' && (
            <div className="flex items-center mb-2 w-full justify-center">
              <input
                type="checkbox"
                id="locked"
                checked={locked}
                onChange={e => setLocked(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="locked" className="text-sm font-medium text-felaco-purple">Lock content (paywall)</label>
            </div>
          )}
          <Button
            type="submit"
            className="rounded-full bg-felaco-gradient px-6 py-2 text-white font-semibold text-base shadow-md hover:scale-105 transition-transform"
            disabled={selectedFiles.length === 0 || isLoading}
          >
            {isLoading ? "Posting..." : "Post"}
          </Button>
        </form>
      </div>
      <BottomNav />
    </div>
  );
};

export default PostUpload;
