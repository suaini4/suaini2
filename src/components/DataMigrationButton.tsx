import { useState } from "react";
import { Button } from "./ui/button";
import { migrateLocalStorageToSupabase } from "../services/supabaseService";
import { toast } from "./ui/use-toast";

export default function DataMigrationButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [migrationResult, setMigrationResult] = useState<{
    users: number;
    transactions: number;
    expenses: number;
  } | null>(null);

  const handleMigration = async () => {
    setIsLoading(true);
    try {
      const result = await migrateLocalStorageToSupabase();
      setMigrationResult(result);
      toast({
        title: "Migrasi Data Berhasil",
        description: `${result.users} pengguna, ${result.transactions} transaksi, dan ${result.expenses} pengeluaran bulanan telah dimigrasikan ke Supabase.`,
        variant: "default",
      });
    } catch (error) {
      console.error("Migration error:", error);
      toast({
        title: "Migrasi Data Gagal",
        description: `Terjadi kesalahan saat migrasi data: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Migrasi Data ke Supabase</h2>
      <p className="text-sm text-gray-600 mb-4">
        Klik tombol di bawah untuk memindahkan data dari penyimpanan lokal ke
        database Supabase. Data yang akan dimigrasikan meliputi pengguna,
        transaksi, dan pengeluaran bulanan.
      </p>

      <Button
        onClick={handleMigration}
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {isLoading ? "Sedang Migrasi..." : "Migrasi Data ke Supabase"}
      </Button>

      {migrationResult && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <h3 className="font-medium text-green-800">Migrasi Berhasil!</h3>
          <ul className="mt-2 text-sm text-green-700">
            <li>Pengguna: {migrationResult.users}</li>
            <li>Transaksi: {migrationResult.transactions}</li>
            <li>Pengeluaran Bulanan: {migrationResult.expenses}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
