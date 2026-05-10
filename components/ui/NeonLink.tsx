"use client";

import { cn } from "@/lib/utils";

export function NeonLink({
  className,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-400/40 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 px-5 py-2.5 text-sm font-semibold text-cyber-text shadow-[0_0_24px_rgba(56,189,248,0.25)] transition-all duration-300 hover:shadow-[0_0_36px_rgba(139,92,246,0.35)]",
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
