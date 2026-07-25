"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useMotionValue, useTransform, useSpring, useMotionValueEvent, type MotionValue } from "framer-motion";
import { useLenis } from "lenis/react";
import type Lenis from "lenis";

// ── Scrub frames configuration ───────────────────────────
// Place your video frames as numbered images inside public/assets/scrub/
// Supported formats: .webp, .jpg, .png
// Naming convention: frame_0001.webp, frame_0002.webp, …
// Then update TOTAL_FRAMES below to match your sequence length.
const TOTAL_FRAMES = 0;          // ← set to > 0 once frames are added
const FRAME_PATH = "/assets/scrub/frame_";
const FRAME_EXT  = ".webp";
const PAD        = 4;

function frameSrc(idx: number): string {
  return `${FRAME_PATH}${String(idx + 1).padStart(PAD, "0")}${FRAME_EXT}`;
}

// ── Philosophy lines (fallback when no frames) ───────────
const lines = [
  { text: "I DON'T JUST", dir: -1 as const, accent: false },
  { text: "BUILD THINGS.", dir: 1 as const, accent: false },
  { text: "I BUILD THINGS", dir: -1 as const, accent: false },
  { text: "THAT MATTER.", dir: 1 as const, accent: true },
];

interface AnimLineProps {
  text: string;
  dir: 1 | -1;
  accent: boolean;
  progress: MotionValue<number>;
  triggerAt: number;
}

function AnimLine({ text, dir, accent, progress, triggerAt }: AnimLineProps) {
  const rawOffset = useTransform(progress, [Math.max(0, triggerAt - 0.08), triggerAt], [1, 0]);
  const rawOpacity = useTransform(progress, [Math.max(0, triggerAt - 0.08), triggerAt], [0, 1]);
  const springOffset = useSpring(rawOffset, { stiffness: 70, damping: 18, restDelta: 0.02 });
  const x = useTransform(springOffset, (val) => `${val * dir * 110}px`);

  return (
    <motion.div
      className={`ss-line${accent ? " ss-line--accent" : ""}`}
      style={{ x, opacity: rawOpacity }}
    >
      {text}
    </motion.div>
  );
}

export default function ScrollScrubSection() {
  const ref = useRef<HTMLDivElement>(null);
  const scrollYProgress = useMotionValue(0);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { isVisibleRef.current = entry.isIntersecting; },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useLenis(
    useCallback((lenis: Lenis) => {
      if (!isVisibleRef.current) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const elTop = rect.top + lenis.scroll;
      const elHeight = rect.height;
      const vh = window.innerHeight;
      const scrollRange = elHeight - vh;
      if (scrollRange <= 0) {
        scrollYProgress.set(0);
        return;
      }
      const p = (lenis.scroll - elTop) / scrollRange;
      scrollYProgress.set(Math.max(0, Math.min(1, p)));
    }, [])
  );

  const hasFrames = TOTAL_FRAMES > 0;

  // ── Frame scrubber ───────────────────────────────────
  const rawFrame = useTransform(scrollYProgress, [0, 1], [0, Math.max(TOTAL_FRAMES - 1, 0)]);
  const smoothFrame = useSpring(rawFrame, { stiffness: 100, damping: 28, restDelta: 0.01 });

  const [displaySrc, setDisplaySrc] = useState("");
  const [prevSrc, setPrevSrc] = useState("");
  const [showPrev, setShowPrev] = useState(false);
  const frameRef = useRef(0);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useMotionValueEvent(smoothFrame, "change", (val) => {
    if (!hasFrames) return;
    const idx = Math.min(Math.max(Math.round(val), 0), TOTAL_FRAMES - 1);
    if (idx === frameRef.current) return;
    frameRef.current = idx;
    const newSrc = frameSrc(idx);
    setPrevSrc(displaySrc);
    setDisplaySrc(newSrc);
    setShowPrev(true);
    clearTimeout(fadeTimer.current);
    fadeTimer.current = setTimeout(() => setShowPrev(false), 150);
  });

  // ── Parallax entrance ──────────────────────────────
  const rawEntranceY = useTransform(scrollYProgress, [0, 0.04], [100, 0]);
  const rawEntranceOpacity = useTransform(scrollYProgress, [0, 0.02], [0, 1]);
  const entranceY = useSpring(rawEntranceY, { stiffness: 250, damping: 25, restDelta: 0.01 });
  const entranceOpacity = useSpring(rawEntranceOpacity, { stiffness: 300, damping: 25, restDelta: 0.01 });

  // ── Philosophy line triggers ─────────────────────────
  const triggers = [0.18, 0.38, 0.58, 0.78];

  // ── Ambient orb ──────────────────────────────────────
  const orbY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  const height = hasFrames ? `${TOTAL_FRAMES * 1.5}vh` : "400vh";

  return (
    <div ref={ref} className="ss-outer" style={{ height }}>
      <div className="ss-sticky">
        <motion.div
          className="ss-entrance-wrap"
          style={{ y: entranceY, opacity: entranceOpacity }}
        >
          {/* Frame scrub background (when frames are loaded) */}
          {hasFrames && (
            <div className="ss-frame-wrap">
              <img
                src={prevSrc}
                alt=""
                className="ss-frame"
                style={{ opacity: showPrev ? 1 : 0 }}
              />
              <img
                src={displaySrc || frameSrc(0)}
                alt=""
                className="ss-frame"
              />
            </div>
          )}

          {/* Pulsing red orb background (fallback visual) */}
          <motion.div className="ss-orb" style={{ y: orbY }} />

          {/* Grid overlay */}
          <div className="ss-grid" />

          {/* Frame counter overlay */}
          {hasFrames && (
            <div className="ss-section-tag" style={{ bottom: "2rem", top: "auto" }}>
              {String(frameRef.current + 1).padStart(PAD, "0")} / {String(TOTAL_FRAMES).padStart(PAD, "0")}
            </div>
          )}

          {/* Philosophy lines (fallback when no frames) */}
          {!hasFrames && (
            <div className="ss-lines">
              {lines.map((line, i) => (
                <AnimLine
                  key={i}
                  text={line.text}
                  dir={line.dir}
                  accent={line.accent}
                  progress={scrollYProgress}
                  triggerAt={triggers[i]}
                />
              ))}
            </div>
          )}

        </motion.div>
      </div>
    </div>
  );
}
