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
import type { SkillDoc } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";

export default function AdminSkillsPage() {
  const [rows, setRows] = useState<SkillDoc[]>([]);
  const [name, setName] = useState("");
  const [percent, setPercent] = useState(80);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const col = collection(db, COLLECTIONS.skills);
    return onSnapshot(col, (snap) => {
      const list: SkillDoc[] = snap.docs.map((d) => {
        const x = d.data() as Omit<SkillDoc, "id">;
        return {
          id: d.id,
          name: x.name ?? "",
          percent: typeof x.percent === "number" ? x.percent : 0,
          order: typeof x.order === "number" ? x.order : 0,
        };
      });
      list.sort((a, b) => a.order - b.order);
      setRows(list);
    });
  }, []);

  async function add() {
    if (!name.trim()) return;
    setBusy(true);
    try {
      const nextOrder =
        rows.length === 0 ? 0 : Math.max(...rows.map((r) => r.order)) + 1;
      await addDoc(collection(db, COLLECTIONS.skills), {
        name: name.trim(),
        percent: Math.min(100, Math.max(0, percent)),
        order: nextOrder,
      });
      setName("");
      setPercent(80);
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    await deleteDoc(doc(db, COLLECTIONS.skills, id));
  }

  async function patch(id: string, data: Record<string, unknown>) {
    await updateDoc(doc(db, COLLECTIONS.skills, id), data);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Ур чадвар</h1>
      <p className="mt-1 text-sm text-slate-500">Нэмэх, засах, устгах.</p>

      <GlassCard className="mt-6 space-y-3 p-6">
        <div className="grid gap-3 md:grid-cols-3">
          <input
            className="rounded-xl border border-white/10 bg-[#050816]/70 px-3 py-2 text-sm md:col-span-2"
            placeholder="Нэр (жишээ нь TypeScript)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            min={0}
            max={100}
            className="rounded-xl border border-white/10 bg-[#050816]/70 px-3 py-2 text-sm"
            value={percent}
            onChange={(e) => setPercent(Number(e.target.value))}
          />
        </div>
        <NeonButton type="button" onClick={add} disabled={busy} className="gap-2">
          <Plus className="h-4 w-4" />
          Нэмэх
        </NeonButton>
      </GlassCard>

      <div className="mt-6 space-y-3">
        {rows.map((r) => (
          <GlassCard key={r.id} className="p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <input
                className="flex-1 rounded-lg border border-white/10 bg-transparent px-2 py-1 text-sm"
                value={r.name}
                onChange={(e) => {
                  const v = e.target.value;
                  setRows((list) =>
                    list.map((x) => (x.id === r.id ? { ...x, name: v } : x)),
                  );
                }}
                onBlur={(e) => patch(r.id, { name: e.target.value.trim() })}
              />
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="number"
                  className="w-24 rounded-lg border border-white/10 bg-transparent px-2 py-1 text-sm"
                  value={r.percent}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setRows((list) =>
                      list.map((x) => (x.id === r.id ? { ...x, percent: v } : x)),
                    );
                  }}
                  onBlur={(e) =>
                    patch(r.id, {
                      percent: Math.min(
                        100,
                        Math.max(0, Number(e.target.value) || 0),
                      ),
                    })
                  }
                />
                <input
                  type="number"
                  className="w-24 rounded-lg border border-white/10 bg-transparent px-2 py-1 text-sm"
                  title="Эрэмбэ"
                  value={r.order}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setRows((list) =>
                      list.map((x) => (x.id === r.id ? { ...x, order: v } : x)),
                    );
                  }}
                  onBlur={(e) =>
                    patch(r.id, { order: Number(e.target.value) || 0 })
                  }
                />
                <button
                  type="button"
                  className="rounded-lg p-2 text-slate-500 hover:bg-red-500/10 hover:text-red-400"
                  aria-label="Устгах"
                  onClick={() => remove(r.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
        {rows.length === 0 ? (
          <p className="text-sm text-slate-500">Одоогоор ур чадвар алга.</p>
        ) : null}
      </div>
    </div>
  );
}
