import { AlertTriangle, Siren } from "lucide-react";
import type { AnalysisResult } from "@/types/analysis";
import { Panel, PanelHeader, SeverityBadge } from "./primitives";

export function ThreatFindings({ result }: { result: AnalysisResult }) {
  return (
    <Panel className="animate-rise overflow-hidden">
      <PanelHeader
        title="Threat Findings"
        icon={<Siren className="size-4" aria-hidden />}
        right={
          <span className="font-mono text-[0.6rem] tracking-[0.16em] text-muted-foreground uppercase">
            {result.indicators.length} findings
          </span>
        }
      />
      <div className="divide-y divide-border/60">
        {result.indicators.map((f) => (
          <div key={f.id} className="flex items-start gap-3.5 px-5 py-4 transition-colors hover:bg-white/[0.03]">
            <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg border border-border/70 bg-black/30">
              <AlertTriangle className="size-4 text-severity-medium" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <SeverityBadge severity={f.severity} />
                <span className="text-sm font-semibold text-foreground">{f.title}</span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{f.explanation}</p>
            </div>
          </div>
        ))}
        {result.indicators.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">No threat findings were produced.</p>
        ) : null}
      </div>
    </Panel>
  );
}
