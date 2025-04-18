-- Enable the pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password TEXT,
  is_authenticated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('car', 'speedboat', 'restaurant')),
  asset_name TEXT NOT NULL,
  rental_type TEXT CHECK (rental_type IN ('drop', 'harian')),
  route TEXT,
  price NUMERIC NOT NULL,
  fuel_cost NUMERIC,
  driver_cost NUMERIC,
  trips INTEGER NOT NULL,
  days INTEGER,
  daily_cash NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create monthly expenses table
CREATE TABLE IF NOT EXISTS public.monthly_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  month TEXT NOT NULL,
  year TEXT NOT NULL,
  staff_salary NUMERIC NOT NULL,
  night_guard_salary NUMERIC NOT NULL,
  electricity_bill NUMERIC NOT NULL,
  water_bill NUMERIC NOT NULL,
  internet_bill NUMERIC NOT NULL,
  other_expenses NUMERIC NOT NULL,
  total_expense NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(month, year)
);

-- Create RLS policies for users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Transactions are viewable by all authenticated users" ON public.transactions;
CREATE POLICY "Transactions are viewable by all authenticated users" ON public.transactions
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Transactions are insertable by all authenticated users" ON public.transactions;
CREATE POLICY "Transactions are insertable by all authenticated users" ON public.transactions
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Transactions are updatable by all authenticated users" ON public.transactions;
CREATE POLICY "Transactions are updatable by all authenticated users" ON public.transactions
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Transactions are deletable by all authenticated users" ON public.transactions;
CREATE POLICY "Transactions are deletable by all authenticated users" ON public.transactions
  FOR DELETE USING (true);

-- Create RLS policies for monthly expenses
ALTER TABLE public.monthly_expenses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Monthly expenses are viewable by all authenticated users" ON public.monthly_expenses;
CREATE POLICY "Monthly expenses are viewable by all authenticated users" ON public.monthly_expenses
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Monthly expenses are insertable by all authenticated users" ON public.monthly_expenses;
CREATE POLICY "Monthly expenses are insertable by all authenticated users" ON public.monthly_expenses
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Monthly expenses are updatable by all authenticated users" ON public.monthly_expenses;
CREATE POLICY "Monthly expenses are updatable by all authenticated users" ON public.monthly_expenses
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Monthly expenses are deletable by all authenticated users" ON public.monthly_expenses;
CREATE POLICY "Monthly expenses are deletable by all authenticated users" ON public.monthly_expenses
  FOR DELETE USING (true);

-- Enable realtime for all tables
alter publication supabase_realtime add table users;
alter publication supabase_realtime add table transactions;
alter publication supabase_realtime add table monthly_expenses;

-- Insert default users
INSERT INTO public.users (username, password, is_authenticated)
VALUES ('admin', 'admin123', false),
       ('operator', 'operator123', false)
ON CONFLICT (username) DO NOTHING;
