"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const links = [
  { href: "#hero", label: "Эхлэл" },
  { href: "#about", label: "Танилцуулга" },
  { href: "#skills", label: "Ур чадвар" },
  { href: "#projects", label: "Төслүүд" },
  { href: "#certificates", label: "Гэрчилгээ" },
  { href: "#experience", label: "Туршлага" },
  { href: "#contact", label: "Холбоо барих" },
];

export function SiteNavbar() {
  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#050816]/75 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link
          href="#hero"
          className="text-sm font-bold tracking-[0.25em] text-cyan-300 drop-shadow-[0_0_12px_rgba(56,189,248,0.45)]"
        >
          SRGLNBTR
        </Link>
        <nav className="hidden flex-wrap items-center justify-end gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-cyan-200",
              )}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/admin/login"
            className="ml-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-200 hover:border-violet-400/50"
          >
            Админ
          </Link>
        </nav>
      </div>
    </motion.header>
  );
}
