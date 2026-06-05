"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

export default function ResumeSection() {
  const [downloadState, setDownloadState] = useState<"idle" | "downloading" | "completed">("idle");
  const [progress, setProgress] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse tilt coordinates for 3D card tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring settings for smooth rotation tracking
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 25 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 25 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left - width / 2;
    const mouseY = event.clientY - rect.top - height / 2;
    
    // Normalize coordinates between -0.5 and 0.5
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleDownload = () => {
    if (downloadState !== "idle") return;
    setDownloadState("downloading");
    setProgress(0);

    let cur = 0;
    const interval = setInterval(() => {
      cur += Math.floor(Math.random() * 12) + 4;
      if (cur >= 100) {
        cur = 100;
        clearInterval(interval);
        setTimeout(() => {
          // Trigger file download
          const link = document.createElement("a");
          link.href = "/Hameed_Afsar_Resume.pdf";
          link.download = "Hameed_Afsar_Resume.pdf";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setDownloadState("completed");
        }, 300);
      }
      setProgress(cur);
    }, 80);
  };

  return (
    <section className="res-section" id="resume">
      <div className="res-radial-glow" />
      <div className="res-container">
        
        {/* Section Title */}
        <div className="res-title-wrap">
          <span className="res-sub-tag">// ARCHIVE SYSTEMS</span>
          <h2 className="res-main-title">CURRICULUM VITAE</h2>
          <div className="res-line-divider" />
        </div>

        {/* Professional 3D Tilt Card */}
        <div 
          className="res-card-wrapper"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div 
            ref={cardRef}
            className="res-card"
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          >
            {/* Ambient inner glow */}
            <div className="res-card-glare" />

            {/* Left: Vector Mock Resume Sheet */}
            <div className="res-card-preview" style={{ transform: "translateZ(30px)" }}>
              <div className="res-sheet">
                <div className="res-sheet-header">
                  <div className="res-sheet-avatar" />
                  <div className="res-sheet-info">
                    <div className="res-sheet-line res-sheet-line--name" />
                    <div className="res-sheet-line res-sheet-line--title" />
                  </div>
                </div>
                <div className="res-sheet-body">
                  <div className="res-sheet-block">
                    <div className="res-sheet-line res-sheet-line--heading" />
                    <div className="res-sheet-line" />
                    <div className="res-sheet-line res-sheet-line--short" />
                  </div>
                  <div className="res-sheet-block">
                    <div className="res-sheet-line res-sheet-line--heading" />
                    <div className="res-sheet-line" />
                    <div className="res-sheet-line" />
                    <div className="res-sheet-line res-sheet-line--short" />
                  </div>
                  <div className="res-sheet-block">
                    <div className="res-sheet-line res-sheet-line--heading" />
                    <div className="res-sheet-grid">
                      <div className="res-sheet-chip" />
                      <div className="res-sheet-chip" />
                      <div className="res-sheet-chip" />
                    </div>
                  </div>
                </div>
                {/* Floating scan effect */}
                <div className="res-sheet-scanner" />
              </div>
            </div>

            {/* Right: Modern Download Controls */}
            <div className="res-card-details" style={{ transform: "translateZ(20px)" }}>
              <div className="res-details-head">
                <span className="res-doc-type">DOCUMENTATION // PDF PACK</span>
                <h3 className="res-doc-title">Hameed_Afsar_Resume.pdf</h3>
                <p className="res-doc-desc">
                  Explore full engineering schematics, system architecture portfolios, toolchain proficiencies, and professional timelines. Compiled and verified for 2026.
                </p>
              </div>

              {/* Data Specifications Grid */}
              <div className="res-specs">
                <div className="res-spec-item">
                  <span className="res-spec-label">FILE SIZE</span>
                  <span className="res-spec-value">542 KB</span>
                </div>
                <div className="res-spec-item">
                  <span className="res-spec-label">FORMAT</span>
                  <span className="res-spec-value">PDF (A4)</span>
                </div>
                <div className="res-spec-item">
                  <span className="res-spec-label">COMPILATION</span>
                  <span className="res-spec-value">RELEASE // V2.6</span>
                </div>
              </div>

              {/* Interactive Download Controller */}
              <div className="res-control-box">
                {downloadState === "idle" && (
                  <button className="res-download-btn" onClick={handleDownload}>
                    <span className="res-btn-bg-glow" />
                    <span className="res-btn-label">DOWNLOAD RESUME</span>
                    <span className="res-btn-icon">↓</span>
                  </button>
                )}

                {downloadState === "downloading" && (
                  <div className="res-loader-container">
                    <div className="res-loader-info">
                      <span className="res-loader-status">COMPILING PACKAGE...</span>
                      <span className="res-loader-percent">{progress}%</span>
                    </div>
                    <div className="res-loader-track">
                      <div className="res-loader-fill" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}

                {downloadState === "completed" && (
                  <div className="res-complete-container">
                    <div className="res-complete-badge">
                      <span className="res-complete-icon">✓</span>
                      <span className="res-complete-label">VERIFIED DOWNLOAD COMPLETE</span>
                    </div>
                    <button className="res-reset-btn" onClick={() => setDownloadState("idle")}>
                      DOWNLOAD AGAIN
                    </button>
                  </div>
                )}
              </div>
            </div>

          </motion.div>
        </div>

      </div>
    </section>
  );
}
