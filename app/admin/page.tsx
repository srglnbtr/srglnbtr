"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function AdminIndexPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (user) router.replace("/admin/dashboard");
    else router.replace("/admin/login");
  }, [user, loading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-slate-400">
      Уншиж байна...
    </div>
  );
}
