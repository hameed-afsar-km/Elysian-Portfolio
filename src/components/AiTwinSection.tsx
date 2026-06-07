"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SUGGESTED_PROMPTS,
  WELCOME_MESSAGE,
  findResponse,
} from "@/data/aiTwinData";

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
                <p className="ait-welcome-text">{WELCOME_MESSAGE}</p>
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
