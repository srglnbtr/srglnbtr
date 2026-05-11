import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { FirebaseAnalytics } from "@/components/FirebaseAnalytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "SRGLNBTR — Оюутан хөгжүүлэгчийн портфолио",
    template: "%s | SRGLNBTR",
  },
  description:
    "SRGLNBTR — Next.js 15, Firebase, кибер хэв маягийн орчин үеийн портфолио вэбсайт.",
  openGraph: {
    title: "SRGLNBTR — Портфолио",
    description: "Оюутан хөгжүүлэгчийн портфолио — кибер UI, Firebase CMS.",
    type: "website",
    locale: "mn_MN",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        <FirebaseAnalytics />
        {children}
      </body>
    </html>
  );
}
