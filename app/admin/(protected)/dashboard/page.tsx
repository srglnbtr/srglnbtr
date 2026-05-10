"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";
import { motion } from "framer-motion";
import { db } from "@/firebase/client";
import { COLLECTIONS } from "@/firebase/collections";
import { GlassCard } from "@/components/ui/GlassCard";

type Stats = {
  projects: number;
  skills: number;
  certificates: number;
  experience: number;
  messagesUnread: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [
          projects,
          skills,
          certificates,
          experience,
          messagesUnread,
        ] = await Promise.all([
          getCountFromServer(collection(db, COLLECTIONS.projects)),
          getCountFromServer(collection(db, COLLECTIONS.skills)),
          getCountFromServer(collection(db, COLLECTIONS.certificates)),
          getCountFromServer(collection(db, COLLECTIONS.experience)),
          getCountFromServer(
            query(collection(db, COLLECTIONS.messages), where("read", "==", false)),
          ),
        ]);
        if (cancelled) return;
        setStats({
          projects: projects.data().count,
          skills: skills.data().count,
          certificates: certificates.data().count,
          experience: experience.data().count,
          messagesUnread: messagesUnread.data().count,
        });
      } catch {
        if (!cancelled) setErr("Статистик ачаалахад алдаа гарлаа.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const cards: { label: string; value: number; tone: string }[] = stats
    ? [
        { label: "Төслүүд", value: stats.projects, tone: "from-cyan-500/25 to-cyan-500/5" },
        { label: "Ур чадвар", value: stats.skills, tone: "from-violet-500/25 to-violet-500/5" },
        {
          label: "Гэрчилгээ",
          value: stats.certificates,
          tone: "from-fuchsia-500/25 to-fuchsia-500/5",
        },
        {
          label: "Туршлага",
          value: stats.experience,
          tone: "from-sky-500/25 to-sky-500/5",
        },
        {
          label: "Уншаагүй мессеж",
          value: stats.messagesUnread,
          tone: "from-rose-500/25 to-rose-500/5",
        },
      ]
    : [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-cyber-text">Хяналтын самбар</h1>
      <p className="mt-1 text-sm text-slate-500">
        Таны контентын тойм — Firebase-аас шууд тооцоолно.
      </p>

      {err ? <p className="mt-4 text-sm text-red-400">{err}</p> : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {!stats
          ? Array.from({ length: 5 }).map((_, i) => (
              <GlassCard key={i} className="h-28 animate-pulse bg-white/5 p-4" />
            ))
          : cards.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard
                  className={`bg-gradient-to-br ${c.tone} p-5 shadow-[0_0_24px_rgba(56,189,248,0.08)]`}
                >
                  <p className="text-xs font-medium text-slate-400">{c.label}</p>
                  <p className="mt-2 text-3xl font-black tabular-nums text-cyber-text">
                    {c.value}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
      </div>
    </div>
  );
}
