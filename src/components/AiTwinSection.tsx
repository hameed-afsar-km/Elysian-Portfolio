"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Suggested prompts ─── */
const SUGGESTED_PROMPTS = [
  "Tell me about yourself",
  "What is afsGPT?",
  "How do you build AI products?",
  "What technologies do you use?",
  "Show me your best projects",
  "What's your design philosophy?",
  "How would you build my startup?",
  "Explain RAG in simple terms",
  "What are you currently building?",
  "Career journey",
];

/* ─── AI response map ─── */
interface ResponseEntry {
  text: string;
  followUp?: string;
}

const RESPONSES: Record<string, ResponseEntry> = {
  "tell me about yourself": {
    text: "I'm Hameed Afsar KM — a full-stack engineer and product designer who started coding out of pure curiosity and never looked back. I've spent the last few years shipping products, building AI systems, and thinking deeply about how software should feel. I believe the best products sit at the intersection of engineering excellence and thoughtful design. Right now I'm focused on AI-powered tools, automation pipelines, and experiences that leave a mark.",
  },
  "what is afsgpt": {
    text: "afsGPT is the brain behind this AI Twin — it's a custom knowledge system I built that knows everything about my projects, tech stack, design philosophy, and how I think about building products. It's designed to give you an honest, detailed, and genuinely useful conversation rather than generic chatbot fluff. Think of it as the digital version of me that's always awake and ready to talk shop.",
  },
  "how do you build ai products": {
    text: "I build AI products with a product-first mindset. That means I start with the user problem, not the technology. I choose the right model and orchestration strategy (LangChain, LangGraph, or direct API), build a clean data pipeline (RAG when grounded knowledge is needed), and obsess over the UX. An AI product that feels smart but is frustrating to use isn't smart at all. I focus on reliability, latency, and making the AI feel like a natural part of the workflow.",
  },
  "what technologies do you use": {
    text: "My stack is broad but intentional. Frontend: React, Next.js, TypeScript, Tailwind, Framer Motion. Backend: Node.js, Express, FastAPI, WebSockets. AI: LangChain, LangGraph, RAG, OpenAI, Ollama. Data: PostgreSQL, MongoDB, Redis. Tools: Git, GitHub, Vercel, Linux. I pick whatever solves the problem best, but TypeScript and Next.js are my daily drivers.",
  },
  "show me your best projects": {
    text: "Some projects I'm proud of: NEXUS COGNITIVE — an AI orchestration engine for multi-agent workflows. AETHER OS — an in-browser WebAssembly desktop environment. SPECTRA PIPELINE — an asset optimization pipeline for game developers. VORTEX CORE — a WebGPU particle physics simulation handling millions of particles. And QUANTUM GRID — a real-time crypto ledger visualizer. Each one pushed something new — whether it was architecture, performance, or UX.",
  },
  "what's your design philosophy": {
    text: "Design isn't decoration — it's communication. Every pixel, transition, and micro-interaction should serve a purpose. I believe in: 1) Motion with meaning — animation should guide, not distract. 2) Darkness with depth — dark UIs need texture, layering, and glow to feel premium. 3) Typography as voice — fonts set the tone before a single word is read. 4) Constraints breed creativity — good design thrives within boundaries.",
  },
  "how would you build my startup": {
    text: "I'd start with the smallest possible version that actually delivers value. No over-engineering, no premature scaling. Pick a stack you can move fast in (Next.js + TypeScript is a solid bet), build a clean data model, invest in the UX early (it's your differentiator), and ship within weeks, not months. Once you have users, iterate based on real feedback, not assumptions. Speed and taste are your unfair advantages as a startup.",
  },
  "explain rag in simple terms": {
    text: "RAG (Retrieval-Augmented Generation) is like giving an AI a textbook to reference before answering a question. Instead of relying only on what it learned during training (which gets stale), RAG lets the AI look up relevant information from a custom knowledge base in real-time. This means answers are more accurate, grounded in your data, and less prone to hallucinations. It's how you build AI that actually knows your specific stuff.",
  },
  "what are you currently building": {
    text: "Right now I'm deep in AI-powered developer tooling — building systems that help engineers ship faster by automating the boring parts. I'm also exploring WebGPU for browser-based compute, refining my portfolio (you're looking at it), and thinking about the next big thing in human-AI interaction. I'm always building something. The specific project changes, but the drive doesn't.",
  },
  "career journey": {
    text: "My journey started in 2022 with raw curiosity and a lot of broken code. 2023 was about shipping real products. 2024 I went deep into systems, cloud architecture, and scalability. 2025 I merged software engineering with AI. Now in 2026, I'm operating at the intersection of product, engineering, and intelligence — leading technical decisions and building things that matter. Each year was a deliberate step toward becoming the engineer I am today.",
  },
};

const DEFAULT_RESPONSE = "That's a great question. I'd love to give you a thoughtful answer — could you ask it a bit differently? I can talk about my projects, tech stack, AI, startups, design philosophy, career journey, or whatever's on your mind.";

function findResponse(text: string): string {
  const normalized = text.toLowerCase().trim();
  for (const [key, entry] of Object.entries(RESPONSES)) {
    if (normalized.includes(key)) return entry.text;
  }
  return DEFAULT_RESPONSE;
}

/* ─── Typing indicator dots ─── */
function TypingDots() {
  return (
    <div className="ait-dots">
      <span className="ait-dot" />
      <span className="ait-dot" style={{ animationDelay: "0.15s" }} />
      <span className="ait-dot" style={{ animationDelay: "0.3s" }} />
    </div>
  );
}

/* ─── Message bubble ─── */
function Message({ role, text }: { role: "user" | "assistant"; text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 25, mass: 0.6 }}
      className={`ait-msg ${role === "user" ? "ait-msg-user" : "ait-msg-ai"}`}
    >
      <div className="ait-msg-content">
        {role === "assistant" && <span className="ait-msg-icon">✦</span>}
        <span>{text}</span>
      </div>
    </motion.div>
  );
}

/* ─── Main section ─── */
export default function AiTwinSection() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const welcomeMessage = "Hi, I'm Afsar's AI Twin.\n\nI can answer questions about my projects, skills, experience, development process, AI systems, product thinking, and future goals.\n\nAsk anything.";

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    setMessages(prev => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setIsTyping(true);
    setShowPrompts(false);

    // Simulate thinking delay based on response length
    const response = findResponse(trimmed);
    const delay = Math.max(800, Math.min(2500, response.length * 6));

    await new Promise(r => setTimeout(r, delay));

    setMessages(prev => [...prev, { role: "assistant", text: response }]);
    setIsTyping(false);
  };

  const handlePromptClick = (prompt: string) => {
    inputRef.current?.focus();
    handleSend(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  // Mouse-reactive glow on container
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!glowRef.current) return;
    const r = glowRef.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    glowRef.current.style.setProperty("--glow-x", `${x}%`);
    glowRef.current.style.setProperty("--glow-y", `${y}%`);
  };

  return (
    <section className="ait-section" id="ai-twin">
      {/* Aurora gradient blobs */}
      <div className="ait-aurora" />
      <div className="ait-aurora ait-aurora--b" />
      <div className="ait-aurora ait-aurora--c" />

      {/* Noise texture overlay */}
      <div className="ait-noise" />

      {/* Floating ambient blobs */}
      <div className="ait-blob ait-blob--1" />
      <div className="ait-blob ait-blob--2" />
      <div className="ait-blob ait-blob--3" />

      <div className="ait-inner">
        {/* Heading */}
        <motion.h2
          className="ait-heading"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          {"MEET MY AI TWIN".split("").map((char, i) => (
            <motion.span
              key={i}
              className="ait-heading-char"
              initial={{ opacity: 0, y: 30, rotateX: -60 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.025, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          className="ait-subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Ask me anything about my projects, experience, AI, web development, startups, design decisions, or how I build products.
        </motion.p>

        {/* Tagline */}
        <motion.p
          className="ait-tagline"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          Not just a portfolio. A conversation.
        </motion.p>

        {/* Chat container with mouse-reactive glow */}
        <motion.div
          ref={glowRef}
          className="ait-glass"
          onMouseMove={handleMouseMove}
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: 0.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Mouse glow follower */}
          <div className="ait-glow-follower" />

          {/* Messages area */}
          <div className="ait-chat">
            {messages.length === 0 && !isTyping ? (
              <motion.div
                className="ait-welcome"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <div className="ait-welcome-icon">◆</div>
                <p className="ait-welcome-text">{welcomeMessage}</p>
              </motion.div>
            ) : (
              <div className="ait-msgs">
                <AnimatePresence initial={false}>
                  {messages.map((msg, i) => (
                    <Message key={i} role={msg.role} text={msg.text} />
                  ))}
                </AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="ait-msg ait-msg-ai"
                  >
                    <div className="ait-msg-content">
                      <span className="ait-msg-icon">✦</span>
                      <TypingDots />
                    </div>
                  </motion.div>
                )}
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Suggested prompts */}
          <AnimatePresence>
            {showPrompts && messages.length === 0 && (
              <motion.div
                className="ait-prompts"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="ait-prompts-inner">
                  {SUGGESTED_PROMPTS.slice(0, 5).map((prompt, i) => (
                    <motion.button
                      key={prompt}
                      className="ait-chip"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ delay: 0.9 + i * 0.04, duration: 0.35 }}
                      onClick={() => handlePromptClick(prompt)}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {prompt}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input area */}
          <div className="ait-input-row">
            <input
              ref={inputRef}
              className="ait-input"
              type="text"
              placeholder="Ask my AI Twin anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
            />
            <motion.button
              className="ait-send"
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isTyping}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
