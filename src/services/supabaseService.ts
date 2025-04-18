import { supabase } from "@/lib/supabase";
import type { Transaction, MonthlyExpense } from "./localStorageService";

// Fungsi untuk menghasilkan ID unik
export const generateId = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

// Fungsi untuk mendapatkan semua transaksi
export const getTransactions = async (): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }

  // Konversi data dari format Supabase ke format aplikasi
  return (data || []).map((item) => ({
    id: item.id,
    date: item.date,
    assetType: item.asset_type as "car" | "speedboat" | "restaurant",
    assetName: item.asset_name || "",
    rentalType: item.rental_type as "drop" | "harian" | undefined,
    route: item.route || "",
    price: item.price,
    operationalCosts: item.operational_costs
      ? {
          fuel: item.operational_costs.fuel || 0,
          driver: item.operational_costs.driver || 0,
        }
      : {
          fuel: 0,
          driver: 0,
        },
    trips: item.trips || 1,
    days: item.days || 1,
    dailyCash: item.daily_cash,
  }));
};

// Fungsi untuk mendapatkan transaksi berdasarkan bulan
export const getTransactionsByMonth = async (
  year: number,
  month: number,
): Promise<Transaction[]> => {
  const startDate = `${year}-${month.toString().padStart(2, "0")}-01`;
  const endDate = `${year}-${month.toString().padStart(2, "0")}-31`;

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: true });

  if (error) {
    console.error("Error fetching transactions by month:", error);
    throw error;
  }

  // Konversi data dari format Supabase ke format aplikasi
  return (data || []).map((item) => ({
    id: item.id,
    date: item.date,
    assetType: item.asset_type as "car" | "speedboat" | "restaurant",
    assetName: item.asset_name || "",
    rentalType: item.rental_type as "drop" | "harian" | undefined,
    route: item.route || "",
    price: item.price,
    operationalCosts: item.operational_costs
      ? {
          fuel: item.operational_costs.fuel || 0,
          driver: item.operational_costs.driver || 0,
        }
      : {
          fuel: 0,
          driver: 0,
        },
    trips: item.trips || 1,
    days: item.days || 1,
    dailyCash: item.daily_cash,
  }));
};

// Fungsi untuk membuat transaksi baru
export const createTransaction = async (
  transaction: Omit<Transaction, "id">,
): Promise<Transaction> => {
  const newId = generateId();

  // Ensure all required fields have default values
  const safeTransaction = {
    ...transaction,
    route: transaction.route || "",
    trips: transaction.trips || 1,
    days: transaction.days || 1,
    dailyCash: transaction.dailyCash || 0,
    operationalCosts: transaction.operationalCosts || { fuel: 0, driver: 0 },
  };

  // Convert field names to match Supabase schema
  const { error } = await supabase.from("transactions").insert({
    id: newId,
    date: safeTransaction.date,
    asset_type: safeTransaction.assetType,
    asset_name: safeTransaction.assetName,
    rental_type: safeTransaction.rentalType,
    route: safeTransaction.route,
    price: safeTransaction.price,
    operational_costs: {
      fuel: safeTransaction.operationalCosts.fuel || 0,
      driver: safeTransaction.operationalCosts.driver || 0,
    },
    trips: safeTransaction.trips,
    days: safeTransaction.days,
    daily_cash: safeTransaction.dailyCash,
  });

  if (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }

  return { ...safeTransaction, id: newId };
};

// Fungsi untuk memperbarui transaksi
export const updateTransaction = async (
  transaction: Transaction,
): Promise<Transaction> => {
  const { error } = await supabase
    .from("transactions")
    .update({
      date: transaction.date,
      asset_type: transaction.assetType,
      asset_name: transaction.assetName,
      rental_type: transaction.rentalType,
      route: transaction.route,
      price: transaction.price,
      operational_costs: transaction.operationalCosts
        ? {
            fuel: transaction.operationalCosts.fuel || 0,
            driver: transaction.operationalCosts.driver || 0,
          }
        : null,
      trips: transaction.trips,
      days: transaction.days,
      daily_cash: transaction.dailyCash,
    })
    .eq("id", transaction.id);

  if (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }

  return transaction;
};

// Fungsi untuk menghapus transaksi
export const deleteTransaction = async (id: string): Promise<void> => {
  const { error } = await supabase.from("transactions").delete().eq("id", id);

  if (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
};

// Fungsi untuk mendapatkan semua pengeluaran bulanan
export const getMonthlyExpenses = async (): Promise<MonthlyExpense[]> => {
  const { data, error } = await supabase
    .from("monthly_expenses")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching monthly expenses:", error);
    throw error;
  }

  // Konversi data dari format Supabase ke format aplikasi
  return (data || []).map((item) => ({
    id: item.id,
    date: item.date,
    month: item.month,
    year: item.year,
    staffSalary: item.staff_salary || 0,
    nightGuardSalary: item.night_guard_salary || 0,
    electricityBill: item.electricity_bill || 0,
    waterBill: item.water_bill || 0,
    internetBill: item.internet_bill || 0,
    otherExpenses: item.other_expenses || 0,
    totalExpense: item.total_expense || 0,
  }));
};

// Fungsi untuk mendapatkan pengeluaran bulanan berdasarkan bulan
export const getMonthlyExpenseByMonth = async (
  year: string,
  month: string,
): Promise<MonthlyExpense | null> => {
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
    console.error("Error fetching monthly expense:", error);
    throw error;
  }

  if (!data) return null;

  // Konversi data dari format Supabase ke format aplikasi
  return {
    id: data.id,
    date: data.date,
    month: data.month,
    year: data.year,
    staffSalary: data.staff_salary || 0,
    nightGuardSalary: data.night_guard_salary || 0,
    electricityBill: data.electricity_bill || 0,
    waterBill: data.water_bill || 0,
    internetBill: data.internet_bill || 0,
    otherExpenses: data.other_expenses || 0,
    totalExpense: data.total_expense || 0,
  };
};

// Fungsi untuk membuat pengeluaran bulanan baru
export const createMonthlyExpense = async (
  expense: Omit<MonthlyExpense, "id">,
): Promise<MonthlyExpense> => {
  const newId = generateId();

  const { error } = await supabase.from("monthly_expenses").insert({
    id: newId,
    date: expense.date,
    month: expense.month,
    year: expense.year,
    staff_salary: expense.staffSalary || 0,
    night_guard_salary: expense.nightGuardSalary || 0,
    electricity_bill: expense.electricityBill || 0,
    water_bill: expense.waterBill || 0,
    internet_bill: expense.internetBill || 0,
    other_expenses: expense.otherExpenses || 0,
    total_expense: expense.totalExpense,
  });

  if (error) {
    console.error("Error creating monthly expense:", error);
    throw error;
  }

  return { ...expense, id: newId };
};

// Fungsi untuk memperbarui pengeluaran bulanan
export const updateMonthlyExpense = async (
  expense: MonthlyExpense,
): Promise<MonthlyExpense> => {
  const { error } = await supabase
    .from("monthly_expenses")
    .update({
      date: expense.date,
      month: expense.month,
      year: expense.year,
      staff_salary: expense.staffSalary,
      night_guard_salary: expense.nightGuardSalary,
      electricity_bill: expense.electricityBill,
      water_bill: expense.waterBill,
      internet_bill: expense.internetBill,
      other_expenses: expense.otherExpenses,
      total_expense: expense.totalExpense,
    })
    .eq("id", expense.id);

  if (error) {
    console.error("Error updating monthly expense:", error);
    throw error;
  }

  return expense;
};

// Fungsi untuk menghapus pengeluaran bulanan
export const deleteMonthlyExpense = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("monthly_expenses")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting monthly expense:", error);
    throw error;
  }
};

// Fungsi untuk upsert pengeluaran bulanan (buat jika tidak ada, perbarui jika ada)
export const upsertMonthlyExpense = async (
  expense: Omit<MonthlyExpense, "id">,
  existingId?: string,
): Promise<MonthlyExpense> => {
  if (existingId) {
    const updatedExpense = { ...expense, id: existingId } as MonthlyExpense;
    return await updateMonthlyExpense(updatedExpense);
  } else {
    // Cek apakah pengeluaran untuk bulan ini sudah ada
    const existingExpense = await getMonthlyExpenseByMonth(
      expense.year,
      expense.month,
    );

    if (existingExpense) {
      const updatedExpense = {
        ...expense,
        id: existingExpense.id,
      } as MonthlyExpense;
      return await updateMonthlyExpense(updatedExpense);
    } else {
      return await createMonthlyExpense(expense);
    }
  }
};

// Fungsi untuk migrasi data dari localStorage ke Supabase
export const migrateLocalStorageToSupabase = async (): Promise<{
  users: number;
  transactions: number;
  expenses: number;
}> => {
  // Import fungsi dari localStorageService
  const {
    getTransactions: getLocalTransactions,
    getMonthlyExpenses: getLocalMonthlyExpenses,
  } = await import("./localStorageService");

  // Migrasi transaksi
  const localTransactions = getLocalTransactions();
  let transactionCount = 0;

  for (const transaction of localTransactions) {
    try {
      // Cek apakah transaksi sudah ada di Supabase
      const { data: existingTransaction } = await supabase
        .from("transactions")
        .select("id")
        .eq("id", transaction.id)
        .single();

      if (!existingTransaction) {
        // Jika belum ada, tambahkan ke Supabase
        await supabase.from("transactions").insert({
          id: transaction.id,
          date: transaction.date,
          asset_type: transaction.assetType,
          asset_name: transaction.assetName,
          rental_type: transaction.rentalType,
          route: transaction.route,
          price: transaction.price,
          operational_costs: transaction.operationalCosts
            ? {
                fuel: transaction.operationalCosts.fuel || 0,
                driver: transaction.operationalCosts.driver || 0,
              }
            : null,
          trips: transaction.trips,
          days: transaction.days,
          daily_cash: transaction.dailyCash,
        });
        transactionCount++;
      }
    } catch (error) {
      console.error("Error migrating transaction:", error);
    }
  }

  // Migrasi pengeluaran bulanan
  const localExpenses = getLocalMonthlyExpenses();
  let expenseCount = 0;

  for (const expense of localExpenses) {
    try {
      // Cek apakah pengeluaran bulanan sudah ada di Supabase
      const { data: existingExpense } = await supabase
        .from("monthly_expenses")
        .select("id")
        .eq("id", expense.id)
        .single();

      if (!existingExpense) {
        // Jika belum ada, tambahkan ke Supabase
        await supabase.from("monthly_expenses").insert({
          id: expense.id,
          date: expense.date,
          month: expense.month,
          year: expense.year,
          staff_salary: expense.staffSalary,
          night_guard_salary: expense.nightGuardSalary,
          electricity_bill: expense.electricityBill,
          water_bill: expense.waterBill,
          internet_bill: expense.internetBill,
          other_expenses: expense.otherExpenses,
          total_expense: expense.totalExpense,
        });
        expenseCount++;
      }
    } catch (error) {
      console.error("Error migrating monthly expense:", error);
    }
  }

  return {
    users: 2, // Default users created in migration
    transactions: transactionCount,
    expenses: expenseCount,
  };
};
