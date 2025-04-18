import { supabase } from "@/lib/supabase";

/**
 * Saran untuk Pengembangan Autentikasi:
 *
 * 1. Autentikasi JWT: Implementasikan autentikasi berbasis token JWT dengan refresh token
 *    untuk keamanan yang lebih baik dan pengalaman pengguna yang mulus.
 *
 * 2. Integrasi OAuth: Tambahkan opsi login dengan penyedia OAuth seperti Google, Microsoft,
 *    atau Apple dengan proses onboarding yang sederhana untuk pengguna baru.
 *
 * 3. Manajemen Peran: Implementasikan sistem peran dan izin yang komprehensif dengan
 *    antarmuka admin untuk mengelola akses ke fitur aplikasi berdasarkan peran pengguna.
 *
 * 4. Audit Login: Catat semua aktivitas login, logout, dan perubahan akun dengan detail
 *    seperti IP, perangkat, dan lokasi untuk keperluan keamanan dan audit.
 *
 * 5. Kebijakan Password: Tambahkan validasi kekuatan password, deteksi password yang
 *    terekspos, dan kebijakan pembaruan password berkala dengan pengingat.
 *
 * 6. Deteksi Aktivitas Mencurigakan: Implementasikan sistem untuk mendeteksi dan
 *    memblokir upaya login yang mencurigakan berdasarkan pola dan lokasi.
 */

import type { User } from "@/types/supabase";

// Login with Supabase
export const login = async (
  username: string,
  password: string,
): Promise<User> => {
  try {
    // First check if user exists in the database
    const { data: users, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", username)
      .single();

    if (fetchError || !users) {
      throw new Error("Username atau password salah");
    }

    // For simplicity, we're using a direct password comparison
    // In a real app, you would use Supabase Auth with proper password hashing
    if (password !== "admin123" && password !== "operator123") {
      throw new Error("Username atau password salah");
    }

    // Store user in localStorage for session management
    const currentUser = {
      id: users.id,
      username: users.email,
      isAuthenticated: true,
      email: users.email,
      is_admin: users.is_admin,
    };

    localStorage.setItem("bjt_current_user", JSON.stringify(currentUser));

    return currentUser;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Login gagal");
  }
};

// Logout
export const logout = async (): Promise<void> => {
  localStorage.removeItem("bjt_current_user");
};

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const userStr = localStorage.getItem("bjt_current_user");
    if (!userStr) return null;

    return JSON.parse(userStr) as User;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return !!user?.isAuthenticated;
};

// Create a new user
export const createUser = async (userData: {
  email: string;
  password: string;
  username: string;
}): Promise<User> => {
  try {
    // First check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("email", userData.email)
      .maybeSingle();

    if (existingUser) {
      throw new Error("Email sudah terdaftar");
    }

    // Insert the new user
    const { data, error } = await supabase
      .from("users")
      .insert({
        email: userData.email,
        is_admin: false,
      })
      .select()
      .single();

    if (error) throw error;

    // For a real app, you would use Supabase Auth here
    // But for this app, we're just storing the user in the database
    // and using a simple password comparison in the login function

    const newUser: User = {
      id: data.id,
      username: userData.username,
      isAuthenticated: false,
      email: userData.email,
      is_admin: false,
    };

    console.log("User created successfully:", newUser);
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error instanceof Error ? error : new Error("Gagal membuat user");
  }
};

// Initialize admin user if it doesn't exist
export const initializeAdminUser = async (): Promise<void> => {
  try {
    // Check if admin user exists
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", "admin")
      .maybeSingle();

    if (!data) {
      // Create admin user
      await supabase.from("users").insert({
        email: "admin",
        is_admin: true,
      });

      // Create operator user
      await supabase.from("users").insert({
        email: "operator",
        is_admin: false,
      });

      console.log("Default users initialized");
    }
  } catch (error) {
    console.error("Error initializing admin user:", error);
  }
};
