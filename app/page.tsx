import { SiteNavbar } from "@/components/layout/SiteNavbar";
import { ParticleBackdrop } from "@/components/layout/ParticleBackdrop";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { CertificatesSection } from "@/components/sections/CertificatesSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { SiteFooter } from "@/components/sections/SiteFooter";

export default function HomePage() {
  return (
    <>
      <ParticleBackdrop />
      <SiteNavbar />
      <main className="relative text-cyber-text">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <CertificatesSection />
        <ExperienceSection />
        <ContactSection />
        <SiteFooter />
      </main>
    </>
  );
}
