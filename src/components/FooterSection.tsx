"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import ParticleBackgroundMono from "@/components/ParticleBackgroundMono";

const SOCIAL_LINKS = [
  { label: "GITHUB", href: "https://github.com/hameed-afsar-km" },
  { label: "LINKEDIN", href: "https://linkedin.com/in/hameedafsar-km" },
  { label: "EMAIL", href: "mailto:hameedafsar2006@gmail.com" },
  { label: "PHONE", href: "tel:+919489475038" },
];

function SocialLink({ label, href }: { label: string; href: string }) {
  return (
    <motion.a
      href={href}
      target={href.startsWith("mailto") || href.startsWith("tel") ? undefined : "_blank"}
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

function HoverTypewriter({ text, active }: { text: string; active: boolean }) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    if (!active) {
      setDisplay("");
      return;
    }

    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplay(text.slice(0, i));
      if (i >= text.length) clearInterval(timer);
    }, 50);

    return () => clearInterval(timer);
  }, [active, text]);

  return <span>{display}</span>;
}

const CHARS = "!@#$%^&*()_+-=[]{}|;':\",./<>?~`ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function ScrambleText({ texts, interval = 50, active = true }: { texts: string[]; interval?: number; active?: boolean }) {
  const [display, setDisplay] = useState(texts[0]);
  const textIdxRef = useRef(0);
  const phaseRef = useRef<"scramble" | "resolve" | "pause">("scramble");
  const idxRef = useRef(0);

  useEffect(() => {
    if (!active) {
      setDisplay(texts[0]);
      return;
    }

    const target = texts[textIdxRef.current % texts.length];

    const timer = setInterval(() => {
      const phase = phaseRef.current;

      if (phase === "scramble") {
        idxRef.current++;
        if (idxRef.current >= 15) {
          phaseRef.current = "resolve";
          idxRef.current = 0;
        }
        setDisplay(
          target
            .split("")
            .map((ch) =>
              Math.random() > 0.3
                ? CHARS[Math.floor(Math.random() * CHARS.length)]
                : ch
            )
            .join("")
        );
      } else if (phase === "resolve") {
        idxRef.current++;
        const progress = Math.min(idxRef.current / target.length, 1);
        const resolved = Math.floor(progress * target.length);
        setDisplay(
          target
            .split("")
            .map((ch, i) =>
              i < resolved ? ch : CHARS[Math.floor(Math.random() * CHARS.length)]
            )
            .join("")
        );
        if (idxRef.current >= target.length) {
          phaseRef.current = "pause";
          idxRef.current = 0;
        }
      } else {
        idxRef.current++;
        setDisplay(target);
        if (idxRef.current >= 40) {
          textIdxRef.current++;
          phaseRef.current = "scramble";
          idxRef.current = 0;
        }
      }
    }, interval);
    return () => clearInterval(timer);
  }, [texts, interval, active]);

  return <span>{display}</span>;
}

function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [result, setResult] = useState("");

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult("Sending...");
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    formData.append("access_key", "a1b91d65-c5d3-4bcb-b718-c2e5a0757f47");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    if (data.success) {
      setResult("Form Submitted Successfully");
      form.reset();
      setTimeout(() => { setResult(""); onClose(); }, 2000);
    } else {
      setResult("Error. Please try again.");
    }
  };

  if (!open) return null;

  return (
    <div className="ftr-modal-overlay" onClick={onClose}>
      <div className="ftr-modal" onClick={(e) => e.stopPropagation()}>
        <button className="ftr-modal-close" onClick={onClose}>×</button>
        <h3 className="ftr-modal-title">
          {'SAY'.split('').map((char, i) => (
            <span key={i} className="ftr-title-char" style={{ animationDelay: `${i * 0.08}s` }}>{char}</span>
          ))}{' '}
          <span className="ftr-modal-title-white">
            {'HELLO'.split('').map((char, i) => (
              <span key={i} className="ftr-title-char" style={{ animationDelay: `${(i + 4) * 0.08}s` }}>{char}</span>
            ))}
          </span>
        </h3>
        <form onSubmit={handleSubmit} className="ftr-modal-form">
          <input name="name" type="text" placeholder="Your Name" required className="ftr-modal-input" />
          <input name="email" type="email" placeholder="Your Email" required className="ftr-modal-input" />
          <textarea name="message" placeholder="Your Message" required rows={5} className="ftr-modal-input ftr-modal-textarea" />
          <button type="submit" className="ftr-modal-submit"><span>SEND MESSAGE</span></button>
          {result && <span className="ftr-modal-result">{result}</span>}
        </form>
      </div>
    </div>
  );
}

export default function FooterSection() {
  const [timeStr, setTimeStr] = useState("");
  const [contactOpen, setContactOpen] = useState(false);
  const [scrambleHover, setScrambleHover] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLSpanElement>(null);
  const ctaInView = useInView(ctaRef, { once: true });

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
      {/* Particle background matching terminal/about section */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <ParticleBackgroundMono />
      </div>

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
            ref={ctaRef}
            className="ftr-cta-tag"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <ScrambleText texts={["OPEN TO OPPORTUNITIES", "AVAILABLE FOR WORK", "LET'S COLLABORATE", "HIRE ME"]} interval={40} active={ctaInView} />
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

          <div className="ftr-actions">
            <motion.div
              className="ftr-email-btn"
              onClick={() => setContactOpen(true)}
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
                <HoverTypewriter text="BUILD SOMETHING GREAT" active={scrambleHover} />
              </span>
              <span className="ftr-email-icon">→</span>
            </motion.div>
          </div>
        </div>

        <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />

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
            <span className="ftr-brand-role">ENGINEER <span className="ftr-role-x">×</span> DESIGNER <span className="ftr-role-x">×</span> BUILDER</span>
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
