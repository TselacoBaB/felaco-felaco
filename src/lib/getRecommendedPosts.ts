// Smart content recommendation for user feed
// Requirements: see prompt above

import { getUserRecentSearches, getPostsByMatchingTags, getTrendingPosts, sortByEngagementAndRecency, getFollowedCreatorsPosts, getCuratedPosts } from './feedDataUtils';

// Export the Post interface for use in feedDataUtils and other modules
export interface Post {
  id: string;
  tags: string[];
  timestamp: string;
  engagementScore: number;
  creatorId: string;
  nsfw?: boolean;
}

export async function getRecommendedPosts(userId: string): Promise<Post[]> {
  const recentSearches = await getUserRecentSearches(userId, 5);

  // If no search history, show trending or curated content
  if (!recentSearches || recentSearches.length === 0) {
    // Try trending, fallback to curated
    const trending = await getTrendingPosts();
    if (trending.length > 0) return trending;
    return getCuratedPosts();
  }

  // Check for NSFW interest
  const nsfwSearch = recentSearches.some((s) => /nsfw|adult|explicit/i.test(s));
  let posts: Post[] = [];

  if (nsfwSearch) {
    // Prioritize NSFW posts
    posts = await getPostsByMatchingTags(recentSearches, { nsfw: true });
  } else {
    posts = await getPostsByMatchingTags(recentSearches);
  }

  // Optionally boost posts from followed creators
  const followedPosts = await getFollowedCreatorsPosts(userId);
  if (followedPosts.length > 0) {
    // Merge and deduplicate
    const all = [...posts, ...followedPosts];
    const unique = Array.from(new Map(all.map(p => [p.id, p])).values());
    return sortByEngagementAndRecency(unique);
  }

  if (posts.length > 0) {
    return sortByEngagementAndRecency(posts);
  }

  // Fallback to trending or curated
  const trending = await getTrendingPosts();
  if (trending.length > 0) return trending;
  return getCuratedPosts();
}
