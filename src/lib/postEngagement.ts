import { supabase } from '../integrations/supabase/client';
import type { Database } from '../integrations/supabase/types';

// Post structure for dynamic posting system
export interface Post {
  id: string;
  authorId: string;
  type: "image" | "video" | "reel" | "story" | "text";
  contentUrl: string;
  caption?: string;
  tags: string[];
  createdAt: string; // ISO timestamp
  viewCount: number;
  likes: string[]; // userIds
  shares: number;
  saves: string[]; // userIds
  expiresAt?: string; // ISO timestamp, for stories
}

// Engagement tracking functions (Supabase integration)
export async function likePost(postId: string, userId: string): Promise<void> {
  // Add userId to likes array if not present
  await supabase.rpc('add_like_to_post', { post_id: postId, user_id: userId });
}

export async function savePost(postId: string, userId: string): Promise<void> {
  // Add userId to saves array if not present
  await supabase.rpc('add_save_to_post', { post_id: postId, user_id: userId });
}

export async function sharePost(postId: string, userId: string): Promise<void> {
  // Increment shares count
  await supabase.rpc('increment_post_shares', { post_id: postId });
}

export async function recordView(postId: string, userId: string): Promise<void> {
  // Only increment viewCount if user hasn't viewed before
  await supabase.rpc('record_post_view', { post_id: postId, user_id: userId });
}

// Story expiration logic
export function isStoryExpired(post: Post): boolean {
  if (post.type !== 'story' || !post.expiresAt) return false;
  return new Date(post.expiresAt).getTime() < Date.now();
}

// Filter out expired stories from a list of posts
export function filterActiveStories(posts: Post[]): Post[] {
  return posts.filter(post => post.type !== 'story' || !isStoryExpired(post));
}

// Feed sorting/filtering utilities
export function sortPostsByRecency(posts: Post[]): Post[] {
  return posts.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function sortPostsByEngagement(posts: Post[]): Post[] {
  return posts.slice().sort((a, b) => (b.likes.length + b.shares + b.saves.length + b.viewCount) - (a.likes.length + a.shares + a.saves.length + a.viewCount));
}

export function filterPostsByType(posts: Post[], type: Post["type"]): Post[] {
  return posts.filter(post => post.type === type);
}

// Example: get trending posts (stub)
export async function getTrendingPosts(): Promise<Post[]> {
  // TODO: Query posts sorted by engagement and recency
  return [];
}
