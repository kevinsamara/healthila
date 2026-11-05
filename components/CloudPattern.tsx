/**
 * Soft white clouds behind "Kata Mereka" so the floating screenshots look like
 * they drift in the sky. Decorative only; drifts slowly unless reduced motion.
 */
const CLOUD = "M25 60a20 20 0 0 1 4-39.6A28 28 0 0 1 82 14a22 22 0 0 1 33 19 16 16 0 0 1-3 27Z";

const clouds = [
  { x: "2%", y: "6%", w: 220, o: 0.16, d: "0s" },
  { x: "70%", y: "3%", w: 280, o: 0.12, d: "-12s" },
  { x: "38%", y: "22%", w: 160, o: 0.1, d: "-6s" },
  { x: "84%", y: "38%", w: 200, o: 0.14, d: "-20s" },
  { x: "-4%", y: "48%", w: 260, o: 0.12, d: "-30s" },
  { x: "52%", y: "62%", w: 240, o: 0.1, d: "-16s" },
  { x: "18%", y: "80%", w: 180, o: 0.13, d: "-24s" },
  { x: "78%", y: "84%", w: 220, o: 0.11, d: "-8s" },
];

export function CloudPattern() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {clouds.map((c, i) => (
        <svg
          key={i}
          viewBox="0 0 120 64"
          className="cloud-drift absolute h-auto max-w-[45vw] fill-white"
          style={{ left: c.x, top: c.y, width: c.w, opacity: c.o, animationDelay: c.d }}
        >
          <path d={CLOUD} />
        </svg>
      ))}
    </div>
  );
}
