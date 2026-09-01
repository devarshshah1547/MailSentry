import { ShieldAlert, Gauge, Fingerprint } from "lucide-react";
import type { AnalysisResult } from "@/types/analysis";
import { Panel, threatTone, InfoTip } from "./primitives";
import { RiskScore } from "./RiskScore";

export function ThreatOverview({ result }: { result: AnalysisResult }) {
  const tone = threatTone[result.threat_level];

  return (
    <section aria-label="Analysis summary" className="animate-rise space-y-3">
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel tilt className="flex flex-col items-center justify-center gap-4 px-6 py-8 text-center">
          <div className="font-mono text-[0.62rem] tracking-[0.24em] text-muted-foreground uppercase">Threat Level</div>
          <div className="relative grid place-items-center">
            <span className="absolute size-24 rounded-full blur-2xl" style={{ background: tone.glow }} aria-hidden />
            <span
              className="relative grid size-24 place-items-center rounded-full border"
              style={{ borderColor: tone.ring, boxShadow: `0 0 30px -6px ${tone.glow}, inset 0 0 24px -10px ${tone.glow}` }}
            >
              <ShieldAlert className={`size-9 ${tone.text}`} aria-hidden />
            </span>
          </div>
          <div className={`font-display text-3xl font-bold tracking-[0.18em] ${tone.text}`}>{result.threat_level}</div>
        </Panel>

        <Panel tilt className="flex flex-col items-center justify-center gap-3 px-6 py-8 text-center">
          <div className="flex items-center gap-2 font-mono text-[0.62rem] tracking-[0.24em] text-muted-foreground uppercase">
            <Gauge className="size-3.5" aria-hidden /> Risk Score
          </div>
          <RiskScore score={result.risk_score} level={result.threat_level} />
          <p className="text-xs text-muted-foreground">Weighted from authentication, content and infrastructure evidence.</p>
        </Panel>

        <Panel tilt className="flex flex-col items-center justify-center gap-4 px-6 py-8 text-center">
          <div className="flex items-center gap-2 font-mono text-[0.62rem] tracking-[0.24em] text-muted-foreground uppercase">
            <Fingerprint className="size-3.5" aria-hidden /> Classification
          </div>
          <div className="font-display text-2xl leading-snug font-bold tracking-[0.1em] text-foreground text-glow-cyan">
            {result.classification.split(" / ").map((part, i, arr) => (
              <span key={part} className="block">
                {part}
                {i < arr.length - 1 ? " /" : ""}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            Confidence {result.confidence}%
            <InfoTip
              label="Attribution Confidence"
              text="How strongly the combined evidence supports this classification and the probable originating infrastructure. It is not a certainty score."
            />
          </div>
        </Panel>
      </div>

      <p className="text-center font-mono text-[0.62rem] tracking-[0.16em] text-muted-foreground uppercase">
        Analysis completed {new Date(result.analyzed_at).toLocaleString()} • Synthetic Investigation
      </p>
    </section>
  );
}
