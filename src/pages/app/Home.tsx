import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { getAllPostsNewestFirst, Post } from "@/lib/feedDataUtils";

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      const allPosts = await getAllPostsNewestFirst();
      setPosts(allPosts);
      setLoading(false);
    }
    fetchPosts();
  }, []);

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-4xl px-4 sm:px-4 md:px-8 lg:px-8 xl:px-8" style={{ width: '80%' }}>
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold gradient-text">Felaco</h1>
          <div className="flex items-center gap-4">
            <button className="text-gray-800" aria-label="Likes">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </button>
            <button className="text-gray-800" aria-label="Messages">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
            </button>
          </div>
        </header>
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading posts...</div>
        ) : (
          <div className="space-y-6">
            {posts.length === 0 ? (
              <div className="text-center text-gray-400 py-12">No posts available.</div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="rounded-lg border border-gray-200 bg-white overflow-hidden">
                  {/* Media rendering (image/video/placeholder) */}
                  <div className="aspect-square w-full bg-gray-200 flex items-center justify-center">
                    {post.contentUrl ? (
                      <img
                        src={post.contentUrl}
                        alt={post.caption || "Post media"}
                        className="object-cover w-full h-full"
                        style={{ maxHeight: 400 }}
                      />
                    ) : (
                      <span className="text-gray-400">Media</span>
                    )}
                  </div>
                  {/* Caption and paywall logic */}
                  <div className="p-3">
                    {post.locked ? (
                      <div className="relative">
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10">
                          <span className="text-white font-bold text-lg">Locked Content</span>
                          <button className="mt-2 px-4 py-2 bg-felaco-purple text-white rounded-full">Unlock</button>
                        </div>
                        <div className="opacity-40 pointer-events-none">
                          {/* Optionally show blurred preview */}
                          <span className="text-gray-400">Locked preview</span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-medium">{post.caption || "No caption"}</p>
                        <p className="text-xs text-gray-500 mt-1">by {post.username || "Unknown"}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
