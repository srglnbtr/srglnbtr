"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SectionTitle({
  eyebrow,
  title,
  className,
}: {
  eyebrow?: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-10", className)}>
      {eyebrow ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/90">
          {eyebrow}
        </p>
      ) : null}
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold tracking-tight text-cyber-text md:text-4xl"
      >
        <span className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">
          {title}
        </span>
      </motion.h2>
    </div>
  );
}
