"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { IconGitHub } from "@/components/icons/BrandIcons";
import { db } from "@/firebase/client";
import { COLLECTIONS } from "@/firebase/collections";
import type { ProjectDoc } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { cn } from "@/lib/utils";

function sortProjects(rows: ProjectDoc[]) {
  return [...rows].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function ProjectsSection() {
  const [projects, setProjects] = useState<ProjectDoc[]>([]);

  useEffect(() => {
    const col = collection(db, COLLECTIONS.projects);
    const unsub = onSnapshot(
      col,
      (snap) => {
        if (snap.empty) {
          setProjects([]);
          return;
        }
        const rows: ProjectDoc[] = snap.docs.map((d) => {
          const x = d.data() as Omit<ProjectDoc, "id">;
          return {
            id: d.id,
            title: x.title ?? "",
            description: x.description ?? "",
            imageUrl: x.imageUrl ?? "",
            techStack: Array.isArray(x.techStack) ? x.techStack : [],
            githubUrl: x.githubUrl ?? "#",
            liveUrl: x.liveUrl ?? "#",
            order: typeof x.order === "number" ? x.order : 0,
          };
        });
        setProjects(sortProjects(rows));
      },
      () => setProjects([]),
    );
    return () => unsub();
  }, []);

  return (
    <section id="projects" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionTitle eyebrow="Builds" title="Төслүүд" />

        <div className="grid gap-6 md:grid-cols-2">
          {projects.length === 0 ? (
            <GlassCard className="p-6 text-sm text-slate-500 md:col-span-2">
              Төсөл байхгүй. Админ самбараас нэмнэ үү.
            </GlassCard>
          ) : null}
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <GlassCard className="group overflow-hidden p-0">
                <div
                  className={cn(
                    "relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-cyan-500/10 to-violet-600/10",
                  )}
                >
                  {p.imageUrl ? (
                    <Image
                      src={p.imageUrl}
                      alt={p.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width:768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-500">
                      Зураг оруулна уу
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050816]/90 via-transparent to-transparent opacity-80" />
                </div>
                <div className="space-y-3 p-5 md:p-6">
                  <h3 className="text-xl font-bold text-cyber-text">{p.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{p.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {p.techStack.map((t) => (
                      <span
                        key={t}
                        className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-2 py-0.5 text-xs text-cyan-100"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3 pt-1">
                    <Link
                      href={p.githubUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-cyan-200"
                    >
                      <IconGitHub className="h-4 w-4" />
                      GitHub
                    </Link>
                    <Link
                      href={p.liveUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-violet-200"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Live demo
                    </Link>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
