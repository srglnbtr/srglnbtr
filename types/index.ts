import type { Timestamp } from "firebase/firestore";

export type UserRole = "admin";

export interface UserDoc {
  email: string;
  role: UserRole;
  createdAt: Timestamp;
}

export interface HeroDoc {
  title: string;
  subtitle: string;
  typingPhrases: string[];
  cvUrl: string;
}

export interface AboutHighlight {
  title: string;
  description: string;
}

export interface AboutDoc {
  paragraphs: string[];
  highlights: AboutHighlight[];
}

export interface SkillDoc {
  id: string;
  name: string;
  percent: number;
  order: number;
}

export interface ProjectDoc {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
  order: number;
}

export interface CertificateDoc {
  id: string;
  title: string;
  imageUrl: string;
  issuedDate: string;
  order: number;
}

export interface ExperienceDoc {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
  order: number;
}

export interface MessageDoc {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: Timestamp;
}

export interface SocialLinks {
  github: string;
  linkedin: string;
  twitter: string;
  email: string;
}

export interface SettingsDoc {
  socialLinks: SocialLinks;
  cvUrl: string;
}

export interface AnalyticsDoc {
  pageViews: number;
  lastUpdated: Timestamp | null;
}
