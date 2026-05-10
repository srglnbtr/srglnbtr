"use client";

import { cn } from "@/lib/utils";

export function GlassCard({
  className,
  children,
  hoverGlow = true,
}: {
  className?: string;
  children?: React.ReactNode;
  hoverGlow?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-[#0f172a]/70 shadow-[0_0_0_1px_rgba(56,189,248,0.08)_inset] backdrop-blur-xl",
        hoverGlow &&
          "transition-shadow duration-300 hover:shadow-[0_0_32px_rgba(56,189,248,0.18),0_0_48px_rgba(139,92,246,0.12)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
