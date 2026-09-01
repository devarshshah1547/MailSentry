import { Route, Server, ChevronRight } from "lucide-react";
import type { AnalysisResult, RelayHop } from "@/types/analysis";
import { Panel, PanelHeader } from "./primitives";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const statusTone: Record<RelayHop["status"], string> = {
  OK: "text-severity-low border-severity-low/35",
  SUSPECT: "text-severity-high border-severity-high/40",
  UNVERIFIED: "text-severity-medium border-severity-medium/35",
};

function FlowLine({ vertical = false }: { vertical?: boolean }) {
  return (
    <svg
      className={vertical ? "h-8 w-full" : "h-full w-full"}
      viewBox={vertical ? "0 0 4 32" : "0 0 100 4"}
      preserveAspectRatio="none"
      aria-hidden
    >
      <line
        x1={vertical ? 2 : 0}
        y1={vertical ? 0 : 2}
        x2={vertical ? 2 : 100}
        y2={vertical ? 32 : 2}
        stroke="var(--cyber-cyan)"
        strokeOpacity="0.25"
        strokeWidth="1.5"
      />
      <line
        x1={vertical ? 2 : 0}
        y1={vertical ? 0 : 2}
        x2={vertical ? 2 : 100}
        y2={vertical ? 32 : 2}
        stroke="var(--cyber-cyan)"
        strokeWidth="1.5"
        strokeDasharray="6 10"
        style={{ animation: "flow-dash 1.4s linear infinite", filter: "drop-shadow(0 0 4px var(--cyber-cyan))" }}
      />
    </svg>
  );
}

function Node({ hop }: { hop: RelayHop }) {
  return (
    <Tooltip>
      <TooltipTrigger
        className={`w-full rounded-xl border bg-black/30 px-3.5 py-3 text-left transition-transform duration-200 hover:-translate-y-1 focus-visible:-translate-y-1 ${statusTone[hop.status]}`}
      >
        <div className="flex items-center gap-2">
          <Server className="size-3.5" aria-hidden />
          <span className="font-mono text-[0.6rem] tracking-[0.16em] text-muted-foreground uppercase">{hop.label}</span>
        </div>
        <div className="mt-1.5 truncate font-mono text-xs text-foreground/90" title={hop.hostname}>
          {hop.hostname}
        </div>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <span className="truncate text-[0.68rem] text-muted-foreground">{hop.type}</span>
          <span className="font-mono text-[0.6rem] font-semibold tracking-[0.12em]">{hop.status}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-xs leading-relaxed">{hop.detail}</TooltipContent>
    </Tooltip>
  );
}

export function RelayPath({ result }: { result: AnalysisResult }) {
  const hops = result.relay_path;
  return (
    <Panel className="animate-rise overflow-hidden">
      <PanelHeader
        title="Relay Path"
        icon={<Route className="size-4" aria-hidden />}
        hint="Reconstructed hand-off chain from the message headers, oldest hop last."
      />
      <div className="p-5">
        <div className="hidden items-center gap-2 md:flex">
          {hops.map((hop, i) => (
            <div key={hop.id} className="flex min-w-0 flex-1 items-center gap-2">
              <div className="min-w-0 flex-1">
                <Node hop={hop} />
              </div>
              {i < hops.length - 1 ? (
                <div className="flex w-10 shrink-0 items-center">
                  <FlowLine />
                  <ChevronRight className="-ml-2 size-3.5 shrink-0 text-cyber-cyan/70" aria-hidden />
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="md:hidden">
          {hops.map((hop, i) => (
            <div key={hop.id}>
              <Node hop={hop} />
              {i < hops.length - 1 ? (
                <div className="mx-auto w-1">
                  <FlowLine vertical />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}
