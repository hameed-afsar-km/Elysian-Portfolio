"use client";

import React, { useState } from "react";
import { Check, Copy, ExternalLink, Terminal } from "lucide-react";

type Block =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; text: string }
  | { type: "code"; language: string; code: string }
  | { type: "quote"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "hr" };

function parseBlocks(markdown: string): Block[] {
  const lines = markdown.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced Code Block
    if (line.trim().startsWith("```")) {
      const language = line.trim().slice(3).trim() || "text";
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      blocks.push({ type: "code", language, code: codeLines.join("\n") });
      continue;
    }

    // Horizontal Rule
    if (/^(\*{3,}|-{3,}|_{3,})$/.test(line.trim())) {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    // Headings (###, ##, #)
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({
        type: "heading",
        level: headingMatch[1].length,
        text: headingMatch[2].trim(),
      });
      i++;
      continue;
    }

    // Blockquote
    if (line.trim().startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      blocks.push({ type: "quote", text: quoteLines.join("\n") });
      continue;
    }

    // Unordered List (- item, * item, • item, + item)
    if (/^\s*[-*•+]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*•+]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*•+]\s+/, "").trim());
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    // Ordered List (1. item, 2. item)
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, "").trim());
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    // Empty lines
    if (!line.trim()) {
      i++;
      continue;
    }

    // Regular paragraph (group contiguous non-empty lines)
    const pLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith("```") &&
      !lines[i].trim().startsWith(">") &&
      !/^(#{1,6})\s+/.test(lines[i]) &&
      !/^\s*[-*•+]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !/^(\*{3,}|-{3,}|_{3,})$/.test(lines[i].trim())
    ) {
      pLines.push(lines[i].trim());
      i++;
    }

    if (pLines.length > 0) {
      blocks.push({ type: "paragraph", text: pLines.join(" ") });
    }
  }

  return blocks;
}

function renderInline(text: string): React.ReactNode[] {
  // Regex to match inline tokens:
  // 1. Inline code: `code`
  // 2. Bold: **bold** or __bold__
  // 3. Italic: *italic* or _italic_
  // 4. Markdown links: [label](url)
  // 5. Raw URLs: https://...
  const tokenRegex =
    /(`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|(?<!\*)\*[^*]+\*(?!\*)|(?<!_)_[^_]+_(?!_)|\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s<)]+)/g;

  const parts = text.split(tokenRegex);
  const elements: React.ReactNode[] = [];

  parts.forEach((part, index) => {
    if (!part) return;

    // Inline code
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      elements.push(
        <code key={index} className="ait-md-code-inline">
          {part.slice(1, -1)}
        </code>
      );
      return;
    }

    // Bold (**text** or __text__)
    if (
      (part.startsWith("**") && part.endsWith("**") && part.length >= 4) ||
      (part.startsWith("__") && part.endsWith("__") && part.length >= 4)
    ) {
      elements.push(
        <strong key={index} className="ait-md-strong">
          {renderInline(part.slice(2, -2))}
        </strong>
      );
      return;
    }

    // Italic (*text* or _text_)
    if (
      (part.startsWith("*") && part.endsWith("*") && part.length >= 2) ||
      (part.startsWith("_") && part.endsWith("_") && part.length >= 2)
    ) {
      elements.push(
        <em key={index} className="ait-md-em">
          {renderInline(part.slice(1, -1))}
        </em>
      );
      return;
    }

    // Markdown Link: [label](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, url] = linkMatch;
      elements.push(
        <a
          key={index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="ait-md-link"
        >
          <span>{label}</span>
          <ExternalLink size={10} className="inline-block shrink-0" />
        </a>
      );
      return;
    }

    // Raw URL: https://...
    if (/^https?:\/\//.test(part)) {
      elements.push(
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="ait-md-link"
        >
          <span>{part.replace(/^https?:\/\/(www\.)?/, "")}</span>
          <ExternalLink size={10} className="inline-block shrink-0" />
        </a>
      );
      return;
    }

    // Plain text
    elements.push(part);
  });

  return elements;
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="ait-md-code-block">
      <div className="ait-md-code-header">
        <div className="flex items-center gap-1.5 font-mono">
          <Terminal size={11} />
          <span>{language.toUpperCase()}</span>
        </div>
        <button
          onClick={handleCopy}
          className="ait-md-copy-btn"
          title="Copy code"
          type="button"
        >
          {copied ? (
            <>
              <Check size={10} className="text-green-400" />
              <span>COPIED</span>
            </>
          ) : (
            <>
              <Copy size={10} />
              <span>COPY</span>
            </>
          )}
        </button>
      </div>
      <pre className="ait-md-code-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function RenderBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "heading": {
      return (
        <h4 className="ait-md-h" data-level={block.level}>
          {renderInline(block.text)}
        </h4>
      );
    }
    case "paragraph": {
      return <p className="ait-md-p">{renderInline(block.text)}</p>;
    }
    case "code": {
      return <CodeBlock language={block.language} code={block.code} />;
    }
    case "quote": {
      return (
        <blockquote className="ait-md-quote">
          {renderInline(block.text)}
        </blockquote>
      );
    }
    case "ul": {
      return (
        <ul className="ait-md-ul">
          {block.items.map((item, i) => (
            <li key={i} className="ait-md-li">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
    }
    case "ol": {
      return (
        <ol className="ait-md-ol">
          {block.items.map((item, i) => (
            <li key={i} className="ait-md-ol-li">
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );
    }
    case "hr": {
      return <hr className="ait-md-hr" />;
    }
    default:
      return null;
  }
}

export function AiTwinMarkdown({ content }: { content: string }) {
  const blocks = parseBlocks(content);

  return (
    <div className="ait-md">
      {blocks.map((block, idx) => (
        <RenderBlock key={idx} block={block} />
      ))}
    </div>
  );
}
