import type { AboutDoc, HeroDoc, SettingsDoc } from "@/types";

export const defaultHero: HeroDoc = {
  title: "SRGLNBTR",
  subtitle: "Оюутан хөгжүүлэгч",
  typingPhrases: [
    "Full Stack",
    "Next.js",
    "Firebase",
    "TypeScript",
  ],
  cvUrl: "#",
};

export const defaultAbout: AboutDoc = {
  paragraphs: [
    "Сайн байна уу! Би вэб болон програмыг сонирхдог оюутан хөгжүүлэгч.",
    "Энэхүү портфолио нь Next.js 15, Firebase, Framer Motion ашиглан бүтээгдсэн.",
  ],
  highlights: [
    {
      title: "Фокус",
      description: "Цэвэр архитектур, үзэгдэх байдал, гүйцэтгэл.",
    },
    {
      title: "Технологи",
      description: "Орчин үеийн стек, тогтвортой deployment.",
    },
  ],
};

export const defaultSettings = {
  socialLinks: {
    facebook: "",
    instagram: "",
    github: "",
    gmail: "",
  },

  cvUrl: "",
};
