import { AtSign, UserSearch } from "lucide-react";
import type { AnalysisResult } from "@/types/analysis";
import { Panel, PanelHeader, SeverityBadge } from "./primitives";

function Row({ label, value, accent }: { label: string; value: string; accent?: "cyan" | "violet" | "amber" }) {
  const tone =
    accent === "violet" ? "text-cyber-violet" : accent === "amber" ? "text-severity-medium" : "text-cyber-cyan";
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border/60 bg-black/25 px-3.5 py-2.5 transition-colors hover:border-cyber-cyan/30 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <span className="font-mono text-[0.62rem] tracking-[0.18em] text-muted-foreground uppercase">{label}</span>
      <span className={`truncate font-mono text-sm ${tone}`} title={value}>
        {value}
      </span>
    </div>
  );
}

export function SenderIntelligence({ result }: { result: AnalysisResult }) {
  return (
    <Panel className="animate-rise overflow-hidden">
      <PanelHeader
        title="Sender Intelligence"
        icon={<UserSearch className="size-4" aria-hidden />}
        right={
          <span className="flex items-center gap-2">
            <span className="font-mono text-[0.58rem] tracking-[0.16em] text-muted-foreground uppercase">Domain Risk</span>
            <SeverityBadge severity={result.domain_risk} />
          </span>
        }
      />
      <div className="grid gap-2.5 p-5">
        <Row label="Sender" value={result.sender} />
        <Row label="Reply-To" value={result.reply_to} accent={result.reply_to !== result.sender ? "amber" : "cyan"} />
        <Row label="Return-Path" value={result.return_path} accent={result.return_path !== result.sender ? "amber" : "cyan"} />
        <Row label="Domain" value={result.domain} accent="violet" />
        <Row label="Message-ID" value={result.message_id} />
      </div>
      <div className="flex items-center gap-2 border-t border-border/70 px-5 py-3 text-xs text-muted-foreground">
        <AtSign className="size-3.5" aria-hidden />
        Identity fields are compared for alignment; mismatches are highlighted.
      </div>
    </Panel>
  );
}
