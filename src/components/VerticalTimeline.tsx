"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const milestones = [
  {
    year: "2020",
    label: "ORIGINS",
    title: "Creative Design Journey",
    body: "Started exploring digital creativity through Photoshop and After Effects, learning visual storytelling, editing, and motion design while building a strong design foundation.",
    tags: ["Photoshop", "After Effects", "Design"],
    side: "left" as const,
  },
  {
    year: "2023",
    label: "FOUNDATION",
    title: "Frontend Development",
    body: "Transitioned from design into web development by building responsive interfaces and interactive websites using modern frontend technologies and animations.",
    tags: ["HTML", "CSS", "JavaScript"],
    side: "right" as const,
  },
  {
    year: "2024",
    label: "ACCELERATION",
    title: "Full Stack Builder",
    body: "Expanded into full-stack application development by integrating databases, authentication, APIs, and deployment workflows to create production-ready applications.",
    tags: ["React", "Next.js", "Supabase"],
    side: "left" as const,
  },
  {
    year: "2025",
    label: "INTELLIGENCE",
    title: "AI Systems Engineer",
    body: "Began building intelligent AI applications including RAG systems, AI agents, multimodal assistants, surveillance AI, and workflow automation platforms.",
    tags: ["LLMs", "RAG", "Agents"],
    side: "right" as const,
  },
  {
    year: "2026",
    label: "NOW",
    title: "Agentic AI Creator",
    body: "Focused on building advanced AI products powered by multi-agent systems, autonomous workflows, orchestration pipelines, and production-ready intelligent applications.",
    tags: ["Multi-Agent", "Agentic AI", "Automation"],
    side: "left" as const,
  },
];

export default function VerticalTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Drive the growing vertical line
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 60%", "end 40%"],
  });
  const rawScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const lineScaleY = useSpring(rawScaleY, { stiffness: 50, damping: 18, restDelta: 0.05 });

  return (
    <section ref={sectionRef} className="vtl-section" id="journey">
      {/* Header */}
      <div className="vtl-header">
        <span className="vtl-header-tag">// JOURNEY</span>
        <h2 className="vtl-header-title">THE TIMELINE</h2>
        <div className="vtl-header-rule" />
      </div>

      {/* Track */}
      <div className="vtl-track">
        {/* Growing vertical line */}
        <div className="vtl-line-outer">
          <motion.div className="vtl-line-fill" style={{ scaleY: lineScaleY }} />
        </div>

        {/* Entries */}
        {milestones.map((m, i) => (
          <TimelineEntry key={i} milestone={m} index={i} />
        ))}
      </div>
    </section>
  );
}

function TimelineEntry({
  milestone,
  index,
}: {
  milestone: (typeof milestones)[0];
  index: number;
}) {
  const isLeft = milestone.side === "left";

  return (
    <div className={`vtl-entry vtl-entry--${milestone.side}`}>
      {/* Card side */}
      <motion.div
        className="vtl-card"
        initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
      >
        {/* Corner accents */}
        <span className="vtl-corner vtl-corner--tl" />
        <span className="vtl-corner vtl-corner--tr" />
        <span className="vtl-corner vtl-corner--bl" />
        <span className="vtl-corner vtl-corner--br" />

        <div className="vtl-card-label">{milestone.label}</div>
        <h3 className="vtl-card-title">{milestone.title}</h3>
        <div className="vtl-card-rule" />
        <p className="vtl-card-body">{milestone.body}</p>
        <div className="vtl-card-tags">
          {milestone.tags.map((t) => (
            <span key={t} className="vtl-tag">{t}</span>
          ))}
        </div>
      </motion.div>

      {/* Center node */}
      <motion.div
        className="vtl-node"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.4, ease: "backOut", delay: 0.15 }}
      >
        <div className="vtl-node-inner">
          <span className="vtl-node-year">{milestone.year}</span>
        </div>
        <div className="vtl-node-ring" />
      </motion.div>

      {/* Spacer side */}
      <div className="vtl-spacer" />
    </div>
  );
}
