"use client";

import { useEffect, useMemo, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { db } from "@/firebase/client";
import { COLLECTIONS, DOC_IDS } from "@/firebase/collections";
import type { HeroDoc, SettingsDoc } from "@/types";
import { defaultHero, defaultSettings } from "@/lib/defaults";
import { CyberSceneDynamic } from "@/components/cyber/CyberSceneDynamic";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import { SocialLinksRow } from "@/components/icons/SocialLinksRow";
import { NeonLink } from "@/components/ui/NeonLink";

function useTyping(phrases: string[], typingSpeed = 95, pause = 1600) {
  const [text, setText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const list = useMemo(
    () => (phrases.length ? phrases : ["Student Developer"]),
    [phrases],
  );

  const phraseKey = list.join("|");

  useEffect(() => {
    setText("");
    setPhraseIndex(0);
    setDeleting(false);
  }, [phraseKey]);

  useEffect(() => {
    const full = list[phraseIndex % list.length] ?? "";
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && text.length < full.length) {
      timeout = setTimeout(() => setText(full.slice(0, text.length + 1)), typingSpeed);
    } else if (!deleting && text.length === full.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && text.length > 0) {
      timeout = setTimeout(() => setText(full.slice(0, text.length - 1)), typingSpeed / 2);
    } else if (deleting && text.length === 0) {
      setDeleting(false);
      setPhraseIndex((i) => (i + 1) % list.length);
    }

    return () => clearTimeout(timeout);
  }, [text, deleting, list, phraseIndex, typingSpeed, pause]);

  return text;
}

export function HeroSection() {
  const { offset, norm, onMouseMove, onMouseLeave } = useMouseParallax(22);
  const [hero, setHero] = useState<HeroDoc>(defaultHero);
  const [settings, setSettings] = useState<SettingsDoc>(defaultSettings);

  useEffect(() => {
    const h = doc(db, COLLECTIONS.hero, DOC_IDS.hero);
    const s = doc(db, COLLECTIONS.settings, DOC_IDS.settings);
    const u1 = onSnapshot(
      h,
      (snap) => {
        if (!snap.exists()) return;
        const d = snap.data() as Partial<HeroDoc>;
        setHero({
          title: d.title ?? defaultHero.title,
          subtitle: d.subtitle ?? defaultHero.subtitle,
          typingPhrases:
            Array.isArray(d.typingPhrases) && d.typingPhrases.length
              ? d.typingPhrases
              : defaultHero.typingPhrases,
          cvUrl: d.cvUrl ?? defaultHero.cvUrl,
        });
      },
      () => {},
    );
    const u2 = onSnapshot(
      s,
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
    return () => {
      u1();
      u2();
    };
  }, []);

  const typed = useTyping(hero.typingPhrases);
  const cv = hero.cvUrl && hero.cvUrl !== "#" ? hero.cvUrl : settings.cvUrl;

  return (
    <section
      id="hero"
      className="relative scroll-mt-24 pt-28"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2 md:gap-12 md:px-6">
        <motion.div
          style={{ x: offset.x, y: offset.y }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-violet-300/90">
            Кибер портфолио
          </p>
          <h1 className="cyber-glow-text text-5xl font-black tracking-tight text-cyber-text md:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-br from-cyan-300 via-sky-200 to-violet-400 bg-clip-text text-transparent">
              {hero.title}
            </span>
          </h1>
          <p className="mt-4 text-lg text-slate-300 md:text-xl">{hero.subtitle}</p>
          <p className="mt-6 min-h-[2rem] font-mono text-base text-cyan-200 md:text-lg">
            <span className="mr-1 text-violet-300">&gt;</span>
            {typed}
            <span className="ml-0.5 inline-block h-5 w-0.5 animate-pulse bg-cyan-300 align-middle" />
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <NeonLink
              href={cv || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              CV татах
            </NeonLink>
          </div>

          <div className="mt-10">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500">
              Сошиал холбоос
            </p>
            <SocialLinksRow links={settings.socialLinks} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-gradient-to-tr from-cyan-500/15 to-violet-600/15 blur-2xl" />
          <CyberSceneDynamic pointer={{ x: norm.x * 2, y: norm.y * 2 }} />
        </motion.div>
      </div>
    </section>
  );
}
