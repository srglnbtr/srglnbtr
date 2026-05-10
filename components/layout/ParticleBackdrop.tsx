"use client";

import { motion } from "framer-motion";

const spots = Array.from({ length: 42 }, (_, i) => ({
  id: i,
  x: `${(i * 17) % 100}%`,
  y: `${(i * 31) % 100}%`,
  s: 40 + (i % 5) * 22,
  d: 12 + (i % 7),
}));

export function ParticleBackdrop() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-cyber-bg" />
      <div className="cyber-grid-bg absolute inset-0 opacity-[0.35]" />
      {spots.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-cyan-400/10 blur-2xl"
          style={{
            left: p.x,
            top: p.y,
            width: p.s,
            height: p.s,
          }}
          animate={{ opacity: [0.15, 0.45, 0.15], scale: [1, 1.15, 1] }}
          transition={{
            duration: p.d,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.12),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(139,92,246,0.12),transparent_50%)]" />
    </div>
  );
}
