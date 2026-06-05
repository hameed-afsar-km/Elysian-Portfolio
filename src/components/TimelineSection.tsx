"use client";

import { useCallback, useRef } from "react";
import { useTransform, motion, MotionValue, useSpring, useMotionValue } from "framer-motion";
import { useLenis } from "lenis/react";
import type Lenis from "lenis";

const entries = [
  {
    year: "2022",
    index: "01",
    era: "Origins",
    headline: "FIRST\nLINE",
    sub: "Where it began",
    body: "Discovered programming through pure curiosity. Built clunky scripts, broke things repeatedly, and fell completely in love with the craft of making machines think.",
    tags: ["Python", "HTML", "CSS"],
    accentSide: "left" as const,
  },
  {
    year: "2023",
    index: "02",
    era: "Foundation",
    headline: "REAL\nTHINGS",
    sub: "Shipping for humans",
    body: "Levelled up into full-stack territory. Started shipping products that real people actually used. Learned that design and engineering are completely inseparable.",
    tags: ["React", "TypeScript", "Node.js"],
    accentSide: "right" as const,
  },
  {
    year: "2024",
    index: "03",
    era: "Acceleration",
    headline: "SYSTEMS\n& SCALE",
    sub: "Thinking in architecture",
    body: "Dived deep into Next.js, cloud architecture, and automation pipelines. Started thinking in systems rather than just features. Speed became a design principle.",
    tags: ["Next.js", "Cloud", "CI/CD"],
    accentSide: "left" as const,
  },
  {
    year: "2025",
    index: "04",
    era: "Intelligence",
    headline: "AI &\nAUTO",
    sub: "The frontier era",
    body: "Merged software engineering with machine learning. Built tools that think, automate, and augment human capability — exploring the absolute edge of what's buildable.",
    tags: ["AI/ML", "LLMs", "Automation"],
    accentSide: "right" as const,
  },
  {
    year: "2026",
    index: "05",
    era: "Now",
    headline: "FULL\nVISION",
    sub: "Product × Engineering",
    body: "Designing at the intersection of product, engineering, and intelligence. Leading technical decisions. Building experiences that actually leave a mark on people.",
    tags: ["Leadership", "System Design", "Startups"],
    accentSide: "left" as const,
  },
];

const CARD_COUNT = entries.length;

export default function TimelineSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const localProgress = useMotionValue(0);

  useLenis(
    useCallback(() => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const sectionHeight = el.offsetHeight;
      const scrollRange = sectionHeight - vh;
      const scrolled = -rect.top;
      const p = scrollRange > 0 ? Math.max(0, Math.min(1, scrolled / scrollRange)) : 0;
      localProgress.set(p);
    }, [])
  );

  const rawX = useTransform(
    localProgress,
    [0, 1],
    ["0vw", `-${(CARD_COUNT - 1) * 100}vw`]
  );

  const translateX = useSpring(rawX as unknown as MotionValue<number>, {
    stiffness: 80,
    damping: 22,
    restDelta: 0.5,
  });

  const currentFloat = useTransform(localProgress, [0, 1], [0, CARD_COUNT - 1]);

  return (
    <div ref={sectionRef} className="relative" style={{ height: `${CARD_COUNT * 100}vh` }}>
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col" style={{ backgroundColor: "#05050d" }}>
        <div className="tl2-viewport">
          <motion.div className="tl2-strip" style={{ x: translateX }}>
            {entries.map((entry, i) => (
              <Slide key={i} entry={entry} index={i} />
            ))}
          </motion.div>
        </div>

        <ProgressBar current={currentFloat} total={CARD_COUNT} />
      </div>
    </div>
  );
}

/* ─── Individual Slide ─────────────────────────────────── */
function Slide({
  entry,
  index,
}: {
  entry: (typeof entries)[0];
  index: number;
}) {
  const isRight = entry.accentSide === "right";

  return (
    <div className={`tl2-slide ${isRight ? "tl2-slide--right" : ""}`}>
      <div className="tl2-watermark" aria-hidden="true">
        {entry.year}
      </div>

      <div className="tl2-slash" />

      <div className="tl2-col-left">
        <div className="tl2-index-wrap">
          <span className="tl2-index">{entry.index}</span>
          <span className="tl2-total">/ 0{CARD_COUNT}</span>
        </div>
        <div className="tl2-vert-year">{entry.year}</div>
        <div className="tl2-vert-era">{entry.era}</div>
        <div className="tl2-vert-line" />
      </div>

      <div className="tl2-col-right">
        <span className="tl2-sub">{entry.sub}</span>

        <h2 className="tl2-headline">
          {entry.headline.split("\n").map((line, i) => (
            <span key={i} className="tl2-headline-line">{line}</span>
          ))}
        </h2>

        <div className="tl2-rule" />

        <p className="tl2-body">{entry.body}</p>

        <div className="tl2-tags">
          {entry.tags.map((tag) => (
            <span key={tag} className="tl2-tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Progress Bar ──────────────────────────────────────── */
function ProgressBar({
  current,
  total,
}: {
  current: MotionValue<number>;
  total: number;
}) {
  const fillWidth = useTransform(current, [0, total - 1], ["0%", "100%"]);

  return (
    <div className="tl2-progress">
      <div className="tl2-progress-track">
        <motion.div className="tl2-progress-fill" style={{ width: fillWidth }} />
      </div>
      <div className="tl2-progress-labels">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className="tl2-progress-label">
            {entries[i].year}
          </span>
        ))}
      </div>
    </div>
  );
}
