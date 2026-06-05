'use client';

const TEXT = "AI SYSTEMS • AI AGENTS • AUTOMATION • DIGITAL EXPERIENCES • ";
const REPEATS = 20;
const FULL_TEXT = TEXT.repeat(REPEATS);

type CurvedMarqueeProps = {
  ribbon: "a" | "b";
};

export default function CurvedMarquee({ ribbon }: CurvedMarqueeProps) {
  return (
    <div className="hero-marquee-wrap">
      <svg
        viewBox="0 0 1440 250"
        className="hero-marquee-svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <path
            id="curve-a"
            d="M -100,125 C 250,40 450,210 720,125 C 990,40 1190,210 1540,125"
          />
          <path
            id="curve-b"
            d="M -100,125 C 250,210 450,40 720,125 C 990,210 1190,40 1540,125"
          />
        </defs>

        {ribbon === "b" && (
          <g className="marquee-group-b">
            <use href="#curve-b" stroke="var(--val-red)" strokeWidth="60" strokeLinecap="round" opacity="0.6" />
            <use href="#curve-b" stroke="var(--val-dark)" strokeWidth="56" strokeLinecap="round" />
            <text className="marquee-text text-b" fontSize="26" dominantBaseline="central">
              <textPath href="#curve-b" startOffset="0%">
                <animate
                  attributeName="startOffset"
                  values="0%;-50%"
                  dur="8s"
                  repeatCount="indefinite"
                />
                {FULL_TEXT}
              </textPath>
            </text>
          </g>
        )}

        {ribbon === "a" && (
          <g className="marquee-group-a">
            <use href="#curve-a" stroke="white" strokeWidth="58" strokeLinecap="round" />
            <use href="#curve-a" stroke="var(--val-red)" strokeWidth="56" strokeLinecap="round" />
            <text className="marquee-text text-a" fontSize="26" dominantBaseline="central">
              <textPath href="#curve-a" startOffset="-50%">
                <animate
                  attributeName="startOffset"
                  values="-50%;0%"
                  dur="8s"
                  repeatCount="indefinite"
                />
                {FULL_TEXT}
              </textPath>
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
