"use client";

import { motion } from "framer-motion";

const TECH = [
  "Next.js", "TypeScript", "React", "Node.js", "Python", "Rust", "Go", "WebGPU",
  "Docker", "Kubernetes", "AWS", "PostgreSQL", "MongoDB", "Redis", "GraphQL", "Linux",
  "Framer Motion", "Tailwind CSS", "LangChain", "AI/ML", "WebAssembly", "Three.js", "Vite", "Git",
];

function TechCard({ name, index }: { name: string; index: number }) {
  return (
    <motion.div
      className="ts-card"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.025, duration: 0.45, ease: "easeOut" }}
      whileHover={{ scale: 1.06, borderColor: "rgba(255,70,85,0.5)", color: "#fff" }}
    >
      <span className="ts-card-text">{name}</span>
    </motion.div>
  );
}

export default function TechStackMarquee() {
  return (
    <section className="ts-section">
      <div className="ts-glow" aria-hidden />
      <div className="ts-header">
        <span className="ts-eyebrow">// TECH STACK</span>
      </div>
      <div className="ts-grid">
        {TECH.map((t, i) => (
          <TechCard key={t} name={t} index={i} />
        ))}
      </div>
    </section>
  );
}
