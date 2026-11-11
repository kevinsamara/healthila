import type { CSSProperties } from "react";

/**
 * Hero of /jus-dessert: title on the left, a playful illustration on the
 * right — someone happily sipping juice, a wobbling bottle with rising
 * bubbles, a juice splash with droplets flying out, floating fruit. Inline
 * SVG in the style of "Cara Order" (components/HowToOrder.tsx); the motion
 * lives in globals.css (jus-*) and stops under reduced motion.
 */
export function JuiceHero({ title, subtitle, gradient }: { title: string; subtitle: string; gradient: string }) {
  return (
    <section className={`relative overflow-hidden ${gradient}`}>
      <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-32 left-10 h-72 w-72 rounded-full bg-white/10" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-6 px-4 pt-12 pb-6 text-center text-white sm:pt-16 md:grid-cols-[1.05fr_1fr] md:py-16 md:text-left">
        <div>
          <h1 className="text-5xl font-extrabold sm:text-7xl">{title}</h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/90 sm:text-lg md:mx-0">{subtitle}</p>
        </div>
        <JuiceArt />
      </div>
    </section>
  );
}

const SKIN = "#f2c4a0";
const INK = "#1d2420";
const drop = (dx: number, dy: number, delay: number): CSSProperties =>
  ({ "--dx": `${dx}px`, "--dy": `${dy}px`, animationDelay: `${delay}s` }) as CSSProperties;

function JuiceArt() {
  return (
    <svg viewBox="0 0 420 320" className="mx-auto block h-auto w-full max-w-[500px]" role="img" aria-label="Orang menikmati jus segar dengan cipratan jus dan buah">
      <defs>
        <linearGradient id="jus-liquid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffb547" />
          <stop offset="1" stopColor="#ff6a4d" />
        </linearGradient>
        <clipPath id="jus-bottle-clip">
          <path d="M266 132h48v126q0 14-14 14h-20q-14 0-14-14Z" />
        </clipPath>
      </defs>

      <circle cx="215" cy="175" r="135" fill="#fff" opacity=".1" />

      {/* floating fruit */}
      <g className="jus-float" style={{ animationDelay: "0s" }}>
        {/* orange slice */}
        <circle cx="380" cy="82" r="25" fill="#ff9a52" />
        <circle cx="380" cy="82" r="20" fill="#ffc98a" />
        <g stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
          <path d="M380 64v36M362 82h36M367 69l26 26M393 69l-26 26" />
        </g>
        <circle cx="380" cy="82" r="3" fill="#fff" />
      </g>
      <g className="jus-float" style={{ animationDelay: "-1.2s" }}>
        {/* strawberry */}
        <path d="M200 44c-14 0-22 10-18 22 4 13 14 22 18 26 4-4 14-13 18-26 4-12-4-22-18-22Z" fill="#ff4d5e" />
        <path d="M188 44l12 6 12-6-6 8h-12Z" fill="#5fd38d" />
        <g fill="#ffe08a">
          <circle cx="193" cy="60" r="1.6" />
          <circle cx="205" cy="58" r="1.6" />
          <circle cx="199" cy="70" r="1.6" />
          <circle cx="190" cy="72" r="1.6" />
          <circle cx="209" cy="71" r="1.6" />
        </g>
      </g>
      <g className="jus-float" style={{ animationDelay: "-2.1s" }}>
        {/* avocado half */}
        <path d="M44 40c-14 0-20 14-20 28 0 14 9 24 20 24s20-10 20-24c0-14-6-28-20-28Z" fill="#3f7d2c" />
        <path d="M44 46c-10 0-15 11-15 22 0 11 7 19 15 19s15-8 15-19c0-11-5-22-15-22Z" fill="#d9f08a" />
        <circle cx="44" cy="72" r="8" fill="#8a5a2b" />
        <circle cx="41" cy="69" r="2.4" fill="#fff" opacity=".5" />
      </g>

      {/* splash puddle + crown behind the bottle */}
      <ellipse cx="290" cy="288" rx="78" ry="12" fill="#ff8a4d" opacity=".9" />
      <g className="jus-crown" fill="#ffa64d">
        <path d="M214 292q4-22 18-22 10 0 10 10 4-20 18-20 12 0 14 14h32q2-14 14-14 14 0 18 20 0-10 10-10 14 0 18 22Z" />
        <circle cx="232" cy="262" r="6" />
        <circle cx="260" cy="250" r="5" />
        <circle cx="320" cy="250" r="5" />
        <circle cx="348" cy="262" r="6" />
      </g>

      {/* flying droplets */}
      <g fill="#ff8a4d">
        <circle cx="236" cy="246" r="6" className="jus-drop" style={drop(-26, -30, 0)} />
        <circle cx="346" cy="244" r="6" className="jus-drop" style={drop(26, -32, -0.5)} />
        <circle cx="252" cy="232" r="4" className="jus-drop" style={drop(-14, -40, -1.1)} />
        <circle cx="330" cy="230" r="4" className="jus-drop" style={drop(16, -42, -1.6)} />
        <circle cx="222" cy="272" r="5" className="jus-drop" style={drop(-36, -12, -0.8)} />
        <circle cx="360" cy="270" r="5" className="jus-drop" style={drop(36, -14, -1.3)} />
        <ellipse cx="290" cy="226" rx="3" ry="5" className="jus-drop" style={drop(0, -36, -0.3)} />
      </g>

      {/* bottle */}
      <g className="jus-wobble">
        <rect x="272" y="68" width="36" height="20" rx="5" fill="#04724a" />
        <rect x="272" y="80" width="36" height="5" fill="#138a5c" />
        <rect x="277" y="88" width="26" height="14" fill="#fff" opacity=".85" />
        <path d="M262 112q0-12 14-14h28q14 2 14 14v148q0 16-16 16h-24q-16 0-16-16Z" fill="#fff" opacity=".9" />
        <path d="M266 132h48v126q0 14-14 14h-20q-14 0-14-14Z" fill="url(#jus-liquid)" />
        {/* rising bubbles */}
        <g clipPath="url(#jus-bottle-clip)" fill="#fff" opacity=".7">
          <circle cx="276" cy="262" r="3" className="jus-bubble" style={{ animationDelay: "0s" }} />
          <circle cx="300" cy="266" r="2.4" className="jus-bubble" style={{ animationDelay: "-0.9s" }} />
          <circle cx="288" cy="268" r="2" className="jus-bubble" style={{ animationDelay: "-1.7s" }} />
          <circle cx="307" cy="262" r="3" className="jus-bubble" style={{ animationDelay: "-2.4s" }} />
        </g>
        {/* label */}
        <rect x="271" y="172" width="38" height="46" rx="8" fill="#fff" />
        <path d="M290 182c-8 4-10 12-6 20 8-2 12-10 6-20Z" fill="#5fd38d" />
        <path d="M285 201l6-10" stroke="#04724a" strokeWidth="1.6" strokeLinecap="round" />
        <rect x="278" y="207" width="24" height="3" rx="1.5" fill="#ff8a4d" />
        <rect x="282" y="212" width="16" height="2.5" rx="1.25" fill={INK} opacity=".25" />
        <rect x="268" y="118" width="5" height="128" rx="2.5" fill="#fff" opacity=".55" />
      </g>

      {/* person sipping */}
      <g className="jus-sip">
        <path d="M66 320c0-50 24-74 62-74s62 24 62 74Z" fill="#00b1ff" />
        <path d="M112 252l16 18 16-18" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity=".8" />
        <rect x="119" y="226" width="18" height="22" rx="6" fill={SKIN} />
        <circle cx="128" cy="198" r="34" fill={SKIN} />
        {/* hair + bun */}
        <circle cx="128" cy="156" r="14" fill="#3b2a20" />
        <path d="M94 200c-4-26 12-40 34-40s38 14 34 40c-6-14-18-22-34-22-14 0-28 8-34 22Z" fill="#3b2a20" />
        <circle cx="96" cy="204" r="6" fill={SKIN} />
        {/* happy closed eyes, cheeks, sipping mouth */}
        <path d="M110 200q6-6 12 0M134 200q6-6 12 0" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <circle cx="108" cy="212" r="5" fill="#f47fb1" opacity=".5" />
        <circle cx="150" cy="212" r="5" fill="#f47fb1" opacity=".5" />
        <ellipse cx="136" cy="219" rx="3.6" ry="3" fill={INK} />
        {/* glass with straw */}
        <path d="M158 220h34l-5 46h-24Z" fill="#fff" opacity=".9" />
        <path d="M161 232h28l-3.6 31h-20.8Z" fill="url(#jus-liquid)" />
        <path d="M176 250l-4-38-30 6" stroke="#ff4d5e" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="185" cy="226" r="7" fill="#ff9a52" />
        <circle cx="185" cy="226" r="4.5" fill="#ffc98a" />
        {/* arm + hand holding the glass */}
        <path d="M182 300c4-16 2-30-8-38" stroke="#00b1ff" strokeWidth="15" fill="none" strokeLinecap="round" />
        <circle cx="168" cy="258" r="9" fill={SKIN} />
      </g>

      {/* sparkles */}
      <g className="jus-twinkle" fill="#ffd23f">
        <path d="M70 128l3 7 7 3-7 3-3 7-3-7-7-3 7-3Z" />
        <path d="M350 150l2.4 5.6 5.6 2.4-5.6 2.4-2.4 5.6-2.4-5.6-5.6-2.4 5.6-2.4Z" style={{ animationDelay: "-0.8s" }} />
        <path d="M232 112l2 4.6 4.6 2-4.6 2-2 4.6-2-4.6-4.6-2 4.6-2Z" style={{ animationDelay: "-1.5s" }} />
      </g>
      <path d="M172 150c-5-7 5-12 8-4 2-8 13-3 8 4l-8 8Z" fill="#ff4d5e" className="jus-heart" />
    </svg>
  );
}
