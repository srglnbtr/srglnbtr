"use client";

import { cn } from "@/lib/utils";

type NeonButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export function NeonButton({
  className,
  variant = "primary",
  children,
  ...props
}: NeonButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300",
        variant === "primary" &&
          "border border-cyan-400/40 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 text-cyber-text shadow-[0_0_24px_rgba(56,189,248,0.25)] hover:shadow-[0_0_36px_rgba(139,92,246,0.35)]",
        variant === "ghost" &&
          "border border-white/10 bg-white/5 text-cyber-text hover:border-cyan-400/30",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
