import { supabase } from "@/lib/supabase";

export const checkDatabaseConnection = async (): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> => {
  try {
    // Check Supabase connection
    const { data, error } = await supabase
      .from("transactions")
      .select("count", { count: "exact", head: true });

    if (error) {
      return {
        success: false,
        message: `Koneksi Supabase gagal: ${error.message}`,
        details: error,
      };
    }

    // Check if localStorage is still being used
    const localStorageKeys = Object.keys(localStorage).filter(
      (key) =>
        key.startsWith("bjt_") &&
        !key.includes("current_user") &&
        !key.includes("remember"),
    );

    if (localStorageKeys.length > 0) {
      return {
        success: true,
        message:
          "Koneksi Supabase berhasil, tetapi localStorage masih digunakan. Pertimbangkan untuk migrasi data.",
        details: { localStorageKeys },
      };
    }

    return {
      success: true,
      message:
        "Aplikasi menggunakan Supabase sepenuhnya. Semua data disimpan secara online.",
      details: { transactionCount: data?.count || 0 },
    };
  } catch (error) {
    return {
      success: false,
      message: `Terjadi kesalahan saat memeriksa database: ${error instanceof Error ? error.message : "Unknown error"}`,
      details: error,
    };
  }
};
