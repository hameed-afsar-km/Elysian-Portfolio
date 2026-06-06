"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";

const SKILLS = ["Next.js", "TypeScript", "AI/ML", "React", "Node.js", "WebGPU", "Rust", "Python"];

const TERMINAL_LINES = [
  { tag: "AI/ML",    tagColor: "#FF8BD2", text: "Architected AI pipelines processing 500K+ daily requests" },
  { tag: "PRODUCT",  tagColor: "#6EC8FF", text: "Built a design system adopted across 12 products" },
  { tag: "LEAD",     tagColor: "#68D391", text: "Led a full-stack team — shipped in under 8 weeks" },
  { tag: "PERF",     tagColor: "#FFC766", text: "Optimized Core Web Vitals to the 98th percentile" },
  { tag: "INFRA",    tagColor: "#B39DFF", text: "Real-time analytics engine for 10K+ concurrent users" },
  { tag: "DEPLOY",   tagColor: "#FF8BD2", text: "80% faster deployment cycles via automated pipelines" },
  { tag: "AGENTS",   tagColor: "#6EC8FF", text: "Multi-agent LLM orchestration for enterprise workflows" },
];

export default function ResumeSection() {
  const [downloadState, setDownloadState] = useState<"idle" | "downloading" | "completed">("idle");
  const [progress, setProgress] = useState(0);
  const [activeSkill, setActiveSkill] = useState(0);
  const [showViewer, setShowViewer] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Cycle through skill pills for animation
  useEffect(() => {
    const t = setInterval(() => setActiveSkill(p => (p + 1) % SKILLS.length), 1800);
    return () => clearInterval(t);
  }, []);

  // 3D tilt tracking
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), { stiffness: 120, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 120, damping: 20 });
  const glareX = useTransform(mx, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(my, [-0.5, 0.5], ["0%", "100%"]);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    mx.set((e.clientX - r.left - r.width / 2) / r.width);
    my.set((e.clientY - r.top - r.height / 2) / r.height);
  };

  const onMouseLeave = () => { mx.set(0); my.set(0); };

  const handleDownload = () => {
    if (downloadState !== "idle") return;
    setDownloadState("downloading");
    setProgress(0);
    let cur = 0;
    const iv = setInterval(() => {
      cur += Math.floor(Math.random() * 10) + 5;
      if (cur >= 100) {
        cur = 100;
        clearInterval(iv);
        setTimeout(() => {
          const a = document.createElement("a");
          a.href = "/Hameed_Afsar_Resume.pdf";
          a.download = "Hameed_Afsar_Resume.pdf";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setDownloadState("completed");
        }, 400);
      }
      setProgress(cur);
    }, 70);
  };

  return (
    <section className="rs-section" id="resume">
      {/* Ambient background elements */}
      <div className="rs-bg-grid" />
      <div className="rs-bg-orb rs-bg-orb--1" />
      <div className="rs-bg-orb rs-bg-orb--2" />

      <div className="rs-inner">
        {/* Left column — editorial header */}
        <div className="rs-left">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="rs-eyebrow">CREDENTIALS</span>
            <h2 className="rs-heading">
              <span className="rs-heading-line">THE</span>
              <span className="rs-heading-line rs-heading-line--outline">RÉSUMÉ</span>
            </h2>
            <p className="rs-blurb">
              Full-stack engineering schematics, product design philosophy, AI systems architecture, and professional trajectory. All in one document.
            </p>
          </motion.div>

          {/* Animated skill pills */}
          <motion.div
            className="rs-skills"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {SKILLS.map((s, i) => (
              <motion.span
                key={s}
                className="rs-skill-pill"
                animate={{
                  background: activeSkill === i
                    ? "rgba(255,70,85,0.15)"
                    : "rgba(255,255,255,0.03)",
                  borderColor: activeSkill === i
                    ? "rgba(255,70,85,0.5)"
                    : "rgba(255,255,255,0.06)",
                  color: activeSkill === i ? "#ff4655" : "rgba(236,232,225,0.4)",
                }}
                transition={{ duration: 0.4 }}
              >
                {s}
              </motion.span>
            ))}
          </motion.div>

          {/* Stats row */}
          <motion.div
            className="rs-stats"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {[["4+", "YRS EXP"], ["20+", "PROJECTS"], ["2026", "EDITION"]].map(([num, label]) => (
              <div key={label} className="rs-stat">
                <span className="rs-stat-num">{num}</span>
                <span className="rs-stat-label">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right column — 3D tilt card */}
        <motion.div
          className="rs-card-scene"
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
        >
          <motion.div
            ref={cardRef}
            className="rs-card"
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          >
            {/* Dynamic glare highlight */}
            <motion.div
              className="rs-glare"
              style={{
                background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.08) 0%, transparent 60%)`,
              }}
            />

            {/* Card header */}
            <div className="rs-card-top" style={{ transform: "translateZ(25px)" }}>
              <div className="rs-card-avatar">
                <span className="rs-card-initials">HA</span>
                <div className="rs-avatar-ring" />
              </div>
              <div className="rs-card-meta">
                <div className="rs-card-name">HAMEED AFSAR KM</div>
                <div className="rs-card-role">FULL STACK ENGINEER × PRODUCT DESIGNER</div>
              </div>
              <div className="rs-card-badge">
                <span className="rs-badge-dot" />
                <span className="rs-badge-text">AVAILABLE</span>
              </div>
            </div>

            {/* Terminal-style typewriter output */}
            <div className="rs-card-preview" style={{ transform: "translateZ(15px)" }}>
              <div className="rs-tw-prompt-line">
                <span className="rs-tw-prompt">visitor@resume:~$</span>
                <span className="rs-tw-command">cat achievements.log</span>
              </div>
              <TypewriterLines />
            </div>

            {/* Download control area */}
            <div className="rs-card-action" style={{ transform: "translateZ(30px)" }}>
              <AnimatePresence mode="wait">
                {downloadState === "idle" && (
                  <div className="rs-btn-group">
                    <button
                      type="button"
                      className="rs-view-btn"
                      onClick={() => setShowViewer(true)}
                    >
                      <span className="rs-view-fill" />
                      <span className="rs-dl-content">
                        <span className="rs-dl-text">VIEW RESUME</span>
                      </span>
                    </button>
                    <button
                      type="button"
                      className="rs-dl-btn"
                      onClick={handleDownload}
                    >
                      <span className="rs-dl-fill" />
                      <span className="rs-dl-content">
                        <span className="rs-dl-arrow">↓</span>
                        <span className="rs-dl-text">DOWNLOAD</span>
                      </span>
                    </button>
                  </div>
                )}

                {downloadState === "downloading" && (
                  <motion.div
                    key="loading"
                    className="rs-dl-loading"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    <div className="rs-dl-bar-wrap">
                      <motion.div className="rs-dl-bar" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="rs-dl-bar-meta">
                      <span>COMPILING</span>
                      <span>{progress}%</span>
                    </div>
                  </motion.div>
                )}

                {downloadState === "completed" && (
                  <motion.div
                    key="done"
                    className="rs-btn-group"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    <button
                      type="button"
                      className="rs-view-btn"
                      onClick={() => setShowViewer(true)}
                    >
                      <span className="rs-view-fill" />
                      <span className="rs-dl-content">
                        <span className="rs-dl-text">VIEW RESUME</span>
                      </span>
                    </button>
                    <button
                      type="button"
                      className="rs-dl-btn"
                      onClick={() => setDownloadState("idle")}
                    >
                      <span className="rs-dl-fill" />
                      <span className="rs-dl-content">
                        <span className="rs-dl-arrow">↓</span>
                        <span className="rs-dl-text">DOWNLOAD</span>
                      </span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Corner accents */}
            <span className="rs-corner rs-corner--tl" />
            <span className="rs-corner rs-corner--tr" />
            <span className="rs-corner rs-corner--bl" />
            <span className="rs-corner rs-corner--br" />
          </motion.div>
        </motion.div>
      </div>

      {/* ── PDF Viewer Modal ── */}
      <AnimatePresence>
        {showViewer && (
          <motion.div
            className="rs-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowViewer(false)}
          >
            <motion.div
              className="rs-modal"
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="rs-modal-corner rs-modal-corner--bl" />
              <span className="rs-modal-corner rs-modal-corner--br" />
              <button className="rs-modal-close" onClick={() => setShowViewer(false)}>
                ✕
              </button>
              <iframe
                src="/Hameed_Afsar_Resume.pdf"
                className="rs-modal-iframe"
                title="Resume"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function TypewriterLines() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [visible, setVisible] = useState<typeof TERMINAL_LINES>([]);
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || started) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    if (lineIdx >= TERMINAL_LINES.length) { setDone(true); return; }

    const line = TERMINAL_LINES[lineIdx];
    const speed = 25 + Math.random() * 35;
    const nextLineDelay = charIdx === 0 ? 300 : 0;

    const t = setTimeout(() => {
      if (charIdx < line.text.length) {
        setCharIdx((c) => c + 1);
      } else {
        setVisible((prev) => [...prev, line]);
        setLineIdx((i) => i + 1);
        setCharIdx(0);
      }
    }, speed + nextLineDelay);

    return () => clearTimeout(t);
  }, [started, lineIdx, charIdx]);

  const activeLine = TERMINAL_LINES[lineIdx];

  return (
    <div ref={ref} className="rs-typewriter-wrap">
      {visible.map((line, i) => (
        <div key={i} className="rs-tw-line">
          <span className="rs-tw-tag" style={{ color: line.tagColor }}>[{line.tag}]</span>
          <span className="rs-tw-text">{line.text}</span>
        </div>
      ))}
      {started && !done && activeLine && (
        <div className="rs-tw-line">
          <span className="rs-tw-tag" style={{ color: activeLine.tagColor }}>[{activeLine.tag}]</span>
          <span className="rs-tw-text">
            {activeLine.text.slice(0, charIdx)}
            <span className="rs-tw-blink">▊</span>
          </span>
        </div>
      )}
      {done && (
        <div className="rs-tw-line">
          <span className="rs-tw-prompt">visitor@resume:~$</span>
          <span className="rs-tw-blink">▊</span>
        </div>
      )}
    </div>
  );
}
