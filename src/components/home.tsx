import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputForm from "./InputForm";
import { getCurrentUser } from "../services/auth";
import { useReportData } from "@/hooks/useReportData";
import { checkDatabaseConnection } from "@/utils/databaseChecker";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";

/**
 * Saran untuk Pengembangan Halaman Utama:
 *
 * 1. Dashboard Ringkasan: Tambahkan ringkasan data keuangan terbaru seperti pendapatan
 *    hari ini, pengeluaran terbaru, dan saldo saat ini dengan visualisasi grafik yang menarik.
 *
 * 2. Pintasan Cepat: Tambahkan pintasan untuk tindakan yang sering dilakukan seperti
 *    menambahkan transaksi tertentu atau melihat laporan spesifik dengan ikon yang intuitif.
 *
 * 3. Aktivitas Terbaru: Tampilkan daftar transaksi terbaru dengan kemampuan filter dan
 *    pencarian untuk referensi cepat dan akses ke detail transaksi.
 *
 * 4. Pengingat dan Tugas: Tambahkan bagian untuk menampilkan pengingat pembayaran
 *    atau tugas keuangan yang akan datang dengan notifikasi dan kemampuan untuk menandai selesai.
 *
 * 5. Personalisasi: Berikan opsi untuk menyesuaikan tampilan halaman utama dengan
 *    widget yang dapat ditambah, dihapus, dan diatur ulang sesuai preferensi pengguna.
 *
 * 6. Statistik Performa: Tampilkan metrik kinerja keuangan seperti perbandingan dengan
 *    periode sebelumnya dan proyeksi untuk periode mendatang.
 */

export default function Home() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [isLoading, setIsLoading] = useState(true);
  const currentMonth = format(new Date(), "yyyy-MM");
  const {
    totalIncome,
    totalExpenses,
    totalMonthlyExpenses,
    totalBalance,
    remainingCash,
    calculateTotalCash,
    isLoading: reportLoading,
  } = useReportData(currentMonth);

  useEffect(() => {
    if (!reportLoading) {
      setIsLoading(false);
    }
  }, [reportLoading]);

  // Check database connection on component mount
  useEffect(() => {
    const checkDatabase = async () => {
      const result = await checkDatabaseConnection();
      if (result.success) {
        console.log("Database check:", result.message);
        if (result.message.includes("localStorage masih digunakan")) {
          toast({
            title: "Perhatian",
            description: result.message,
            variant: "default",
            className: "bg-yellow-100 border border-yellow-400 text-yellow-800",
          });
        }
      } else {
        console.error("Database check failed:", result.message);
        toast({
          variant: "destructive",
          title: "Error Database",
          description: result.message,
        });
      }
    };

    checkDatabase();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      <header className="bjt-header">
        <div className="flex items-center justify-center w-full">
          <div className="w-10 h-10 mr-2">
            <img
              src="https://i.postimg.cc/qNF92yDZ/logo.png"
              alt="Berkah Jaya Transport Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-bjt-title font-bold text-black text-base sm:text-lg md:text-xl lg:text-[22px]">
              Berkah Jaya Transport
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 max-w-4xl">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          {isLoading ? (
            <>
              <div className="bg-bjt-cardBg rounded-bjt shadow-premium p-4 animate-pulse">
                <div className="h-5 bg-white/20 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-white/20 rounded w-3/4"></div>
              </div>
              <div className="bg-bjt-cardBg rounded-bjt shadow-premium p-4 animate-pulse">
                <div className="h-5 bg-white/20 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-white/20 rounded w-3/4"></div>
              </div>
              <div className="bg-bjt-cardBg rounded-bjt shadow-premium p-4 animate-pulse">
                <div className="h-5 bg-white/20 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-white/20 rounded w-3/4"></div>
              </div>
              <div className="bg-bjt-cardBg rounded-bjt shadow-premium p-4 animate-pulse">
                <div className="h-5 bg-white/20 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-white/20 rounded w-3/4"></div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-bjt shadow-premium p-4 border border-green-500/20">
                <h3 className="text-sm font-medium text-white/80 mb-1">
                  Total Pendapatan
                </h3>
                <p className="text-xl font-bold text-white">
                  {formatCurrency(totalIncome + calculateTotalCash())}
                </p>
              </div>
              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-bjt shadow-premium p-4 border border-red-400/20">
                <h3 className="text-sm font-medium text-white/80 mb-1">
                  Total Pengeluaran
                </h3>
                <p className="text-xl font-bold text-white">
                  {formatCurrency(totalExpenses + totalMonthlyExpenses)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-bjt-primary to-bjt-primaryLight rounded-bjt shadow-premium p-4 border border-bjt-secondary/20">
                <h3 className="text-sm font-medium text-white/80 mb-1">
                  Saldo
                </h3>
                <p className="text-xl font-bold text-white">
                  {formatCurrency(totalBalance + calculateTotalCash())}
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-bjt shadow-premium p-4 border border-amber-400/20">
                <h3 className="text-sm font-medium text-white/80 mb-1">
                  Sisa Uang Kas
                </h3>
                <p className="text-xl font-bold text-white">
                  {formatCurrency(remainingCash)}
                </p>
              </div>
            </>
          )}
        </div>

        <InputForm />
      </main>
    </>
  );
}
