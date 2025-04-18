-- Update users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  username TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  assetType TEXT NOT NULL,
  assetName TEXT NOT NULL,
  rentalType TEXT,
  route TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  operationalCosts JSONB,
  trips INTEGER,
  days INTEGER,
  dailyCash NUMERIC NOT NULL DEFAULT 0,
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update monthly_expenses table
CREATE TABLE IF NOT EXISTS monthly_expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  month TEXT NOT NULL,
  year TEXT NOT NULL,
  staffSalary NUMERIC NOT NULL DEFAULT 0,
  nightGuardSalary NUMERIC NOT NULL DEFAULT 0,
  electricityBill NUMERIC NOT NULL DEFAULT 0,
  waterBill NUMERIC NOT NULL DEFAULT 0,
  internetBill NUMERIC NOT NULL DEFAULT 0,
  otherExpenses NUMERIC NOT NULL DEFAULT 0,
  totalExpense NUMERIC NOT NULL DEFAULT 0,
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_expenses ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Public users access" ON users;
CREATE POLICY "Public users access"
  ON users FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own data" ON users;
CREATE POLICY "Users can insert their own data"
  ON users FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public transactions access" ON transactions;
CREATE POLICY "Public transactions access"
  ON transactions FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert transactions" ON transactions;
CREATE POLICY "Users can insert transactions"
  ON transactions FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public monthly_expenses access" ON monthly_expenses;
CREATE POLICY "Public monthly_expenses access"
  ON monthly_expenses FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert monthly_expenses" ON monthly_expenses;
CREATE POLICY "Users can insert monthly_expenses"
  ON monthly_expenses FOR INSERT
  WITH CHECK (true);

-- Enable realtime
alter publication supabase_realtime add table users;
alter publication supabase_realtime add table transactions;
alter publication supabase_realtime add table monthly_expenses;
