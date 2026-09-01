import { Settings, ShieldHalf } from "lucide-react";
import { StatusDot } from "./primitives";

const links = ["Dashboard", "Investigate", "Threat Intelligence"];

export function TopNav({ active = "Dashboard" }: { active?: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-lg border border-cyber-cyan/30 bg-cyber-cyan/10 text-cyber-cyan shadow-[0_0_24px_-6px_var(--cyber-cyan)]">
            <ShieldHalf className="size-5" aria-hidden />
          </div>
          <div className="leading-tight">
            <div className="font-display text-base font-bold tracking-[0.28em] text-foreground text-glow-cyan">
              CYBERTRACE
            </div>
            <div className="font-mono text-[0.58rem] tracking-[0.2em] text-muted-foreground uppercase">
              AI Email Forensic Intelligence
            </div>
          </div>
        </div>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <a
              key={l}
              href="#investigation"
              aria-current={l === active ? "page" : undefined}
              className={`rounded-md px-3.5 py-2 text-sm transition-colors ${
                l === active
                  ? "bg-cyber-cyan/10 text-cyber-cyan"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              }`}
            >
              {l}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-md border border-border/70 bg-white/[0.03] px-3 py-1.5 sm:flex">
            <span className="font-mono text-[0.6rem] tracking-[0.18em] text-muted-foreground uppercase">
              System Status
            </span>
            <StatusDot tone="green" />
            <span className="font-mono text-[0.65rem] font-semibold tracking-[0.16em] text-severity-low">ONLINE</span>
          </div>
          <button
            type="button"
            aria-label="Settings"
            className="grid size-9 place-items-center rounded-md border border-border/70 text-muted-foreground transition-colors hover:border-cyber-cyan/40 hover:text-cyber-cyan"
          >
            <Settings className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </header>
  );
}
