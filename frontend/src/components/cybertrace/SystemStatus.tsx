import { Activity } from "lucide-react";
import { Panel, PanelHeader, StatusDot } from "./primitives";

const rows: { label: string; value: string; tone: "green" | "cyan" }[] = [
  { label: "System Status", value: "Online", tone: "green" },
  { label: "Analysis Engine", value: "Ready", tone: "green" },
  { label: "Threat Detection", value: "Active", tone: "cyan" },
  { label: "GeoLocation", value: "Available", tone: "cyan" },
  { label: "Forensics", value: "Ready", tone: "green" },
];

export function SystemStatus({ phase }: { phase: "idle" | "loading" | "result" }) {
  return (
    <Panel className="overflow-hidden">
      <PanelHeader title="Live Investigation" icon={<Activity className="size-4" aria-hidden />} />
      <div className="divide-y divide-border/50">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between gap-3 px-4 py-3">
            <span className="font-mono text-[0.62rem] tracking-[0.14em] text-muted-foreground uppercase">{r.label}</span>
            <span className="flex items-center gap-2 text-xs text-foreground/90">
              <StatusDot tone={r.tone} />
              {r.value}
            </span>
          </div>
        ))}
      </div>
      <div className="border-t border-border/70 px-4 py-3">
        <div className="font-mono text-[0.58rem] tracking-[0.16em] text-muted-foreground uppercase">Session</div>
        <div className="mt-1 font-mono text-xs text-cyber-cyan">
          {phase === "idle" ? "AWAITING INPUT" : phase === "loading" ? "ANALYSIS RUNNING" : "REPORT AVAILABLE"}
        </div>
        <div className="mt-3 h-px hairline" />
        <p className="mt-3 text-[0.68rem] leading-relaxed text-muted-foreground">
          Prototype mode — synthetic datasets only. Live telemetry connects once the analysis API is attached.
        </p>
      </div>
    </Panel>
  );
}
