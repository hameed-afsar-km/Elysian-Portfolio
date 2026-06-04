"use client";

import { useState, useEffect } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { scrollYProgress } = useScroll();
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
