import ParticleBackground from "@/components/ParticleBackground";

export default function Home() {
  return (
    <>
      <div className="loader-screen">
        <div className="loader-stripes">
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} className="loader-stripe" />
          ))}
        </div>
        <h1 className="loader-text">
          {"AFSAR".split("").map((char, index) => (
            <span key={index} className="loader-char" style={{ "--char-idx": index } as React.CSSProperties}>
              {char}
            </span>
          ))}
        </h1>
      </div>
      
      <ParticleBackground />

      <main className="hero-container">
        <div className="marquee">
          <div className="marquee-track">
            <span>AI SYSTEMS • AI AGENTS • AUTOMATION • DIGITAL EXPERIENCES •</span>
            <span>AI SYSTEMS • AI AGENTS • AUTOMATION • DIGITAL EXPERIENCES •</span>
          </div>
        </div>
        <h1 className="val-heading">
          <span className="word-wrap"><span>THINK</span></span>
          <span className="word-wrap"><span>MAKE</span></span>
          <span className="word-wrap"><span>REPEAT</span></span>
        </h1>
      </main>
    </>
  );
}

