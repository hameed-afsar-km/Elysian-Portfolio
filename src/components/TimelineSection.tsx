"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useTransform, motion, useScroll, useMotionValue } from "framer-motion";

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
    github: "https://github.com/hameed-afsar-km/afsGPT",
    website: "https://afs-gpt.vercel.app",
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
    github: "https://github.com/hameed-afsar-km/TRIPZ-AI",
    website: "https://tripz-ai.vercel.app",
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
    github: "https://github.com/hameed-afsar-km/AI-Surveillance-System",
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
    github: "https://github.com/hameed-afsar-km/miaksaaa",
    website: "https://miaksaaa.vercel.app",
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
    github: "https://github.com/hameed-afsar-km/GitSubway",
    website: "https://git-subway.vercel.app",
  },
];

const CARD_COUNT = entries.length + 1;

export default function TimelineSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // useScroll tracks progress through this element (start..end = 0..1)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Map 0→1 to card index 0→(n-1)
  const rawProgress = useTransform(scrollYProgress, [0, 1], [0, CARD_COUNT - 1]);
  const displayProgress = useMotionValue(0);
  const translateX = useTransform(displayProgress, (p) => `${-p * 100}vw`);
  const fillWidth = useTransform(displayProgress, [0, CARD_COUNT - 1], ["0%", "100%"]);

  useEffect(() => {
    const unsub = rawProgress.on("change", (v) => {
      displayProgress.set(v);
    });
    return () => { unsub(); };
  }, []);

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
              <MoreSlide index={entries.length} />
            </motion.div>
          </div>

          {/* Progress bar */}
          <div className="tl2-progress">
            <div className="tl2-progress-track">
              <motion.div className="tl2-progress-fill" style={{ width: fillWidth }} />
            </div>
            <div className="tl2-progress-labels">
              {[...entries, { index: "06", year: "MORE" }].map((e) => (
                <span key={e.index} className="tl2-progress-label">{e.year}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MoreSlide({ index }: { index: number }) {
  const isRight = index % 2 === 1;
  return (
    <Link href="/projects" className={`tl2-slide tl2-slide--more ${isRight ? "tl2-slide--right" : ""}`}>
      <div className="tl2-watermark" aria-hidden="true">ALL</div>
      <div className="tl2-slash" />

      <div className="tl2-col-left">
        <div className="tl2-index-wrap">
          <span className="tl2-index">0{index + 1}</span>
          <span className="tl2-total">/ 0{entries.length}</span>
        </div>
        <div className="tl2-vert-year">MORE</div>
        <div className="tl2-vert-era">PROJECTS</div>
        <div className="tl2-vert-line" />
      </div>

      <div className="tl2-col-right">
        <span className="tl2-sub">FULL ARCHIVE</span>
        <h3 className="tl2-headline">
          <span className="tl2-headline-line">VIEW ALL</span>
          <span className="tl2-headline-line">PROJECTS</span>
        </h3>
        <div className="tl2-rule" />
        <p className="tl2-body">
          Explore the complete collection of projects, experiments, and
          collaborations spanning AI, full-stack, 3D, and more.
        </p>
        <div className="tl2-more-arrow-wrap">
          <ArrowUpRight size={32} className="tl2-more-arrow" />
        </div>
      </div>
    </Link>
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
        <div className="tl2-links">
          {entry.github && (
            <a href={entry.github} target="_blank" rel="noopener noreferrer" className="tl2-link" aria-label="GitHub">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
          )}
          {entry.website && (
            <a href={entry.website} target="_blank" rel="noopener noreferrer" className="tl2-link" aria-label="Website">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
