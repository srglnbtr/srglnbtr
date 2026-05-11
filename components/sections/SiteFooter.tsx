"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import Link from "next/link";
import { db } from "@/firebase/client";
import { COLLECTIONS, DOC_IDS } from "@/firebase/collections";
import type { SettingsDoc } from "@/types";
import { defaultSettings } from "@/lib/defaults";
import { SocialLinksRow } from "@/components/icons/SocialLinksRow";

export function SiteFooter() {
  const [settings, setSettings] = useState<SettingsDoc>(defaultSettings);

  useEffect(() => {
    const ref = doc(db, COLLECTIONS.settings, DOC_IDS.settings);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) return;
        const d = snap.data() as Partial<SettingsDoc>;
        setSettings({
          socialLinks: {
            ...defaultSettings.socialLinks,
            ...(d.socialLinks ?? {}),
          },
          cvUrl: d.cvUrl ?? defaultSettings.cvUrl,
        });
      },
      () => {},
    );
    return () => unsub();
  }, []);

  return (
    <footer className="border-t border-white/5 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 text-center md:flex-row md:text-left md:px-6">
        <div>
          <p className="text-sm font-bold tracking-[0.2em] text-cyan-300">SRGLNBTR</p>
          <p className="mt-2 max-w-md text-xs text-slate-500">
          © 2026 Бүх эрх хуулиар хамгаалагдсан. Зөвшөөрөлгүй хуулбарлах, ашиглахыг хориглоно.
          </p>
        </div>
        <div className="flex flex-col items-center gap-3 md:items-end">
          <SocialLinksRow links={settings.socialLinks} className="justify-center md:justify-end" />
          <Link
            href="/admin/login"
            className="text-xs text-slate-600 underline-offset-4 hover:text-slate-400 hover:underline"
          >
            Админ нэвтрэх
          </Link>
        </div>
      </div>
    </footer>
  );
}
