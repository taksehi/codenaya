"use client";

import { useEffect } from "react";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import { MarketingNavbar } from "@/components/marketing-navbar";
import { SideGlyphs } from "./side-glyphs";
import { GridPattern } from "./grid-pattern";
import { LandingHero } from "./hero";
import { LandingDemo } from "./demo-video";
import { LandingStatsStrip } from "./stats-strip";
import { LandingPlayground } from "./interactive-playground";
import { LandingCommunityStrip } from "./community-strip";
import { LandingFeatures } from "./features";
import { LandingComparison } from "./comparison-matrix";
import { LandingHowItWorks } from "./how-it-works";
import { LandingFAQ } from "./faq-section";
import { LandingCTA } from "./cta-section";
import { LandingFooter } from "./footer";

export const LandingPage = () => {
  useEffect(() => {
    const root = document.documentElement;
    const wasDark = root.classList.contains("dark");
    root.classList.remove("dark");
    root.classList.add("light");

    const observer = new MutationObserver(() => {
      if (root.classList.contains("dark")) {
        root.classList.remove("dark");
        if (!root.classList.contains("light")) {
          root.classList.add("light");
        }
      }
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
      if (wasDark) {
        root.classList.add("dark");
        root.classList.remove("light");
      }
    };
  }, []);

  return (
    <SmoothScrollProvider>
      <div className="relative min-h-screen bg-[var(--canvas)] overflow-x-hidden">
        <SideGlyphs />
        <GridPattern className="fixed inset-0 opacity-[0.04] dark:opacity-[0.035]" />
        <MarketingNavbar overlay />
        <main className="relative z-10">
          <LandingHero />
          <LandingDemo />
          <LandingStatsStrip />
          <LandingPlayground />
          <LandingCommunityStrip />
          <LandingFeatures />
          <LandingComparison />
          <LandingHowItWorks />
          <LandingFAQ />
          <LandingCTA />
        </main>
        <LandingFooter />
      </div>
    </SmoothScrollProvider>
  );
};
