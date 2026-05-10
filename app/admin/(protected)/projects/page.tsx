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
import type { ProjectDoc } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";

const emptyProject: Omit<ProjectDoc, "id"> = {
  title: "",
  description: "",
  imageUrl: "",
  techStack: [],
  githubUrl: "",
  liveUrl: "",
  order: 0,
};

export default function AdminProjectsPage() {
  const [rows, setRows] = useState<ProjectDoc[]>([]);
  const [draft, setDraft] = useState<Omit<ProjectDoc, "id">>({ ...emptyProject, order: 0 });
  const [techInput, setTechInput] = useState("Next.js, Firebase, Tailwind");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    return onSnapshot(collection(db, COLLECTIONS.projects), (snap) => {
      const list: ProjectDoc[] = snap.docs.map((d) => {
        const x = d.data() as Omit<ProjectDoc, "id">;
        return {
          id: d.id,
          title: x.title ?? "",
          description: x.description ?? "",
          imageUrl: x.imageUrl ?? "",
          techStack: Array.isArray(x.techStack) ? x.techStack : [],
          githubUrl: x.githubUrl ?? "",
          liveUrl: x.liveUrl ?? "",
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
      const techStack = techInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      await addDoc(collection(db, COLLECTIONS.projects), {
        title: draft.title.trim(),
        description: draft.description.trim(),
        imageUrl: draft.imageUrl.trim(),
        techStack,
        githubUrl: draft.githubUrl.trim(),
        liveUrl: draft.liveUrl.trim(),
        order: nextOrder,
      });
      setDraft({ ...emptyProject, order: 0 });
      setTechInput("");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    await deleteDoc(doc(db, COLLECTIONS.projects, id));
  }

  async function saveRow(r: ProjectDoc) {
    await updateDoc(doc(db, COLLECTIONS.projects, r.id), {
      title: r.title.trim(),
      description: r.description.trim(),
      imageUrl: r.imageUrl.trim(),
      techStack: r.techStack,
      githubUrl: r.githubUrl.trim(),
      liveUrl: r.liveUrl.trim(),
      order: r.order,
    });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Төслүүд</h1>
      <p className="mt-1 text-sm text-slate-500">Зурагны URL, GitHub, Live холбоос.</p>

      <GlassCard className="mt-6 space-y-3 p-6">
        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="rounded-xl border border-white/10 bg-[#050816]/70 px-3 py-2 text-sm"
            placeholder="Гарчиг"
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
          />
          <input
            className="rounded-xl border border-white/10 bg-[#050816]/70 px-3 py-2 text-sm"
            placeholder="Зургийн URL"
            value={draft.imageUrl}
            onChange={(e) => setDraft((d) => ({ ...d, imageUrl: e.target.value }))}
          />
          <textarea
            className="md:col-span-2 rounded-xl border border-white/10 bg-[#050816]/70 px-3 py-2 text-sm"
            placeholder="Тайлбар"
            rows={3}
            value={draft.description}
            onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
          />
          <input
            className="rounded-xl border border-white/10 bg-[#050816]/70 px-3 py-2 text-sm md:col-span-2"
            placeholder="Технологиуд (таслалаар)"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
          />
          <input
            className="rounded-xl border border-white/10 bg-[#050816]/70 px-3 py-2 text-sm"
            placeholder="GitHub URL"
            value={draft.githubUrl}
            onChange={(e) => setDraft((d) => ({ ...d, githubUrl: e.target.value }))}
          />
          <input
            className="rounded-xl border border-white/10 bg-[#050816]/70 px-3 py-2 text-sm"
            placeholder="Live demo URL"
            value={draft.liveUrl}
            onChange={(e) => setDraft((d) => ({ ...d, liveUrl: e.target.value }))}
          />
        </div>
        <NeonButton type="button" onClick={add} disabled={busy} className="gap-2">
          <Plus className="h-4 w-4" />
          Төсөл нэмэх
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
                value={r.imageUrl}
                onChange={(e) => {
                  const v = e.target.value;
                  setRows((list) =>
                    list.map((x) => (x.id === r.id ? { ...x, imageUrl: v } : x)),
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
                className="md:col-span-2 rounded-lg border border-white/10 bg-transparent px-2 py-1 text-sm"
                value={r.techStack.join(", ")}
                onChange={(e) => {
                  const techStack = e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean);
                  setRows((list) =>
                    list.map((x) => (x.id === r.id ? { ...x, techStack } : x)),
                  );
                }}
              />
              <input
                className="rounded-lg border border-white/10 bg-transparent px-2 py-1 text-sm"
                value={r.githubUrl}
                onChange={(e) => {
                  const v = e.target.value;
                  setRows((list) =>
                    list.map((x) => (x.id === r.id ? { ...x, githubUrl: v } : x)),
                  );
                }}
              />
              <input
                className="rounded-lg border border-white/10 bg-transparent px-2 py-1 text-sm"
                value={r.liveUrl}
                onChange={(e) => {
                  const v = e.target.value;
                  setRows((list) =>
                    list.map((x) => (x.id === r.id ? { ...x, liveUrl: v } : x)),
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
              Мөр хадгалах
            </NeonButton>
          </GlassCard>
        ))}
        {rows.length === 0 ? (
          <p className="text-sm text-slate-500">Төсөл алга.</p>
        ) : null}
      </div>
    </div>
  );
}
