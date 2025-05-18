// This file will contain Supabase table schemas and suggestions for wallet/payment integration

/*
Suggested Supabase tables:

1. wallets
- id (uuid, primary key)
- user_id (uuid, foreign key to users)
- balance (numeric)
- created_at (timestamp)
- updated_at (timestamp)

2. wallet_transactions
- id (uuid, primary key)
- wallet_id (uuid, foreign key to wallets)
- type (enum: 'topup', 'withdrawal', 'payment', etc)
- amount (numeric)
- status (enum: 'pending', 'completed', 'failed')
- payment_gateway (text)
- reference (text)
- created_at (timestamp)
- updated_at (timestamp)
- metadata (jsonb)
*/

// Use Supabase dashboard or SQL editor to create these tables.
