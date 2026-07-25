"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTransform, motion, useMotionValue, useSpring, useScroll } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
import TechStackMarquee from "@/components/TechStackMarquee";
import ResumeSection from "@/components/ResumeSection";
import AiTwinSection from "@/components/AiTwinSection";
import FooterSection from "@/components/FooterSection";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const lenisRef = useLenis();

  // ── Refs for GSAP-animated elements ─────────────────────
  const fixedRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const marqueeARef = useRef<HTMLDivElement>(null);
  const marqueeBRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  // Scroll progress driven by Lenis (kept for about section Framer Motion)
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

  // ── Client-only initialisation ──────────────────────────────

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("splashShown") === "true";
    if (alreadyShown) {
      setLoading(false);
    } else {
      const timer = setTimeout(() => {
        setLoading(false);
        sessionStorage.setItem("splashShown", "true");
      }, 3300);
      return () => clearTimeout(timer);
    }
  }, []);

  // Hash navigation from /projects → /#projects: hide hero instantly
  useEffect(() => {
    if (window.location.hash === "#projects") {
      // Scroll past the hero spacer to hide everything
      if (lenisRef) {
        const el = document.getElementById("projects");
        if (el) lenisRef.scrollTo(el, { immediate: true });
      }
    }
  }, [lenisRef]);

  // Sync Lenis scroll → GSAP ScrollTrigger + Framer Motion scrollYProgress (about section)
  useLenis(
    useCallback((lenis: Lenis) => {
      // Update Framer Motion progress for about section
      const el = containerRef.current;
      if (el) {
        const elTop = el.offsetTop;
        const vh = window.innerHeight;
        const range = vh * 3;
        const p = range > 0 ? (lenis.scroll - elTop) / range : 0;
        scrollYProgress.set(Math.max(0, Math.min(1, p)));
      }
    }, [])
  );

  // Sync Lenis with GSAP ScrollTrigger
  useEffect(() => {
    if (!lenisRef) return;
    lenisRef.on("scroll", ScrollTrigger.update);
    return () => {
      lenisRef.off("scroll", ScrollTrigger.update);
    };
  }, [lenisRef]);

  // ── GSAP ScrollTrigger for hero, marquees, bg ─────────────
  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      const trigger = containerRef.current;
      if (!trigger) return;

      const scrollEnd = () => window.innerHeight * 3;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger,
          start: "top top",
          end: scrollEnd,
          scrub: 0.3,
          onUpdate: (self) => {
            if (fixedRef.current) {
              fixedRef.current.style.display = self.progress >= 1.0 ? "none" : "";
            }
          },
        },
      });

      // Marquee A: scale 1→2, y 0→-800, opacity 1→0 over 0→7%
      tl.fromTo(
        marqueeARef.current,
        { scale: 1, y: 0, opacity: 1 },
        { scale: 2, y: -800, opacity: 0, ease: "none", duration: 0.07 },
        0
      );

      // Marquee B: scale 1→2, y 0→800, opacity 1→0 over 0→7%
      tl.fromTo(
        marqueeBRef.current,
        { scale: 1, y: 0, opacity: 1 },
        { scale: 2, y: 800, opacity: 0, ease: "none", duration: 0.07 },
        0
      );

      // Background opacity: 1→0.15 over 0→20%
      tl.fromTo(
        bgRef.current,
        { opacity: 1 },
        { opacity: 0.15, ease: "none", duration: 0.20 },
        0
      );
    });

    return () => ctx.revert();
  }, [loading]);

  // ── Hero text — direct scroll listener (same speed as Navbar, opposite direction) ──
  useEffect(() => {
    if (loading) return;
    const el = heroRef.current;
    if (!el) return;
    const scrollContainer = document.querySelector("[data-scroll-container]");
    if (!scrollContainer) return;

    const update = () => {
      const rect = scrollContainer.getBoundingClientRect();
      const scrollRange = window.innerHeight * 3;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / scrollRange));
      const progress = Math.min(1, p / 0.05);

      gsap.set(el, {
        scale: 1 + progress * 1.5,
        y: progress * 350,
        opacity: 1 - progress,
      });
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => { update(); ticking = false; });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, [loading]);

  // ── About Me (Framer Motion — kept as-is) ────────────────
  const aboutDisplay = useTransform(scrollYProgress, (p) =>
    (p < 0.15 || p >= 1.0) ? "none" : "flex"
  );
  const aboutCardDisplay = useTransform(scrollYProgress, (p) =>
    (p < 0.15 || p >= 1.0) ? "none" : "flex"
  );
  const rawAboutCardY = useTransform(
    scrollYProgress,
    [0.15, 0.30, 0.65, 1.0],
    [1200, 0, 0, -1000]
  );
  const rawAboutCardScale = useTransform(scrollYProgress, [0.65, 1.0], [1, 0.88]);
  const aboutCardY = useSpring(rawAboutCardY, { stiffness: 300, damping: 40, restDelta: 0.5 });
  const aboutCardScale = useSpring(rawAboutCardScale, { stiffness: 200, damping: 30, restDelta: 0.1 });

  const rawCardProgress = useTransform(scrollYProgress, [0.30, 0.60], [0, 1]);
  const cardProgress = useSpring(rawCardProgress, {
    stiffness: 150,
    damping: 30,
    restDelta: 0.01,
  });

  const rawAboutExit = useTransform(scrollYProgress, [0.65, 0.95], [0, 1]);
  const aboutExit = useSpring(rawAboutExit, {
    stiffness: 300,
    damping: 40,
    restDelta: 0.01,
  });

  // ── Tech Stack parallax transition ──────────────────────
  const techParallaxRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: techProgress } = useScroll({
    target: techParallaxRef,
    offset: ["start start", "end start"],
  });
  const techStackTranslateY = useTransform(techProgress, [0, 1], [0, "-15vh"]);

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
        <p className="loader-hint md:hidden">use desktop view<br />for a better experience</p>
      </div>

      {/* Particle Background — GSAP controlled opacity */}
      <div ref={bgRef} className="pointer-events-none">
        <ParticleBackground />
      </div>

      {/* Fixed Viewport Container */}
      <div
        ref={fixedRef}
        className="fixed top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center pointer-events-none z-[10]"
        style={{ contain: "layout style" }}
      >
        {/* Marquee B — GSAP animated */}
        <div
          ref={marqueeBRef}
          style={{ willChange: "transform, opacity" }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-[5]"
        >
          <CurvedMarquee ribbon="b" />
        </div>

        {/* Marquee A — GSAP animated */}
        <div
          ref={marqueeARef}
          style={{ willChange: "transform, opacity" }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-[6]"
        >
          <CurvedMarquee ribbon="a" />
        </div>

        {/* Hero Section Wrapper — GSAP animated */}
        <div
          ref={heroRef}
          style={{ willChange: "transform, opacity" }}
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
        </div>

        {/* About Me Background — Framer Motion */}
        <motion.div
          id="about"
          style={{ display: aboutDisplay }}
          className="absolute inset-0 w-full h-full"
        >
          <ParticleBackgroundMono />
        </motion.div>

        {/* About Me Card — Framer Motion */}
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
      </div>

      {/* Spacer for hero + about scroll range */}
      <div style={{ height: "300vh" }} />

      {/* Scroll Scrub Philosophy Section */}
      <ScrollScrubSection />

      {/* Vertical Career Journey Section */}
      <VerticalTimeline />

      {/* Tech Stack Infinite Marquee - sticky parallax */}
      <div ref={techParallaxRef} className="relative z-[12]" style={{ height: "130vh" }}>
        <div className="sticky top-0 h-screen overflow-hidden">
          <motion.div className="h-full" style={{ y: techStackTranslateY }}>
            <TechStackMarquee />
          </motion.div>
        </div>
      </div>

      {/* Projects Section */}
      <TimelineSection />

      {/* Resume Section */}
      <ResumeSection />

      {/* AI Twin Section */}
      <AiTwinSection />

      {/* Footer Section */}
      <FooterSection />
    </div>
  );
}
