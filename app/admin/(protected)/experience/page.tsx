"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { Plus, Trash2 } from "lucide-react";
import { db } from "@/firebase/client";
import { COLLECTIONS } from "@/firebase/collections";
import type { ExperienceDoc } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";

const empty: Omit<ExperienceDoc, "id"> = {
  title: "",
  company: "",
  period: "",
  description: "",
  order: 0,
};

export default function AdminExperiencePage() {
  const [rows, setRows] = useState<ExperienceDoc[]>([]);
  const [draft, setDraft] = useState<Omit<ExperienceDoc, "id">>(empty);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    return onSnapshot(collection(db, COLLECTIONS.experience), (snap) => {
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
      list.sort((a, b) => a.order - b.order);
      setRows(list);
    });
  }, []);

  async function add() {
    if (!draft.title.trim()) return;
    setBusy(true);
    try {
      const nextOrder =
        rows.length === 0 ? 0 : Math.max(...rows.map((r) => r.order)) + 1;
      await addDoc(collection(db, COLLECTIONS.experience), {
        title: draft.title.trim(),
        company: draft.company.trim(),
        period: draft.period.trim(),
        description: draft.description.trim(),
        order: nextOrder,
      });
      setDraft(empty);
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    await deleteDoc(doc(db, COLLECTIONS.experience, id));
  }

  async function saveRow(r: ExperienceDoc) {
    await updateDoc(doc(db, COLLECTIONS.experience, r.id), {
      title: r.title.trim(),
      company: r.company.trim(),
      period: r.period.trim(),
      description: r.description.trim(),
      order: r.order,
    });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Туршлага</h1>
      <p className="mt-1 text-sm text-slate-500">Timeline мэдээлэл.</p>

      <GlassCard className="mt-6 space-y-3 p-6">
        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="rounded-xl border border-white/10 bg-[#050816]/70 px-3 py-2 text-sm"
            placeholder="Албан тушаал / үүрэг"
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
          />
          <input
            className="rounded-xl border border-white/10 bg-[#050816]/70 px-3 py-2 text-sm"
            placeholder="Байгууллага"
            value={draft.company}
            onChange={(e) => setDraft((d) => ({ ...d, company: e.target.value }))}
          />
          <input
            className="rounded-xl border border-white/10 bg-[#050816]/70 px-3 py-2 text-sm"
            placeholder="Хугацаа (жишээ 2024 — Одоо)"
            value={draft.period}
            onChange={(e) => setDraft((d) => ({ ...d, period: e.target.value }))}
          />
          <textarea
            className="md:col-span-2 rounded-xl border border-white/10 bg-[#050816]/70 px-3 py-2 text-sm"
            placeholder="Тайлбар"
            rows={3}
            value={draft.description}
            onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
          />
        </div>
        <NeonButton type="button" onClick={add} disabled={busy} className="gap-2">
          <Plus className="h-4 w-4" />
          Нэмэх
        </NeonButton>
      </GlassCard>

      <div className="mt-6 space-y-4">
        {rows.map((r) => (
          <GlassCard key={r.id} className="space-y-2 p-4">
            <div className="flex justify-end">
              <button
                type="button"
                className="rounded-lg p-2 text-slate-500 hover:bg-red-500/10 hover:text-red-400"
                aria-label="Устгах"
                onClick={() => remove(r.id)}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              <input
                className="rounded-lg border border-white/10 bg-transparent px-2 py-1 text-sm"
                value={r.title}
                onChange={(e) => {
                  const v = e.target.value;
                  setRows((list) =>
                    list.map((x) => (x.id === r.id ? { ...x, title: v } : x)),
                  );
                }}
              />
              <input
                className="rounded-lg border border-white/10 bg-transparent px-2 py-1 text-sm"
                value={r.company}
                onChange={(e) => {
                  const v = e.target.value;
                  setRows((list) =>
                    list.map((x) => (x.id === r.id ? { ...x, company: v } : x)),
                  );
                }}
              />
              <input
                className="md:col-span-2 rounded-lg border border-white/10 bg-transparent px-2 py-1 text-sm"
                value={r.period}
                onChange={(e) => {
                  const v = e.target.value;
                  setRows((list) =>
                    list.map((x) => (x.id === r.id ? { ...x, period: v } : x)),
                  );
                }}
              />
              <textarea
                className="md:col-span-2 rounded-lg border border-white/10 bg-transparent px-2 py-1 text-sm"
                rows={3}
                value={r.description}
                onChange={(e) => {
                  const v = e.target.value;
                  setRows((list) =>
                    list.map((x) => (x.id === r.id ? { ...x, description: v } : x)),
                  );
                }}
              />
              <input
                type="number"
                className="rounded-lg border border-white/10 bg-transparent px-2 py-1 text-sm"
                title="Эрэмбэ"
                value={r.order}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setRows((list) =>
                    list.map((x) => (x.id === r.id ? { ...x, order: v } : x)),
                  );
                }}
              />
            </div>
            <NeonButton type="button" variant="ghost" onClick={() => saveRow(r)}>
              Хадгалах
            </NeonButton>
          </GlassCard>
        ))}
        {rows.length === 0 ? (
          <p className="text-sm text-slate-500">Туршлага бүртгэгдээгүй.</p>
        ) : null}
      </div>
    </div>
  );
}
