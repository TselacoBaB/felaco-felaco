-- Enable RLS for messages table
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy: Only sender can delete their own message within 60 minutes
CREATE POLICY "Allow sender to delete own message within 60 minutes" ON messages
FOR DELETE
USING (
  auth.uid() = sender_id
  AND created_at > (now() - interval '60 minutes')
);

-- Policy: Only sender or receiver can select (read) messages
CREATE POLICY "Allow sender or receiver to read messages" ON messages
FOR SELECT
USING (
  auth.uid() = sender_id OR auth.uid() = receiver_id
);

-- Policy: Only sender can insert messages
CREATE POLICY "Allow sender to insert messages" ON messages
FOR INSERT
WITH CHECK (
  auth.uid() = sender_id
);
