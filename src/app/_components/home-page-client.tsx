"use client";

import { PublicNavbar } from "./public-navbar";
import { HeroSection } from "./hero-section";
import { CockpitWidgets } from "./cockpit-widgets";
import { OnboardingGuide } from "./onboarding-guide";
import { FacultyModulesGrid } from "./faculty-modules-grid";
import { ArchitectureTrust } from "./architecture-trust";
import { ContactSection } from "./contact-section";
import { PublicFooter } from "./public-footer";

export function HomePageClient() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/25 selection:text-primary relative overflow-x-hidden">
      {/* ─── Nexa-Style Ambient Mesh Background & Grid Lines ─── */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Fine Matrix Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800c_1px,transparent_1px),linear-gradient(to_bottom,#8080800c_1px,transparent_1px)] bg-[size:36px_36px] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)]" />

        {/* Ambient Radial Spotlights */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[750px] h-[550px] bg-gradient-to-tr from-primary/25 via-cyan-500/20 to-purple-600/15 blur-[150px] rounded-full opacity-80" />
        <div className="absolute top-[35%] -left-32 w-[500px] h-[500px] bg-amber-500/15 blur-[140px] rounded-full opacity-60" />
        <div className="absolute top-[60%] -right-32 w-[600px] h-[600px] bg-emerald-500/15 blur-[160px] rounded-full opacity-60" />
      </div>

      {/* ─── 1. Floating Top Navbar ─── */}
      <PublicNavbar />

      {/* ─── 2. Hero Section ─── */}
      <HeroSection />

      {/* ─── 3. Cockpit Live Widgets ─── */}
      <div className="px-4 max-w-6xl mx-auto w-full flex justify-center">
        <CockpitWidgets />
      </div>

      {/* ─── 4. Onboarding & Quickstart Guide ─── */}
      <OnboardingGuide />

      {/* ─── 5. 8 Faculty Modules Ecosystem ─── */}
      <FacultyModulesGrid />

      {/* ─── 6. Enterprise Architecture & Trust ─── */}
      <ArchitectureTrust />

      {/* ─── 7. Contact Information ─── */}
      <ContactSection />

      {/* ─── 8. Public Footer ─── */}
      <PublicFooter />
    </div>
  );
}
