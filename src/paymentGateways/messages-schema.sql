-- Supabase SQL for real-time messaging (DMs)

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text,
  media_url text,
  message_type text CHECK (message_type IN ('text', 'image', 'video')) DEFAULT 'text',
  seen boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc', now())
);

-- Index for fast conversation lookup
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages (sender_id, receiver_id, created_at);
