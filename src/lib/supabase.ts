import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const initializeSupabaseTables = async (): Promise<void> => {
  try {
    // Check connection
    const { data, error } = await supabase
      .from("transactions")
      .select("count", { count: "exact", head: true });

    if (error) {
      console.error("Error connecting to Supabase:", error);
      throw new Error(`Supabase connection failed: ${error.message}`);
    }

    // Check users table
    const { data: usersData, error: usersError } = await supabase
      .from("users")
      .select("count", { count: "exact", head: true });

    if (usersError) {
      console.error("Error checking users table:", usersError);
      throw new Error(`Users table check failed: ${usersError.message}`);
    }

    // Check monthly_expenses table
    const { data: expensesData, error: expensesError } = await supabase
      .from("monthly_expenses")
      .select("count", { count: "exact", head: true });

    if (expensesError) {
      console.error("Error checking monthly_expenses table:", expensesError);
      throw new Error(
        `Monthly expenses table check failed: ${expensesError.message}`,
      );
    }

    console.log("Supabase connection successful");
    console.log(
      `Database stats - Transactions: ${data?.count || 0}, Users: ${usersData?.count || 0}, Monthly Expenses: ${expensesData?.count || 0}`,
    );

    return;
  } catch (error) {
    console.error("Error initializing Supabase tables:", error);
    throw error;
  }
};
