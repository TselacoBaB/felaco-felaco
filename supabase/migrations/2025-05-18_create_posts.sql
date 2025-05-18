-- Supabase SQL schema for posts table supporting Felaco's requirements
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  type text CHECK (type IN ('image', 'video', 'reel', 'story', 'text')) NOT NULL,
  content_url text,
  caption text,
  tags text[],
  nsfw boolean DEFAULT false,
  created_at timestamptz DEFAULT timezone('utc', now()),
  expires_at timestamptz,
  view_count integer DEFAULT 0,
  likes text[] DEFAULT '{}', -- user ids
  shares integer DEFAULT 0,
  saves text[] DEFAULT '{}', -- user ids
  engagement_score integer GENERATED ALWAYS AS (coalesce(array_length(likes,1),0) + shares + coalesce(array_length(saves,1),0) + view_count) STORED
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_posts_tags ON posts USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_posts_nsfw ON posts (nsfw);
CREATE INDEX IF NOT EXISTS idx_posts_type ON posts (type);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_engagement_score ON posts (engagement_score DESC, created_at DESC);

-- For story expiration
CREATE INDEX IF NOT EXISTS idx_posts_expires_at ON posts (expires_at);
