"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import api from "@/api/axios";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/api/auth/login", { email, password });
      const { access_token, user } = response.data;
      if (access_token) {
        login(access_token, user);
      } else {
        setError("Token non reçu.");
        setLoading(false);
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Identifiants incorrects.");
      } else {
        setError(err.response?.data?.message || "Erreur de connexion.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 animate-slide-up">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="w-12 h-12 bg-gray-900 rounded-xl mx-auto flex items-center justify-center mb-4 shadow-sm">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-1">Connexion</h1>
            <p className="text-sm text-gray-500">
              Accédez à votre espace de gestion
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm text-center rounded-lg">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 bg-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 text-gray-900 placeholder-gray-400 transition-all duration-200 hover:border-gray-300"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-gray-700">Mot de passe</label>
                <Link href="/login/forgot-password" className="text-xs text-gray-400 hover:text-gray-900 transition-colors">
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 bg-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 text-gray-900 placeholder-gray-400 transition-all duration-200 hover:border-gray-300"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 rounded-lg shadow-sm mt-2 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer text */}
        <p className="text-center text-xs text-gray-400 mt-6">
          FANJAVA — Système de Gestion Commerciale
        </p>
      </div>
    </div>
  );
}
