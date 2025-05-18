// Utility functions for feed recommendation system
// These are stubs and should be implemented with real data access logic

import { supabase } from '../integrations/supabase/client';
// Use the exported Post type from getRecommendedPosts for all Post typings
import type { Post } from './getRecommendedPosts';

// When mapping/returning posts, ensure all required fields are present
type RawPost = Record<string, unknown>;
function normalizePost(raw: RawPost): Post {
  return {
    id: String(raw.id ?? ''),
    tags: Array.isArray(raw.tags) ? (raw.tags as string[]) : [],
    timestamp: String(raw.timestamp ?? raw.createdAt ?? raw.created_at ?? ''),
    engagementScore: Number(raw.engagementScore ?? raw.engagement_score ?? 0),
    creatorId: String(raw.creatorId ?? raw.creator_id ?? ''),
    nsfw: Boolean(raw.nsfw ?? false),
  };
}

export async function getUserRecentSearches(userId: string, limit: number): Promise<string[]> {
  if (!userId) return [];
  // Use @ts-expect-error to suppress type errors for custom tables
  // @ts-expect-error: Custom table not in Supabase types
  const { data, error } = await supabase.from('search_history').select('query').eq('user_id', userId).order('created_at', { ascending: false }).limit(limit);
  if (error || !data) return [];
  return ((data as unknown) as { query: string }[]).map((row) => row.query);
}

export async function getPostsByMatchingTags(searches: string[], opts?: { nsfw?: boolean }): Promise<Post[]> {
  if (!Array.isArray(searches) || searches.length === 0) return [];
  let query = supabase
    .from('posts')
    .select('*')
    .overlaps('tags', searches);
  if (opts?.nsfw !== undefined) {
    query = query.eq('nsfw', opts.nsfw);
  }
  const { data, error } = await query.order('engagement_score', { ascending: false }).order('created_at', { ascending: false });
  if (error || !data) return [];
  return (data as RawPost[]).map(normalizePost);
}

export async function getTrendingPosts(): Promise<Post[]> {
  const since = new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .gte('created_at', since)
    .order('engagement_score', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(50);
  if (error || !data) return [];
  return (data as RawPost[]).map(normalizePost);
}

export function sortByEngagementAndRecency(posts: Post[]): Post[] {
  if (!Array.isArray(posts)) return [];
  return posts.slice().sort((a, b) => {
    if (b.engagementScore !== a.engagementScore) {
      return b.engagementScore - a.engagementScore;
    }
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
}

export async function getFollowedCreatorsPosts(userId: string): Promise<Post[]> {
  if (!userId) return [];
  // @ts-expect-error: Custom table not in Supabase types
  const { data: follows, error: followsError } = await supabase.from('follows').select('followed_id').eq('follower_id', userId);
  if (followsError || !follows || follows.length === 0) return [];
  // Defensive: convert to unknown first to satisfy TS
  const followedIds = (follows as unknown as { followed_id: string }[]).map((f) => f.followed_id);
  if (followedIds.length === 0) return [];
  const { data: posts, error: postsError } = await supabase
    .from('posts')
    .select('*')
    .in('creator_id', followedIds)
    .order('created_at', { ascending: false })
    .limit(50);
  if (postsError || !posts) return [];
  return (posts as RawPost[]).map(normalizePost);
}

export function getCuratedPosts(): Post[] {
  // Return a static fallback list of curated posts (empty for now)
  return [];
}
