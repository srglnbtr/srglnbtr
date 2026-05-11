"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import type { SettingsDoc } from "@/types";
import { cn } from "@/lib/utils";

import {
  IconGitHub,
  IconFacebook,
  IconInstagram,
} from "@/components/icons/BrandIcons";

type IconComp = React.ComponentType<{ className?: string }>;

export function SocialLinksRow({
  links,
  className,
}: {
  links: SettingsDoc["socialLinks"];
  className?: string;
}) {
  const items: { href: string; label: string; Icon: IconComp }[] = [
    {
      href: links.github,
      label: "GitHub",
      Icon: IconGitHub,
    },
    {
      href: links.facebook,
      label: "Facebook",
      Icon: IconFacebook,
    },
    {
      href: links.instagram,
      label: "Instagram",
      Icon: IconInstagram,
    },
    {
      href: `mailto:${links.gmail}`,
      label: "Gmail",
      Icon: Mail,
    },
  ].filter((x) => x.href && x.href.trim() !== "");

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {items.map(({ href, label, Icon }) => (
        <Link
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-cyber-text transition-all hover:border-cyan-400/40 hover:text-cyan-200 hover:shadow-[0_0_20px_rgba(56,189,248,0.25)]"
        >
          <Icon className="h-5 w-5" />
        </Link>
      ))}
    </div>
  );
}