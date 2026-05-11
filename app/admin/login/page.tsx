"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { auth, db } from "@/firebase/client";
import { COLLECTIONS } from "@/firebase/collections";
import { useAuth } from "@/hooks/useAuth";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";

async function isFirestoreAdmin(uid: string): Promise<boolean> {
  const snap = await getDoc(doc(db, COLLECTIONS.users, uid));
  return snap.exists() && (snap.data() as { role?: string }).role === "admin";
}

export default function AdminLoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [checkingRole, setCheckingRole] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      setCheckingRole(false);
      setErr("");
      return;
    }

    let cancelled = false;
    setCheckingRole(true);
    setErr("");
    void isFirestoreAdmin(user.uid).then((admin) => {
      if (cancelled) return;
      if (admin) {
        router.replace("/admin/dashboard");
      } else {
        setErr(
          'Энэ бүртгэлд админ эрх байхгүй. Firebase Console → Firestore → "users" коллекцэд өөрийн Auth UID-гаар баримт үүсгээд role талбарт admin гэж бичнэ үү (текст).',
        );
      }
      setCheckingRole(false);
    });

    return () => {
      cancelled = true;
    };
  }, [user, loading, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch {
      setErr("Нэвтрэхэд алдаа гарлаа. И-мэйл болон нууц үгээ шалгана уу.");
    } finally {
      setBusy(false);
    }
  }

  async function onSignOut() {
    setErr("");
    await signOut(auth);
  }

  if (loading || checkingRole) {
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
          {user && err ? (
            <div className="mt-6 space-y-4">
              <p className="text-sm text-amber-400/95">{err}</p>
              <NeonButton type="button" variant="ghost" className="w-full" onClick={() => void onSignOut()}>
                Өөр бүртгэлээр нэвтрэх (гарах)
              </NeonButton>
            </div>
          ) : (
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
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
}
