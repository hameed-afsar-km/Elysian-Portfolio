const TEXT = "AI SYSTEMS • AI AGENTS • AUTOMATION • DIGITAL EXPERIENCES • ";
const REPEATS = 6;
const FULL_TEXT = TEXT.repeat(REPEATS);

// Path length calculations:
// The total length of the wave path d="M -100,125 C 250,40 450,210 720,125 C 990,40 1190,210 1540,125" is exactly 1655.36 SVG units.
// We set textLength to exactly 3 * 1655.36 = 4966.08, so one full repetition is exactly P/2 (50% of the path length).
// Animating startOffset by 50% (either 0% to -50% or -50% to 0%) creates a 100% mathematically seamless loop.
const PATH_LENGTH = 1655.36;
const TEXT_LENGTH = PATH_LENGTH * 3; // 4966.08

export default function CurvedMarquee() {
  return (
    <div className="hero-marquee-wrap">
      <svg
        viewBox="0 0 1440 250"
        className="hero-marquee-svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Path for Ribbon A (Wavy Curve 1 - starts curving up) */}
          <path
            id="curve-a"
            d="M -100,125 C 250,40 450,210 720,125 C 990,40 1190,210 1540,125"
          />
          {/* Path for Ribbon B (Wavy Curve 2 - Inverse Phase, starts curving down) */}
          <path
            id="curve-b"
            d="M -100,125 C 250,210 450,40 720,125 C 990,210 1190,40 1540,125"
          />
        </defs>

        {/* --- RIBBON B (Dark/Neon Outline Ribbon, Behind Ribbon A) --- */}
        <g className="marquee-group-b">
          {/* Outer Border (Light Red glow outline) */}
          <use href="#curve-b" stroke="var(--val-red)" strokeWidth="60" strokeLinecap="round" opacity="0.6" />
          {/* Ribbon Body (Dark background) */}
          <use href="#curve-b" stroke="var(--val-dark)" strokeWidth="56" strokeLinecap="round" />
          {/* Repeating text moving right-to-left */}
          <text className="marquee-text text-b" fontSize="26" dominantBaseline="central">
            <textPath href="#curve-b" startOffset="0%" textLength={TEXT_LENGTH}>
              <animate
                attributeName="startOffset"
                from="0%"
                to="-50%"
                dur="26s"
                repeatCount="indefinite"
              />
              {FULL_TEXT}
            </textPath>
          </text>
        </g>

        {/* --- RIBBON A (Solid Red Ribbon, In Front of Ribbon B) --- */}
        <g className="marquee-group-a">
          {/* Ribbon Body (Solid Red background) */}
          <use href="#curve-a" stroke="var(--val-red)" strokeWidth="56" strokeLinecap="round" />
          {/* Repeating text moving left-to-right */}
          <text className="marquee-text text-a" fontSize="26" dominantBaseline="central">
            <textPath href="#curve-a" startOffset="-50%" textLength={TEXT_LENGTH}>
              <animate
                attributeName="startOffset"
                from="-50%"
                to="0%"
                dur="22s"
                repeatCount="indefinite"
              />
              {FULL_TEXT}
            </textPath>
          </text>
        </g>
      </svg>
    </div>
  );
}
