"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, KeyRound, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import api from "@/api/axios";

function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    try {
      await api.post("/api/auth/reset-password", { email, otp, newPassword });
      setSuccess("Mot de passe réinitialisé avec succès ! Redirection...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Le code est invalide ou expiré.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm p-8 bg-white border border-slate-200 relative">
      <Link href="/login" className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-5 h-5" />
      </Link>
      <div className="mb-8 mt-4 text-center">
        <div className="w-12 h-12 bg-slate-900 mx-auto flex items-center justify-center mb-4">
          <KeyRound className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-1">Nouveau mot de passe</h1>
        <p className="text-sm text-slate-500">
          Entrez le code reçu et votre nouveau mot de passe
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm text-center">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm text-center">
          {success}
        </div>
      )}

      <form onSubmit={handleResetPassword} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Code de vérification (OTP)</label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              required
              className="w-full pl-10 pr-4 py-2 border border-slate-300 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 text-slate-900 placeholder-slate-400 uppercase tracking-widest text-center"
              placeholder="123456"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Nouveau mot de passe</label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="password"
              required
              minLength={6}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 text-slate-900 placeholder-slate-400"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Confirmer le mot de passe</label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="password"
              required
              minLength={6}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 text-slate-900 placeholder-slate-400"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Valider
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
      <Suspense fallback={<div>Chargement...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
