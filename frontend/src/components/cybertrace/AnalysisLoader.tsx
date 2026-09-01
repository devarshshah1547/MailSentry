import { useEffect, useState } from "react";
import { Check, Loader2, Radar } from "lucide-react";
import { Panel, PanelHeader } from "./primitives";

export const ANALYSIS_STEPS = [
  "Receiving email data",
  "Parsing headers",
  "Extracting sender information",
  "Checking SPF / DKIM / DMARC",
  "Detecting suspicious indicators",
  "Tracing IP infrastructure",
  "Resolving approximate geolocation",
  "Generating forensic assessment",
];

export const STEP_MS = 380;
export const TOTAL_MS = ANALYSIS_STEPS.length * STEP_MS;

export function AnalysisLoader() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => Math.min(s + 1, ANALYSIS_STEPS.length)), STEP_MS);
    return () => clearInterval(id);
  }, []);

  const pct = Math.round((step / ANALYSIS_STEPS.length) * 100);

  return (
    <Panel interactive={false} className="animate-rise overflow-hidden">
      <PanelHeader title="Investigation In Progress" icon={<Radar className="size-4 animate-pulse-soft" aria-hidden />} />
      <div className="p-5">
        <div className="relative h-1.5 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-violet transition-[width] duration-300"
            style={{ width: `${pct}%` }}
          />
          <span className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent [animation:sweep_1.4s_linear_infinite]" />
        </div>

        <ol className="mt-5 grid gap-2 sm:grid-cols-2" aria-live="polite">
          {ANALYSIS_STEPS.map((label, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <li
                key={label}
                className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition-colors ${
                  done
                    ? "border-severity-low/25 bg-severity-low/8 text-foreground/85"
                    : active
                      ? "border-cyber-cyan/40 bg-cyber-cyan/10 text-cyber-cyan"
                      : "border-border/50 text-muted-foreground/70"
                }`}
              >
                {done ? (
                  <Check className="size-3.5 text-severity-low" aria-hidden />
                ) : active ? (
                  <Loader2 className="size-3.5 animate-spin" aria-hidden />
                ) : (
                  <span className="size-1.5 rounded-full bg-current opacity-50" />
                )}
                <span className="truncate">{label}</span>
              </li>
            );
          })}
        </ol>
        <p className="mt-4 font-mono text-[0.62rem] tracking-[0.16em] text-muted-foreground uppercase">
          Correlating synthetic evidence • {pct}%
        </p>
      </div>
    </Panel>
  );
}
