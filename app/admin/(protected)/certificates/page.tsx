"use client";

import { useEffect, useRef, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Trash2, Upload } from "lucide-react";
import { db, storage } from "@/firebase/client";
import { COLLECTIONS } from "@/firebase/collections";
import type { CertificateDoc } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";

export default function AdminCertificatesPage() {
  const [rows, setRows] = useState<CertificateDoc[]>([]);
  const [title, setTitle] = useState("");
  const [issuedDate, setIssuedDate] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return onSnapshot(collection(db, COLLECTIONS.certificates), (snap) => {
      const list: CertificateDoc[] = snap.docs.map((d) => {
        const x = d.data() as Omit<CertificateDoc, "id">;
        return {
          id: d.id,
          title: x.title ?? "",
          imageUrl: x.imageUrl ?? "",
          issuedDate: x.issuedDate ?? "",
          order: typeof x.order === "number" ? x.order : 0,
        };
      });
      list.sort((a, b) => a.order - b.order);
      setRows(list);
    });
  }, []);

  async function addWithFile(file: File | null) {
    if (!title.trim()) return;
    setBusy(true);
    try {
      const nextOrder =
        rows.length === 0 ? 0 : Math.max(...rows.map((r) => r.order)) + 1;
      const id = doc(collection(db, COLLECTIONS.certificates)).id;
      let imageUrl = "";
      if (file) {
        const path = `certificates/${id}/${file.name}`;
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, file, { contentType: file.type });
        imageUrl = await getDownloadURL(storageRef);
      }
      await setDoc(doc(db, COLLECTIONS.certificates, id), {
        title: title.trim(),
        issuedDate: issuedDate.trim(),
        imageUrl,
        order: nextOrder,
      });
      setTitle("");
      setIssuedDate("");
      if (fileRef.current) fileRef.current.value = "";
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    await deleteDoc(doc(db, COLLECTIONS.certificates, id));
  }

  async function saveRow(r: CertificateDoc) {
    await updateDoc(doc(db, COLLECTIONS.certificates, r.id), {
      title: r.title.trim(),
      issuedDate: r.issuedDate.trim(),
      imageUrl: r.imageUrl.trim(),
      order: r.order,
    });
  }

  async function replaceImage(r: CertificateDoc, file: File | null) {
    if (!file) return;
    setBusy(true);
    try {
      const path = `certificates/${r.id}/${file.name}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file, { contentType: file.type });
      const imageUrl = await getDownloadURL(storageRef);
      await updateDoc(doc(db, COLLECTIONS.certificates, r.id), { imageUrl });
      setRows((list) =>
        list.map((x) => (x.id === r.id ? { ...x, imageUrl } : x)),
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Гэрчилгээ</h1>
      <p className="mt-1 text-sm text-slate-500">
        Firebase Storage руу зураг оруулна (зөвшөөрөгдсөн админ).
      </p>

      <GlassCard className="mt-6 space-y-3 p-6">
        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="rounded-xl border border-white/10 bg-[#050816]/70 px-3 py-2 text-sm"
            placeholder="Гарчиг"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="rounded-xl border border-white/10 bg-[#050816]/70 px-3 py-2 text-sm"
            placeholder="Олгосон огноо (жишээ 2025-04)"
            value={issuedDate}
            onChange={(e) => setIssuedDate(e.target.value)}
          />
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="text-sm text-slate-400" />
        <NeonButton
          type="button"
          disabled={busy}
          className="gap-2"
          onClick={() => addWithFile(fileRef.current?.files?.[0] ?? null)}
        >
          <Upload className="h-4 w-4" />
          Нэмэх
        </NeonButton>
      </GlassCard>

      <div className="mt-6 space-y-4">
        {rows.map((r) => (
          <GlassCard key={r.id} className="space-y-2 p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="text-xs text-slate-500 break-all">{r.imageUrl || "Зураггүй"}</p>
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
                value={r.issuedDate}
                onChange={(e) => {
                  const v = e.target.value;
                  setRows((list) =>
                    list.map((x) => (x.id === r.id ? { ...x, issuedDate: v } : x)),
                  );
                }}
              />
              <input
                className="md:col-span-2 rounded-lg border border-white/10 bg-transparent px-2 py-1 text-sm"
                placeholder="Зургийн URL (заавал биш)"
                value={r.imageUrl}
                onChange={(e) => {
                  const v = e.target.value;
                  setRows((list) =>
                    list.map((x) => (x.id === r.id ? { ...x, imageUrl: v } : x)),
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
            <div className="flex flex-wrap gap-2">
              <input
                type="file"
                accept="image/*"
                id={`file-${r.id}`}
                className="hidden"
                onChange={(e) => replaceImage(r, e.target.files?.[0] ?? null)}
              />
              <NeonButton
                type="button"
                variant="ghost"
                disabled={busy}
                onClick={() => document.getElementById(`file-${r.id}`)?.click()}
              >
                Зураг солих
              </NeonButton>
              <NeonButton type="button" variant="ghost" onClick={() => saveRow(r)}>
                Хадгалах
              </NeonButton>
            </div>
          </GlassCard>
        ))}
        {rows.length === 0 ? (
          <p className="text-sm text-slate-500">Гэрчилгээ алга.</p>
        ) : null}
      </div>
    </div>
  );
}
