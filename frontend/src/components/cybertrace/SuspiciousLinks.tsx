import { Link2Off, ShieldCheck } from "lucide-react";
import type { AnalysisResult } from "@/types/analysis";
import { Panel, PanelHeader, SeverityBadge } from "./primitives";

export function SuspiciousLinks({ result }: { result: AnalysisResult }) {
  const links = result.suspicious_links;
  return (
    <Panel className="animate-rise overflow-hidden">
      <PanelHeader title="Suspicious Links" icon={<Link2Off className="size-4" aria-hidden />} />
      <div className="space-y-2.5 p-5">
        {links.length === 0 ? (
          <div className="flex items-center gap-3 rounded-lg border border-severity-low/25 bg-severity-low/8 px-4 py-6 text-sm text-severity-low">
            <ShieldCheck className="size-5" aria-hidden />
            No suspicious URLs were detected in this message.
          </div>
        ) : (
          links.map((l) => (
            <div
              key={l.url}
              className="rounded-lg border border-border/60 bg-black/25 p-3.5 transition-colors hover:border-severity-high/35"
            >
              <div className="flex items-start justify-between gap-3">
                <code
                  className="min-w-0 truncate font-mono text-sm text-severity-high"
                  title={l.url}
                  aria-label={`Detected URL ${l.url}`}
                >
                  {l.url}
                </code>
                <SeverityBadge severity={l.risk} />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{l.reason}</p>
            </div>
          ))
        )}
        <p className="pt-1 text-[0.68rem] text-muted-foreground">
          URLs are displayed as inert text only — they are never fetched or made clickable.
        </p>
      </div>
    </Panel>
  );
}
