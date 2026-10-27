"use client";

import { useEffect } from "react";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import { MarketingNavbar } from "@/components/marketing-navbar";
import { SideGlyphs } from "./side-glyphs";
import { LandingHero } from "./hero";
import { LandingDemo } from "./demo-video";
import { LandingCommunityStrip } from "./community-strip";
import { LandingFeatures } from "./features";
import { LandingHowItWorks } from "./how-it-works";
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
        <MarketingNavbar overlay />
        <main>
          <LandingHero />
          <LandingDemo />
          <LandingCommunityStrip />
          <LandingFeatures />
          <LandingHowItWorks />
          <LandingCTA />
        </main>
        <LandingFooter />
      </div>
    </SmoothScrollProvider>
  );
};
