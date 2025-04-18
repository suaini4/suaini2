/**
 * This file is kept as a placeholder to maintain compatibility with any imports.
 * The application now uses Supabase for data persistence instead of localStorage.
 *
 * For actual implementations, please refer to src/services/supabaseService.ts
 */

import { supabase } from "../lib/supabase";
import type { Transaction, MonthlyExpense } from "../types/supabase";

// Type definitions for backward compatibility
export type User = {
  id: string;
  username: string;
  password?: string;
  isAuthenticated: boolean;
};

// Re-export types for backward compatibility
export { Transaction, MonthlyExpense };

// Generate a unique ID
export const generateId = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

// Initialize default users
export const initializeDefaultUsers = async (): Promise<void> => {
  try {
    const { data, error } = await supabase.from("users").select("*");

    if (error) {
      console.error("Error checking users:", error);
      return;
    }

    if (!data || data.length === 0) {
      // Add default admin user
      await supabase.from("users").insert([
        {
          id: generateId(),
          email: "admin",
          username: "admin",
          is_admin: true,
        },
        {
          id: generateId(),
          email: "operator",
          username: "operator",
          is_admin: false,
        },
      ]);
    }
  } catch (error) {
    console.error("Error initializing default users:", error);
  }
};

// Authentication functions
export const login = async (
  username: string,
  password: string,
): Promise<User> => {
  try {
    // For simplicity, we're using a direct password comparison
    // In a real app, you would use Supabase Auth with proper password hashing
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", username)
      .single();

    if (error || !data) {
      throw new Error("Username atau password salah");
    }

    // Simple password check (this should be replaced with proper auth)
    if (password !== "admin123" && password !== "operator123") {
      throw new Error("Username atau password salah");
    }

    const currentUser = {
      id: data.id,
      username: data.email,
      isAuthenticated: true,
    };

    localStorage.setItem("bjt_current_user", JSON.stringify(currentUser));

    return currentUser;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Login gagal");
  }
};

export const logout = (): void => {
  localStorage.removeItem("bjt_current_user");
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem("bjt_current_user");
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = (): boolean => {
  const currentUser = getCurrentUser();
  return !!currentUser?.isAuthenticated;
};

// Transaction functions
export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
};

export const getTransactionsByMonth = async (
  year: number,
  month: number,
): Promise<Transaction[]> => {
  try {
    // Format month to ensure it's two digits
    const monthStr = month.toString().padStart(2, "0");

    // Create date range for the month
    const startDate = `${year}-${monthStr}-01`;
    const endDate =
      month === 12
        ? `${year + 1}-01-01`
        : `${year}-${(month + 1).toString().padStart(2, "0")}-01`;

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .gte("date", startDate)
      .lt("date", endDate)
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching transactions by month:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching transactions by month:", error);
    return [];
  }
};

export const createTransaction = async (
  transaction: Omit<Transaction, "id">,
): Promise<Transaction> => {
  try {
    const newTransaction = { ...transaction, id: generateId() };

    const { data, error } = await supabase
      .from("transactions")
      .insert([newTransaction])
      .select()
      .single();

    if (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
};

export const updateTransaction = async (
  transaction: Transaction,
): Promise<Transaction> => {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .update(transaction)
      .eq("id", transaction.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating transaction:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }
};

export const deleteTransaction = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase.from("transactions").delete().eq("id", id);

    if (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
};

// Monthly expense functions
export const getMonthlyExpenses = async (): Promise<MonthlyExpense[]> => {
  try {
    const { data, error } = await supabase
      .from("monthly_expenses")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching monthly expenses:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching monthly expenses:", error);
    return [];
  }
};

export const getMonthlyExpenseByMonth = async (
  year: string,
  month: string,
): Promise<MonthlyExpense | null> => {
  try {
    const { data, error } = await supabase
      .from("monthly_expenses")
      .select("*")
      .eq("year", year)
      .eq("month", month)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No data found
        return null;
      }
      console.error("Error fetching monthly expense by month:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching monthly expense by month:", error);
    return null;
  }
};

export const createMonthlyExpense = async (
  expense: Omit<MonthlyExpense, "id">,
): Promise<MonthlyExpense> => {
  try {
    const newExpense = { ...expense, id: generateId() };

    const { data, error } = await supabase
      .from("monthly_expenses")
      .insert([newExpense])
      .select()
      .single();

    if (error) {
      console.error("Error creating monthly expense:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error creating monthly expense:", error);
    throw error;
  }
};

export const updateMonthlyExpense = async (
  expense: MonthlyExpense,
): Promise<MonthlyExpense> => {
  try {
    const { data, error } = await supabase
      .from("monthly_expenses")
      .update(expense)
      .eq("id", expense.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating monthly expense:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error updating monthly expense:", error);
    throw error;
  }
};

export const deleteMonthlyExpense = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("monthly_expenses")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting monthly expense:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error deleting monthly expense:", error);
    throw error;
  }
};

export const upsertMonthlyExpense = async (
  expense: Omit<MonthlyExpense, "id">,
  existingId?: string,
): Promise<MonthlyExpense> => {
  try {
    // Check if expense for this month already exists
    const existingExpense = await getMonthlyExpenseByMonth(
      expense.year,
      expense.month,
    );

    if (existingExpense || existingId) {
      const expenseId = existingId || existingExpense!.id;
      const updatedExpense = { ...expense, id: expenseId } as MonthlyExpense;
      return updateMonthlyExpense(updatedExpense);
    } else {
      return createMonthlyExpense(expense);
    }
  } catch (error) {
    console.error("Error upserting monthly expense:", error);
    throw error;
  }
};

// Create a new user
export const createUser = async (user: Omit<User, "id">): Promise<User> => {
  try {
    const newUser = {
      id: generateId(),
      email: user.username,
      username: user.username,
      is_admin: false,
    };

    const { data, error } = await supabase
      .from("users")
      .insert([newUser])
      .select()
      .single();

    if (error) {
      console.error("Error creating user:", error);
      throw error;
    }

    return {
      id: data.id,
      username: data.username || data.email,
      isAuthenticated: false,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};
