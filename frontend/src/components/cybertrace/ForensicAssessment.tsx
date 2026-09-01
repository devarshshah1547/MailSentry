import { ScrollText, ShieldQuestion } from "lucide-react";
import type { AnalysisResult } from "@/types/analysis";
import { Panel, PanelHeader, InfoTip } from "./primitives";

export function ForensicAssessment({ result }: { result: AnalysisResult }) {
  return (
    <Panel tilt className="animate-rise overflow-hidden">
      <PanelHeader title="Forensic Assessment" icon={<ScrollText className="size-4" aria-hidden />} />
      <div className="grid gap-6 p-6 lg:grid-cols-[220px_1fr]">
        <div className="rounded-xl border border-border/70 bg-black/25 p-4">
          <div className="flex items-center gap-1.5 font-mono text-[0.6rem] tracking-[0.18em] text-muted-foreground uppercase">
            Attribution Confidence
            <InfoTip label="Attribution Confidence" text="Strength of the evidence supporting this conclusion. It is not proof of who sent the message." />
          </div>
          <div className="mt-2 font-display text-4xl font-bold text-cyber-cyan tabular-nums text-glow-cyan">
            {result.confidence}%
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/8">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-violet"
              style={{ width: `${result.confidence}%` }}
            />
          </div>
        </div>

        <div>
          <div className="font-mono text-[0.6rem] tracking-[0.18em] text-muted-foreground uppercase">Forensic Summary</div>
          <blockquote className="mt-2 border-l-2 border-cyber-cyan/50 pl-4 text-base leading-relaxed text-foreground/95">
            {result.forensic_summary}
          </blockquote>
        </div>
      </div>
      <p className="flex items-start gap-2 border-t border-border/70 px-6 py-3.5 text-xs text-muted-foreground">
        <ShieldQuestion className="mt-0.5 size-3.5 shrink-0" aria-hidden />
        Geolocation and attribution are approximate and based on available evidence.
      </p>
    </Panel>
  );
}
