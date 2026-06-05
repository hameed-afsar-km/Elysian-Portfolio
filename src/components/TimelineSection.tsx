"use client";

import { useTransform, motion, MotionValue, useSpring } from "framer-motion";

interface TimelineSectionProps {
  scrollYProgress: MotionValue<number>;
  start?: number;
  end?: number;
}

const DEFAULT_START = 0.42;
const DEFAULT_END   = 0.80;

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

export default function TimelineSection({
  scrollYProgress,
  start = DEFAULT_START,
  end = DEFAULT_END,
}: TimelineSectionProps) {
  // Map scroll → translateX: 0vw (first card) → -(n-1)*100vw (last card)
  const rawX = useTransform(
    scrollYProgress,
    [start, end],
    ["0vw", `-${(CARD_COUNT - 1) * 100}vw`]
  );
  // Smooth it out
  const translateX = useSpring(rawX as unknown as MotionValue<number>, {
    stiffness: 80,
    damping: 22,
    restDelta: 0.5,
  });

  // Current card index (0–4) for progress indicator
  const currentFloat = useTransform(scrollYProgress, [start, end], [0, CARD_COUNT - 1]);

  // Section-level fade in/out
  const sectionOpacity = useTransform(
    scrollYProgress,
    [start, start + 0.03, end - 0.02, end],
    [0, 1, 1, 0]
  );

  return (
    <motion.div className="tl2-section" style={{ opacity: sectionOpacity }}>
      {/* Horizontal strip */}
      <div className="tl2-viewport">
        <motion.div className="tl2-strip" style={{ x: translateX }}>
          {entries.map((entry, i) => (
            <Slide key={i} entry={entry} index={i} />
          ))}
        </motion.div>
      </div>

      {/* Bottom progress bar */}
      <ProgressBar current={currentFloat} total={CARD_COUNT} />
    </motion.div>
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
      {/* Giant watermark year */}
      <div className="tl2-watermark" aria-hidden="true">
        {entry.year}
      </div>

      {/* Diagonal red slash */}
      <div className="tl2-slash" />

      {/* LEFT COLUMN — meta info */}
      <div className="tl2-col-left">
        <div className="tl2-index-wrap">
          <span className="tl2-index">{entry.index}</span>
          <span className="tl2-total">/ 0{CARD_COUNT}</span>
        </div>
        <div className="tl2-vert-year">{entry.year}</div>
        <div className="tl2-vert-era">{entry.era}</div>
        <div className="tl2-vert-line" />
      </div>

      {/* RIGHT COLUMN — content */}
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
  // Width of filled bar as percentage
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
