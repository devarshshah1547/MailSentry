import { useState } from "react";
import { AlertTriangle, FileCode2, Play, ChevronDown, Check } from "lucide-react";
import { Panel, PanelHeader } from "./primitives";
import { DEMO_EMAILS } from "@/data/mockAnalysis";
import type { DemoScenario } from "@/types/analysis";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const scenarios: DemoScenario[] = ["legitimate", "phishing", "spoofed"];

export function EmailInput({
  value,
  onChange,
  onAnalyze,
  onLoadDemo,
  error,
  loadedDemo,
}: {
  value: string;
  onChange: (v: string) => void;
  onAnalyze: () => void;
  onLoadDemo: (s: DemoScenario) => void;
  error: string | null;
  loadedDemo: DemoScenario | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Panel tilt className="overflow-hidden" id="investigation">
      <PanelHeader
        title="Raw Email / Header Analysis"
        icon={<FileCode2 className="size-4" aria-hidden />}
        right={
          <span className="font-mono text-[0.6rem] tracking-[0.16em] text-muted-foreground uppercase">
            {value.trim() ? `${value.trim().length} chars` : "awaiting input"}
          </span>
        }
      />
      <div className="p-5">
        <label htmlFor="raw-email" className="sr-only">
          Raw email content and headers
        </label>
        <textarea
          id="raw-email"
          value={value}
          spellCheck={false}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste raw email content and headers here…"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "email-error" : undefined}
          className="h-64 w-full resize-y rounded-xl border border-border/80 bg-black/35 p-4 font-mono text-[0.8rem] leading-relaxed text-foreground/90 placeholder:text-muted-foreground/70 focus:border-cyber-cyan/50 focus:outline-none"
        />

        {error ? (
          <div
            id="email-error"
            role="alert"
            className="mt-4 flex items-start gap-2.5 rounded-lg border border-severity-high/40 bg-severity-high/10 px-3.5 py-2.5 text-sm text-severity-high"
          >
            <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>{error}</span>
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onAnalyze}
            className="group inline-flex items-center gap-2 rounded-lg border border-cyber-cyan/45 bg-cyber-cyan/15 px-5 py-2.5 text-sm font-semibold tracking-wide text-cyber-cyan transition-all hover:-translate-y-0.5 hover:bg-cyber-cyan/25 hover:shadow-[0_14px_30px_-14px_var(--cyber-cyan)]"
          >
            <Play className="size-4" aria-hidden />
            Analyze Email
          </button>

          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-lg border border-border/80 bg-white/[0.03] px-4 py-2.5 text-sm text-foreground/85 transition-colors hover:border-cyber-violet/45 hover:text-foreground">
              Load Demo
              <ChevronDown className="size-4" aria-hidden />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-72">
              <DropdownMenuLabel className="font-mono text-[0.6rem] tracking-[0.18em] uppercase">
                Synthetic scenarios
              </DropdownMenuLabel>
              {scenarios.map((s) => (
                <DropdownMenuItem key={s} onSelect={() => onLoadDemo(s)} className="flex-col items-start gap-0.5 py-2">
                  <span className="flex w-full items-center justify-between gap-2 text-sm">
                    {DEMO_EMAILS[s].label}
                    {loadedDemo === s ? <Check className="size-3.5 text-cyber-cyan" aria-hidden /> : null}
                  </span>
                  <span className="text-xs text-muted-foreground">{DEMO_EMAILS[s].description}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <p className="ml-auto max-w-xs text-right text-xs text-muted-foreground">
            Prototype uses synthetic datasets. No message content leaves this browser.
          </p>
        </div>
      </div>
    </Panel>
  );
}
