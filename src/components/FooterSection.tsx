"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const SOCIAL_LINKS = [
  { label: "GITHUB", href: "https://github.com/hameed-afsar-km" },
  { label: "LINKEDIN", href: "https://linkedin.com/in/hameed-afsar-km" },
  { label: "EMAIL", href: "mailto:hameedafsar.km@gmail.com" },
];

function SocialLink({ label, href }: { label: string; href: string }) {
  return (
    <motion.a
      href={href}
      target={href.startsWith("mailto") ? undefined : "_blank"}
      rel="noopener noreferrer"
      className="ftr-social"
      whileHover="hover"
      initial="rest"
    >
      <motion.span
        className="ftr-social-track"
        variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
        transition={{ duration: 0.3 }}
      />
      <span className="ftr-social-label">{label}</span>
      <motion.span
        className="ftr-social-arrow"
        variants={{ rest: { x: 0, opacity: 0 }, hover: { x: 6, opacity: 1 } }}
        transition={{ duration: 0.25 }}
      >↗</motion.span>
    </motion.a>
  );
}

const SCRAMBLE_CHARS = "!@#$%^&*<>?/+=";

function ScrambleText({ text, active }: { text: string; active: boolean }) {
  const [display, setDisplay] = useState(text);
  const frameRef = useRef(0);

  useEffect(() => {
    if (!active) {
      setDisplay(text);
      return;
    }

    frameRef.current = 0;
    const totalFrames = 12;

    const timer = setInterval(() => {
      frameRef.current++;
      if (frameRef.current >= totalFrames) {
        clearInterval(timer);
        setDisplay(text);
        return;
      }
      setDisplay(
        text
          .split("")
          .map((c) => (c === " " ? " " : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]))
          .join("")
      );
    }, 50);

    return () => clearInterval(timer);
  }, [active, text]);

  return <span>{display}</span>;
}

export default function FooterSection() {
  const [timeStr, setTimeStr] = useState("");
  const [scrambleHover, setScrambleHover] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax for heading
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const headY = useSpring(useTransform(scrollYProgress, [0, 1], [60, -60]), { stiffness: 60, damping: 20 });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const off = now.getTimezoneOffset();
      const sign = off > 0 ? "-" : "+";
      const h = String(Math.floor(Math.abs(off) / 60)).padStart(2, "0");
      const m = String(Math.abs(off) % 60).padStart(2, "0");
      setTimeStr(`${now.toLocaleTimeString("en-US", { hour12: false })} GMT${sign}${h}:${m}`);
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <section ref={sectionRef} className="ftr-section" id="contact">
      {/* Giant outlined marquee backdrop */}
      <div className="ftr-marquee-wrap" aria-hidden>
        <div className="ftr-marquee">
          <span>LET'S BUILD • COLLABORATE • CREATE • INNOVATE • LET'S BUILD • COLLABORATE • CREATE • INNOVATE • </span>
        </div>
      </div>

      <div className="ftr-inner">
        {/* ── CTA Block ── */}
        <div className="ftr-cta">
          <motion.span
            className="ftr-cta-tag"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            OPEN TO OPPORTUNITIES
          </motion.span>

          <div className="ftr-heading-wrap" style={{ overflow: "hidden" }}>
            <motion.h2
              className="ftr-heading"
              style={{ y: headY }}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="ftr-heading-solid">SAY</span>
              <span className="ftr-heading-outline">HELLO.</span>
            </motion.h2>
          </div>

          <motion.div
            className="ftr-email-btn"
            onMouseEnter={() => setScrambleHover(true)}
            onMouseLeave={() => setScrambleHover(false)}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="ftr-email-bg" />
            <span className="ftr-email-text">
              <ScrambleText text="BUILD SOMETHING GREAT" active={scrambleHover} />
            </span>
            <span className="ftr-email-icon">→</span>
          </motion.div>
        </div>

        {/* ── Divider with crosshair ornaments ── */}
        <div className="ftr-divider">
          <span className="ftr-divider-cross ftr-divider-cross--l" />
          <div className="ftr-divider-line" />
          <span className="ftr-divider-cross ftr-divider-cross--r" />
        </div>

        {/* ── Bottom bar ── */}
        <div className="ftr-bottom">
          {/* Brand */}
          <motion.div
            className="ftr-brand"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="ftr-brand-name">HAMEED AFSAR KM</span>
            <span className="ftr-brand-role">ENGINEER × DESIGNER × BUILDER</span>
            <span className="ftr-copy">
              © {new Date().getFullYear()} — ALL RIGHTS RESERVED
            </span>
          </motion.div>

          {/* Live clock status */}
          <motion.div
            className="ftr-clock-box"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            <span className="ftr-clock-dot" />
            <span className="ftr-clock-val">{timeStr}</span>
          </motion.div>

          {/* Social links + Back to top */}
          <motion.div
            className="ftr-right-col"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <div className="ftr-socials">
              {SOCIAL_LINKS.map((s) => (
                <SocialLink key={s.label} {...s} />
              ))}
            </div>

            <motion.button
              className="ftr-top-btn"
              onClick={scrollToTop}
              whileHover={{ y: -4, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="ftr-top-arrow">↑</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
