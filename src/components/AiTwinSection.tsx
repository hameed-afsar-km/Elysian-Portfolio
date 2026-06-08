"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SUGGESTED_PROMPTS,
  WELCOME_MESSAGE,
  findResponse,
} from "@/data/aiTwinData";
import AiTwinBackground from "@/components/AiTwinBackground";

const SHUFFLE_CHARS = "!@#$%^&*<>?/;:ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const rng = () => SHUFFLE_CHARS[Math.floor(Math.random() * SHUFFLE_CHARS.length)];

function useTypewriterLine(text: string): string {
  const [display, setDisplay] = useState("");
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting">("typing");

  useEffect(() => {
    if (phase === "typing") {
      if (display.length < text.length) {
        const t = setTimeout(() => setDisplay(text.slice(0, display.length + 1)), 25);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("holding"), 2000);
      return () => clearTimeout(t);
    }

    if (phase === "holding") {
      const t = setTimeout(() => setPhase("deleting"), 3000);
      return () => clearTimeout(t);
    }

    if (phase === "deleting") {
      if (display.length > 0) {
        const t = setTimeout(() => setDisplay(display.slice(0, -1)), 15);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => {
        setDisplay("");
        setPhase("typing");
      }, 500);
      return () => clearTimeout(t);
    }
  }, [phase, display, text]);

  return display;
}

function usePixelShuffle(target: string): [string, number] {
  const [display, setDisplay] = useState(target);
  const [locked, setLocked] = useState(target.length);
  const [phase, setPhase] = useState<"shuffle" | "done">("done");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) return;
    setMounted(true);
    setDisplay(target.split("").map(() => rng()).join(""));
    setLocked(0);
    setPhase("shuffle");
  }, [target, mounted]);

  useEffect(() => {
    if (!mounted) return;
    if (phase === "shuffle") {
      if (locked >= target.length) {
        const t = setTimeout(() => setPhase("done"), 1500);
        return () => clearTimeout(t);
      }

      const interval = setInterval(() => {
        setDisplay(prev =>
          prev.split("").map((c, i) => (i < locked ? target[i] : rng())).join("")
        );
      }, 50);

      const lockTimer = setTimeout(() => {
        setLocked(l => l + 1);
      }, 150 + Math.random() * 400);

      return () => {
        clearInterval(interval);
        clearTimeout(lockTimer);
      };
    }

    if (phase === "done") {
      const t = setTimeout(() => {
        setDisplay(target.split("").map(() => rng()).join(""));
        setLocked(0);
        setPhase("shuffle");
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [phase, locked, target, mounted]);

  const progress = phase === "shuffle" ? (locked / target.length) * 100 : 100;
  return [display, progress];
}

function TypingDots() {
  return (
    <span className="ait-t">
      <span className="ait-td" />
      <span className="ait-td" style={{ animationDelay: "0.2s" }} />
      <span className="ait-td" style={{ animationDelay: "0.4s" }} />
    </span>
  );
}

function Message({ role, text, time }: { role: "user" | "assistant"; text: string; time: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: role === "user" ? 12 : -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.15 }}
      className={`ait-m ${role === "user" ? "ait-m-u" : "ait-m-a"}`}
    >
      <div className={`ait-mb ${role === "user" ? "ait-mb-u" : "ait-mb-a"}`}>
        <p>{text}</p>
        <span className="ait-mt">{time}</span>
      </div>
    </motion.div>
  );
}

export default function AiTwinSection() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string; time: string }[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chat = chatRef.current;
    if (!chat) return;
    chat.scrollTop = chat.scrollHeight;
  }, [messages, isTyping]);

  useEffect(() => {
    const box = boxRef.current;
    const chat = chatRef.current;
    if (!box || !chat) return;

    const handler = (e: WheelEvent) => {
      e.stopPropagation();
    };
    chat.addEventListener("wheel", handler, { passive: false });

    const ro = new ResizeObserver(() => {
      chat.style.maxHeight = "";
      const avail = box.clientHeight - (box.querySelector<HTMLElement>(".ait-box-h")?.offsetHeight ?? 0) - (box.querySelector<HTMLElement>(".ait-box-in")?.offsetHeight ?? 0);
      chat.style.maxHeight = avail + "px";
    });
    ro.observe(box);

    return () => {
      chat.removeEventListener("wheel", handler);
      ro.disconnect();
    };
  }, []);

  const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const [loadingText, loadProgress] = usePixelShuffle("LOADING…");
  const taglineText = useTypewriterLine("Not just a portfolio. A conversation.");

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    setMessages(prev => [...prev, { role: "user", text: trimmed, time: now() }]);
    setInput("");
    setIsTyping(true);
    setShowPrompts(false);

    const response = findResponse(trimmed);
    const delay = Math.max(800, Math.min(2500, response.length * 6));

    await new Promise(r => setTimeout(r, delay));

    setMessages(prev => [...prev, { role: "assistant", text: response, time: now() }]);
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

  return (
    <section className="ait-s" id="ai-twin">
      <AiTwinBackground />
      <div className="ait-inner">
        <motion.h2
          className="ait-h"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4 }}
        >
          {"ASK".split("").map((char, i) => (
            <motion.span
              key={i}
              className="ait-hc"
              initial={{ opacity: 0, y: 80, scale: 0.3 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.5, ease: [0.17, 0.67, 0.29, 1] }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h2>

        <motion.p
          className="ait-sub"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          I build. You ask. Let's talk.
        </motion.p>

        <motion.p
          className="ait-tag"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          {taglineText}
        </motion.p>

        <div
          className="ait-box"
          ref={boxRef}
        >
          {/* Header */}
          <div className="ait-box-h">
            <div className="ait-av">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M12 2a4 4 0 014 4c0 2-2 3-4 5-2-2-4-3-4-5a4 4 0 014-4z" />
                <path d="M4 22v-2a4 4 0 014-4h8a4 4 0 014 4v2" />
              </svg>
            </div>
            <div className="ait-box-hi">
              <span className="ait-box-hn">AI_Twin</span>
              <span className="ait-box-hs">
                <span className="ait-box-hsd">
                  <span /><span /><span />
                </span>
                ONLINE
              </span>
            </div>
          </div>

          {/* Chat */}
          <div ref={chatRef} className="ait-box-c" style={{ overflow: messages.length === 0 && !isTyping ? "hidden" : undefined }}>
            <div className="ait-box-cs">
              {messages.length === 0 && !isTyping ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="ait-box-w"
                >
                  <div className="ait-box-wi">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                  </div>
                  <p className="ait-box-wt">{WELCOME_MESSAGE}</p>
                  <div className="ait-box-loading">
                    <span className="ait-box-loading-text">{loadingText}</span>
                    <div className="ait-box-loading-bar">
                      <div className="ait-box-loading-fill" style={{ width: `${loadProgress}%` }} />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="ait-box-ms">
                  <AnimatePresence initial={false}>
                    {messages.map((msg, i) => (
                      <Message key={i} role={msg.role} text={msg.text} time={msg.time} />
                    ))}
                  </AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="ait-m ait-m-a"
                    >
                      <div className="ait-mb ait-mb-a">
                        <TypingDots />
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Suggested */}
          <AnimatePresence>
            {showPrompts && messages.length === 0 && (
              <motion.div
                className="ait-box-p"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="ait-box-pi">
                  {SUGGESTED_PROMPTS.slice(0, 4).map((prompt, i) => (
                    <motion.button
                      key={prompt}
                      className="ait-box-pb"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ delay: 0.9 + i * 0.04, duration: 0.3 }}
                      onClick={() => handlePromptClick(prompt)}
                    >
                      {prompt}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input */}
          <div className="ait-box-in">
            <input
              ref={inputRef}
              className="ait-box-ii"
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
            />
            <motion.button
              className="ait-box-is"
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isTyping}
              whileTap={{ scale: 0.85 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
