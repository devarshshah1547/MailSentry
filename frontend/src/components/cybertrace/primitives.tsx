import type { ReactNode } from "react";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Severity, ThreatLevel } from "@/types/analysis";

export function Panel({
  className,
  children,
  interactive = true,
  tilt = false,
  ...rest
}: {
  className?: string;
  children: ReactNode;
  interactive?: boolean;
  tilt?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "glass-panel",
        interactive && "glass-panel-hover hover:glass-panel-hover-on",
        tilt && "tilt-card",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function PanelHeader({
  title,
  icon,
  right,
  hint,
}: {
  title: string;
  icon?: ReactNode;
  right?: ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/70 px-5 py-3.5">
      <div className="flex items-center gap-2.5">
        {icon ? <span className="text-cyber-cyan">{icon}</span> : null}
        <h2 className="font-display text-[0.78rem] font-semibold tracking-[0.22em] text-foreground/90 uppercase">
          {title}
        </h2>
        {hint ? <InfoTip label={title} text={hint} /> : null}
      </div>
      {right}
    </div>
  );
}

export function InfoTip({ label, text }: { label: string; text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger
        aria-label={`What is ${label}?`}
        className="rounded-full text-muted-foreground transition-colors hover:text-cyber-cyan"
      >
        <Info className="size-3.5" aria-hidden />
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-xs leading-relaxed">{text}</TooltipContent>
    </Tooltip>
  );
}

const severityStyles: Record<Severity, string> = {
  INFO: "text-severity-info border-severity-info/35 bg-severity-info/10",
  LOW: "text-severity-low border-severity-low/35 bg-severity-low/10",
  MEDIUM: "text-severity-medium border-severity-medium/35 bg-severity-medium/10",
  HIGH: "text-severity-high border-severity-high/40 bg-severity-high/12",
  CRITICAL: "text-severity-critical border-severity-critical/45 bg-severity-critical/14",
};

export function SeverityBadge({ severity, className }: { severity: Severity; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[0.62rem] font-semibold tracking-[0.16em]",
        severityStyles[severity],
        className,
      )}
    >
      {severity}
    </span>
  );
}

export const threatTone: Record<ThreatLevel, { text: string; ring: string; glow: string }> = {
  LOW: { text: "text-severity-low", ring: "var(--severity-low)", glow: "oklch(0.78 0.16 165 / 45%)" },
  MEDIUM: { text: "text-severity-medium", ring: "var(--severity-medium)", glow: "oklch(0.82 0.15 85 / 45%)" },
  HIGH: { text: "text-severity-high", ring: "var(--severity-high)", glow: "oklch(0.72 0.19 40 / 50%)" },
  CRITICAL: { text: "text-severity-critical", ring: "var(--severity-critical)", glow: "oklch(0.65 0.24 18 / 55%)" },
};

export function StatusDot({ tone = "cyan", className }: { tone?: "cyan" | "green" | "amber" | "red"; className?: string }) {
  const color =
    tone === "green"
      ? "bg-severity-low"
      : tone === "amber"
        ? "bg-severity-medium"
        : tone === "red"
          ? "bg-severity-critical"
          : "bg-cyber-cyan";
  return (
    <span className={cn("relative inline-flex size-2 items-center justify-center", className)}>
      <span className={cn("absolute size-2 rounded-full opacity-60 animate-pulse-soft", color)} />
      <span className={cn("size-1.5 rounded-full", color)} />
    </span>
  );
}

export function Field({ label, value, mono = true, tone }: { label: string; value: string; mono?: boolean; tone?: string }) {
  return (
    <div className="min-w-0">
      <div className="font-mono text-[0.62rem] tracking-[0.18em] text-muted-foreground uppercase">{label}</div>
      <div className={cn("mt-1 truncate text-sm text-foreground/90", mono && "font-mono", tone)} title={value}>
        {value}
      </div>
    </div>
  );
}
