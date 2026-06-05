"use client";

import { useState, useCallback } from "react";
import { useTransform, motion, useMotionValue } from "framer-motion";
import type Lenis from "lenis";
import { useLenis } from "lenis/react";

const LEFT_ITEMS = [
  { id: "home", label: "Home", href: "/" },
  { id: "about", label: "About", href: "#about" },
];

const RIGHT_ITEMS = [
  { id: "work", label: "Work", href: "#work" },
  { id: "contact", label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [activeId, setActiveId] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const scrollYProgress = useMotionValue(0);

  useLenis(
    useCallback((lenis: Lenis) => {
      setScrolled(lenis.scroll > 20);
      const p = lenis.limit > 0 ? lenis.scroll / lenis.limit : 0;
      scrollYProgress.set(p);
    }, [])
  );

  const navY = useTransform(scrollYProgress, [0.25, 0.32], [0, -120]);
  const navPointerEvents = useTransform(scrollYProgress, (v) => (v >= 0.32 ? "none" : "auto"));

  const handleLinkClick = (id: string, href: string, e: React.MouseEvent) => {
    if (href === "/") e.preventDefault();
    setActiveId(id);
  };

  const renderLink = (item: { id: string; label: string; href: string }) => (
    <a
      key={item.id}
      href={item.href}
      className={`hud-link-item ${activeId === item.id ? "active" : ""}`}
      onClick={(e) => handleLinkClick(item.id, item.href, e)}
    >
      <span className="hud-link-label">{item.label}</span>
    </a>
  );

  return (
    <motion.nav
      style={{ x: "-50%", y: navY, pointerEvents: navPointerEvents }}
      className={`hud-nav-wrap ${scrolled ? "scrolled" : ""}`}>
      <div className="hud-nav-container">
        <div className="hud-section hud-section-left">
          {LEFT_ITEMS.map(renderLink)}
        </div>
        <div className="hud-section hud-section-center">
          <span className="hud-brand-prefix">//</span>
          <span className="hud-brand-text">AFSAR</span>
        </div>
        <div className="hud-section hud-section-right">
          {RIGHT_ITEMS.map(renderLink)}
        </div>
      </div>
    </motion.nav>
  );
}
