"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase/client";
import { COLLECTIONS, DOC_IDS } from "@/firebase/collections";
import type { AnalyticsDoc } from "@/types";
import { formatFirestoreDate } from "@/utils/format";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";

export default function AdminAnalyticsPage() {
  const [pageViews, setPageViews] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Timestamp | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "err">("idle");

  useEffect(() => {
    (async () => {
      const ref = doc(db, COLLECTIONS.analytics, DOC_IDS.analytics);
      const snap = await getDoc(ref);
      if (!snap.exists()) return;
      const d = snap.data() as Partial<AnalyticsDoc>;
      if (typeof d.pageViews === "number") setPageViews(d.pageViews);
      setLastUpdated(d.lastUpdated ?? null);
    })();
  }, []);

  async function save() {
    setStatus("saving");
    try {
      const now = Timestamp.now();
      await setDoc(
        doc(db, COLLECTIONS.analytics, DOC_IDS.analytics),
        {
          pageViews: Math.max(0, Math.floor(pageViews)),
          lastUpdated: now,
        },
        { merge: true },
      );
      setLastUpdated(now);
      setStatus("ok");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("err");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Статистик</h1>
      <p className="mt-1 text-sm text-slate-500">
        analytics/stats баримт — хуудас үзэлт (гараар тохируулах боломжтой).
      </p>

      <GlassCard className="mt-6 space-y-4 p-6">
        <div>
          <label className="mb-1 block text-xs text-slate-400">Хуудас үзэлт</label>
          <input
            type="number"
            min={0}
            className="w-full max-w-xs rounded-xl border border-white/10 bg-[#050816]/70 px-3 py-2 text-sm"
            value={pageViews}
            onChange={(e) => setPageViews(Number(e.target.value))}
          />
        </div>
        <p className="text-xs text-slate-500">
          Сүүлд шинэчилсэн: {lastUpdated ? formatFirestoreDate(lastUpdated) : "—"}
        </p>

        {status === "ok" ? <p className="text-sm text-emerald-400">Хадгалагдлаа.</p> : null}
        {status === "err" ? <p className="text-sm text-red-400">Алдаа гарлаа.</p> : null}

        <NeonButton type="button" onClick={save} disabled={status === "saving"}>
          {status === "saving" ? "Хадгалж байна..." : "Хадгалах"}
        </NeonButton>
      </GlassCard>
    </div>
  );
}
