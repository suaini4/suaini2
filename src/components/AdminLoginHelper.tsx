import React, { useState } from "react";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";

const AdminLoginHelper = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const createLocalAdmin = async () => {
    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      // Simpan admin di localStorage
      const users = JSON.parse(localStorage.getItem("bjt_users") || "[]");

      // Cek apakah admin sudah ada
      const adminExists = users.some((user: any) => user.username === "admin");

      if (!adminExists) {
        users.push({
          id: Math.random().toString(36).substring(2, 15),
          username: "admin",
          password: "admin123",
          isAuthenticated: false,
        });

        localStorage.setItem("bjt_users", JSON.stringify(users));
        setMessage(
          "Admin berhasil dibuat di localStorage! Username: admin, Password: admin123",
        );
      } else {
        setMessage(
          "Admin sudah ada di localStorage. Username: admin, Password: admin123",
        );
      }
    } catch (err) {
      console.error("Error creating local admin:", err);
      setError(
        err instanceof Error ? err.message : "Gagal membuat admin lokal",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-bjt-cardBg rounded-bjt shadow-premium">
      <h2 className="text-white font-bold mb-4">Bantuan Login Admin</h2>

      {message && (
        <Alert className="mb-4 bg-green-100 border-green-500 text-green-800">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="mb-4 bg-red-100 border-red-500 text-red-800">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        <Button
          onClick={createLocalAdmin}
          disabled={isLoading}
          className="bjt-btn-primary w-full"
        >
          {isLoading ? "Memproses..." : "Buat Admin di localStorage"}
        </Button>
      </div>

      <div className="mt-4 p-3 bg-bjt-primary/20 rounded-bjt">
        <h3 className="text-white font-medium mb-2">Informasi Login:</h3>
        <p className="text-white/80 text-sm">
          <span className="font-medium">Untuk localStorage:</span>
          <br />
          Username: admin
          <br />
          Password: admin123
        </p>
      </div>
    </div>
  );
};

export default AdminLoginHelper;
