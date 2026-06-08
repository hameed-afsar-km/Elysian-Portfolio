"use client";

import { useEffect, useRef } from "react";

interface Shape {
  x: number; y: number; size: number; vx: number; vy: number;
  angle: number; rotSpeed: number;
  type: "circle" | "square" | "triangle" | "crosshair";
}

export default function AiTwinBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;
    let animId: number;
    let time = 0;
    let isVisible = true;
    const mouse = { x: -1000, y: -1000 };

    const shapes: Shape[] = [];

    function init(width: number, height: number) {
      shapes.length = 0;
      const types: Shape["type"][] = ["circle", "square", "triangle", "crosshair"];
      for (let i = 0; i < 10; i++) {
        shapes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 50 + 25,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          angle: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.008,
          type: types[i % types.length],
        });
      }
    }

    function drawShape(s: Shape) {
      if (!ctx) return;
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.angle);
      ctx.strokeStyle = "rgba(255, 70, 85, 0.55)";
      ctx.lineWidth = 1;

      if (s.type === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, s.size / 2, 0, Math.PI * 2);
        ctx.stroke();
      } else if (s.type === "square") {
        ctx.strokeRect(-s.size / 2, -s.size / 2, s.size, s.size);
      } else if (s.type === "triangle") {
        ctx.beginPath();
        ctx.moveTo(0, -s.size / 2);
        ctx.lineTo(s.size / 2, s.size / 2);
        ctx.lineTo(-s.size / 2, s.size / 2);
        ctx.closePath();
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(-s.size / 2, 0); ctx.lineTo(s.size / 2, 0);
        ctx.moveTo(0, -s.size / 2); ctx.lineTo(0, s.size / 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w * (window.devicePixelRatio || 1);
      canvas!.height = h * (window.devicePixelRatio || 1);
      canvas!.style.width = w + "px";
      canvas!.style.height = h + "px";
      ctx!.setTransform(window.devicePixelRatio || 1, 0, 0, window.devicePixelRatio || 1, 0, 0);
      init(w, h);
    }

    resize();
    window.addEventListener("resize", resize);

    function draw(now: number) {
      if (!ctx || !isVisible) { animId = requestAnimationFrame(draw); return; }
      const t = (now / 1000);
      ctx.clearRect(0, 0, w, h);

      for (let x = 0; x < w; x += 60) {
        for (let y = 0; y < h; y += 60) {
          const dx = mouse.x - x;
          const dy = mouse.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          let scale = 1;
          let intensity = 0;
          if (dist < 150) {
            intensity = (150 - dist) / 150;
            scale = 1 + intensity * 2;
          }
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(t * 0.1 + (x + y) * 0.001);
          const opacity = 0.2 + intensity * 0.6;
          ctx.strokeStyle = `rgba(255, ${Math.round(70 - intensity * 50)}, ${Math.round(85 - intensity * 65)}, ${opacity})`;
          ctx.lineWidth = 0.5 + intensity * 2;
          ctx.beginPath();
          ctx.moveTo(-2 * scale, 0); ctx.lineTo(2 * scale, 0);
          ctx.moveTo(0, -2 * scale); ctx.lineTo(0, 2 * scale);
          ctx.stroke();
          ctx.restore();
        }
      }

      for (const s of shapes) {
        s.x += s.vx;
        s.y += s.vy;
        s.angle += s.rotSpeed;
        if (s.x < -s.size) s.x = w + s.size;
        if (s.x > w + s.size) s.x = -s.size;
        if (s.y < -s.size) s.y = h + s.size;
        if (s.y > h + s.size) s.y = -s.size;
        drawShape(s);
      }

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleLeave = () => { mouse.x = -1000; mouse.y = -1000; };
    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("mouseleave", handleLeave);

    const observer = new IntersectionObserver(([e]) => { isVisible = e.isIntersecting; }, { threshold: 0 });
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 1,
      }}
    />
  );
}
