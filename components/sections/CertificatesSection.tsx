"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import Image from "next/image";
import { motion } from "framer-motion";
import { db } from "@/firebase/client";
import { COLLECTIONS } from "@/firebase/collections";
import type { CertificateDoc } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionTitle } from "@/components/ui/SectionTitle";

function sortCerts(rows: CertificateDoc[]) {
  return [...rows].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function CertificatesSection() {
  const [items, setItems] = useState<CertificateDoc[]>([]);

  useEffect(() => {
    const col = collection(db, COLLECTIONS.certificates);
    const unsub = onSnapshot(
      col,
      (snap) => {
        if (snap.empty) {
          setItems([]);
          return;
        }
        const rows: CertificateDoc[] = snap.docs.map((d) => {
          const x = d.data() as Omit<CertificateDoc, "id">;
          return {
            id: d.id,
            title: x.title ?? "",
            imageUrl: x.imageUrl ?? "",
            issuedDate: x.issuedDate ?? "",
            order: typeof x.order === "number" ? x.order : 0,
          };
        });
        setItems(sortCerts(rows));
      },
      () => setItems([]),
    );
    return () => unsub();
  }, []);

  return (
    <section id="certificates" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionTitle eyebrow="Proof" title="Гэрчилгээ" />

        {items.length === 0 ? (
          <GlassCard className="p-8 text-center text-slate-400">
            Одоогоор гэрчилгээ байхгүй. Админ самбараас нэмнэ үү.
          </GlassCard>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard className="group overflow-hidden p-0">
                  <div className="relative aspect-[4/3] w-full bg-white/5">
                    {c.imageUrl ? (
                      <Image
                        src={c.imageUrl}
                        alt={c.title}
                        fill
                        className="object-cover transition duration-500 group-hover:brightness-110"
                        sizes="(max-width:768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-slate-500">
                        Зураг байхгүй
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-cyber-text">{c.title}</h3>
                    {c.issuedDate ? (
                      <p className="mt-1 text-xs text-slate-500">{c.issuedDate}</p>
                    ) : null}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
