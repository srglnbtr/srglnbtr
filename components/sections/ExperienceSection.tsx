"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";
import { db } from "@/firebase/client";
import { COLLECTIONS } from "@/firebase/collections";
import type { ExperienceDoc } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionTitle } from "@/components/ui/SectionTitle";

function sortExp(rows: ExperienceDoc[]) {
  return [...rows].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function ExperienceSection() {
  const [rows, setRows] = useState<ExperienceDoc[]>([]);

  useEffect(() => {
    const col = collection(db, COLLECTIONS.experience);
    const unsub = onSnapshot(
      col,
      (snap) => {
        if (snap.empty) {
          setRows([]);
          return;
        }
        const list: ExperienceDoc[] = snap.docs.map((d) => {
          const x = d.data() as Omit<ExperienceDoc, "id">;
          return {
            id: d.id,
            title: x.title ?? "",
            company: x.company ?? "",
            period: x.period ?? "",
            description: x.description ?? "",
            order: typeof x.order === "number" ? x.order : 0,
          };
        });
        setRows(sortExp(list));
      },
      () => setRows([]),
    );
    return () => unsub();
  }, []);

  return (
    <section id="experience" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionTitle eyebrow="Timeline" title="Туршлага" />

        <div className="relative">
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-cyan-400/50 via-violet-500/40 to-transparent md:left-4" />
          <div className="space-y-6">
            {rows.length === 0 ? (
              <GlassCard className="p-6 text-sm text-slate-500">
                Туршлагын мэдээлэл байхгүй. Админ самбараас нэмнэ үү.
              </GlassCard>
            ) : null}
            {rows.map((e, i) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="relative pl-10 md:pl-12"
              >
                <span className="absolute left-1 top-2 flex h-5 w-5 items-center justify-center rounded-full border border-cyan-400/40 bg-[#0f172a] shadow-[0_0_14px_rgba(56,189,248,0.35)] md:left-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-300" />
                </span>
                <GlassCard className="p-5 md:p-6">
                  <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                    <h3 className="text-lg font-semibold text-cyber-text">{e.title}</h3>
                    <span className="text-xs font-mono text-violet-300/90">{e.period}</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-cyan-200/90">{e.company}</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{e.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
