"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform, useSpring } from "framer-motion";

interface TechItem {
  name: string;
  category: string;
  level: number;
  mode: string;
  note: string;
}

const TECH: TechItem[] = [
  { name: "React", category: "Frontend", level: 92, mode: "Interface", note: "Component systems, state, motion-rich UI." },
  { name: "Next.js", category: "Frontend", level: 90, mode: "Framework", note: "App routing, rendering strategy, deployment flow." },
  { name: "TypeScript", category: "Frontend", level: 88, mode: "Safety", note: "Typed contracts for scalable product code." },
  { name: "Tailwind", category: "Frontend", level: 85, mode: "Styling", note: "Fast, consistent responsive UI composition." },
  { name: "Framer Motion", category: "Frontend", level: 82, mode: "Motion", note: "Microinteractions, transitions, scroll choreography." },
  { name: "FastAPI", category: "Backend", level: 85, mode: "API", note: "Typed Python services and quick backend prototypes." },
  { name: "Node.js", category: "Backend", level: 85, mode: "Runtime", note: "Server logic, tooling, realtime glue." },
  { name: "Express", category: "Backend", level: 82, mode: "Routing", note: "Lean REST APIs and middleware pipelines." },
  { name: "WebSockets", category: "Backend", level: 75, mode: "Realtime", note: "Live updates, rooms, presence, event streams." },
  { name: "LangChain", category: "AI & Agents", level: 88, mode: "Orchestration", note: "LLM workflows, tools, memory, retrieval." },
  { name: "LangGraph", category: "AI & Agents", level: 82, mode: "Agents", note: "Stateful agent graphs and controllable loops." },
  { name: "RAG", category: "AI & Agents", level: 80, mode: "Retrieval", note: "Grounded answers from custom knowledge sources." },
  { name: "Ollama", category: "AI & Agents", level: 78, mode: "Local AI", note: "Local model experiments and private prototypes." },
  { name: "OpenAI", category: "AI & Agents", level: 85, mode: "Models", note: "Practical AI features with structured outputs." },
  { name: "PostgreSQL", category: "Data", level: 82, mode: "Relational", note: "Schemas, joins, queries, reliable storage." },
  { name: "MongoDB", category: "Data", level: 78, mode: "Document", note: "Flexible data models and quick iteration." },
  { name: "Firebase", category: "Data", level: 75, mode: "Platform", note: "Auth, realtime data, fast product scaffolds." },
  { name: "Redis", category: "Data", level: 70, mode: "Cache", note: "Caching, queues, ephemeral app state." },
  { name: "Git", category: "Tools", level: 90, mode: "Versioning", note: "Branching, diffs, recovery, clean history." },
  { name: "GitHub", category: "Tools", level: 88, mode: "Collaboration", note: "PR flow, issues, CI touchpoints." },
  { name: "Vercel", category: "Tools", level: 82, mode: "Deploy", note: "Preview deployments and frontend hosting." },
  { name: "Postman", category: "Tools", level: 78, mode: "Testing", note: "API collections, checks, request debugging." },
  { name: "Linux", category: "Tools", level: 75, mode: "System", note: "Shell workflows, servers, environment setup." },
];

const CATEGORY_COLORS: Record<string, string> = {
  Frontend: "#6EC8FF",
  Backend: "#68D391",
  "AI & Agents": "#FF8BD2",
  Data: "#B39DFF",
  Tools: "#FFC766",
};

const CATEGORIES = ["All", ...Object.keys(CATEGORY_COLORS)];

const PLACEMENTS = [
  { x: 5, y: 5, r: -4 },    { x: 17, y: 3, r: 6 },   { x: 29, y: 7, r: -3 },
  { x: 41, y: 4, r: 5 },    { x: 53, y: 6, r: -6 },  { x: 65, y: 3, r: 4 },
  { x: 77, y: 7, r: -5 },   { x: 79, y: 18, r: 7 },  { x: 79, y: 31, r: -4 },
  { x: 80, y: 44, r: 6 },   { x: 79, y: 57, r: -5 }, { x: 79, y: 72, r: 5 },
  { x: 77, y: 87, r: -6 },  { x: 65, y: 89, r: 7 },  { x: 53, y: 86, r: -4 },
  { x: 41, y: 90, r: 6 },   { x: 29, y: 87, r: -5 }, { x: 17, y: 89, r: 7 },
  { x: 5, y: 87, r: -6 },   { x: 4, y: 72, r: 5 },   { x: 4, y: 57, r: -7 },
  { x: 3, y: 44, r: 6 },    { x: 3, y: 31, r: -5 },  { x: 3, y: 18, r: 7 },
];
const CARD_TILT_RANGE = 14;
const FRAME_TILT_RANGE = 22;

export default function TechStackMarquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [category, setCategory] = useState("All");
  const [selectedName, setSelectedName] = useState("React");
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    let animId: number;
    let isVisible = true;
    let time = 0;
    const mouse = { x: W / 2, y: H / 2, mx: 0, my: 0 };

    function drawMandala() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      mouse.mx += (mouse.x - mouse.mx) * 0.05;
      mouse.my += (mouse.y - mouse.my) * 0.05;

      const cx = W / 2 + (mouse.mx - W / 2) * 0.08;
      const cy = H / 2 + (mouse.my - H / 2) * 0.08;
      const maxR = Math.min(W, H) * 0.45;
      const mDist = Math.sqrt((mouse.mx - W / 2) ** 2 + (mouse.my - H / 2) ** 2) / Math.max(W, H) * 2;

      for (let ring = 0; ring < 8; ring++) {
        const points = 6 + ring * 2;
        const baseR = maxR * (0.15 + ring * 0.11);
        const wave = Math.sin(time * 0.008 + ring * 0.7 + mDist * 2) * (0.15 + mDist * 0.1) + 1;
        const speedMult = 1 + mDist * 2;

        ctx.beginPath();
        for (let i = 0; i <= points; i++) {
          const angle = (i / points) * Math.PI * 2 + time * (0.002 + ring * 0.0005) * speedMult;
          const r = baseR * wave + Math.sin(angle * 3 + time * 0.01 + ring + mDist * 3) * baseR * (0.12 + mDist * 0.06);
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(255,70,85,${0.15 + ring * 0.04 + mDist * 0.1})`;
        ctx.lineWidth = (1 + ring * 0.15) * (1 + mDist * 0.3);
        ctx.shadowColor = "#ff4655";
        ctx.shadowBlur = (5 + ring * 2) * (1 + mDist);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      for (let i = 0; i < 60; i++) {
        const angle = (i / 60) * Math.PI * 2 + time * 0.003 * (1 + mDist);
        const r = maxR * (0.3 + Math.sin(angle * 5 + time * 0.007 + mDist * 4) * 0.2 + 0.3);
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        ctx.beginPath();
        ctx.arc(x, y, 1.5 + mDist, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,70,85,${0.3 + Math.sin(angle * 3 + time * 0.01) * 0.2 + mDist * 0.3})`;
        ctx.fill();
      }
    }

    function animate() {
      if (!ctx) return;
      if (!isVisible) { animId = requestAnimationFrame(animate); return; }
      time++;
      drawMandala();
      animId = requestAnimationFrame(animate);
    }

    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    const onMouse = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const obs = new IntersectionObserver(([e]) => { isVisible = e.isIntersecting; }, { threshold: 0 });

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouse);
    obs.observe(canvas);
    animate();

    return () => {
      cancelAnimationFrame(animId);
      obs.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  // Parallax slide-up on scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const rawParallaxY = useTransform(scrollYProgress, [0, 0.5, 1], [320, 0, -240]);
  const rawParallaxOpacity = useTransform(scrollYProgress, [0, 0.12, 0.88, 1], [0.4, 1, 1, 0.4]);
  const parallaxY = useSpring(rawParallaxY, { stiffness: 180, damping: 28, restDelta: 0.001 });
  const parallaxOpacity = useSpring(rawParallaxOpacity, { stiffness: 200, damping: 30, restDelta: 0.001 });

  const visibleTech = useMemo(
    () => TECH.filter((tech) => category === "All" || tech.category === category),
    [category]
  );

  const selectedTech = useMemo(
    () => TECH.find((tech) => tech.name === selectedName) ?? visibleTech[0] ?? TECH[0],
    [selectedName, visibleTech]
  );

  const categoryMeta = useMemo(
    () =>
      CATEGORIES.map((item) => ({
        name: item,
        count: item === "All" ? TECH.length : TECH.filter((tech) => tech.category === item).length,
        color: item === "All" ? "#ff4655" : CATEGORY_COLORS[item],
      })),
    []
  );

  useEffect(() => {
    if (isPinned || visibleTech.length < 2) return;
    const timer = window.setInterval(() => {
      setSelectedName((current) => {
        const currentIndex = visibleTech.findIndex((tech) => tech.name === current);
        return visibleTech[(currentIndex + 1 + visibleTech.length) % visibleTech.length].name;
      });
    }, 2200);
    return () => window.clearInterval(timer);
  }, [isPinned, visibleTech]);

  const handleCategory = useCallback((nextCategory: string) => {
    setCategory(nextCategory);
    setIsPinned(false);
    const first = TECH.find((tech) => nextCategory === "All" || tech.category === nextCategory);
    if (first) setSelectedName(first.name);
  }, []);

  const activeColor = CATEGORY_COLORS[selectedTech.category];
  const selColor = activeColor ?? "#ff4655";

  // Frame 3D tilt
  const handleFramePointer = useCallback((e: React.PointerEvent) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    el.style.setProperty("--rx", `${(py - 0.5) * -FRAME_TILT_RANGE}deg`);
    el.style.setProperty("--ry", `${(px - 0.5) * FRAME_TILT_RANGE}deg`);
  }, []);

  const handleFrameLeave = useCallback(() => {
    const el = frameRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-screen overflow-hidden bg-[#12080a] text-[#ece8e1]"
      style={{ backgroundImage: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,70,85,0.08), transparent)" }}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0"
        style={{ width: "100%", height: "100%" }}
      />
      <motion.div
        className="relative z-10 mx-auto grid h-full w-full max-w-[1400px] grid-rows-[auto_1fr] px-4 py-4 sm:px-7 sm:py-6"
        style={{ y: parallaxY, opacity: parallaxOpacity }}
      >
        <header className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <span className="block font-mono text-[0.64rem] uppercase tracking-[4px] text-[#ff4655]">
              {"// TECH STACK"}
            </span>
            <h2 className="mt-1 font-['Droid_1997','Outfit',sans-serif] text-[clamp(2.5rem,6vw,6.5rem)] font-black uppercase leading-[0.86] tracking-normal text-[#ece8e1]">
              STACKED
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
            {categoryMeta.map((item) => {
              const active = category === item.name;
              return (
                <button
                  key={item.name}
                  type="button"
                  className="min-h-9 border-2 bg-transparent px-2 text-left font-mono text-[0.58rem] uppercase tracking-[0.5px] transition hover:-translate-y-0.5"
                  style={{
                    borderColor: active ? item.color : "rgba(255,255,255,0.1)",
                    background: active ? item.color : "transparent",
                    color: active ? "#000" : "rgba(236,232,225,0.5)",
                  }}
                  onClick={() => handleCategory(item.name)}
                  aria-pressed={active}
                >
                  <span className="block truncate">{item.name}</span>
                  <small>{item.count}</small>
                </button>
              );
            })}
          </div>
        </header>

        <main className="relative min-h-0" style={{ perspective: "1200px" }}>
          {/* Center Frame — 3D perspective tilt on hover */}
          <div
            ref={frameRef}
            onPointerMove={handleFramePointer}
            onPointerLeave={handleFrameLeave}
            className="absolute left-1/2 top-1/2 z-20 w-[min(95vw,665px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden border-2 bg-[#0a0a14]/95 p-5 shadow-[0_0_40px_rgba(255,70,85,0.12)] sm:p-7"
            style={{
              transform: "perspective(1200px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
              transition: "transform 0.12s ease-out",
              transformStyle: "preserve-3d",
              borderColor: selColor,
              boxShadow: `0 0 50px ${selColor}22, 0 0 100px ${selColor}11`,
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTech.name}
                initial={{ opacity: 0, y: 16, rotate: -2 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, y: -14, rotate: 2 }}
                transition={{ duration: 0.24 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div
                  className="mb-5 flex items-start justify-between gap-4"
                  style={{ transform: "translateZ(36px)" }}
                >
                  <span className="font-mono text-[0.6rem] uppercase tracking-[2px] text-[#ff4655]">
                    {isPinned ? "Pinned sticker" : "Live sticker"}
                  </span>
                  <span
                    className="border-2 px-2 py-1 font-mono text-[0.62rem] text-black"
                    style={{
                      borderColor: selColor,
                      background: selColor,
                    }}
                  >
                    {selectedTech.level}%
                  </span>
                </div>

                <h3
                  className="m-0 w-full whitespace-nowrap font-['Outfit',sans-serif] text-[clamp(2.4rem,8vw,4.8rem)] font-black leading-[0.88] text-[#ece8e1]"
                  style={{ transform: "translateZ(48px)" }}
                >
                  {selectedTech.name}
                </h3>

                <p
                  className="mt-3 font-mono text-[0.72rem] uppercase tracking-[1px]"
                  style={{ color: selColor, transform: "translateZ(28px)" }}
                >
                  {selectedTech.category} / {selectedTech.mode}
                </p>

                <p
                  className="mt-5 w-full whitespace-nowrap text-[0.95rem] leading-7 text-[#a09888]"
                  style={{ transform: "translateZ(16px)" }}
                >
                  {selectedTech.note}
                </p>

                <div
                  className="mt-6 h-3 border-2 bg-[#1a1a2e] p-[2px]"
                  style={{ borderColor: selColor, transform: "translateZ(8px)" }}
                >
                  <motion.span
                    className="block h-full"
                    style={{ background: selColor }}
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedTech.level}%` }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Scattered sticker cards — each with individual 3D tilt */}
          <AnimatePresence mode="popLayout">
            {visibleTech.map((tech, index) => {
              const placement = PLACEMENTS[index % PLACEMENTS.length];
              const active = selectedTech.name === tech.name;
              const color = CATEGORY_COLORS[tech.category];

              return (
                <motion.button
                  key={tech.name}
                  type="button"
                  className="absolute z-10 cursor-pointer"
                  style={{ left: `${placement.x}%`, top: `${placement.y}%`, perspective: "600px" }}
                  layout
                  initial={{ opacity: 0, scale: 0.6, rotate: placement.r + 18 }}
                  animate={{
                    opacity: active ? 1 : 0.82,
                    scale: active ? 1.08 : 1,
                    rotate: placement.r,
                    y: active ? -8 : [0, -3, 0],
                  }}
                  exit={{ opacity: 0, scale: 0.6, rotate: placement.r - 16 }}
                  transition={{
                    layout: { type: "spring", stiffness: 220, damping: 24 },
                    y: { repeat: active ? 0 : Infinity, duration: 3 + (index % 4) * 0.4, ease: "easeInOut" },
                    opacity: { duration: 0.2 },
                    scale: { type: "spring", stiffness: 220, damping: 18 },
                  }}
                  whileHover={{ scale: 1.15, rotate: 0, y: -12, zIndex: 40 }}
                  whileTap={{ scale: 0.96 }}
                  onMouseEnter={() => setSelectedName(tech.name)}
                  onFocus={() => setSelectedName(tech.name)}
                  onClick={() => {
                    setSelectedName(tech.name);
                    setIsPinned((value) => !value || selectedTech.name !== tech.name);
                  }}
                  aria-pressed={active}
                >
                  <Card3DInner color={color} active={active}>
                    <span
                      className="block truncate text-[0.7rem] font-bold"
                      style={{ transform: "translateZ(14px)", display: "block" }}
                    >
                      {tech.name}
                    </span>
                    <span
                      className="mt-1 block truncate text-[0.52rem] uppercase tracking-[1px] opacity-70"
                      style={{ transform: "translateZ(8px)", display: "block" }}
                    >
                      {tech.mode}
                    </span>
                  </Card3DInner>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </main>
      </motion.div>
    </section>
  );
}

function Card3DInner({
  color,
  active,
  children,
}: {
  color: string;
  active: boolean;
  children: React.ReactNode;
}) {
  const innerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: React.MouseEvent) => {
    const el = innerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rx = (y - 0.5) * -CARD_TILT_RANGE;
    const ry = (x - 0.5) * CARD_TILT_RANGE;
    el.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.06,1.06,1.06)`;
  }, []);

  const handleLeave = useCallback(() => {
    const el = innerRef.current;
    if (!el) return;
    el.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
  }, []);

  return (
    <div
      ref={innerRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="min-w-[116px] border-2 px-3 py-2 text-left font-mono"
      style={{
        background: "#0a0a14",
        borderColor: color,
        color: color,
        transformStyle: "preserve-3d",
        willChange: "transform",
        transition: "transform 0.08s ease-out",
        boxShadow: active
          ? `0 8px 30px ${color}33, 4px 4px 0 rgba(0,0,0,0.4)`
          : "4px 4px 0 rgba(0,0,0,0.4)",
      }}
    >
      {children}
    </div>
  );
}
