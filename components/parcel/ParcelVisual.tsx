"use client";

/**
 * 2D parcel preview: the chosen container with the selected fruits piled on
 * top. Pure SVG so it scales crisply and animates without assets. Fruit counts
 * are illustrative — operations decide the real quantities.
 */

export type ShapeKey = "keranjang" | "box" | "tas" | "tower" | "plate";

type Slot = { x: number; y: number; s: number };

// Mound layouts per container, back rows first so front fruit overlaps them.
function rows(cx: number, baseY: number, counts: number[], gap: number, size: number, lift: number): Slot[] {
  const out: Slot[] = [];
  counts.forEach((n, r) => {
    const y = baseY - r * lift;
    const w = (n - 1) * gap;
    for (let i = 0; i < n; i++) out.push({ x: cx - w / 2 + i * gap, y, s: size - r * 2 });
  });
  return out.reverse();
}

const LAYOUT: Record<ShapeKey, Slot[]> = {
  keranjang: rows(200, 215, [6, 5, 4, 3, 1], 42, 46, 30),
  box: rows(200, 190, [5, 5, 4, 2], 44, 46, 30),
  tas: rows(200, 150, [4, 3, 2], 42, 44, 30),
  tower: [
    ...rows(200, 268, [5], 40, 40, 0),
    ...rows(200, 196, [4], 40, 38, 0),
    ...rows(200, 126, [3], 38, 36, 0),
    ...rows(200, 62, [1], 0, 40, 0),
  ],
  plate: rows(200, 230, [7, 6, 4, 2], 40, 42, 26),
};

export function ParcelVisual({
  shape,
  fruits,
  ribbon,
  card,
}: {
  shape: ShapeKey;
  fruits: { emoji: string; art: string | null }[]; // one per selected fruit type
  ribbon: string; // colour
  card: string | null;
}) {
  const slots = LAYOUT[shape];
  // Spread the selected fruits evenly across the slots.
  const placed = fruits.length ? slots.map((slot, i) => ({ ...slot, f: fruits[(i * 7 + Math.floor(i / fruits.length)) % fruits.length] })) : [];

  return (
    <svg viewBox="0 0 400 360" className="h-full w-full" role="img" aria-label="Pratinjau parcel">
      <defs>
        <linearGradient id="weave" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#d9a35f" />
          <stop offset="1" stopColor="#a8692c" />
        </linearGradient>
        <linearGradient id="kraft" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#e9cfa3" />
          <stop offset="1" stopColor="#caa16a" />
        </linearGradient>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity="0.18" />
        </filter>
      </defs>

      <ellipse cx="200" cy="338" rx="150" ry="14" fill="#000" opacity="0.08" />

      {/* Back part of the container (behind fruit) */}
      {shape === "keranjang" && (
        <path d="M70 200 Q200 40 330 200" fill="none" stroke="#a8692c" strokeWidth="12" strokeLinecap="round" />
      )}
      {shape === "tas" && (
        <>
          <path d="M140 150 Q140 80 175 80 Q205 80 205 150" fill="none" stroke="#8a5a2b" strokeWidth="7" />
          <path d="M195 150 Q195 80 230 80 Q262 80 262 150" fill="none" stroke="#8a5a2b" strokeWidth="7" />
        </>
      )}
      {shape === "tower" && (
        <g fill="#f4efe6" stroke="#d8cfbf" strokeWidth="2" filter="url(#soft)">
          <ellipse cx="200" cy="290" rx="120" ry="16" />
          <ellipse cx="200" cy="218" rx="95" ry="13" />
          <ellipse cx="200" cy="148" rx="72" ry="11" />
          <rect x="196" y="140" width="8" height="150" fill="#d8cfbf" stroke="none" />
        </g>
      )}

      {/* Fruit */}
      <g>
        {placed.map((p, i) =>
          p.f.art ? (
            <image
              key={`${shape}-${i}-${p.f.art}`}
              href={p.f.art}
              x={p.x - p.s * 0.62}
              y={p.y - p.s * 0.62}
              width={p.s * 1.24}
              height={p.s * 1.24}
              className="parcel-pop"
              style={{ animationDelay: `${i * 25}ms` }}
            />
          ) : (
            // No illustration for this fruit: a plain fruit-coloured ball.
            <circle
              key={`${shape}-${i}-ball`}
              cx={p.x}
              cy={p.y}
              r={p.s * 0.42}
              fill={["#f97316", "#84cc16", "#e11d48", "#facc15", "#a855f7"][i % 5]}
              stroke="#fff"
              strokeWidth={2}
              className="parcel-pop"
              style={{ animationDelay: `${i * 25}ms` }}
            />
          ),
        )}
      </g>

      {/* Front of the container (over the fruit) */}
      {shape === "keranjang" && (
        <g filter="url(#soft)">
          <path d="M55 210 L345 210 L310 320 Q200 340 90 320 Z" fill="url(#weave)" />
          {[235, 260, 285, 308].map((y) => (
            <path key={y} d={`M${62 + (y - 210) * 0.32} ${y} L${338 - (y - 210) * 0.32} ${y}`} stroke="#8a5523" strokeWidth="3" opacity="0.5" />
          ))}
          {Array.from({ length: 12 }, (_, i) => 70 + i * 24).map((x) => (
            <path key={x} d={`M${x} 212 L${x + (200 - x) * 0.12} 322`} stroke="#8a5523" strokeWidth="2" opacity="0.35" />
          ))}
          <rect x="48" y="200" width="304" height="18" rx="9" fill="#c08441" />
        </g>
      )}
      {shape === "box" && (
        <g filter="url(#soft)">
          <rect x="70" y="190" width="260" height="130" rx="10" fill="url(#kraft)" />
          <rect x="70" y="190" width="260" height="20" rx="6" fill="#b88a52" />
          <rect x="185" y="190" width="30" height="130" fill={ribbon} opacity="0.9" />
        </g>
      )}
      {shape === "tas" && (
        <g filter="url(#soft)">
          <path d="M105 150 L295 150 L310 322 L90 322 Z" fill="url(#kraft)" />
          <path d="M105 150 L295 150 L292 172 L108 172 Z" fill="#b88a52" opacity="0.6" />
        </g>
      )}
      {shape === "plate" && (
        <g filter="url(#soft)">
          <ellipse cx="200" cy="262" rx="170" ry="40" fill="#fbfaf7" stroke="#e5ded1" strokeWidth="3" />
          <ellipse cx="200" cy="256" rx="140" ry="28" fill="none" stroke="#efe9de" strokeWidth="2" />
        </g>
      )}

      {/* Bow */}
      {shape !== "plate" && (
        <g transform={shape === "keranjang" ? "translate(200 62)" : shape === "tas" ? "translate(200 158)" : shape === "tower" ? "translate(200 300)" : "translate(200 196)"}>
          <path d="M0 0 C-30 -22 -46 6 -20 12 Z M0 0 C30 -22 46 6 20 12 Z" fill={ribbon} />
          <path d="M-4 4 L-16 34 M4 4 L16 34" stroke={ribbon} strokeWidth="6" strokeLinecap="round" />
          <circle r="7" fill={ribbon} stroke="#fff" strokeOpacity="0.4" strokeWidth="2" />
        </g>
      )}

      {/* Greeting card */}
      {card && (
        <g transform="translate(300 240) rotate(8)" filter="url(#soft)">
          <rect x="-46" y="-30" width="92" height="62" rx="6" fill="#fff" />
          <rect x="-46" y="-30" width="92" height="10" rx="4" fill={ribbon} opacity="0.85" />
          <foreignObject x="-40" y="-16" width="80" height="44">
            <p style={{ fontSize: 8, lineHeight: "10px", color: "#1d2420", fontStyle: "italic", overflow: "hidden", margin: 0 }}>{card}</p>
          </foreignObject>
        </g>
      )}

      {!fruits.length && (
        <text x="200" y="130" textAnchor="middle" fontSize="15" fill="#5c6862">
          Pilih buah untuk mengisi parcel
        </text>
      )}
    </svg>
  );
}
