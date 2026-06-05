"use client";

import { useCallback } from "react";
import { useTransform, motion, useMotionValue, useSpring } from "framer-motion";
import type Lenis from "lenis";
import { useLenis } from "lenis/react";

export default function Navbar() {
  const scrollYProgress = useMotionValue(0);

  useLenis(
    useCallback((l: Lenis) => {
      const p = l.limit > 0 ? l.scroll / l.limit : 0;
      scrollYProgress.set(Math.max(0, Math.min(1, p)));
    }, [])
  );

  const rawScale = useTransform(scrollYProgress, (p) => {
    const t = Math.min(p / 0.18, 1);
    return 1 + 19 * t * t * t;
  });
  const rawY = useTransform(scrollYProgress, (p) => {
    const t = Math.min(p / 0.18, 1);
    return -900 * t * t * t;
  });
  const rawOpacity = useTransform(scrollYProgress, [0, 0.12, 0.18], [1, 1, 0]);
  const scale = useSpring(rawScale, { stiffness: 150, damping: 30, restDelta: 0.001 });
  const y = useSpring(rawY, { stiffness: 200, damping: 35, restDelta: 0.001 });
  const opacity = useSpring(rawOpacity, { stiffness: 180, damping: 35, restDelta: 0.001 });

  return (
    <motion.div
      style={{ y, scale, opacity }}
      className="fixed top-0 left-0 w-full flex items-center justify-center pointer-events-none z-[9997]"
    >
      <h1 className="navbar-name">HAMEED AFSAR KM</h1>
    </motion.div>
  );
}
