import { useEffect, useState } from "react";
import { getAllPostsNewestFirst } from "@/lib/feedDataUtils";
import type { Post } from "@/lib/getRecommendedPosts";

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      const all = await getAllPostsNewestFirst();
      setPosts(all);
      setLoading(false);
    }
    fetchPosts();
  }, []);

  const filtered = posts.filter((post) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (post.caption && post.caption.toLowerCase().includes(q)) ||
      (Array.isArray(post.tags) &&
        post.tags.some((t: string) => t.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="flex justify-center w-full min-h-screen bg-gray-50">
      <div
        className="w-full max-w-4xl px-4 sm:px-4 md:px-8 lg:px-8 xl:px-8"
        style={{ width: "80%" }}
      >
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full rounded-lg border border-gray-300 bg-gray-100 py-2 pl-10 pr-4 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {(loading ? Array(9).fill(null) : filtered).map((post, i) => (
            <div
              key={i}
              className="aspect-square w-full bg-gray-200 flex items-center justify-center overflow-hidden"
            >
              {post ? (
                post.contentUrl && post.type === "video" ? (
                  <video
                    src={post.contentUrl}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                  />
                ) : post.contentUrl ? (
                  <img
                    src={post.contentUrl}
                    alt="Post"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-gray-400">No media</span>
                )
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Explore;
