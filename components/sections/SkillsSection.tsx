"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";
import { db } from "@/firebase/client";
import { COLLECTIONS } from "@/firebase/collections";
import type { SkillDoc } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionTitle } from "@/components/ui/SectionTitle";

function sortSkills(rows: SkillDoc[]) {
  return [...rows].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function SkillsSection() {
  const [skills, setSkills] = useState<SkillDoc[]>([]);

  useEffect(() => {
    const col = collection(db, COLLECTIONS.skills);
    const unsub = onSnapshot(
      col,
      (snap) => {
        if (snap.empty) {
          setSkills([]);
          return;
        }
        const rows: SkillDoc[] = snap.docs.map((d) => {
          const x = d.data() as Omit<SkillDoc, "id">;
          return {
            id: d.id,
            name: x.name ?? "",
            percent: typeof x.percent === "number" ? x.percent : 0,
            order: typeof x.order === "number" ? x.order : 0,
          };
        });
        setSkills(sortSkills(rows));
      },
      () => setSkills([]),
    );
    return () => unsub();
  }, []);

  return (
    <section id="skills" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionTitle eyebrow="Stack" title="Ур чадвар" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.length === 0 ? (
            <GlassCard className="p-6 text-sm text-slate-500 sm:col-span-2 lg:col-span-3">
              Ур чадварын мэдээлэл байхгүй. Админ самбараас нэмнэ үү.
            </GlassCard>
          ) : null}
          {skills.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard className="group p-5 transition-transform duration-300 hover:-translate-y-0.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-cyber-text">{s.name}</h3>
                  <span className="text-xs font-mono text-cyan-300/90">{s.percent}%</span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 shadow-[0_0_16px_rgba(56,189,248,0.45)]"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${Math.min(100, Math.max(0, s.percent))}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                  />
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
