import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { createUser } from "@/services/auth";

export default function AddUserForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validation
    if (!username || !email || !password) {
      setError("Semua field harus diisi");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password harus minimal 6 karakter");
      setLoading(false);
      return;
    }

    try {
      await createUser({
        username,
        email,
        password,
      });
      setSuccess("Pengguna berhasil dibuat");
      // Reset form
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat pengguna");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-bjt-primary mb-4">
        Tambah Pengguna Baru
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Username
          </label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Masukkan username"
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Masukkan email"
            disabled={loading}
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password"
            disabled={loading}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-bjt-primary hover:bg-bjt-primary/90"
          disabled={loading}
        >
          {loading ? "Memproses..." : "Tambah Pengguna"}
        </Button>
      </form>
    </div>
  );
}
