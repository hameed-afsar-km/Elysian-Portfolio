"use client";

import { useEffect, useRef } from "react";

export default function ParticleBackgroundMono() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // The About Me panel is absolute inset-0 inside a h-screen sticky container,
    // so it always equals the viewport. Use window dimensions directly to avoid
    // the 0×0 bug that occurs when the parent has display:none at mount time.
    let width  = (canvas.width  = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let animationId: number;
    let time = 0;

    const mouse = { x: -1000, y: -1000, active: false };

    // ── Floating outline shapes (same geometry as hero ParticleBackground) ──
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

    const shapes = Array.from({ length: 8 }, () => new FloatingShape());

    function animate() {
      if (!ctx) return;
      time++;

      // Solid black background
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      const spacing = 80;
      ctx.lineWidth = 1;

      for (let x = spacing / 2; x < width; x += spacing) {
        for (let y = spacing / 2; y < height; y += spacing) {
          const dx = mouse.x - x;
          const dy = mouse.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let angleOffset = 0;
          let scale = 1;
          let color = "rgba(255, 255, 255, 0.10)";

          if (dist < 180) {
            const factor = (180 - dist) / 180;
            angleOffset = factor * 0.5;
            scale = 1 + factor * 2.5;
            color = `rgba(255, 255, 255, ${0.10 + factor * 0.50})`;
          }

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angleOffset + time * 0.002);
          ctx.strokeStyle = color;
          ctx.beginPath();
          ctx.moveTo(-4 * scale, 0); ctx.lineTo(4 * scale, 0);
          ctx.moveTo(0, -4 * scale); ctx.lineTo(0, 4 * scale);
          ctx.stroke();
          ctx.restore();

          if ((Math.floor(x) % 240 === 0) && (Math.floor(y) % 240 === 0)) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.20)";
            ctx.font = "8px monospace";
            ctx.fillText(`[${Math.floor(x)},${Math.floor(y)}]`, x + 10, y + 3);
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
      width  = canvas.width  = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    animate();

    return () => {
      cancelAnimationFrame(animationId);
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
