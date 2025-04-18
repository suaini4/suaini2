-- Fix transaction table to ensure no null values in critical fields
ALTER TABLE transactions
ALTER COLUMN operational_costs SET DEFAULT '{"fuel": 0, "driver": 0}'::jsonb,
ALTER COLUMN trips SET DEFAULT 1,
ALTER COLUMN days SET DEFAULT 1,
ALTER COLUMN daily_cash SET DEFAULT 0;

-- Update any existing null values
UPDATE transactions 
SET operational_costs = '{"fuel": 0, "driver": 0}'::jsonb 
WHERE operational_costs IS NULL;

UPDATE transactions 
SET trips = 1 
WHERE trips IS NULL;

UPDATE transactions 
SET days = 1 
WHERE days IS NULL;

UPDATE transactions 
SET daily_cash = 0 
WHERE daily_cash IS NULL;

UPDATE transactions 
SET route = '' 
WHERE route IS NULL;