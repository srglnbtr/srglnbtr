"use client";

import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { Trash2, MailOpen } from "lucide-react";
import { db } from "@/firebase/client";
import { COLLECTIONS } from "@/firebase/collections";
import type { MessageDoc } from "@/types";
import { formatFirestoreDate } from "@/utils/format";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";

export default function AdminMessagesPage() {
  const [rows, setRows] = useState<MessageDoc[]>([]);

  useEffect(() => {
    return onSnapshot(collection(db, COLLECTIONS.messages), (snap) => {
      const list: MessageDoc[] = snap.docs.map((d) => {
        const x = d.data() as Omit<MessageDoc, "id">;
        return {
          id: d.id,
          name: x.name ?? "",
          email: x.email ?? "",
          message: x.message ?? "",
          read: Boolean(x.read),
          createdAt: x.createdAt,
        };
      });
      list.sort((a, b) => {
        const ta = a.createdAt?.toMillis?.() ?? 0;
        const tb = b.createdAt?.toMillis?.() ?? 0;
        return tb - ta;
      });
      setRows(list);
    });
  }, []);

  async function markRead(id: string) {
    await updateDoc(doc(db, COLLECTIONS.messages, id), { read: true });
  }

  async function remove(id: string) {
    await deleteDoc(doc(db, COLLECTIONS.messages, id));
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Мессежүүд</h1>
      <p className="mt-1 text-sm text-slate-500">Холбоо барих маягтаас ирсэн.</p>

      <div className="mt-6 space-y-4">
        {rows.map((m) => (
          <GlassCard
            key={m.id}
            className={`p-5 ${m.read ? "opacity-70" : "shadow-[0_0_24px_rgba(56,189,248,0.08)]"}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-cyber-text">{m.name}</p>
                <p className="text-sm text-cyan-200/90">{m.email}</p>
                <p className="mt-2 text-xs text-slate-500">
                  {formatFirestoreDate(m.createdAt)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {!m.read ? (
                  <NeonButton
                    type="button"
                    variant="ghost"
                    className="gap-1"
                    onClick={() => markRead(m.id)}
                  >
                    <MailOpen className="h-4 w-4" />
                    Уншсан
                  </NeonButton>
                ) : null}
                <button
                  type="button"
                  className="rounded-lg p-2 text-slate-500 hover:bg-red-500/10 hover:text-red-400"
                  aria-label="Устгах"
                  onClick={() => remove(m.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
              {m.message}
            </p>
          </GlassCard>
        ))}
        {rows.length === 0 ? (
          <p className="text-sm text-slate-500">Мессеж алга.</p>
        ) : null}
      </div>
    </div>
  );
}
