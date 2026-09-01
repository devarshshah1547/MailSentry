import { Globe, Mail, MessageSquareWarning, Link2, KeyRound, Server, type LucideIcon } from "lucide-react";
import type { AnalysisResult, ThreatIndicator } from "@/types/analysis";
import { Panel, PanelHeader, SeverityBadge } from "./primitives";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const icons: Record<ThreatIndicator["category"], LucideIcon> = {
  domain: Globe,
  identity: Mail,
  content: MessageSquareWarning,
  url: Link2,
  auth: KeyRound,
  infrastructure: Server,
};

export function ThreatIndicators({ result }: { result: AnalysisResult }) {
  return (
    <Panel className="animate-rise overflow-hidden">
      <PanelHeader title="Indicators" icon={<MessageSquareWarning className="size-4" aria-hidden />} />
      <div className="flex flex-wrap gap-2.5 p-5">
        {result.indicators.map((ind) => {
          const Icon = icons[ind.category];
          return (
            <Tooltip key={ind.id}>
              <TooltipTrigger className="group flex items-center gap-2.5 rounded-xl border border-border/70 bg-black/30 px-3.5 py-2.5 text-left transition-all duration-200 hover:-translate-y-1 hover:border-cyber-cyan/40 hover:shadow-[0_12px_26px_-16px_var(--cyber-cyan)] focus-visible:-translate-y-1">
                <Icon className="size-4 text-cyber-cyan" aria-hidden />
                <span className="text-sm text-foreground/90">{ind.title}</span>
                <SeverityBadge severity={ind.severity} />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs leading-relaxed">{ind.explanation}</TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </Panel>
  );
}
