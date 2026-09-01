import { CircleCheck, CircleHelp, CircleX, KeyRound } from "lucide-react";
import type { AnalysisResult, AuthResult } from "@/types/analysis";
import { Panel, PanelHeader, InfoTip } from "./primitives";

const glossary: Record<string, string> = {
  SPF: "Sender Policy Framework — evidence that the sending server is authorised to send mail for the domain.",
  DKIM: "DomainKeys Identified Mail — a cryptographic signature proving the message was not altered in transit.",
  DMARC: "Domain-based Message Authentication — the policy that requires SPF or DKIM to align with the visible sender domain.",
};

const tone: Record<AuthResult, { cls: string; icon: typeof CircleCheck }> = {
  PASS: { cls: "text-severity-low border-severity-low/35 bg-severity-low/8", icon: CircleCheck },
  FAIL: { cls: "text-severity-critical border-severity-critical/40 bg-severity-critical/10", icon: CircleX },
  SOFTFAIL: { cls: "text-severity-medium border-severity-medium/35 bg-severity-medium/8", icon: CircleHelp },
  UNKNOWN: { cls: "text-severity-medium border-severity-medium/35 bg-severity-medium/8", icon: CircleHelp },
};

export function AuthenticationStatus({ result }: { result: AnalysisResult }) {
  return (
    <Panel className="animate-rise overflow-hidden">
      <PanelHeader
        title="Authentication Analysis"
        icon={<KeyRound className="size-4" aria-hidden />}
        hint="Authentication evidence parsed from the supplied headers. This prototype reports synthetic results and performs no live verification."
      />
      <div className="grid gap-3 p-5 md:grid-cols-3">
        {result.authentication.map((check) => {
          const t = tone[check.result];
          const Icon = t.icon;
          return (
            <div
              key={check.mechanism}
              tabIndex={0}
              className={`group rounded-xl border p-4 transition-transform duration-200 outline-none hover:-translate-y-1 focus-visible:-translate-y-1 ${t.cls}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 font-display text-sm font-semibold tracking-[0.2em] text-foreground">
                  {check.mechanism}
                  <InfoTip label={check.mechanism} text={glossary[check.mechanism] ?? ""} />
                </span>
                <Icon className="size-5" aria-hidden />
              </div>
              <div className="mt-3 font-mono text-lg font-bold tracking-[0.16em]">{check.result}</div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{check.explanation}</p>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
