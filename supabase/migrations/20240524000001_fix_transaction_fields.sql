-- Fix transaction table fields to use JSON for operational costs
ALTER TABLE transactions DROP COLUMN IF EXISTS fuel_cost;
ALTER TABLE transactions DROP COLUMN IF EXISTS driver_cost;

-- Make sure operational_costs column exists and is JSON type
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'operational_costs') THEN
    ALTER TABLE transactions ADD COLUMN operational_costs JSONB;
  END IF;
END $$;

-- Enable realtime for transactions table
alter publication supabase_realtime add table transactions;
