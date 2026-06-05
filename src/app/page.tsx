"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTransform, motion, useMotionValue, useSpring, MotionValue } from "framer-motion";
import type Lenis from "lenis";
import { useLenis } from "lenis/react";
import ParticleBackground from "@/components/ParticleBackground";
import ParticleBackgroundMono from "@/components/ParticleBackgroundMono";
import CurvedMarquee from "@/components/CurvedMarquee";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { TerminalAbout } from "@/components/TerminalAbout";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const lenisRef = useLenis();

  // Scroll progress driven by Lenis (container-relative 0-1)
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

  // Sync Lenis scroll to container-relative progress MotionValue
  useLenis(
    useCallback((lenis: Lenis) => {
      const el = containerRef.current;
      if (!el) return;
      const elTop = el.offsetTop;
      const elHeight = el.offsetHeight;
      const vh = window.innerHeight;
      const range = elHeight - vh;
      const p = range > 0 ? (lenis.scroll - elTop) / range : 0;
      scrollYProgress.set(Math.max(0, Math.min(1, p)));
    }, [])
  );

  // Hero Section transitions:
  // As scroll progress goes from 0 to 0.45, scale the Hero content from 1 to 10 and fade out.
  const heroScale = useTransform(scrollYProgress, [0, 0.45], [1, 10]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.35, 0.45], [1, 1, 0]);

  // Marquees: scale up and move apart as the hero zooms in
  const marqueeScale = useTransform(scrollYProgress, [0, 0.35], [1, 3]);
  const marqueeAY = useTransform(scrollYProgress, [0, 0.35], [0, -600]);
  const marqueeBY = useTransform(scrollYProgress, [0, 0.35], [0, 600]);
  const marqueeOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  // Background particles: dim/fade opacity slightly as we enter the content zone
  const bgOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0.15]);

  // About Me Section: appears once scroll passes 25%, stays visible
  const aboutDisplay = useTransform(scrollYProgress, (progress) =>
    progress < 0.25 ? "none" : "flex"
  );
  // Card slides up from below the viewport — spring-smoothed for fluid feel
  const rawAboutCardY = useTransform(scrollYProgress, [0.25, 0.45], [1200, 0]);
  const aboutCardY = useSpring(rawAboutCardY, {
    stiffness: 200,
    damping: 35,
    restDelta: 1,
  });

  // Map the master scroll [0.25, 0.98] to [0, 1] for the Card Scroll Animation inside ContainerScroll
  const rawCardProgress = useTransform(scrollYProgress, [0.25, 0.98], [0, 1]);
  const cardProgress = useSpring(rawCardProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div ref={containerRef} className="relative w-full h-[320vh] bg-transparent">
      {/* Loader screen */}
      <div className="loader-screen">
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
      <div className="fixed top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center pointer-events-none">
        
        {/* Curved Marquees - scale up and move apart as hero zooms in */}
        <motion.div
          style={{
            scale: marqueeScale,
            y: marqueeBY,
            opacity: marqueeOpacity,
          }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-[5]"
        >
          <CurvedMarquee ribbon="b" />
        </motion.div>
        <motion.div
          style={{
            scale: marqueeScale,
            y: marqueeAY,
            opacity: marqueeOpacity,
          }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-[6]"
        >
          <CurvedMarquee ribbon="a" />
        </motion.div>

        {/* Hero Section Wrapper */}
        <motion.div
          style={{
            scale: heroScale,
            opacity: heroOpacity,
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <main className="hero-container">
            <h1 className="val-heading">
              <span className="word-wrap"><span>THINK</span></span>
              <span className="word-wrap"><span>MAKE</span></span>
              <span className="word-wrap"><span>REPEAT</span></span>
            </h1>
          </main>
        </motion.div>

        {/* About Me Background — dark canvas, always 100% opacity when visible */}
        <motion.div
          style={{ display: aboutDisplay }}
          className="absolute inset-0 w-full h-full"
        >
          <ParticleBackgroundMono />
        </motion.div>

        {/* About Me Card — slides up from below viewport */}
        <motion.div
          style={{
            display: aboutDisplay,
            y: aboutCardY,
            pointerEvents: "auto",
          }}
          className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden"
        >
          <div className="relative z-10 w-full max-w-5xl mx-auto px-4 md:px-8">
            <ContainerScroll progress={cardProgress}>
              <TerminalAbout progress={cardProgress} />
            </ContainerScroll>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
