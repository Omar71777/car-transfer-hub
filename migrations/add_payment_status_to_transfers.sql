
-- Add payment_status column to transfers table
ALTER TABLE transfers ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
