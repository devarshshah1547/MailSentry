import { useEffect, useState } from "react";
import type { ThreatLevel } from "@/types/analysis";
import { threatTone } from "./primitives";

export function RiskScore({ score, level, size = 168 }: { score: number; level: ThreatLevel; size?: number }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / 900, 1);
      setValue(Math.round(score * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const tone = threatTone[level];
  const r = 54;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <div
        className="absolute inset-4 rounded-full blur-2xl"
        style={{ background: tone.glow, opacity: 0.5 }}
        aria-hidden
      />
      <svg viewBox="0 0 140 140" className="relative size-full -rotate-90" role="img" aria-label={`Risk score ${score} of 100`}>
        <defs>
          <linearGradient id="risk-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--cyber-cyan)" />
            <stop offset="100%" stopColor={tone.ring} />
          </linearGradient>
        </defs>
        <circle cx="70" cy="70" r={r} fill="none" stroke="oklch(1 0 0 / 8%)" strokeWidth="10" />
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke="url(#risk-grad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 10px ${tone.glow})` }}
        />
        <circle cx="70" cy="70" r={r - 12} fill="none" stroke="oklch(1 0 0 / 5%)" strokeWidth="1" strokeDasharray="2 6" />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`font-display text-4xl font-bold tabular-nums ${tone.text}`}>{value}</span>
        <span className="font-mono text-[0.6rem] tracking-[0.2em] text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}
