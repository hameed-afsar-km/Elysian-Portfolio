"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import Image from "next/image";
import ParticleBackground from "@/components/ParticleBackground";
import CurvedMarquee from "@/components/CurvedMarquee";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Lock body scroll while loader is active to prevent early scrolling
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.overflowX = "hidden";
    }
  }, [loading]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3300);
    return () => clearTimeout(timer);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Hero Section transitions:
  // As scroll progress goes from 0 to 0.45, scale the Hero content from 1 to 10 and fade out.
  const heroScale = useTransform(scrollYProgress, [0, 0.45], [1, 10]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.35, 0.45], [1, 1, 0]);
  const heroDisplay = useTransform(scrollYProgress, (progress) =>
    progress >= 0.48 ? "none" : "flex"
  );

  // Background particles: dim/fade opacity slightly as we enter the content zone
  const bgOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0.15]);

  // About Me Section transitions:
  // As scroll progress goes from 0.35 to 0.5, fade in and scale up the About Me content.
  const aboutOpacity = useTransform(scrollYProgress, [0.35, 0.5], [0, 1]);
  const aboutScale = useTransform(scrollYProgress, [0.35, 0.5], [0.75, 1]);
  const aboutDisplay = useTransform(scrollYProgress, (progress) =>
    progress < 0.3 ? "none" : "flex"
  );

  // Map the master scroll [0.5, 0.95] to [0, 1] for the Card Scroll Animation inside ContainerScroll
  const cardProgress = useTransform(scrollYProgress, [0.5, 0.95], [0, 1]);

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

      {/* Sticky Viewport Container */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center pointer-events-none">
        
        {/* Hero Section Wrapper */}
        <motion.div
          style={{
            scale: heroScale,
            opacity: heroOpacity,
            display: heroDisplay,
            pointerEvents: "auto",
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <main className="hero-container">
            <CurvedMarquee />
            <h1 className="val-heading">
              <span className="word-wrap"><span>THINK</span></span>
              <span className="word-wrap"><span>MAKE</span></span>
              <span className="word-wrap"><span>REPEAT</span></span>
            </h1>
          </main>
        </motion.div>

        {/* About Me Section Wrapper */}
        <motion.div
          style={{
            opacity: aboutOpacity,
            scale: aboutScale,
            display: aboutDisplay,
            pointerEvents: "auto",
          }}
          className="absolute inset-0 w-full h-full flex items-center justify-center"
        >
          <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
            <ContainerScroll
              progress={cardProgress}
              titleComponent={
                <div className="mb-4">
                  <span className="hud-tag">SYSTEM DOS // INITIALIZED</span>
                  <h2 className="text-3xl md:text-5xl font-bold mt-2 font-mono text-white tracking-widest">
                    CORE SYSTEM FILE
                  </h2>
                </div>
              }
            >
              <div className="about-grid">
                {/* Left Column: Avatar with HUD effect */}
                <div className="about-image-wrap">
                  <div className="hud-corner tl"></div>
                  <div className="hud-corner tr"></div>
                  <div className="hud-corner bl"></div>
                  <div className="hud-corner br"></div>
                  <Image
                    src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000"
                    alt="Afsar Dev Profile"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover opacity-80"
                    priority
                  />
                </div>

                {/* Right Column: Bio details */}
                <div className="about-content">
                  <span className="hud-tag">USER PROFILE // AFSAR</span>
                  <h3 className="about-title">CREATIVE DEVELOPER</h3>
                  <p className="about-desc">
                    I build next-generation <strong>AI agents, autonomous systems,</strong> and high-performance digital architectures. Bridging the gap between intelligent reasoning engines and beautiful user interfaces is my core specialty.
                  </p>
                  
                  <div className="hud-metrics">
                    <div className="hud-metric-card">
                      <div className="hud-metric-label">Location</div>
                      <div className="hud-metric-value">Earth / Remote</div>
                    </div>
                    <div className="hud-metric-card">
                      <div className="hud-metric-label">Status</div>
                      <div className="hud-metric-value">Online / Active</div>
                    </div>
                  </div>

                  <div className="mt-2">
                    <span className="hud-tag">TECH STACK DIRECTORY</span>
                    <div className="hud-skills">
                      <span className="hud-skill-badge">Next.js</span>
                      <span className="hud-skill-badge">React 19</span>
                      <span className="hud-skill-badge">Tailwind v4</span>
                      <span className="hud-skill-badge">TypeScript</span>
                      <span className="hud-skill-badge">Framer Motion</span>
                      <span className="hud-skill-badge">AI Integration</span>
                    </div>
                  </div>
                </div>
              </div>
            </ContainerScroll>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
