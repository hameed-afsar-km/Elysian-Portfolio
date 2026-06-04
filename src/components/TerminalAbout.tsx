"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

type LineType = "command" | "output" | "loading" | "success" | "empty";

interface TerminalLineData {
  text: string;
  type: LineType;
}

const lines: TerminalLineData[] = [
  { text: "visitor@portfolio:~$ initialize", type: "command" },
  { text: "", type: "empty" },
  { text: "Loading ideas...", type: "loading" },
  { text: "Loading projects...", type: "loading" },
  { text: "Loading ambition...", type: "loading" },
  { text: "", type: "empty" },
  { text: "Ready.", type: "success" },
  { text: "visitor@portfolio:~$ whoami", type: "command" },
  { text: "Hameed Afsar K M", type: "output" },
  { text: "", type: "empty" },
  { text: "AI Engineer", type: "output" },
  { text: "Builder", type: "output" },
  { text: "", type: "empty" },
  { text: "Currently creating intelligent systems,", type: "output" },
  { text: "", type: "empty" },
  { text: "digital products, and ambitious ideas.", type: "output" },
];

const totalLines = lines.length;

const promptPrefix = "visitor@portfolio:~$ ";

function TerminalLine({
  line,
  index,
  progress,
}: {
  line: TerminalLineData;
  index: number;
  progress: MotionValue<number>;
}) {
  const threshold = index / totalLines;
  const nextThreshold = (index + 1) / totalLines;

  const lineProgress = useTransform(progress, [threshold, nextThreshold], [0, 1]);
  const opacity = useTransform(lineProgress, [0, 0.3], [0, 1]);
  const y = useTransform(lineProgress, [0, 1], [8, 0]);

  if (line.type === "empty") {
    return (
      <motion.div
        style={{ opacity, y }}
        className="terminal-empty-line"
      />
    );
  }

  return (
    <motion.div
      style={{ opacity, y }}
      className="terminal-line"
    >
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
    </motion.div>
  );
}

export function TerminalAbout({ progress }: { progress: MotionValue<number> }) {
  const showCursor = useTransform(progress, [0.97, 1], [0, 1]);
  const cursorOpacity = useTransform(showCursor, [0, 1], [0, 1]);

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
          {lines.map((line, i) => (
            <TerminalLine
              key={i}
              line={line}
              index={i}
              progress={progress}
            />
          ))}
          <motion.span
            style={{ opacity: cursorOpacity }}
            className="terminal-cursor"
          >
            _
          </motion.span>
        </div>
      </div>
    </div>
  );
}
