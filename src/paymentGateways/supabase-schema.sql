-- Supabase SQL for wallet and role tables

CREATE TABLE IF NOT EXISTS wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  balance numeric DEFAULT 0,
  type text CHECK (type IN ('user', 'creator', 'admin', 'super-admin')) DEFAULT 'user',
  created_at timestamp with time zone DEFAULT timezone('utc', now()),
  updated_at timestamp with time zone DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id uuid REFERENCES wallets(id) ON DELETE CASCADE,
  type text CHECK (type IN ('topup', 'withdrawal', 'payment', 'payout')),
  amount numeric NOT NULL,
  status text CHECK (status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
  payment_gateway text,
  reference text,
  created_at timestamp with time zone DEFAULT timezone('utc', now()),
  updated_at timestamp with time zone DEFAULT timezone('utc', now()),
  metadata jsonb
);

CREATE TABLE IF NOT EXISTS user_roles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text CHECK (role IN ('user', 'creator', 'admin', 'super-admin')) NOT NULL
);
