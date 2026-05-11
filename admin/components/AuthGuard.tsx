"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/client";
import { COLLECTIONS } from "@/firebase/collections";
import { useAuth } from "@/hooks/useAuth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setAllowed(null);
      router.replace("/admin/login");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const snap = await getDoc(doc(db, COLLECTIONS.users, user.uid));
        if (cancelled) return;
        const role = snap.exists() ? (snap.data() as { role?: string }).role : undefined;
        if (role === "admin") {
          setAllowed(true);
        } else {
          setAllowed(false);
          router.replace("/admin/login");
        }
      } catch {
        if (!cancelled) {
          setAllowed(false);
          router.replace("/admin/login");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading, router]);

  if (authLoading || (user && allowed === null)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cyber-bg text-cyber-text">
        <div className="rounded-2xl border border-white/10 bg-cyber-card/60 px-8 py-6 text-sm backdrop-blur">
          Уншиж байна...
        </div>
      </div>
    );
  }

  if (!user || !allowed) return null;

  return <>{children}</>;
}
