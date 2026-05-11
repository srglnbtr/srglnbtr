"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/client";
import { COLLECTIONS, DOC_IDS } from "@/firebase/collections";
import type { SettingsDoc } from "@/types";
import { defaultSettings } from "@/lib/defaults";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SettingsDoc>(defaultSettings);
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "err">("idle");

  useEffect(() => {
    (async () => {
      const ref = doc(db, COLLECTIONS.settings, DOC_IDS.settings);
      const snap = await getDoc(ref);

      if (!snap.exists()) return;

      const d = snap.data() as Partial<SettingsDoc>;

      setForm({
        socialLinks: {
          ...defaultSettings.socialLinks,
          ...(d.socialLinks ?? {}),
        },
        cvUrl: d.cvUrl ?? defaultSettings.cvUrl,
      });
    })();
  }, []);

  async function save() {
    setStatus("saving");

    try {
      await setDoc(
        doc(db, COLLECTIONS.settings, DOC_IDS.settings),
        {
          socialLinks: {
            facebook: form.socialLinks.facebook.trim(),
            instagram: form.socialLinks.instagram.trim(),
            github: form.socialLinks.github.trim(),
            gmail: form.socialLinks.gmail.trim(),
          },
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
      <h1 className="text-2xl font-bold">Тохиргоо</h1>

      <p className="mt-1 text-sm text-slate-500">
        Facebook, Instagram, GitHub, Gmail холбоосууд.
      </p>

      <GlassCard className="mt-6 space-y-4 p-6">
        {(
          [
            { key: "facebook" as const, label: "Facebook URL" },
            { key: "instagram" as const, label: "Instagram URL" },
            { key: "github" as const, label: "GitHub URL" },
            { key: "gmail" as const, label: "Gmail" },
          ] as const
        ).map(({ key, label }) => (
          <div key={key}>
            <label className="mb-1 block text-xs text-slate-400">
              {label}
            </label>

            <input
              className="w-full rounded-xl border border-white/10 bg-[#050816]/70 px-3 py-2 text-sm"
              value={form.socialLinks[key]}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  socialLinks: {
                    ...f.socialLinks,
                    [key]: e.target.value,
                  },
                }))
              }
            />
          </div>
        ))}

        <div>
          <label className="mb-1 block text-xs text-slate-400">
            CV URL (нийтлэг)
          </label>

          <input
            className="w-full rounded-xl border border-white/10 bg-[#050816]/70 px-3 py-2 text-sm"
            value={form.cvUrl}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                cvUrl: e.target.value,
              }))
            }
          />
        </div>

        {status === "ok" ? (
          <p className="text-sm text-emerald-400">Хадгалагдлаа.</p>
        ) : null}

        {status === "err" ? (
          <p className="text-sm text-red-400">Алдаа гарлаа.</p>
        ) : null}

        <NeonButton
          type="button"
          onClick={save}
          disabled={status === "saving"}
        >
          {status === "saving"
            ? "Хадгалж байна..."
            : "Хадгалах"}
        </NeonButton>
      </GlassCard>
    </div>
  );
}