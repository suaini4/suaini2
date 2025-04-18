import { useState, useEffect } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { getTransactionsByMonth } from "@/services/transactionService";
import { getMonthlyExpenseByMonth } from "@/services/monthlyExpenseService";
import type { Transaction, MonthlyExpense } from "@/types/supabase";

// Using types from @/types/supabase

export interface ReportData {
  transactions: Transaction[];
  monthlyExpenses: MonthlyExpense[];
  daysInMonth: number[];
  carNames: string[];
  speedboatNames: string[];
  totalIncome: number;
  totalExpenses: number;
  totalMonthlyExpenses: number;
  totalBalance: number;
  remainingCash: number; // Added remaining cash field
  calculateDailyIncome: (
    day: number,
    assetType?: "car" | "speedboat" | "restaurant",
    assetName?: string,
  ) => number;
  calculateDailyExpenses: (day: number, assetName?: string) => number;
  calculateDailyCash: (
    day: number,
    assetType?: "car" | "speedboat" | "restaurant",
  ) => number;
  calculateTotalIncome: (
    assetType?: "car" | "speedboat" | "restaurant",
    assetName?: string,
  ) => number;
  calculateTotalExpenses: (assetName?: string) => number;
  calculateTotalCash: (
    assetType?: "car" | "speedboat" | "restaurant",
  ) => number;
  formatCurrency: (amount: number) => string;
  generateMonthOptions: () => { value: string; label: string }[];
  isLoading: boolean;
  error: string | null;
}

export const useReportData = (selectedMonth: string): ReportData => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState<MonthlyExpense[]>([]);
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Generate array of days in the selected month
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [year, month] = selectedMonth.split("-").map(Number);
        const daysCount = new Date(year, month, 0).getDate();
        setDaysInMonth(Array.from({ length: daysCount }, (_, i) => i + 1));

        // Load transactions from Supabase
        try {
          const transactionsData = await getTransactionsByMonth(year, month);
          setTransactions(transactionsData);
        } catch (err) {
          console.error("Error fetching transactions:", err);
          setError("Gagal memuat data transaksi. Silakan coba lagi.");
          setTransactions([]);
          // Continue execution even if transactions fail to load
        }

        // Load monthly expenses from Supabase
        try {
          const monthlyExpense = await getMonthlyExpenseByMonth(
            year.toString(),
            month.toString().padStart(2, "0"),
          );

          if (monthlyExpense) {
            setMonthlyExpenses([monthlyExpense]);
          } else {
            setMonthlyExpenses([]);
          }
        } catch (err) {
          console.error("Error fetching monthly expenses:", err);
          setError("Gagal memuat data pengeluaran bulanan. Silakan coba lagi.");
          setMonthlyExpenses([]);
        }
      } catch (error) {
        console.error("Error fetching report data:", error);
        setError("Gagal memuat data laporan. Silakan coba lagi.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth]);

  // Generate months for the select dropdown
  const generateMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    // Generate options for the current year and previous year
    for (let year = currentYear; year >= currentYear - 1; year--) {
      for (let month = 1; month <= 12; month++) {
        // Skip future months
        if (year === currentYear && month > currentDate.getMonth() + 1) {
          continue;
        }

        const monthStr = month.toString().padStart(2, "0");
        const monthName = format(new Date(year, month - 1, 1), "MMMM", {
          locale: id,
        });
        options.push({
          value: `${year}-${monthStr}`,
          label: `${monthName} ${year}`,
        });
      }
    }

    return options;
  };

  // Extract unique car and speedboat names from transactions
  const carNames = [
    ...new Set(
      transactions.filter((t) => t.assetType === "car").map((t) => t.assetName),
    ),
  ];

  const speedboatNames = [
    ...new Set(
      transactions
        .filter((t) => t.assetType === "speedboat")
        .map((t) => t.assetName),
    ),
  ];

  // Calculate total income from all transactions
  const totalIncome = transactions.reduce((sum, t) => sum + t.price, 0);

  // Calculate total expenses from car operational costs
  const totalExpenses = transactions.reduce((sum, t) => {
    const fuelCost = t.operationalCosts?.fuel || 0;
    const driverCost = t.operationalCosts?.driver || 0;
    return sum + fuelCost + driverCost;
  }, 0);

  // Calculate total monthly expenses
  const totalMonthlyExpenses = monthlyExpenses.reduce(
    (sum, e) => sum + e.totalExpense,
    0,
  );

  // Calculate total balance
  const totalBalance = totalIncome - totalExpenses - totalMonthlyExpenses;

  // Calculate daily income for specific day, asset type, and asset name
  const calculateDailyIncome = (
    day: number,
    assetType?: "car" | "speedboat" | "restaurant",
    assetName?: string,
  ) => {
    return transactions
      .filter((t) => {
        const transactionDay = new Date(t.date).getDate();
        const matchesDay = transactionDay === day;
        const matchesType = !assetType || t.assetType === assetType;
        const matchesName = !assetName || t.assetName === assetName;
        return matchesDay && matchesType && matchesName;
      })
      .reduce((sum, t) => sum + t.price, 0);
  };

  // Calculate daily expenses for specific day and asset name
  const calculateDailyExpenses = (day: number, assetName?: string) => {
    return transactions
      .filter((t) => {
        const transactionDay = new Date(t.date).getDate();
        const matchesDay = transactionDay === day;
        const matchesName = !assetName || t.assetName === assetName;
        return matchesDay && matchesName;
      })
      .reduce((sum, t) => {
        const fuelCost = t.operationalCosts?.fuel || 0;
        const driverCost = t.operationalCosts?.driver || 0;
        return sum + fuelCost + driverCost;
      }, 0);
  };

  // Calculate daily cash for specific day and asset type
  const calculateDailyCash = (
    day: number,
    assetType?: "car" | "speedboat" | "restaurant",
  ) => {
    return transactions
      .filter((t) => {
        const transactionDay = new Date(t.date).getDate();
        const matchesDay = transactionDay === day;
        const matchesType = !assetType || t.assetType === assetType;
        return matchesDay && matchesType;
      })
      .reduce((sum, t) => sum + t.dailyCash, 0);
  };

  // Calculate total income for specific asset type and asset name
  const calculateTotalIncome = (
    assetType?: "car" | "speedboat" | "restaurant",
    assetName?: string,
  ) => {
    return transactions
      .filter((t) => {
        const matchesType = !assetType || t.assetType === assetType;
        const matchesName = !assetName || t.assetName === assetName;
        return matchesType && matchesName;
      })
      .reduce((sum, t) => sum + t.price, 0);
  };

  // Calculate total expenses for specific asset name
  const calculateTotalExpenses = (assetName?: string) => {
    return transactions
      .filter((t) => !assetName || t.assetName === assetName)
      .reduce((sum, t) => {
        const fuelCost = t.operationalCosts?.fuel || 0;
        const driverCost = t.operationalCosts?.driver || 0;
        return sum + fuelCost + driverCost;
      }, 0);
  };

  // Calculate total cash for specific asset type
  const calculateTotalCash = (
    assetType?: "car" | "speedboat" | "restaurant",
  ) => {
    return transactions
      .filter((t) => !assetType || t.assetType === assetType)
      .reduce((sum, t) => sum + t.dailyCash, 0);
  };

  // Calculate remaining cash (Sisa Uang Kas)
  const totalCash = calculateTotalCash();
  const remainingCash = totalCash - totalMonthlyExpenses;

  const formatCurrency = (amount: number) => `Rp ${amount.toLocaleString()}`;

  return {
    transactions,
    monthlyExpenses,
    daysInMonth,
    carNames,
    speedboatNames,
    totalIncome,
    totalExpenses,
    totalMonthlyExpenses,
    totalBalance,
    remainingCash,
    calculateDailyIncome,
    calculateDailyExpenses,
    calculateDailyCash,
    calculateTotalIncome,
    calculateTotalExpenses,
    calculateTotalCash,
    formatCurrency,
    generateMonthOptions,
    isLoading,
    error,
  };
};
