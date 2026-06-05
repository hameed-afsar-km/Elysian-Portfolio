"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTransform, motion, useMotionValue, useSpring } from "framer-motion";
import type Lenis from "lenis";
import { useLenis } from "lenis/react";
import ParticleBackground from "@/components/ParticleBackground";
import ParticleBackgroundMono from "@/components/ParticleBackgroundMono";
import CurvedMarquee from "@/components/CurvedMarquee";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { TerminalAbout } from "@/components/TerminalAbout";
import TimelineSection from "@/components/TimelineSection";
import ScrollScrubSection from "@/components/ScrollScrubSection";
import VerticalTimeline from "@/components/VerticalTimeline";
import ResumeSection from "@/components/ResumeSection";
import FooterSection from "@/components/FooterSection";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const lenisRef = useLenis();

  // Scroll progress driven by Lenis (container-relative 0–1)
  const scrollYProgress = useMotionValue(0);

  // Lock body scroll while loader is active; pause/resume Lenis accordingly
  useEffect(() => {
    if (lenisRef) {
      if (loading) {
        lenisRef.stop();
        document.body.style.overflow = "hidden";
      } else {
        lenisRef.start();
        document.body.style.overflow = "auto";
        document.body.style.overflowX = "hidden";
      }
    }
  }, [loading, lenisRef]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3300);
    return () => clearTimeout(timer);
  }, []);

  // Sync Lenis scroll to progress MotionValue (focused on first 300vh)
  useLenis(
    useCallback((lenis: Lenis) => {
      const el = containerRef.current;
      if (!el) return;
      const elTop = el.offsetTop;
      const vh = window.innerHeight;
      const range = vh * 3; // Lock scroll-scrub range to exactly 300vh
      const p = range > 0 ? (lenis.scroll - elTop) / range : 0;
      scrollYProgress.set(Math.max(0, Math.min(1, p)));
    }, [])
  );

  // ── Hero (0 → 0.15) ─────────────────────────────────────
  const rawHeroScale = useTransform(scrollYProgress, [0, 0.15], [1, 10]);
  const rawHeroY = useTransform(scrollYProgress, [0, 0.15], [0, -800]);
  const rawHeroOpacity = useTransform(scrollYProgress, [0, 0.10, 0.15], [1, 1, 0]);
  const heroScale = useSpring(rawHeroScale, { stiffness: 200, damping: 30, restDelta: 0.001 });
  const heroY = useSpring(rawHeroY, { stiffness: 200, damping: 30, restDelta: 0.001 });
  const heroOpacity = useSpring(rawHeroOpacity, { stiffness: 250, damping: 35, restDelta: 0.001 });

  // ── Marquees (0 → 0.18) ────────────────────────────────
  const rawMarqueeScale = useTransform(scrollYProgress, [0, 0.18], [1, 3]);
  const rawMarqueeAY = useTransform(scrollYProgress, [0, 0.18], [0, -600]);
  const rawMarqueeBY = useTransform(scrollYProgress, [0, 0.18], [0, 600]);
  const rawMarqueeOpacity = useTransform(scrollYProgress, [0, 0.14], [1, 0]);
  const marqueeScale = useSpring(rawMarqueeScale, { stiffness: 100, damping: 25, restDelta: 0.001 });
  const marqueeAY = useSpring(rawMarqueeAY, { stiffness: 100, damping: 25, restDelta: 0.001 });
  const marqueeBY = useSpring(rawMarqueeBY, { stiffness: 100, damping: 25, restDelta: 0.001 });
  const marqueeOpacity = useSpring(rawMarqueeOpacity, { stiffness: 150, damping: 30, restDelta: 0.001 });

  // ── Background opacity (0 → 0.20) ──────────────────────
  const rawBgOpacity = useTransform(scrollYProgress, [0, 0.20], [1, 0.15]);
  const bgOpacity = useSpring(rawBgOpacity, { stiffness: 150, damping: 30, restDelta: 0.001 });

  // ── Fixed viewport display toggles ─────────────────────
  const fixedContainerDisplay = useTransform(scrollYProgress, (p) =>
    p >= 1.0 ? "none" : "flex"
  );

  // ── About Me (0.15 → 1.0) ─────────────────────────────
  const aboutDisplay = useTransform(scrollYProgress, (p) =>
    (p < 0.15 || p >= 1.0) ? "none" : "flex"
  );
  // Hide card after parallax exit completes at 1.0
  const aboutCardDisplay = useTransform(scrollYProgress, (p) =>
    (p < 0.15 || p >= 1.0) ? "none" : "flex"
  );
  // Slide in → hold while typing → parallax shrink + slide up out
  const rawAboutCardY = useTransform(
    scrollYProgress,
    [0.15, 0.30, 0.65, 1.0],
    [1200, 0, 0, -1000]
  );
  const rawAboutCardScale = useTransform(scrollYProgress, [0.65, 1.0], [1, 0.88]);
  const aboutCardY = useSpring(rawAboutCardY, { stiffness: 300, damping: 40, restDelta: 0.1 });
  const aboutCardScale = useSpring(rawAboutCardScale, { stiffness: 250, damping: 35, restDelta: 0.001 });

  // Terminal typing animation progress
  const rawCardProgress = useTransform(scrollYProgress, [0.30, 0.60], [0, 1]);
  const cardProgress = useSpring(rawCardProgress, {
    stiffness: 150,
    damping: 30,
    restDelta: 0.001,
  });

  // Terminal exit animation progress (lines fade out as card exits)
  const rawAboutExit = useTransform(scrollYProgress, [0.65, 0.95], [0, 1]);
  const aboutExit = useSpring(rawAboutExit, {
    stiffness: 300,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <div ref={containerRef} data-scroll-container className="relative w-full bg-transparent">
      {/* Loader screen */}
      <div className="loader-screen">
        <div className="loader-bg" />
        <div className="loader-stripes">
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} className="loader-stripe" />
          ))}
        </div>
        <h1 className="loader-text">
          {"AFSAR".split("").map((char, index) => (
            <span
              key={index}
              className="loader-char"
              style={{ "--char-idx": index } as React.CSSProperties}
            >
              {char}
            </span>
          ))}
        </h1>
      </div>

      {/* Particle Background */}
      <motion.div style={{ opacity: bgOpacity }} className="pointer-events-none">
        <ParticleBackground />
      </motion.div>

      {/* Fixed Viewport Container — stays in view regardless of scroll distance */}
      <motion.div
        style={{ display: fixedContainerDisplay }}
        className="fixed top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center pointer-events-none z-[10]"
      >

        {/* Curved Marquees — scale up and fly apart as hero zooms in */}
        <motion.div
          style={{ scale: marqueeScale, y: marqueeBY, opacity: marqueeOpacity }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-[5]"
        >
          <CurvedMarquee ribbon="b" />
        </motion.div>
        <motion.div
          style={{ scale: marqueeScale, y: marqueeAY, opacity: marqueeOpacity }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-[6]"
        >
          <CurvedMarquee ribbon="a" />
        </motion.div>

        {/* Hero Section Wrapper */}
        <motion.div
          style={{ scale: heroScale, y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <main className="hero-container">
            <h1 className="val-heading">
              <span className="word-wrap">
                <span className="word-half">THINK</span>
              </span>
              <span className="word-wrap">
                <span className="word-half">MAKE</span>
              </span>
              <span className="word-wrap">
                <span className="word-half">REPEAT</span>
              </span>
            </h1>
          </main>
        </motion.div>

        {/* About Me Background — dark canvas */}
        <motion.div
          id="about"
          style={{ display: aboutDisplay }}
          className="absolute inset-0 w-full h-full"
        >
          <ParticleBackgroundMono />
        </motion.div>

        {/* About Me Card — parallax: shrinks + slides up as timeline takes over */}
        <motion.div
          style={{
            display: aboutCardDisplay,
            y: aboutCardY,
            scale: aboutCardScale,
            pointerEvents: "auto",
          }}
          className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden"
        >
          <div className="relative z-10 w-full max-w-5xl mx-auto px-4 md:px-8">
            <ContainerScroll progress={cardProgress}>
              <TerminalAbout progress={cardProgress} exitProgress={aboutExit} />
            </ContainerScroll>
          </div>
        </motion.div>

      </motion.div>

      {/* Spacer for hero + about scroll range */}
      <div style={{ height: "300vh" }} />

      {/* Scroll Scrub Philosophy Section */}
      <ScrollScrubSection />

      {/* Vertical Career Journey Section */}
      <VerticalTimeline />

      {/* Projects Section — horizontal scroll in normal flow */}
      <TimelineSection />

      {/* Resume Section — 3D interactive tilt sheet preview */}
      <ResumeSection />

      {/* Complete Footer Section — Outlined marquee + HUD status */}
      <FooterSection />
    </div>
  );
}
