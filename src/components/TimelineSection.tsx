"use client";

import { useRef } from "react";
import { useTransform, motion, useScroll, useSpring, MotionValue } from "framer-motion";

const entries = [
  {
    year: "2024",
    index: "01",
    era: "AI Orchestration",
    headline: "NEXUS\nCOGNITIVE",
    sub: "Autonomous multi-agent workflow engine",
    body: "Architected a high-throughput orchestration engine managing complex, nested AI agent communication. Built localized semantic memory vectors, customized JSON parser runtimes, and real-time execution graphs.",
    tags: ["Next.js", "LangChain", "NodeJS", "Vector DB"],
    accentSide: "left" as const,
  },
  {
    year: "2024",
    index: "02",
    era: "System Simulation",
    headline: "AETHER\nOS",
    sub: "Interactive WebAssembly operating system mockup",
    body: "Developed an in-browser desktop environment running virtual sub-applications in isolated containers. Built a custom shell syntax parser, multi-window layout system, and IndexedDB file system.",
    tags: ["TypeScript", "WASM", "Tailwind", "Canvas"],
    accentSide: "right" as const,
  },
  {
    year: "2025",
    index: "03",
    era: "Developer Tooling",
    headline: "SPECTRA\nPIPELINE",
    sub: "Asset optimization and compilation engine",
    body: "Built an automated asset processing pipeline designed for game developers. Compresses texture arrays, converts and optimizes 3D glTF models, and synthesizes dynamic texture maps automatically.",
    tags: ["Rust", "NodeJS", "Sharp", "glTF-compiler"],
    accentSide: "left" as const,
  },
  {
    year: "2025",
    index: "04",
    era: "Graphics Engineering",
    headline: "VORTEX\nCORE",
    sub: "GPU particle physics simulation framework",
    body: "Created a WebGPU accelerated physics runner managing 10 million particles at 60 FPS in real-time. Features editable custom shaders, gravitational gravity wells, and mouse attraction fields.",
    tags: ["WebGPU", "WGSL", "TypeScript", "Vite"],
    accentSide: "right" as const,
  },
  {
    year: "2026",
    index: "05",
    era: "Finance Visualization",
    headline: "QUANTUM\nGRID",
    sub: "Cryptographic high-frequency ledger viewer",
    body: "Designed a real-time transactional visualizer with low-latency updates. Visualizes transaction validation state changes with sub-millisecond updates and full WebSockets connection failover protocols.",
    tags: ["React", "Go", "WebSockets", "Redis"],
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
