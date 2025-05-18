-- Supabase RLS policy: Allow sender to delete their own message within 60 minutes
-- Run this in the Supabase SQL editor for the 'messages' table

-- Enable RLS if not already enabled
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy: Only sender can delete, and only within 60 minutes of creation
CREATE POLICY "Allow sender to delete own message within 60 minutes" ON messages
FOR DELETE
USING (
  auth.uid() = sender_id
  AND created_at > (now() - interval '60 minutes')
);
