"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { motion } from "framer-motion";
import { auth } from "@/firebase/client";
import { useAuth } from "@/hooks/useAuth";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";

export default function AdminLoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/admin/dashboard");
  }, [user, loading, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/admin/dashboard");
    } catch {
      setErr("Нэвтрэхэд алдаа гарлаа. И-мэйл болон нууц үгээ шалгана уу.");
    } finally {
      setBusy(false);
    }
  }

  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-400">
        Уншиж байна...
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.15),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(139,92,246,0.12),transparent_50%)]" />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <GlassCard className="p-8">
          <h1 className="text-xl font-bold text-cyber-text">Админ нэвтрэх</h1>
          <p className="mt-1 text-xs text-slate-500">
            Firebase Authentication — и-мэйл / нууц үг
          </p>
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="mb-1 block text-xs text-slate-400" htmlFor="email">
                И-мэйл
              </label>
              <input
                id="email"
                autoComplete="email"
                className="w-full rounded-xl border border-white/10 bg-[#050816]/70 px-3 py-2 text-sm outline-none ring-cyan-400/30 focus:ring-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-400" htmlFor="password">
                Нууц үг
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="w-full rounded-xl border border-white/10 bg-[#050816]/70 px-3 py-2 text-sm outline-none ring-cyan-400/30 focus:ring-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {err ? <p className="text-sm text-red-400">{err}</p> : null}
            <NeonButton type="submit" disabled={busy} className="w-full">
              {busy ? "Нэвтэрч байна..." : "Нэвтрэх"}
            </NeonButton>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
}
