import type { MonthlyExpense } from "@/types/supabase";
import {
  getMonthlyExpenses as supabaseGetMonthlyExpenses,
  getMonthlyExpenseByMonth as supabaseGetMonthlyExpenseByMonth,
  createMonthlyExpense as supabaseCreateMonthlyExpense,
  updateMonthlyExpense as supabaseUpdateMonthlyExpense,
  deleteMonthlyExpense as supabaseDeleteMonthlyExpense,
  upsertMonthlyExpense as supabaseUpsertMonthlyExpense,
} from "./supabaseService";

/**
 * Saran untuk Pengembangan Layanan Pengeluaran Bulanan:
 *
 * 1. Anggaran dan Perencanaan: Tambahkan fungsi untuk menetapkan dan melacak anggaran
 *    bulanan untuk setiap kategori pengeluaran dengan visualisasi progres dan peringatan.
 *
 * 2. Perbandingan Historis: Implementasikan fungsi untuk membandingkan pengeluaran
 *    bulan ini dengan bulan-bulan sebelumnya, termasuk analisis tren dan anomali.
 *
 * 3. Proyeksi Pengeluaran: Tambahkan kemampuan untuk memproyeksikan pengeluaran
 *    masa depan berdasarkan tren historis dengan model prediksi yang dapat disesuaikan.
 *
 * 4. Kategori Kustom: Berikan fleksibilitas untuk menambah, mengedit, atau
 *    menghapus kategori pengeluaran dengan hierarki dan aturan alokasi.
 *
 * 5. Notifikasi Anggaran: Tambahkan fungsi untuk mengirim peringatan melalui berbagai
 *    saluran ketika pengeluaran mendekati atau melebihi anggaran dengan tingkat keparahan.
 *
 * 6. Laporan Pengeluaran: Buat fungsi untuk menghasilkan laporan pengeluaran
 *    yang komprehensif dengan visualisasi interaktif dan opsi ekspor.
 *
 * 7. Optimasi Pengeluaran: Tambahkan fitur untuk menganalisis dan menyarankan
 *    area pengeluaran yang dapat dioptimalkan berdasarkan pola historis.
 */

// Ekspor fungsi-fungsi pengeluaran bulanan dari Supabase
export const getMonthlyExpenses = supabaseGetMonthlyExpenses;
export const getMonthlyExpenseByMonth = supabaseGetMonthlyExpenseByMonth;
export const createMonthlyExpense = supabaseCreateMonthlyExpense;
export const updateMonthlyExpense = supabaseUpdateMonthlyExpense;
export const deleteMonthlyExpense = supabaseDeleteMonthlyExpense;
export const upsertMonthlyExpense = supabaseUpsertMonthlyExpense;

// Ekspor tipe MonthlyExpense
export type { MonthlyExpense };
