"use client";

import { useRef, useState, useMemo } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface TechItem {
  name: string;
  category: string;
  level: number;
}

const TECH: TechItem[] = [
  { name: "Next.js", category: "Frontend", level: 95 },
  { name: "TypeScript", category: "Frontend", level: 92 },
  { name: "React", category: "Frontend", level: 90 },
  { name: "Three.js", category: "Frontend", level: 78 },
  { name: "Framer Motion", category: "Frontend", level: 88 },
  { name: "Tailwind CSS", category: "Frontend", level: 85 },
  { name: "Vite", category: "Frontend", level: 82 },
  { name: "Node.js", category: "Backend", level: 88 },
  { name: "Python", category: "Backend", level: 85 },
  { name: "Rust", category: "Backend", level: 70 },
  { name: "Go", category: "Backend", level: 65 },
  { name: "GraphQL", category: "Backend", level: 80 },
  { name: "LangChain", category: "Backend", level: 75 },
  { name: "PostgreSQL", category: "Data", level: 82 },
  { name: "MongoDB", category: "Data", level: 78 },
  { name: "Redis", category: "Data", level: 72 },
  { name: "AI/ML", category: "Data", level: 80 },
  { name: "Docker", category: "DevOps", level: 85 },
  { name: "Kubernetes", category: "DevOps", level: 72 },
  { name: "AWS", category: "DevOps", level: 80 },
  { name: "Linux", category: "DevOps", level: 78 },
  { name: "Git", category: "DevOps", level: 90 },
  { name: "WebGPU", category: "Edge", level: 60 },
  { name: "WebAssembly", category: "Edge", level: 55 },
];

const CATEGORY_COLORS: Record<string, { hue: number; label: string }> = {
  Frontend: { hue: 210, label: "Frontend" },
  Backend: { hue: 140, label: "Backend" },
  Data: { hue: 280, label: "Data" },
  DevOps: { hue: 30, label: "DevOps" },
  Edge: { hue: 350, label: "Edge" },
};

function TechCard({ item, index, isHovered, onHover, onLeave }: {
  item: TechItem;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isLocalHovered, setIsLocalHovered] = useState(false);

  const { hue } = CATEGORY_COLORS[item.category];
  const active = isLocalHovered || isHovered;

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), { stiffness: 300, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), { stiffness: 300, damping: 20 });
  const glowX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseEnter = () => {
    setIsLocalHovered(true);
    onHover();
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsLocalHovered(false);
    onLeave();
  };

  return (
    <motion.div
      ref={cardRef}
      className="ts-card"
      style={{
        rotateX,
        rotateY,
        "--card-hue": hue,
      } as React.CSSProperties}
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.025, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        borderColor: active
          ? `hsla(${hue}, 70%, 55%, 0.5)`
          : "rgba(255,255,255,0.06)",
        boxShadow: active
          ? `0 0 40px hsla(${hue}, 70%, 55%, 0.12), inset 0 0 30px hsla(${hue}, 70%, 55%, 0.03)`
          : "0 0 0px transparent",
        scale: active ? 1.08 : 1,
      }}
    >
      {/* Glare overlay */}
      <motion.div
        className="ts-card-glare"
        style={{
          background: `radial-gradient(circle at ${glowX} ${glowY}, hsla(${hue}, 80%, 60%, 0.12), transparent 60%)`,
        }}
      />

      {/* Proficiency bar */}
      <motion.div
        className="ts-card-bar"
        style={{ backgroundColor: `hsla(${hue}, 70%, 55%, 0.25)` }}
        animate={{ width: active ? `${item.level}%` : "0%" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Category dot */}
      <span
        className="ts-card-dot"
        style={{ backgroundColor: `hsla(${hue}, 70%, 55%, 0.8)` }}
      />

      <motion.span
        className="ts-card-text"
        animate={{
          color: active
            ? `hsla(${hue}, 60%, 75%, 1)`
            : "rgba(236, 232, 225, 0.35)",
        }}
      >
        {item.name}
      </motion.span>
    </motion.div>
  );
}

export default function TechStackMarquee() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleSectionMouse = (e: React.MouseEvent) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const categories = useMemo(() => {
    const cats = new Map<string, TechItem[]>();
    TECH.forEach((t) => {
      if (!cats.has(t.category)) cats.set(t.category, []);
      cats.get(t.category)!.push(t);
    });
    return Array.from(cats.entries());
  }, []);

  return (
    <section
      ref={sectionRef}
      className="ts-section"
      onMouseMove={handleSectionMouse}
    >
      {/* Interactive orbs that follow mouse */}
      <motion.div
        className="ts-orb ts-orb--1"
        animate={{
          x: [`${mousePos.x - 20}%`, `${mousePos.x + 10}%`, `${mousePos.x - 20}%`],
          y: [`${mousePos.y - 10}%`, `${mousePos.y + 5}%`, `${mousePos.y - 10}%`],
        }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      />
      <motion.div
        className="ts-orb ts-orb--2"
        animate={{
          x: [`${100 - mousePos.x - 15}%`, `${100 - mousePos.x + 5}%`, `${100 - mousePos.x - 15}%`],
          y: [`${100 - mousePos.y - 5}%`, `${100 - mousePos.y + 10}%`, `${100 - mousePos.y - 5}%`],
        }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
      />

      {/* Mouse spotlight */}
      <motion.div
        className="ts-spotlight"
        animate={{
          left: `${mousePos.x}%`,
          top: `${mousePos.y}%`,
        }}
        transition={{ type: "spring", stiffness: 100, damping: 25, mass: 0.5 }}
      />

      <div className="ts-header">
        <motion.span
          className="ts-eyebrow"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          // TECH STACK
        </motion.span>
        <motion.div
          className="ts-underline"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Category tabs */}
      <motion.div
        className="ts-categories"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {categories.map(([cat, items]) => {
          const { hue } = CATEGORY_COLORS[cat];
          const isActive = hoveredCategory === null || hoveredCategory === cat;
          return (
            <motion.button
              key={cat}
              className="ts-cat-btn"
              style={{
                borderColor: isActive
                  ? `hsla(${hue}, 70%, 55%, 0.3)`
                  : "rgba(255,255,255,0.06)",
                color: isActive
                  ? `hsla(${hue}, 60%, 75%, 1)`
                  : "rgba(236, 232, 225, 0.25)",
              }}
              onMouseEnter={() => setHoveredCategory(cat)}
              onMouseLeave={() => setHoveredCategory(null)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span
                className="ts-cat-dot"
                style={{ backgroundColor: `hsla(${hue}, 70%, 55%, 0.8)` }}
              />
              {cat}
              <span className="ts-cat-count">{items.length}</span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Tech grid */}
      <div className="ts-grid">
        {TECH.map((item, i) => (
          <TechCard
            key={item.name}
            item={item}
            index={i}
            isHovered={hoveredCategory !== null && hoveredCategory === item.category}
            onHover={() => setHoveredCategory(item.category)}
            onLeave={() => setHoveredCategory(null)}
          />
        ))}
      </div>
    </section>
  );
}
