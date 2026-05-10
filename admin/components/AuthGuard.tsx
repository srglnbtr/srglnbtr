"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/admin/login");
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cyber-bg text-cyber-text">
        <div className="rounded-2xl border border-white/10 bg-cyber-card/60 px-8 py-6 text-sm backdrop-blur">
          Уншиж байна...
        </div>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
