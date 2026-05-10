"use client";

import { useState } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { db } from "@/firebase/client";
import { COLLECTIONS } from "@/firebase/collections";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { NeonButton } from "@/components/ui/NeonButton";

export function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setStatus("sending");
    try {
      await addDoc(collection(db, COLLECTIONS.messages), {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        read: false,
        createdAt: Timestamp.now(),
      });
      setStatus("ok");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("err");
      setErr("Илгээхэд алдаа гарлаа. Дахин оролдоно уу.");
    }
  }

  return (
    <section id="contact" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionTitle eyebrow="Холбоо" title="Холбоо барих" />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <GlassCard className="mx-auto max-w-xl p-6 md:p-8">
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400" htmlFor="name">
                  Нэр
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#050816]/60 px-4 py-2.5 text-sm text-cyber-text outline-none ring-cyan-400/30 placeholder:text-slate-600 focus:ring-2"
                  placeholder="Таны нэр"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400" htmlFor="email">
                  И-мэйл
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#050816]/60 px-4 py-2.5 text-sm text-cyber-text outline-none ring-cyan-400/30 placeholder:text-slate-600 focus:ring-2"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label
                  className="mb-1.5 block text-xs font-medium text-slate-400"
                  htmlFor="message"
                >
                  Мессеж
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full resize-y rounded-xl border border-white/10 bg-[#050816]/60 px-4 py-2.5 text-sm text-cyber-text outline-none ring-cyan-400/30 placeholder:text-slate-600 focus:ring-2"
                  placeholder="Таны мессеж..."
                />
              </div>

              {status === "ok" ? (
                <p className="text-sm font-medium text-emerald-400">Амжилттай илгээгдлээ. Баярлалаа!</p>
              ) : null}
              {status === "err" ? <p className="text-sm text-red-400">{err}</p> : null}

              <NeonButton
                type="submit"
                disabled={status === "sending"}
                className="w-full gap-2 sm:w-auto"
              >
                <Send className="h-4 w-4" />
                {status === "sending" ? "Илгээж байна..." : "Илгээх"}
              </NeonButton>
            </form>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
