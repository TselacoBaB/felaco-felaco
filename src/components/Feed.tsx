import { useEffect, useRef, useState, useCallback } from "react";
import PostCard from "@/components/PostCard";
import { useNavigate } from "react-router-dom";
import { getAllPostsNewestFirst } from "@/lib/feedDataUtils";
import type { Post as FeedPost } from "@/lib/getRecommendedPosts";
import type { Post as EngagementPost } from "@/lib/postEngagement";
type Post = FeedPost & Partial<EngagementPost>;

interface FeedProps {
  userId?: string;
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "likes", label: "Most Liked" },
];
const TYPE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "image", label: "Image" },
  { value: "video", label: "Video" },
  { value: "reel", label: "Reel" },
  { value: "story", label: "Story" },
];

const PAGE_SIZE = 10;

const Feed: React.FC<FeedProps> = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
  const [sort, setSort] = useState("newest");
  const [typeFilter, setTypeFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const storiesRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Fetch all posts on mount or userId change
  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      setError(null);
      try {
        const backendPosts = await getAllPostsNewestFirst();
        let filtered = backendPosts;
        if (userId) {
          filtered = backendPosts.filter(post => post.creatorId === userId);
        }
        setPosts(filtered);
        setPage(1);
        setHasMore(filtered.length > PAGE_SIZE);
      } catch (err) {
        setError("Failed to load posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [userId]);

  // Apply sorting/filtering and pagination
  useEffect(() => {
    let filtered = posts;
    // Use type or postType for filtering
    if (typeFilter !== "all") {
      filtered = filtered.filter(post => {
        const t = typeof post.type === 'string' ? post.type : (typeof (post as { postType?: string }).postType === 'string' ? (post as { postType?: string }).postType : undefined);
        return t === typeFilter;
      });
    }
    if (tagFilter.trim()) {
      const tag = tagFilter.trim().toLowerCase();
      filtered = filtered.filter(post => Array.isArray(post.tags) && post.tags.some((t: string) => t.toLowerCase().includes(tag)));
    }
    if (sort === "likes") {
      filtered = filtered.slice().sort((a, b) => (Array.isArray(b.likes) ? b.likes.length : 0) - (Array.isArray(a.likes) ? a.likes.length : 0));
    } else {
      filtered = filtered.slice().sort((a, b) => {
        const dateA = new Date((a.createdAt || a.timestamp || "")).getTime();
        const dateB = new Date((b.createdAt || b.timestamp || "")).getTime();
        return dateB - dateA;
      });
    }
    const next = filtered.slice(0, page * PAGE_SIZE);
    setDisplayedPosts(next);
    setHasMore(next.length < filtered.length);
  }, [posts, sort, typeFilter, tagFilter, page]);

  // Infinite scroll observer
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !loading) {
      setPage(p => p + 1);
    }
  }, [hasMore, loading]);

  useEffect(() => {
    const option = { root: null, rootMargin: "20px", threshold: 1.0 };
    const observer = new window.IntersectionObserver(handleObserver, option);
    const loader = loaderRef.current;
    if (loader) observer.observe(loader);
    return () => { if (loader) observer.unobserve(loader); };
  }, [handleObserver]);

  const handleThreadClick = (id: string) => {
    navigate(`/thread/${id}`);
  };

  const scrollStories = (dir: "left" | "right") => {
    if (storiesRef.current) {
      const scrollAmount = 120;
      storiesRef.current.scrollBy({
        left: dir === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex flex-col items-center w-full py-4 px-2 sm:px-4 md:px-6 lg:px-0 bg-gray-50 min-h-screen">
      {/* Filter & Sort Controls */}
      <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl flex flex-wrap gap-2 mb-4 px-0 sm:px-2" role="region" aria-label="Feed filters">
        <label htmlFor="sort-select" className="sr-only">Sort posts</label>
        <select id="sort-select" value={sort} onChange={e => setSort(e.target.value)} className="rounded border px-2 py-1" aria-label="Sort posts">
          {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <label htmlFor="type-select" className="sr-only">Filter by type</label>
        <select id="type-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="rounded border px-2 py-1" aria-label="Filter by type">
          {TYPE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <label htmlFor="tag-filter" className="sr-only">Filter by tag</label>
        <input
          id="tag-filter"
          type="text"
          placeholder="Filter by tag"
          value={tagFilter}
          onChange={e => setTagFilter(e.target.value)}
          className="rounded border px-2 py-1 flex-1"
          aria-label="Filter by tag"
        />
      </div>
      {/* Stories Section */}
      <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl px-0 sm:px-2 mb-4">
        <div className="flex items-center mb-2">
          <span className="font-semibold text-lg">Stories</span>
          <div className="flex-1" />
          <button onClick={() => scrollStories("left")} className="p-1 mr-1 rounded-full bg-gray-100 hover:bg-gray-200" aria-label="Scroll stories left">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button onClick={() => scrollStories("right")} className="p-1 rounded-full bg-gray-100 hover:bg-gray-200" aria-label="Scroll stories right">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>
          </button>
        </div>
        <div
          ref={storiesRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory"
          style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none", msOverflowStyle: "none" }}
          aria-label="Stories"
        >
          {/* TODO: Render story previews here. Example placeholder: */}
          <div className="w-16 h-24 bg-gradient-to-br from-felaco-purple to-felaco-pink rounded-lg flex items-center justify-center text-white font-bold opacity-60 select-none">
            Story
          </div>
        </div>
      </div>
      <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl space-y-4 sm:space-y-6 px-0 sm:px-2">
        {error && (
          <div className="w-full text-center text-red-500 py-8">{error}</div>
        )}
        {loading && (
          <div className="w-full flex justify-center py-12">
            <svg className="animate-spin h-8 w-8 text-felaco-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
          </div>
        )}
        {!loading && !error && displayedPosts.length === 0 && (
          <div className="w-full text-center text-gray-400 py-12">No posts found. Try changing your filters or check back later.</div>
        )}
        {!loading && !error && displayedPosts.map((post, i) => {
          // Only allow PostCard types: 'image', 'video', 'multi-image'
          let type: "image" | "video" | "multi-image" = "image";
          if (post.type === "video") type = "video";
          // If in the future, multi-image is supported, add logic here
          // For now, treat 'reel', 'story', 'text' as 'image' for fallback
          const mappedPost = {
            id: post.id,
            type,
            media: post.contentUrl ? [post.contentUrl] : [],
            description: post.caption || '',
            likes: Array.isArray(post.likes) ? post.likes.length : 0,
            comments: 0, // No comments field in post, default to 0
            saves: Array.isArray(post.saves) ? post.saves.length : 0,
          };
          return (
            <PostCard key={i} loading={loading} post={mappedPost} onThreadClick={handleThreadClick} />
          );
        })}
        <div ref={loaderRef} className="h-8 flex items-center justify-center text-gray-400 text-xs">
          {hasMore && !loading && !error && <span>Loading more...</span>}
        </div>
      </div>
    </div>
  );
};

export default Feed;

// Tailwind utility for hiding scrollbars
// Add this to your global CSS if not present:
// .scrollbar-hide::-webkit-scrollbar { display: none; }
// .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
