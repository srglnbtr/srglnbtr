"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/client";
import { COLLECTIONS, DOC_IDS } from "@/firebase/collections";
import type { HeroDoc } from "@/types";
import { defaultHero } from "@/lib/defaults";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";

export default function AdminHeroPage() {
  const [form, setForm] = useState<HeroDoc>(defaultHero);
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "err">("idle");

  useEffect(() => {
    (async () => {
      const ref = doc(db, COLLECTIONS.hero, DOC_IDS.hero);
      const snap = await getDoc(ref);
      if (!snap.exists()) return;
      const d = snap.data() as Partial<HeroDoc>;
      setForm({
        title: d.title ?? defaultHero.title,
        subtitle: d.subtitle ?? defaultHero.subtitle,
        typingPhrases: Array.isArray(d.typingPhrases) ? d.typingPhrases : defaultHero.typingPhrases,
        cvUrl: d.cvUrl ?? defaultHero.cvUrl,
      });
    })();
  }, []);

  async function save() {
    setStatus("saving");
    try {
      const phrases = form.typingPhrases
        .map((p) => p.trim())
        .filter(Boolean);
      await setDoc(
        doc(db, COLLECTIONS.hero, DOC_IDS.hero),
        {
          title: form.title.trim(),
          subtitle: form.subtitle.trim(),
          typingPhrases: phrases.length ? phrases : defaultHero.typingPhrases,
          cvUrl: form.cvUrl.trim(),
        },
        { merge: true },
      );
      setStatus("ok");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("err");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Hero засварлагч</h1>
      <p className="mt-1 text-sm text-slate-500">Нүүр хэсгийн текст болон CV холбоос.</p>

      <GlassCard className="mt-6 space-y-4 p-6">
        <div>
          <label className="mb-1 block text-xs text-slate-400">Гарчиг (том текст)</label>
          <input
            className="w-full rounded-xl border border-white/10 bg-[#050816]/70 px-3 py-2 text-sm"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-400">Дэд гарчиг</label>
          <input
            className="w-full rounded-xl border border-white/10 bg-[#050816]/70 px-3 py-2 text-sm"
            value={form.subtitle}
            onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-400">
            Бичих эффектийн мөрнүүд (мөр бүрт нэг фраз)
          </label>
          <textarea
            rows={5}
            className="w-full rounded-xl border border-white/10 bg-[#050816]/70 px-3 py-2 text-sm font-mono"
            value={form.typingPhrases.join("\n")}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                typingPhrases: e.target.value.split("\n"),
              }))
            }
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-400">CV файлын URL</label>
          <input
            className="w-full rounded-xl border border-white/10 bg-[#050816]/70 px-3 py-2 text-sm"
            value={form.cvUrl}
            onChange={(e) => setForm((f) => ({ ...f, cvUrl: e.target.value }))}
            placeholder="https://..."
          />
        </div>

        {status === "ok" ? (
          <p className="text-sm text-emerald-400">Хадгалагдлаа.</p>
        ) : null}
        {status === "err" ? (
          <p className="text-sm text-red-400">Хадгалахад алдаа гарлаа.</p>
        ) : null}

        <NeonButton type="button" onClick={save} disabled={status === "saving"}>
          {status === "saving" ? "Хадгалж байна..." : "Хадгалах"}
        </NeonButton>
      </GlassCard>
    </div>
  );
}
