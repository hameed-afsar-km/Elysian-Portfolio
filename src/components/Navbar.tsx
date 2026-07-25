"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

const WORDS = ["HAMEED", "AFSAR", "KM"];

export default function Navbar() {
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pathname === "/projects") return;
    if (!navRef.current) return;

    const el = navRef.current;
    const scrollContainer = document.querySelector("[data-scroll-container]");
    if (!scrollContainer) return;

    const update = () => {
      const rect = scrollContainer.getBoundingClientRect();
      const scrollRange = window.innerHeight * 3;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / scrollRange));

      const progress = p / 0.05;
      const clamped = Math.min(1, progress);

      gsap.set(el, {
        scale: 1 + clamped * 1.5,
        y: clamped * -350,
        opacity: 1 - clamped,
      });
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  if (pathname === "/projects") return null;

  let charIdx = 0;

  return (
    <div
      ref={navRef}
      className="fixed top-0 left-0 w-full flex items-center justify-center pointer-events-none z-[9997]"
    >
      <h1 className="navbar-name">
        {WORDS.map((word, wi) => (
          <span key={wi} className="navbar-word">
            {word.split("").map((char, ci) => {
              const idx = charIdx++;
              return (
                <span
                  key={ci}
                  className="inline-block navbar-char"
                  style={{ "--char-idx": idx } as React.CSSProperties}
                >
                  {char}
                </span>
              );
            })}
          </span>
        ))}
      </h1>
    </div>
  );
}
