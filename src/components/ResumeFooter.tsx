"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ResumeFooter() {
  const [downloadState, setDownloadState] = useState<"idle" | "downloading" | "completed">("idle");
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [timeStr, setTimeStr] = useState("");
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Digital clock update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const offsetMinutes = now.getTimezoneOffset();
      const offsetHours = Math.abs(offsetMinutes / 60);
      const sign = offsetMinutes > 0 ? "-" : "+";
      const tzString = `GMT${sign}${offsetHours.toFixed(1)}`;
      const time = now.toLocaleTimeString("en-US", { hour12: false });
      setTimeStr(`${time} (${tzString})`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Scroll logs to bottom during download
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const terminalMessages = [
    "[INIT] Initializing secure handshake protocol...",
    "[HANDSHAKE] Connection established. Encryption: AES-256",
    "[LOAD] Resolving public/Hameed_Afsar_Resume.pdf...",
    "[DECRYPT] Verifying package integrity hash...",
    "[TRANSFER] Direct byte-stream transmission initiated...",
    "[DONE] Package successfully compiled and delivered."
  ];

  const handleDownload = () => {
    if (downloadState !== "idle") return;
    setDownloadState("downloading");
    setProgress(0);
    setLogs([]);

    // Print logs with staggered delays
    let logIndex = 0;
    const addLog = () => {
      if (logIndex < terminalMessages.length) {
        setLogs((prev) => [...prev, terminalMessages[logIndex]]);
        logIndex++;
        // Trigger next log slightly faster than the progress
        setTimeout(addLog, 450);
      }
    };
    addLog();

    // Increment progress bar
    let curProgress = 0;
    const progressTimer = setInterval(() => {
      curProgress += Math.floor(Math.random() * 8) + 3;
      if (curProgress >= 100) {
        curProgress = 100;
        clearInterval(progressTimer);
        
        // Trigger the actual PDF file download
        setTimeout(() => {
          const link = document.createElement("a");
          link.href = "/Hameed_Afsar_Resume.pdf";
          link.download = "Hameed_Afsar_Resume.pdf";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setDownloadState("completed");
        }, 400);
      }
      setProgress(curProgress);
    }, 100);
  };

  const handleReset = () => {
    setDownloadState("idle");
    setProgress(0);
    setLogs([]);
  };

  return (
    <section className="rf-section" id="resume">
      {/* Visual background details */}
      <div className="rf-grid" />
      <div className="rf-glow" />

      <div className="rf-container">
        {/* Module Header */}
        <div className="rf-header">
          <div className="rf-header-left">
            <span className="rf-header-tag">// RETRIEVAL.SYS</span>
            <h2 className="rf-header-title">RESUME CONSOLE</h2>
          </div>
          <div className="rf-header-right">
            <div className="rf-status">
              <span className="rf-status-dot" />
              <span className="rf-status-text">HOST: ONLINE</span>
            </div>
          </div>
        </div>

        {/* Console Box */}
        <div className="rf-console">
          {/* Top terminal bar */}
          <div className="rf-console-bar">
            <div className="rf-dots">
              <span className="rf-dot rf-dot-red" />
              <span className="rf-dot rf-dot-yellow" />
              <span className="rf-dot rf-dot-green" />
            </div>
            <div className="rf-console-title">SECURE_DOWNLOAD_SHELL.sh</div>
            <div className="rf-console-meta">V1.4.2</div>
          </div>

          <div className="rf-console-content">
            {/* Left Column: Metadata Dashboard */}
            <div className="rf-meta-col">
              <div className="rf-meta-item">
                <span className="rf-meta-label">FILENAME:</span>
                <span className="rf-meta-val">Hameed_Afsar_Resume.pdf</span>
              </div>
              <div className="rf-meta-item">
                <span className="rf-meta-label">FILE SIZE:</span>
                <span className="rf-meta-val">542 KB</span>
              </div>
              <div className="rf-meta-item">
                <span className="rf-meta-label">INTEGRITY:</span>
                <span className="rf-meta-val rf-meta-val--green">SECURE // SHA-256</span>
              </div>
              <div className="rf-meta-item">
                <span className="rf-meta-label">LOCATION:</span>
                <span className="rf-meta-val">BANGALORE, IN</span>
              </div>
              <div className="rf-meta-item">
                <span className="rf-meta-label">LAST_UPDATE:</span>
                <span className="rf-meta-val">2026.06.05</span>
              </div>
            </div>

            {/* Right Column: Interaction Hub */}
            <div className="rf-interact-col">
              <AnimatePresence mode="wait">
                {downloadState === "idle" && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="rf-state-box"
                  >
                    <p className="rf-info-text">
                      Handshake verification is required to download the credentials portfolio. Press the trigger button below to compile and authorize transmission.
                    </p>

                    <button className="rf-btn-download" onClick={handleDownload}>
                      <span className="rf-btn-hazard" />
                      <span className="rf-btn-text">INITIALIZE TRANSMISSION</span>
                      <span className="rf-btn-arrow">↳</span>
                    </button>
                  </motion.div>
                )}

                {downloadState === "downloading" && (
                  <motion.div
                    key="downloading"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="rf-state-box"
                  >
                    {/* Log Terminal */}
                    <div ref={logContainerRef} className="rf-log-screen">
                      {logs.map((log, idx) => (
                        <div key={idx} className="rf-log-line">
                          <span className="rf-log-prompt">&gt;</span> {log}
                        </div>
                      ))}
                      <div className="rf-log-cursor-line">
                        <span className="rf-log-prompt">&gt;</span>
                        <span className="rf-log-cursor" />
                      </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="rf-progress-container">
                      <div className="rf-progress-labels">
                        <span className="rf-prog-txt">TRANSFERRING BYTES:</span>
                        <span className="rf-prog-pct">{progress}%</span>
                      </div>
                      <div className="rf-progress-bar-track">
                        <motion.div 
                          className="rf-progress-bar-fill" 
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {downloadState === "completed" && (
                  <motion.div
                    key="completed"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="rf-state-box"
                  >
                    <div className="rf-success-badge">
                      <div className="rf-success-icon">✓</div>
                      <div className="rf-success-title">TRANSMISSION COMPLETED</div>
                      <p className="rf-success-desc">
                        Handshake successful. The resume PDF packet has been compiled and downloaded to your default local system retrieval queue.
                      </p>
                    </div>

                    <button className="rf-btn-reset" onClick={handleReset}>
                      <span className="rf-btn-reset-text">RESET CONSOLE SHELL</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Sleek Cyber Footer */}
        <footer className="rf-footer">
          <div className="rf-footer-rule">
            <span className="rf-rule-cross rf-rule-cross--l" />
            <span className="rf-rule-cross rf-rule-cross--r" />
          </div>

          <div className="rf-footer-cols">
            {/* Col 1: Brand & Trademarks */}
            <div className="rf-footer-col rf-footer-col--left">
              <h3 className="rf-brand-name">HAMEED AFSAR KM</h3>
              <p className="rf-brand-sub">// FULL STACK ENGINEER × PRODUCT DESIGNER</p>
              <p className="rf-copy">
                &copy; {new Date().getFullYear()} ALL RIGHS RESERVED. DESIGNED FOR PERFORMANCE.
              </p>
            </div>

            {/* Col 2: Live Clock */}
            <div className="rf-footer-col rf-footer-col--center">
              <div className="rf-hud-clock">
                <span className="rf-clock-label">SYSTEM TIME:</span>
                <span className="rf-clock-val">{timeStr}</span>
              </div>
              <div className="rf-hud-status">
                <span className="rf-status-label">GRID GRID:</span>
                <span className="rf-status-val rf-status-val--green">OPERATIONAL // LVL_0</span>
              </div>
            </div>

            {/* Col 3: Social Directories */}
            <div className="rf-footer-col rf-footer-col--right">
              <div className="rf-social-title">// CONNECT</div>
              <div className="rf-social-links">
                <a href="https://github.com/hameed-afsar-km" target="_blank" rel="noopener noreferrer" className="rf-social-link">
                  <span className="rf-link-bracket">[</span>
                  <span className="rf-link-txt">GITHUB</span>
                  <span className="rf-link-bracket">]</span>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="rf-social-link">
                  <span className="rf-link-bracket">[</span>
                  <span className="rf-link-txt">LINKEDIN</span>
                  <span className="rf-link-bracket">]</span>
                </a>
                <a href="mailto:hameedafsar.km@gmail.com" className="rf-social-link">
                  <span className="rf-link-bracket">[</span>
                  <span className="rf-link-txt">EMAIL</span>
                  <span className="rf-link-bracket">]</span>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}
