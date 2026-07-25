"use client";

import { useEffect, useRef } from "react";

export default function ParticleBackgroundMono() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.innerWidth <= 768;
    const dpr = isMobile ? 0.5 : 1;

    let width  = (canvas.width  = window.innerWidth * dpr);
    let height = (canvas.height = window.innerHeight * dpr);
    if (isMobile) {
      canvas.style.width = "100%";
      canvas.style.height = "100%";
    }

    let animationId: number;
    let time = 0;
    let isVisible = true;
    let lastFrame = 0;
    const FRAME_INTERVAL = 33; // 30fps on all viewports

    const mouse = { x: -1000, y: -1000, active: false };

    class FloatingShape {
      x: number; y: number; size: number;
      vx: number; vy: number; angle: number; rotationSpeed: number;
      type: "circle" | "square" | "triangle" | "crosshair";

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 80 + 40;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.angle = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.005;
        const types: ("circle" | "square" | "triangle" | "crosshair")[] = [
          "circle", "square", "triangle", "crosshair",
        ];
        this.type = types[Math.floor(Math.random() * types.length)];
      }

      update() {
        this.x += this.vx; this.y += this.vy; this.angle += this.rotationSpeed;
        if (this.x < -this.size) this.x = width + this.size;
        if (this.x > width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = height + this.size;
        if (this.y > height + this.size) this.y = -this.size;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
        ctx.lineWidth = 1;
        if (this.type === "circle") {
          ctx.beginPath(); ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2); ctx.stroke();
        } else if (this.type === "square") {
          ctx.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size);
        } else if (this.type === "triangle") {
          ctx.beginPath();
          ctx.moveTo(0, -this.size / 2);
          ctx.lineTo(this.size / 2, this.size / 2);
          ctx.lineTo(-this.size / 2, this.size / 2);
          ctx.closePath(); ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.moveTo(-this.size / 2, 0); ctx.lineTo(this.size / 2, 0);
          ctx.moveTo(0, -this.size / 2); ctx.lineTo(0, this.size / 2);
          ctx.stroke();
        }
        ctx.restore();
      }
    }

    const SHAPES_COUNT = isMobile ? 4 : 8;
    const shapes = Array.from({ length: SHAPES_COUNT }, () => new FloatingShape());

    const MOUSE_RADIUS = 180;
    const HALF_SIZE = 4;
    const spacing = isMobile ? 100 : 80;

    function animate(timestamp: number) {
      if (!ctx) return;
      if (!isVisible) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      if (FRAME_INTERVAL && timestamp - lastFrame < FRAME_INTERVAL) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      lastFrame = timestamp;
      time++;

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      const angle = time * 0.002;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const hx = HALF_SIZE * cos;
      const hy = HALF_SIZE * sin;
      const vx = -HALF_SIZE * sin;
      const vy = HALF_SIZE * cos;

      ctx.lineWidth = 1;

      const mrSq = MOUSE_RADIUS * MOUSE_RADIUS * dpr * dpr;
      const mr = MOUSE_RADIUS * dpr;

      // Batch all default crosshairs into one path
      ctx.strokeStyle = "rgba(255, 255, 255, 0.10)";
      ctx.beginPath();
      for (let x = spacing / 2; x < width; x += spacing) {
        for (let y = spacing / 2; y < height; y += spacing) {
          const dx = mouse.x * dpr - x;
          const dy = mouse.y * dpr - y;
          if (dx * dx + dy * dy < mrSq) continue;

          ctx.moveTo(x - hx, y - hy);
          ctx.lineTo(x + hx, y + hy);
          ctx.moveTo(x - vx, y - vy);
          ctx.lineTo(x + vx, y + vy);
        }
      }
      ctx.stroke();

      // Draw mouse-affected crosshairs individually
      for (let x = spacing / 2; x < width; x += spacing) {
        for (let y = spacing / 2; y < height; y += spacing) {
          const dx = mouse.x * dpr - x;
          const dy = mouse.y * dpr - y;
          const distSq = dx * dx + dy * dy;
          if (distSq >= mrSq) continue;

          const dist = Math.sqrt(distSq);
          const factor = (mr - dist) / mr;
          const aOff = factor * 0.5;
          const scale = 1 + factor * 2.5;

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(aOff + angle);
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.10 + factor * 0.50})`;
          ctx.beginPath();
          ctx.moveTo(-HALF_SIZE * scale, 0);
          ctx.lineTo(HALF_SIZE * scale, 0);
          ctx.moveTo(0, -HALF_SIZE * scale);
          ctx.lineTo(0, HALF_SIZE * scale);
          ctx.stroke();
          ctx.restore();

          if ((Math.floor(x) % (240 * dpr) === 0) && (Math.floor(y) % (240 * dpr) === 0)) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.20)";
            ctx.font = `${8 * dpr}px monospace`;
            ctx.fillText(`[${Math.floor(x / dpr)},${Math.floor(y / dpr)}]`, x + 10 * dpr, y + 3 * dpr);
          }
        }
      }

      for (const shape of shapes) { shape.update(); shape.draw(); }
      animationId = requestAnimationFrame(animate);
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const handleMouseLeave = () => { mouse.x = -1000; mouse.y = -1000; mouse.active = false; };
    const handleResize = () => {
      width  = canvas.width  = window.innerWidth * dpr;
      height = canvas.height = window.innerHeight * dpr;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    const observer = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; },
      { threshold: 0 }
    );
    observer.observe(canvas);

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}
