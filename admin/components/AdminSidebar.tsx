"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import {
  LayoutDashboard,
  Sparkles,
  UserRound,
  Wrench,
  FolderKanban,
  Award,
  Briefcase,
  Mail,
  Settings,
  BarChart3,
  LogOut,
} from "lucide-react";
import { auth } from "@/firebase/client";
import { cn } from "@/lib/utils";

const items: { href: string; label: string; icon: typeof LayoutDashboard }[] = [
  { href: "/admin/dashboard", label: "Хяналтын самбар", icon: LayoutDashboard },
  { href: "/admin/hero", label: "Hero", icon: Sparkles },
  { href: "/admin/about", label: "Танилцуулга", icon: UserRound },
  { href: "/admin/skills", label: "Ур чадвар", icon: Wrench },
  { href: "/admin/projects", label: "Төслүүд", icon: FolderKanban },
  { href: "/admin/certificates", label: "Гэрчилгээ", icon: Award },
  { href: "/admin/experience", label: "Туршлага", icon: Briefcase },
  { href: "/admin/messages", label: "Мессежүүд", icon: Mail },
  { href: "/admin/settings", label: "Тохиргоо", icon: Settings },
  { href: "/admin/analytics", label: "Статистик", icon: BarChart3 },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-white/10 bg-[#0a1020]/95 backdrop-blur">
      <div className="border-b border-white/10 px-4 py-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-300/90">
          SRGLNBTR
        </p>
        <p className="mt-1 text-sm font-bold text-cyber-text">Админ самбар</p>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
        {items.map((it) => {
          const active = pathname === it.href;
          const Icon = it.icon;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-all",
                active
                  ? "bg-gradient-to-r from-cyan-500/20 to-violet-500/15 text-cyan-100 shadow-[0_0_20px_rgba(56,189,248,0.12)]"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200",
              )}
            >
              <Icon className="h-4 w-4 shrink-0 opacity-90" />
              {it.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-2">
        <Link
          href="/"
          className="mb-1 block rounded-xl px-3 py-2 text-xs text-slate-500 hover:bg-white/5 hover:text-slate-300"
        >
          Вэб рүү буцах
        </Link>
        <button
          type="button"
          onClick={() => signOut(auth)}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-red-300/90 hover:bg-red-500/10"
        >
          <LogOut className="h-4 w-4" />
          Гарах
        </button>
      </div>
    </aside>
  );
}
