"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Plus, Trash2 } from "lucide-react";
import { db } from "@/firebase/client";
import { COLLECTIONS, DOC_IDS } from "@/firebase/collections";
import type { AboutDoc, AboutHighlight } from "@/types";
import { defaultAbout } from "@/lib/defaults";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";

export default function AdminAboutPage() {
  const [paragraphsText, setParagraphsText] = useState(
    defaultAbout.paragraphs.join("\n\n"),
  );
  const [highlights, setHighlights] = useState<AboutHighlight[]>(defaultAbout.highlights);
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "err">("idle");

  useEffect(() => {
    (async () => {
      const ref = doc(db, COLLECTIONS.about, DOC_IDS.about);
      const snap = await getDoc(ref);
      if (!snap.exists()) return;
      const d = snap.data() as Partial<AboutDoc>;
      if (Array.isArray(d.paragraphs)) {
        setParagraphsText(d.paragraphs.join("\n\n"));
      }
      if (Array.isArray(d.highlights)) {
        setHighlights(d.highlights);
      }
    })();
  }, []);

  function addHighlight() {
    setHighlights((h) => [...h, { title: "", description: "" }]);
  }

  function removeHighlight(i: number) {
    setHighlights((h) => h.filter((_, idx) => idx !== i));
  }

  async function save() {
    setStatus("saving");
    try {
      const paragraphs = paragraphsText
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);
      const hl = highlights
        .map((x) => ({
          title: x.title.trim(),
          description: x.description.trim(),
        }))
        .filter((x) => x.title && x.description);
      await setDoc(
        doc(db, COLLECTIONS.about, DOC_IDS.about),
        { paragraphs, highlights: hl.length ? hl : defaultAbout.highlights },
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
      <h1 className="text-2xl font-bold">Танилцуулга засварлагч</h1>
      <p className="mt-1 text-sm text-slate-500">Догол мөрөөр зайтай оруулбал олон догол болно.</p>

      <GlassCard className="mt-6 space-y-4 p-6">
        <div>
          <label className="mb-1 block text-xs text-slate-400">Доголууд</label>
          <textarea
            rows={8}
            className="w-full rounded-xl border border-white/10 bg-[#050816]/70 px-3 py-2 text-sm"
            value={paragraphsText}
            onChange={(e) => setParagraphsText(e.target.value)}
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs text-slate-400">Онцлох картууд</label>
            <button
              type="button"
              onClick={addHighlight}
              className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-xs text-slate-300 hover:bg-white/5"
            >
              <Plus className="h-3 w-3" />
              Нэмэх
            </button>
          </div>
          <div className="space-y-3">
            {highlights.map((h, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-[#050816]/40 p-3">
                <div className="flex justify-end">
                  <button
                    type="button"
                    aria-label="Устгах"
                    onClick={() => removeHighlight(i)}
                    className="text-slate-500 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <input
                  className="mt-1 w-full rounded-lg border border-white/10 bg-transparent px-2 py-1 text-sm"
                  placeholder="Гарчиг"
                  value={h.title}
                  onChange={(e) => {
                    const v = e.target.value;
                    setHighlights((arr) =>
                      arr.map((x, idx) => (idx === i ? { ...x, title: v } : x)),
                    );
                  }}
                />
                <textarea
                  rows={2}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-transparent px-2 py-1 text-sm"
                  placeholder="Тайлбар"
                  value={h.description}
                  onChange={(e) => {
                    const v = e.target.value;
                    setHighlights((arr) =>
                      arr.map((x, idx) => (idx === i ? { ...x, description: v } : x)),
                    );
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {status === "ok" ? <p className="text-sm text-emerald-400">Хадгалагдлаа.</p> : null}
        {status === "err" ? <p className="text-sm text-red-400">Алдаа гарлаа.</p> : null}

        <NeonButton type="button" onClick={save} disabled={status === "saving"}>
          {status === "saving" ? "Хадгалж байна..." : "Хадгалах"}
        </NeonButton>
      </GlassCard>
    </div>
  );
}
