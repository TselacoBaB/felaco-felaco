import React, { useState } from "react";
import { likePost, savePost } from "@/lib/postEngagement";
import { useAuth } from "@/contexts/AuthContext";

interface PostCardProps {
  loading: boolean;
  post?: {
    id: string;
    type: "image" | "video" | "multi-image";
    media: string[];
    description: string;
    likes: number;
    comments: number;
    saves: number;
  };
  onThreadClick?: (id: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ loading, post, onThreadClick }) => {
  const { user } = useAuth();
  const [likeLoading, setLikeLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(post?.likes || 0);
  const [saveCount, setSaveCount] = useState(post?.saves || 0);

  if (loading) {
    return (
      <div className="w-full max-w-md rounded-lg p-4 bg-white shadow animate-pulse space-y-4">
        <div className="h-52 bg-gray-300 rounded-md" />
        <div className="h-4 bg-gray-300 rounded w-3/4" />
        <div className="flex space-x-4">
          <div className="h-4 bg-gray-300 rounded w-1/4" />
          <div className="h-4 bg-gray-300 rounded w-1/4" />
        </div>
      </div>
    );
  }

  if (!post) return null;

  const handleLike = async () => {
    if (!user || likeLoading) return;
    setLikeLoading(true);
    setLiked(true);
    setLikeCount(likeCount + 1);
    try {
      await likePost(post.id, user.id);
    } catch (e) {
      setLiked(false);
      setLikeCount(likeCount - 1);
    }
    setLikeLoading(false);
  };

  const handleSave = async () => {
    if (!user || saveLoading) return;
    setSaveLoading(true);
    setSaved(true);
    setSaveCount(saveCount + 1);
    try {
      await savePost(post.id, user.id);
    } catch (e) {
      setSaved(false);
      setSaveCount(saveCount - 1);
    }
    setSaveLoading(false);
  };

  const handleFollow = () => {
    // TODO: Implement follow logic
    alert('Follow feature coming soon!');
  };

  return (
    <div className="w-full max-w-md rounded-lg p-4 bg-white shadow space-y-2">
      {/* Creator Info */}
      <div className="flex items-center gap-3 mb-2">
        <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
          {/* Replace with real creator avatar if available */}
          <img src="/lovable-uploads/icon_logo_f.png" alt="Creator" className="h-full w-full object-cover" />
        </div>
        <span className="font-semibold text-sm text-gray-800">@creatorname</span>
      </div>
      {/* Media display */}
      {post.type === "video" ? (
        <video src={post.media[0]} controls className="w-full rounded-lg" />
      ) : post.type === "multi-image" ? (
        <div className="flex overflow-x-scroll space-x-2 scrollbar-hide">
          {post.media.map((src, i) => (
            <img key={i} src={src} className="w-1/2 rounded" />
          ))}
        </div>
      ) : (
        <img src={post.media[0]} alt="Post" className="w-full rounded" />
      )}

      {/* Description */}
      <p className="text-sm text-gray-800">{post.description}</p>

      {/* Buttons */}
      <div className="flex justify-between text-sm text-gray-600 mt-2">
        <button onClick={handleLike} disabled={likeLoading || liked}>❤️ {likeCount}</button>
        <button onClick={() => onThreadClick?.(post.id)}>💬 {post.comments} Threads</button>
        <button>🔗 Share</button>
        <button onClick={handleSave} disabled={saveLoading || saved}>💾 {saveCount}</button>
        <button className="ml-2" onClick={handleFollow}>➕ Follow</button>
      </div>
    </div>
  );
};

export default PostCard;
