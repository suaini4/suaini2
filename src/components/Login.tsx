import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

/**
 * Saran untuk Pengembangan Autentikasi:
 *
 * 1. Manajemen Pengguna: Tambahkan fitur untuk mengelola beberapa pengguna dengan
 *    peran berbeda (admin, operator, manajer, dll) dengan antarmuka admin yang intuitif.
 *
 * 2. Reset Password: Tambahkan fitur untuk mereset password melalui email atau
 *    pertanyaan keamanan dengan proses verifikasi yang aman.
 *
 * 3. Autentikasi Dua Faktor: Implementasikan autentikasi dua faktor menggunakan
 *    aplikasi authenticator atau SMS untuk meningkatkan keamanan akun.
 *
 * 4. Sesi Login: Tambahkan manajemen sesi dengan opsi "ingat saya", timeout
 *    otomatis, dan kemampuan untuk melihat dan mengakhiri sesi aktif dari perangkat lain.
 *
 * 5. Riwayat Login: Catat dan tampilkan riwayat login dengan detail seperti waktu,
 *    lokasi, dan perangkat untuk membantu mendeteksi akses yang tidak sah.
 *
 * 6. Kebijakan Password: Terapkan kebijakan password yang kuat dengan persyaratan
 *    kompleksitas dan pembaruan berkala.
 */

import { Alert, AlertDescription } from "./ui/alert";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  // Check for saved credentials on component mount
  useEffect(() => {
    // Using sessionStorage instead of localStorage for better security
    const savedUsername = sessionStorage.getItem("bjt_remember_username");
    const savedRememberMe =
      sessionStorage.getItem("bjt_remember_me") === "true";

    if (savedUsername && savedRememberMe) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  // Real-time validation
  useEffect(() => {
    if (username && username.trim().length < 3) {
      setUsernameError("Username minimal 3 karakter");
    } else {
      setUsernameError("");
    }
  }, [username]);

  useEffect(() => {
    if (password && password.trim().length < 6) {
      setPasswordError("Password minimal 6 karakter");
    } else {
      setPasswordError("");
    }
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Final validation before submission
    if (!username.trim() || !password.trim()) {
      setError("Username dan password harus diisi");
      return;
    }

    if (usernameError || passwordError) {
      setError("Mohon perbaiki error pada form");
      return;
    }

    setIsLoading(true);

    try {
      await login(username, password);

      // Save credentials if remember me is checked
      if (rememberMe) {
        sessionStorage.setItem("bjt_remember_username", username);
        sessionStorage.setItem("bjt_remember_me", "true");
      } else {
        sessionStorage.removeItem("bjt_remember_username");
        sessionStorage.removeItem("bjt_remember_me");
      }

      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial welcome screen
  if (!showLoginForm) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bjt-primary px-4 py-12 text-white">
        <motion.div
          className="text-center space-y-6 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-8 text-white">
            APLIKASI KEUANGAN
            <br />
            BERKAH JAYA
            <br />
            TRANSPORT
          </h1>

          <p className="text-lg sm:text-xl mb-12">
            Welcome to BJT Finance App. Please login to continue.
          </p>

          <Button
            onClick={() => setShowLoginForm(true)}
            className="bg-yellow-400 hover:bg-yellow-500 text-bjt-primary font-bold py-3 px-8 rounded-md text-lg w-32"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </Button>
        </motion.div>
      </div>
    );
  }

  // Login form screen
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bjt-primary px-4 py-8">
      <AnimatePresence>
        <motion.div
          className="w-full max-w-md bg-bjt-primary rounded-lg border border-bjt-primaryLight/30 overflow-hidden"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="p-6 space-y-6">
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                BJT Finance
              </h2>

              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center p-1">
                <img
                  src="https://i.postimg.cc/qNF92yDZ/logo.png"
                  alt="BJT Logo"
                  className="w-20 h-20 object-contain"
                />
              </div>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Alert
                  variant="destructive"
                  className="mb-4 bg-red-500/20 border border-red-500 text-white"
                >
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  required
                  className={`h-12 rounded-md bg-white text-bjt-textPrimary px-4 py-2 w-full ${usernameError ? "border-2 border-red-500" : "border-none"}`}
                />
                {usernameError && (
                  <motion.p
                    className="text-red-300 text-xs mt-1 ml-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {usernameError}
                  </motion.p>
                )}
              </div>

              <div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className={`h-12 rounded-md bg-white text-bjt-textPrimary px-4 py-2 w-full ${passwordError ? "border-2 border-red-500" : "border-none"}`}
                />
                {passwordError && (
                  <motion.p
                    className="text-red-300 text-xs mt-1 ml-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {passwordError}
                  </motion.p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  className="bg-white border-bjt-secondary data-[state=checked]:bg-bjt-secondary"
                />
                <Label
                  htmlFor="remember-me"
                  className="text-white text-sm cursor-pointer"
                >
                  Ingat Saya
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full h-12 mt-2 bg-yellow-400 hover:bg-yellow-500 text-bjt-primary font-bold rounded-md text-lg"
                disabled={isLoading}
              >
                {isLoading ? "Memproses..." : "Login"}
              </Button>
            </form>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
