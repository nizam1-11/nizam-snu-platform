/**
 * CoverAmbience — decorative atmosphere for the project cover panel.
 *
 * Four hand-drawn copper/gold butterflies flutter in the corners while a
 * scatter of tiny motes drifts and twinkles. The center is deliberately left
 * empty so the project logo stays the focal point.
 *
 * CSS only — no JS, no listeners, and only transform/opacity are animated.
 * The site-wide Motion toggle opts out by putting `motion-off` on <html>;
 * the scoped rules at the bottom of the <style> block freeze everything.
 */

import type { CSSProperties } from "react";

type Butterfly = {
  id: string;
  position: CSSProperties;
  size: number;
  tilt: number;
  flap: number;
  flapDelay: number;
  float: number;
  floatDelay: number;
};

/** Corners only — nothing is placed near the center logo. */
const BUTTERFLIES: Butterfly[] = [
  {
    id: "top-left",
    position: { left: "9%", top: "13%" },
    size: 40,
    tilt: -18,
    flap: 0.62,
    flapDelay: 0,
    float: 5.6,
    floatDelay: 0.2,
  },
  {
    id: "top-right",
    position: { right: "12%", top: "18%" },
    size: 30,
    tilt: 14,
    flap: 0.78,
    flapDelay: 0.18,
    float: 6.8,
    floatDelay: 1.1,
  },
  {
    id: "bottom-left",
    position: { left: "15%", bottom: "14%" },
    size: 46,
    tilt: 24,
    flap: 0.7,
    flapDelay: 0.34,
    float: 6.1,
    floatDelay: 0.6,
  },
  {
    id: "bottom-right",
    position: { right: "16%", bottom: "17%" },
    size: 34,
    tilt: -12,
    flap: 0.55,
    flapDelay: 0.1,
    float: 4.9,
    floatDelay: 1.8,
  },
];

type Particle = {
  left: string;
  top: string;
  size: number;
  color: string;
  drift: number;
  twinkle: number;
  delay: number;
  rise: string;
  sway: string;
};

const PARTICLES: Particle[] = [
  { left: "8%", top: "28%", size: 3, color: "#D8A46B", drift: 7.2, twinkle: 3.1, delay: 0, rise: "-13px", sway: "4px" },
  { left: "18%", top: "72%", size: 2, color: "#E3B784", drift: 6.4, twinkle: 2.6, delay: 0.7, rise: "-9px", sway: "-3px" },
  { left: "26%", top: "40%", size: 4, color: "#C8945F", drift: 8.1, twinkle: 3.8, delay: 1.4, rise: "-16px", sway: "5px" },
  { left: "34%", top: "84%", size: 2, color: "#D8A46B", drift: 5.9, twinkle: 2.9, delay: 0.3, rise: "-11px", sway: "3px" },
  { left: "43%", top: "16%", size: 3, color: "#B5794A", drift: 7.8, twinkle: 3.4, delay: 1.9, rise: "-14px", sway: "-4px" },
  { left: "52%", top: "66%", size: 2, color: "#E3B784", drift: 6.7, twinkle: 2.4, delay: 0.9, rise: "-8px", sway: "4px" },
  { left: "61%", top: "34%", size: 3, color: "#D8A46B", drift: 8.4, twinkle: 3.6, delay: 1.2, rise: "-15px", sway: "-5px" },
  { left: "70%", top: "80%", size: 2, color: "#C8945F", drift: 6.1, twinkle: 2.7, delay: 0.5, rise: "-10px", sway: "3px" },
  { left: "78%", top: "24%", size: 4, color: "#E3B784", drift: 7.5, twinkle: 3.2, delay: 1.6, rise: "-17px", sway: "-4px" },
  { left: "86%", top: "58%", size: 2, color: "#D8A46B", drift: 5.6, twinkle: 2.5, delay: 0.2, rise: "-9px", sway: "5px" },
  { left: "92%", top: "42%", size: 3, color: "#B5794A", drift: 8, twinkle: 3.9, delay: 1.1, rise: "-12px", sway: "-3px" },
  { left: "12%", top: "88%", size: 2, color: "#E3B784", drift: 6.9, twinkle: 3, delay: 1.7, rise: "-13px", sway: "4px" },
];

/** One butterfly: symmetric left/right wings plus a slim body and antennae. */
function ButterflyGlyph() {
  const upperWing = "M23.5 21 C 17 5, 5 5, 5 16 C 5 22, 13 25, 23.5 23 Z";
  const lowerWing = "M23.5 25 C 15 25, 9 31, 12 38 C 14.5 43, 20 40, 23.5 27 Z";

  return (
    <svg
      viewBox="0 0 48 48"
      className="cover-butterfly-glyph"
      aria-hidden="true"
      focusable="false"
    >
      <g className="cover-butterfly-wings">
        <path d={upperWing} />
        <path d={lowerWing} />
        {/* Mirror around the vertical centerline (x = 24) for the right pair. */}
        <g transform="translate(48,0) scale(-1,1)">
          <path d={upperWing} />
          <path d={lowerWing} />
        </g>
      </g>
      <g className="cover-butterfly-body">
        <path d="M24 13.5 C 22.5 13.5 22.4 19 22.7 25 L 22.3 33.5 C 22.2 36 25.8 36 25.7 33.5 L 25.3 25 C 25.6 19 25.5 13.5 24 13.5 Z" />
        <path
          d="M23.3 14.2 C 21.3 10.6 19.4 9.4 17.8 9.1 M24.7 14.2 C 26.7 10.6 28.6 9.4 30.2 9.1"
          fill="none"
          stroke="#8A5A36"
          strokeWidth={0.9}
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

export function CoverAmbience() {
  return (
    <div
      aria-hidden="true"
      className="cover-ambience pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {/* Shared paint server. width/height 0 (not display:none) keeps url() references working. */}
      <svg className="cover-ambience-defs" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="cba-wing-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B5794A" />
            <stop offset="100%" stopColor="#D8A46B" />
          </linearGradient>
        </defs>
      </svg>

      {BUTTERFLIES.map((butterfly) => (
        <div
          key={butterfly.id}
          className="cover-butterfly"
          style={
            {
              ...butterfly.position,
              width: butterfly.size,
              height: butterfly.size,
              "--cba-tilt": `${butterfly.tilt}deg`,
              "--cba-float": `${butterfly.float}s`,
              "--cba-flap": `${butterfly.flap}s`,
              "--cba-delay": `${butterfly.floatDelay}s`,
              "--cba-flap-delay": `${butterfly.flapDelay}s`,
            } as CSSProperties
          }
        >
          <ButterflyGlyph />
        </div>
      ))}

      {PARTICLES.map((particle, index) => (
        <span
          key={index}
          className="cover-particle"
          style={
            {
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              color: particle.color,
              "--cba-drift": `${particle.drift}s`,
              "--cba-twinkle": `${particle.twinkle}s`,
              "--cba-delay": `${particle.delay}s`,
              "--cba-rise": particle.rise,
              "--cba-sway": particle.sway,
            } as CSSProperties
          }
        />
      ))}

      <style>{`
        .cover-ambience { isolation: isolate; }

        .cover-ambience-defs {
          position: absolute;
          width: 0;
          height: 0;
          overflow: hidden;
          pointer-events: none;
        }

        /* ── Butterflies ─────────────────────────────────────────────── */
        .cover-butterfly {
          position: absolute;
          transform-origin: center;
          filter: drop-shadow(0 0 4px rgb(216 164 107 / 0.45));
          animation: cover-butterfly-float var(--cba-float, 6s) ease-in-out infinite;
          animation-delay: var(--cba-delay, 0s);
        }
        .cover-butterfly-glyph {
          display: block;
          width: 100%;
          height: 100%;
        }
        .cover-butterfly-wings {
          transform-box: fill-box;
          transform-origin: center;
          animation: cover-butterfly-flap var(--cba-flap, 0.7s) ease-in-out infinite alternate;
          animation-delay: var(--cba-flap-delay, 0s);
        }
        .cover-butterfly-wings path {
          fill: url(#cba-wing-gradient);
          stroke: rgb(240 200 154 / 0.3);
          stroke-width: 0.5;
        }
        .cover-butterfly-body path:first-child {
          fill: #8A5A36;
        }

        @keyframes cover-butterfly-float {
          0%   { transform: translate3d(0, 0, 0) rotate(var(--cba-tilt, 0deg)); }
          25%  { transform: translate3d(7px, -9px, 0) rotate(calc(var(--cba-tilt, 0deg) + 7deg)); }
          50%  { transform: translate3d(-3px, -14px, 0) rotate(calc(var(--cba-tilt, 0deg) - 5deg)); }
          75%  { transform: translate3d(6px, -5px, 0) rotate(calc(var(--cba-tilt, 0deg) + 3deg)); }
          100% { transform: translate3d(0, 0, 0) rotate(var(--cba-tilt, 0deg)); }
        }
        @keyframes cover-butterfly-flap {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0.32); }
        }

        /* ── Motes ───────────────────────────────────────────────────── */
        .cover-particle {
          position: absolute;
          display: block;
          border-radius: 9999px;
          background: currentColor;
          box-shadow: 0 0 6px 1px currentColor;
          opacity: 0;
          animation:
            cover-particle-drift var(--cba-drift, 6s) ease-in-out infinite,
            cover-particle-twinkle var(--cba-twinkle, 3s) ease-in-out infinite;
          animation-delay: var(--cba-delay, 0s), var(--cba-delay, 0s);
        }
        @keyframes cover-particle-drift {
          0%   { transform: translate3d(0, 0, 0); }
          50%  { transform: translate3d(var(--cba-sway, 4px), var(--cba-rise, -12px), 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        @keyframes cover-particle-twinkle {
          0%, 100% { opacity: 0.12; }
          50%      { opacity: 0.85; }
        }

        /* ── Motion opt-out (class set on <html> by the site's Motion toggle) ── */
        html.motion-off .cover-butterfly,
        html.motion-off .cover-particle {
          animation: none !important;
          opacity: 0.5;
        }
        html.motion-off .cover-butterfly {
          transform: rotate(var(--cba-tilt, 0deg));
        }
        html.motion-off .cover-butterfly-wings {
          animation: none !important;
        }
      `}</style>
    </div>
  );
}
