"use client";

import { useCallback } from "react";
import { usePathname } from "next/navigation";
import { useTransform, motion, useMotionValue, useSpring } from "framer-motion";
import type Lenis from "lenis";
import { useLenis } from "lenis/react";

const WORDS = ["HAMEED", "AFSAR", "KM"];

export default function Navbar() {
  const pathname = usePathname();
  const scrollYProgress = useMotionValue(0);

  useLenis(
    useCallback((l: Lenis) => {
      const p = l.limit > 0 ? l.scroll / l.limit : 0;
      scrollYProgress.set(Math.max(0, Math.min(1, p)));
    }, [])
  );

  const rawScale = useTransform(scrollYProgress, [0, 0.04], [1, 10]);
  const rawY = useTransform(scrollYProgress, [0, 0.04], [0, -800]);
  const rawOpacity = useTransform(scrollYProgress, [0, 0.025, 0.04], [1, 1, 0]);
  const scale = useSpring(rawScale, { stiffness: 200, damping: 30, restDelta: 0.001 });
  const y = useSpring(rawY, { stiffness: 200, damping: 30, restDelta: 0.001 });
  const opacity = useSpring(rawOpacity, { stiffness: 250, damping: 35, restDelta: 0.001 });

  if (pathname === "/projects") return null;

  return (
    <motion.div
      style={{ y, scale, opacity }}
      className="fixed top-0 left-0 w-full flex items-center justify-center pointer-events-none z-[9997]"
    >
      <h1 className="navbar-name">
        {(() => {
          let charIdx = 0;
          return WORDS.map((word, wi) => (
            <span key={wi} className="navbar-word">
              {word.split("").map((char, ci) => {
                const idx = charIdx++;
                return (
                  <motion.span
                    key={ci}
                    initial={{ opacity: 0, y: -24, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                      delay: 3 + idx * 0.035,
                      duration: 0.45,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                );
              })}
            </span>
          ));
        })()}
      </h1>
    </motion.div>
  );
}
