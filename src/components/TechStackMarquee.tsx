"use client";

import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Data ── */
interface TechItem { name: string; category: string; level: number }

const TECH: TechItem[] = [
  { name: "React", category: "Frontend", level: 92 },
  { name: "Next.js", category: "Frontend", level: 90 },
  { name: "TypeScript", category: "Frontend", level: 88 },
  { name: "Tailwind", category: "Frontend", level: 85 },
  { name: "Framer Motion", category: "Frontend", level: 82 },
  { name: "FastAPI", category: "Backend", level: 85 },
  { name: "Node.js", category: "Backend", level: 85 },
  { name: "Express", category: "Backend", level: 82 },
  { name: "WebSockets", category: "Backend", level: 75 },
  { name: "LangChain", category: "AI & Agents", level: 88 },
  { name: "LangGraph", category: "AI & Agents", level: 82 },
  { name: "RAG", category: "AI & Agents", level: 80 },
  { name: "Ollama", category: "AI & Agents", level: 78 },
  { name: "OpenAI", category: "AI & Agents", level: 85 },
  { name: "PostgreSQL", category: "Data", level: 82 },
  { name: "MongoDB", category: "Data", level: 78 },
  { name: "Firebase", category: "Data", level: 75 },
  { name: "Redis", category: "Data", level: 70 },
  { name: "Git", category: "Tools", level: 90 },
  { name: "GitHub", category: "Tools", level: 88 },
  { name: "Vercel", category: "Tools", level: 82 },
  { name: "Postman", category: "Tools", level: 78 },
  { name: "Linux", category: "Tools", level: 75 },
];

const CAT_COLORS: Record<string, number> = {
  Frontend: 210, Backend: 145, "AI & Agents": 320, Data: 260, Tools: 35,
};

/* ── Wave item ── */
interface WaveItem {
  x: number; y: number; scale: number; glow: number; hue: number;
  name: string; level: number; category: string; index: number;
}

/* ── Main ── */
export default function TechStackMarquee() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [hovered, setHovered] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | null>(null);
  const [wave, setWave] = useState<WaveItem[]>([]);
  const dims = useRef({ w: 800, h: 400 });

  // Categorize items for clustering
  const catOrder = useMemo(() => ["Frontend", "Backend", "AI & Agents", "Data", "Tools"], []);

  // Build items with cluster positions
  const layout = useMemo(() => {
    const groups: Record<string, TechItem[]> = {};
    TECH.forEach(t => {
      if (!groups[t.category]) groups[t.category] = [];
      groups[t.category].push(t);
    });

    const items: Array<{ item: TechItem; clusterX: number; row: number }> = [];
    let cursor = 0.05;
    for (const cat of catOrder) {
      const g = groups[cat] || [];
      const span = g.length * 0.035;
      g.forEach((t, i) => {
        items.push({
          item: t,
          clusterX: cursor + (i / Math.max(g.length - 1, 1)) * span,
          row: catOrder.indexOf(cat) % 2 === 0 ? 0 : 1,
        });
      });
      cursor += span + 0.04;
    }
    return items;
  }, [catOrder]);

  // Wave animation loop
  useEffect(() => {
    let raf: number;
    let time = 0;
    const ampBase = 80;
    const freqBase = 2.2;

    const tick = () => {
      time += 0.025;
      const mx = mouse.x;
      const my = mouse.y;

      // Amplitude: base 80 + mouseY control (40-140)
      const amp = 40 + my * 100;
      // Phase shift from mouseX (0 to 2π)
      const phaseOff = mx * Math.PI * 2;

      const result: WaveItem[] = layout.map(({ item, clusterX, row }) => {
        const visible = filter === null || filter === item.category;
        const isHovered = hovered === item.name;
        const hue = CAT_COLORS[item.category] || 0;
        const rowOff = row * Math.PI;
        const speed = 1.0 + row * 0.3;

        // Center Y per row
        const cy = row === 0 ? 150 : 310;

        // Wave Y
        const wavePhase = clusterX * freqBase * Math.PI * 2 + time * speed + phaseOff + rowOff;
        const waveY = Math.sin(wavePhase) * amp * (1 - my * 0.3);

        // Scale + glow from wave position
        const normalized = (Math.sin(wavePhase) + 1) / 2; // 0 to 1
        const s = isHovered ? 1.5 : 0.6 + normalized * 0.5;
        const glow = isHovered ? 1 : 0.3 + normalized * 0.5;

        // X position spans the section
        const x = clusterX * dims.current.w;
        const y = cy + waveY;

        return {
          x, y, scale: s, glow, hue,
          name: item.name, level: item.level,
          category: item.category, index: item.name.charCodeAt(0),
          visible,
        };
      });

      setWave(result);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mouse, hovered, filter, layout]);

  // Track mouse
  const handleMouse = useCallback((e: React.MouseEvent) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    dims.current = { w: rect.width, h: rect.height };
    setMouse({ x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height });
  }, []);

  // Burst state
  const [bursts, setBursts] = useState<Array<{ id: number; x: number; y: number; hue: number }>>([]);
  const burstId = useRef(0);

  const handleClick = useCallback((wx: number, wy: number, hue: number) => {
    const id = ++burstId.current;
    setBursts(prev => [...prev, { id, x: wx, y: wy, hue }]);
    setTimeout(() => setBursts(prev => prev.filter(b => b.id !== id)), 900);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="ts-section"
      onMouseMove={handleMouse}
      onMouseLeave={() => setMouse({ x: 0.5, y: 0.5 })}
    >
      {/* Background gradient orbs */}
      <motion.div
        className="ts-aurora"
        animate={{
          background: [
            `radial-gradient(ellipse 60% 50% at ${30 + mouse.x * 10}% ${30 + mouse.y * 10}%, hsla(210, 70%, 50%, 0.04), transparent)`,
            `radial-gradient(ellipse 60% 50% at ${70 - mouse.x * 10}% ${60 + mouse.y * 10}%, hsla(320, 70%, 50%, 0.03), transparent)`,
          ],
        }}
        transition={{ duration: 1.5 }}
      />

      {/* Header */}
      <div className="ts-header">
        <motion.span className="ts-eyebrow" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          // TECH STACK
        </motion.span>
        <motion.div className="ts-underline" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }} />
        <motion.p className="ts-hint" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.5 }}>
          move mouse to shape the wave &bull; hover to reveal &bull; click to burst
        </motion.p>
      </div>

      {/* Filters */}
      <motion.div className="ts-categories" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.5 }}>
        <motion.button className="ts-cat-btn" style={{ borderColor: filter === null ? "rgba(255,70,85,0.4)" : "rgba(255,255,255,0.06)", color: filter === null ? "var(--val-red)" : "rgba(236,232,225,0.35)" }} onClick={() => setFilter(null)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          ALL
        </motion.button>
        {Object.entries(CAT_COLORS).map(([cat, hue]) => (
          <motion.button key={cat} className="ts-cat-btn" style={{ borderColor: filter === cat ? `hsla(${hue}, 70%, 55%, 0.4)` : "rgba(255,255,255,0.06)", color: filter === cat ? `hsla(${hue}, 60%, 75%, 1)` : "rgba(236,232,225,0.25)" }} onClick={() => setFilter(filter === cat ? null : cat)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <span className="ts-cat-dot" style={{ backgroundColor: `hsla(${hue}, 70%, 55%, 0.8)` }} />
            {cat}
          </motion.button>
        ))}
      </motion.div>

      {/* Wave stage */}
      <div className="ts-wave-stage">
        {wave.map((w) => {
          const isHovered = hovered === w.name;
          const visible = filter === null || filter === w.category;
          return (
            <motion.div
              key={w.name}
              className="ts-wave-item"
              style={{
                x: w.x,
                y: w.y,
                scale: w.scale * (visible ? 1 : 0.3),
                opacity: visible ? 1 : 0,
                zIndex: isHovered ? 100 : Math.round(w.y),
                "--whue": w.hue,
              } as React.CSSProperties}
              transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.8 }}
              onMouseEnter={() => setHovered(w.name)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleClick(w.x, w.y, w.hue)}
            >
              {/* Glow orb */}
              <motion.div
                className="ts-wave-orb"
                style={{
                  backgroundColor: `hsla(${w.hue}, 70%, 55%, ${0.06 + w.glow * 0.1})`,
                  boxShadow: `0 0 ${20 + w.glow * 30}px hsla(${w.hue}, 70%, 55%, ${0.08 + w.glow * 0.12})`,
                }}
                animate={{
                  scale: isHovered ? 1.8 : 1,
                }}
                transition={{ duration: 0.3 }}
              />

              {/* Core dot */}
              <motion.div
                className="ts-wave-core"
                style={{
                  backgroundColor: `hsla(${w.hue}, 80%, 60%, ${0.4 + w.glow * 0.5})`,
                  boxShadow: `0 0 ${6 + w.glow * 14}px hsla(${w.hue}, 80%, 60%, ${0.15 + w.glow * 0.4})`,
                }}
                animate={{
                  scale: isHovered ? 1.6 : 1,
                }}
              >
                <span className="ts-wave-catdot" style={{ backgroundColor: `hsla(${w.hue}, 80%, 60%, 1)` }} />
              </motion.div>

              {/* Label */}
              <motion.span
                className="ts-wave-label"
                animate={{
                  opacity: isHovered ? 1 : 0.3 + w.glow * 0.3,
                  color: isHovered ? `hsla(${w.hue}, 60%, 85%, 1)` : `hsla(${w.hue}, 40%, 60%, 0.5)`,
                  y: isHovered ? -6 : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                {w.name}
              </motion.span>

              {/* Level badge */}
              <AnimatePresence>
                {isHovered && (
                  <motion.span
                    className="ts-wave-level"
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.8 }}
                    style={{ color: `hsla(${w.hue}, 80%, 70%, 1)` }}
                  >
                    {w.level}%
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {/* Burst particles */}
        <AnimatePresence>
          {bursts.map(b => (
            <ParticleBurst key={b.id} {...b} />
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ── Burst ── */
function ParticleBurst({ x, y, hue }: { x: number; y: number; hue: number }) {
  const dots = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      angle: (Math.PI * 2 * i) / 8,
      dist: 30 + Math.random() * 50,
      size: 1.5 + Math.random() * 2.5,
    })), []);

  return (
    <>
      {dots.map((d, i) => (
        <motion.div
          key={i}
          className="ts-wave-burst"
          style={{
            width: d.size, height: d.size,
            backgroundColor: `hsla(${hue}, 80%, 65%, 0.9)`,
            boxShadow: `0 0 ${d.size * 3}px hsla(${hue}, 80%, 65%, 0.3)`,
          }}
          initial={{ x, y, opacity: 1, scale: 1 }}
          animate={{
            x: x + Math.cos(d.angle) * d.dist,
            y: y + Math.sin(d.angle) * d.dist,
            opacity: 0, scale: 0,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 + Math.random() * 0.3, ease: "easeOut" }}
        />
      ))}
    </>
  );
}
