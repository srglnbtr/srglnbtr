"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";
import { db } from "@/firebase/client";
import { COLLECTIONS, DOC_IDS } from "@/firebase/collections";
import type { AboutDoc } from "@/types";
import { defaultAbout } from "@/lib/defaults";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function AboutSection() {
  const [about, setAbout] = useState<AboutDoc>(defaultAbout);

  useEffect(() => {
    const ref = doc(db, COLLECTIONS.about, DOC_IDS.about);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) return;
        const d = snap.data() as Partial<AboutDoc>;
        setAbout({
          paragraphs: Array.isArray(d.paragraphs) ? d.paragraphs : defaultAbout.paragraphs,
          highlights: Array.isArray(d.highlights) ? d.highlights : defaultAbout.highlights,
        });
      },
      () => {},
    );
    return () => unsub();
  }, []);

  return (
    <section id="about" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionTitle eyebrow="Тухай" title="Миний тухай" />

        <div className="grid gap-6 md:grid-cols-2">
          <GlassCard className="p-6 md:p-8">
            <div className="space-y-4 text-slate-300">
              {about.paragraphs.map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="leading-relaxed"
                >
                  {p}
                </motion.p>
              ))}
            </div>
          </GlassCard>

          <div className="grid gap-4">
            {about.highlights.map((h, i) => (
              <motion.div
                key={h.title + i}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 * i }}
              >
                <GlassCard className="h-full p-5">
                  <h3 className="text-lg font-semibold text-cyan-200">{h.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{h.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
