"use client";

import { useState } from "react";
import { MotionValue, useMotionValueEvent } from "framer-motion";

type LineType = "command" | "output" | "loading" | "success" | "empty";

interface TerminalLineData {
  text: string;
  type: LineType;
}

const lines: TerminalLineData[] = [
  { text: "visitor@portfolio:~$ whoami", type: "command" },
  { text: "", type: "empty" },
  { text: "Hameed Afsar KM", type: "output" },
  { text: "", type: "empty" },
  { text: "visitor@portfolio:~$ about", type: "command" },
  { text: "", type: "empty" },
  { text: "Started with curiosity.", type: "output" },
  { text: "Stayed for the challenge.", type: "output" },
  { text: "", type: "empty" },
  { text: "Now building products,", type: "output" },
  { text: "systems, and experiences.", type: "output" },
  { text: "", type: "empty" },
  { text: "visitor@portfolio:~$ focus", type: "command" },
  { text: "", type: "empty" },
  { text: "AI \u2022 Automation \u2022 Startups", type: "output" },
  { text: "", type: "empty" },
  { text: "visitor@portfolio:~$ ", type: "command" },
];

const promptPrefix = "visitor@portfolio:~$ ";

function TerminalLine({ line, visible, exiting }: { line: TerminalLineData; visible: boolean; exiting: boolean }) {
  const content = (() => {
    if (line.type === "empty") {
      return null;
    }
    return (
      <>
        {line.type === "command" && (
          <>
            <span className="terminal-prompt">
              <span className="tp-user">visitor</span>
              <span className="tp-at">@</span>
              <span className="tp-host">portfolio</span>
              <span className="tp-colon">:</span>
              <span className="tp-path">~</span>
              <span className="tp-dollar">$</span>
            </span>
            <span className="terminal-cmd-text">
              {line.text.replace(promptPrefix, "")}
            </span>
          </>
        )}
        {line.type === "loading" && (
          <>
            <span className="terminal-spinner">&#x27F3;</span>
            <span className="terminal-loading-text"> {line.text}</span>
          </>
        )}
        {line.type === "success" && (
          <>
            <span className="terminal-checkmark">&#x2713;</span>
            <span className="terminal-success-text"> {line.text}</span>
          </>
        )}
        {line.type === "output" && (
          <span className="terminal-output-text">{line.text}</span>
        )}
      </>
    );
  })();

  return (
    <div
      className={line.type === "empty" ? "terminal-empty-line" : "terminal-line"}
      style={{
        opacity: visible ? (exiting ? 0 : 1) : 0,
        transform: visible
          ? exiting
            ? "translateY(-12px) scale(0.95)"
            : "translateY(0)"
          : "translateY(6px)",
        filter: visible && exiting ? "blur(4px)" : "none",
        transition: "opacity 0.4s ease, transform 0.4s ease, filter 0.4s ease",
      }}
    >
      {content}
    </div>
  );
}

export function TerminalAbout({ progress, exitProgress }: { progress: MotionValue<number>; exitProgress: MotionValue<number> }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [exitAmount, setExitAmount] = useState(0);

  useMotionValueEvent(progress, "change", (latest) => {
    setVisibleCount(Math.min(Math.floor(latest * lines.length), lines.length));
  });

  useMotionValueEvent(exitProgress, "change", (latest) => {
    setExitAmount(latest);
  });

  return (
    <div className="terminal-wrap">
      <div className="terminal-window">
        <div className="terminal-titlebar">
          <div className="terminal-dots">
            <span className="dot dot-red" />
            <span className="dot dot-yellow" />
            <span className="dot dot-green" />
          </div>
          <span className="terminal-titlebar-text">
            visitor@portfolio:~/about
          </span>
          <div className="terminal-titlebar-spacer" />
        </div>
        <div className="terminal-body">
          {lines.map((line, i) => {
            const exitThreshold = (lines.length - i) / lines.length;
            const exiting = exitAmount > exitThreshold;
            return (
              <TerminalLine key={i} line={line} visible={i < visibleCount} exiting={exiting} />
            );
          })}
          {visibleCount >= lines.length && exitAmount < 0.5 && <span className="terminal-cursor">_</span>}
        </div>
      </div>
    </div>
  );
}
