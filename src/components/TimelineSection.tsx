"use client";

import { useRef } from "react";
import { useTransform, motion, useScroll, useSpring, MotionValue } from "framer-motion";

const entries = [
  {
    year: "2026",
    index: "01",
    era: "AI Platforms",
    headline: "AFSGPT\nPLATFORM",
    sub: "Multi-model AI assistant ecosystem",
    body: "Built a modern AI assistant platform supporting multiple LLM providers, speech capabilities, chat history, and intelligent workflows while focusing on production-ready UX and extensibility.",
    tags: ["Next.js", "LLMs", "TypeScript", "AI"],
    accentSide: "left" as const,
  },
  {
    year: "2026",
    index: "02",
    era: "Agentic AI",
    headline: "MULTI AGENT\nTRIP PLANNER",
    sub: "Collaborative AI travel planning system",
    body: "Developed a multi-agent architecture where specialized AI agents coordinate research, budgeting, itinerary planning, and recommendations to generate personalized travel experiences.",
    tags: ["LangGraph", "Agents", "LLMs", "RAG"],
    accentSide: "right" as const,
  },
  {
    year: "2026",
    index: "03",
    era: "Computer Vision",
    headline: "AI\nSURVEILLANCE",
    sub: "Incident detection using computer vision",
    body: "Created an intelligent surveillance system capable of detecting accidents, fire, fatalities, and abnormal incidents from video feeds using AI-powered computer vision pipelines.",
    tags: ["Python", "OpenCV", "YOLO", "AI"],
    accentSide: "left" as const,
  },
  {
    year: "2026",
    index: "04",
    era: "Full Stack Commerce",
    headline: "MIAKSAAA\nECOMMERCE",
    sub: "Modern scalable shopping platform",
    body: "Built a complete ecommerce platform with authentication, product management, wishlist, cart, checkout flows, animations, and responsive user experience.",
    tags: ["Next.js", "Supabase", "React", "Tailwind"],
    accentSide: "right" as const,
  },
  {
    year: "2026",
    index: "05",
    era: "Interactive Web",
    headline: "GITSUBWAY\n3D WORLD",
    sub: "GitHub visualized as a railway universe",
    body: "Designed an immersive 3D web experience where repositories become railway stations, enabling developers to explore projects, analytics, and compete with others through gamified interactions.",
    tags: ["Three.js", "React", "GitHub API", "3D"],
    accentSide: "left" as const,
  },
];

const CARD_COUNT = entries.length;

export default function TimelineSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // useScroll tracks progress through this element (start..end = 0..1)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Map 0→1 to card index 0→(n-1), spring it, then derive CSS x string
  const rawProgress = useTransform(scrollYProgress, [0, 1], [0, CARD_COUNT - 1]);
  const springProgress = useSpring(rawProgress, { stiffness: 80, damping: 22, restDelta: 0.001 });
  const translateX = useTransform(springProgress, (p) => `${-p * 100}vw`);

  // Progress bar fill
  const fillWidth = useTransform(springProgress, [0, CARD_COUNT - 1], ["0%", "100%"]);

  return (
    // Outer: tall enough to give 100vh of scroll per card
    <div
      ref={containerRef}
      id="projects"
      style={{ height: `${CARD_COUNT * 100}vh` }}
      className="relative"
    >
      {/* Sticky inner — stays at top while the outer scrolls */}
      <div className="tl2-sticky">
        <div className="tl2-section">
          {/* Header */}
          <div className="tl2-header">
            <span className="tl2-header-tag">// PROJECTS</span>
            <h2 className="tl2-header-title">THE WORK</h2>
            <div className="tl2-header-line" />
          </div>

          {/* Horizontal track viewport */}
          <div className="tl2-viewport">
            <motion.div className="tl2-strip" style={{ x: translateX }}>
              {entries.map((entry, i) => (
                <Slide key={i} entry={entry} index={i} />
              ))}
            </motion.div>
          </div>

          {/* Progress bar */}
          <div className="tl2-progress">
            <div className="tl2-progress-track">
              <motion.div className="tl2-progress-fill" style={{ width: fillWidth }} />
            </div>
            <div className="tl2-progress-labels">
              {entries.map((e) => (
                <span key={e.index} className="tl2-progress-label">{e.year}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Slide({ entry, index }: { entry: (typeof entries)[0]; index: number }) {
  const isRight = entry.accentSide === "right";

  return (
    <div className={`tl2-slide ${isRight ? "tl2-slide--right" : ""}`}>
      <div className="tl2-watermark" aria-hidden="true">{entry.year}</div>
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
        <h3 className="tl2-headline">
          {entry.headline.split("\n").map((line, i) => (
            <span key={i} className="tl2-headline-line">{line}</span>
          ))}
        </h3>
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
