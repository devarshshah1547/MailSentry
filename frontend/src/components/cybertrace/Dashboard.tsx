import { useCallback, useRef, useState } from "react";
import { RotateCcw, Terminal } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TopNav } from "./TopNav";
import { EmailInput } from "./EmailInput";
import { AnalysisLoader, TOTAL_MS } from "./AnalysisLoader";
import { ThreatOverview } from "./ThreatOverview";
import { SenderIntelligence } from "./SenderIntelligence";
import { AuthenticationStatus } from "./AuthenticationStatus";
import { ThreatFindings } from "./ThreatFindings";
import { SuspiciousLinks } from "./SuspiciousLinks";
import { OriginIntelligence } from "./OriginIntelligence";
import { RelayPath } from "./RelayPath";
import { ThreatIndicators } from "./ThreatIndicators";
import { ForensicAssessment } from "./ForensicAssessment";
import { SystemStatus } from "./SystemStatus";
import { Panel } from "./primitives";
import { DEMO_EMAILS } from "@/data/mockAnalysis";
import { analyzeEmail, AnalysisError, EMPTY_INPUT_MESSAGE } from "@/lib/analyze-email";
import type { AnalysisResult, DemoScenario } from "@/types/analysis";

type Phase = "idle" | "loading" | "result";

export function Dashboard() {
  const [raw, setRaw] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [demo, setDemo] = useState<DemoScenario | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!raw.trim()) {
      setError(EMPTY_INPUT_MESSAGE);
      return;
    }
    setError(null);
    setPhase("loading");
    const started = Date.now();
    try {
      const data = await analyzeEmail(raw);
      const wait = Math.max(0, TOTAL_MS - (Date.now() - started));
      timer.current = setTimeout(() => {
        setResult(data);
        setPhase("result");
      }, wait);
    } catch (e) {
      setPhase("idle");
      setError(e instanceof AnalysisError ? e.message : "Unable to analyze email. Please try again.");
    }
  }, [raw]);

  const handleReset = () => {
    if (timer.current) clearTimeout(timer.current);
    setResult(null);
    setPhase("idle");
    setError(null);
    setRaw("");
    setDemo(null);
  };

  const loadDemo = (s: DemoScenario) => {
    setRaw(DEMO_EMAILS[s].raw);
    setDemo(s);
    setError(null);
    setResult(null);
    setPhase("idle");
  };

  return (
    <TooltipProvider delayDuration={120}>
      <div className="min-h-dvh">
        <div className="cyber-backdrop" aria-hidden />
        <div className="cyber-grid" aria-hidden />
        <TopNav />

        <main className="mx-auto max-w-[1600px] px-4 pt-10 pb-20 sm:px-6">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_290px]">
            <div className="min-w-0 space-y-6">
              <section className="max-w-3xl">
                <p className="flex items-center gap-2 font-mono text-[0.62rem] tracking-[0.28em] text-cyber-cyan uppercase">
                  <Terminal className="size-3.5" aria-hidden /> Forensic Investigation Console
                </p>
                <h1 className="mt-3 font-display text-4xl leading-[1.05] font-bold tracking-tight text-foreground sm:text-5xl">
                  <span className="block text-glow-cyan">EMAIL THREAT</span>
                  <span className="block bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-violet bg-clip-text text-transparent">
                    INVESTIGATION
                  </span>
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Analyze suspicious email content, trace infrastructure, identify threat indicators and generate a
                  forensic assessment.
                </p>
              </section>

              {phase === "result" && result ? (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-mono text-[0.62rem] tracking-[0.2em] text-muted-foreground uppercase">
                      Investigation report • Synthetic dataset
                    </p>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center gap-2 rounded-lg border border-border/80 bg-white/[0.03] px-4 py-2 text-sm text-foreground/85 transition-colors hover:border-cyber-cyan/45 hover:text-cyber-cyan"
                    >
                      <RotateCcw className="size-4" aria-hidden />
                      New Investigation
                    </button>
                  </div>

                  <ThreatOverview result={result} />

                  <div className="grid gap-6 2xl:grid-cols-2">
                    <SenderIntelligence result={result} />
                    <AuthenticationStatus result={result} />
                  </div>

                  <div className="grid gap-6 2xl:grid-cols-2">
                    <ThreatFindings result={result} />
                    <div className="space-y-6">
                      <SuspiciousLinks result={result} />
                      <ThreatIndicators result={result} />
                    </div>
                  </div>

                  <OriginIntelligence result={result} />
                  <RelayPath result={result} />
                  <ForensicAssessment result={result} />
                </>
              ) : (
                <>
                  <EmailInput
                    value={raw}
                    onChange={(v) => {
                      setRaw(v);
                      if (error) setError(null);
                    }}
                    onAnalyze={handleAnalyze}
                    onLoadDemo={loadDemo}
                    error={error}
                    loadedDemo={demo}
                  />
                  {phase === "loading" ? (
                    <AnalysisLoader />
                  ) : (
                    <Panel interactive={false} className="p-6">
                      <h2 className="font-display text-sm font-semibold tracking-[0.2em] text-foreground/90 uppercase">
                        How this investigation works
                      </h2>
                      <ol className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
                        {[
                          "Paste a raw email with headers, or load one of the three synthetic scenarios.",
                          "The engine parses identity, authentication, content and relay evidence.",
                          "A scored forensic report is produced with probable originating infrastructure.",
                        ].map((t, i) => (
                          <li key={t} className="rounded-lg border border-border/60 bg-black/20 p-4">
                            <span className="font-mono text-xs text-cyber-cyan">0{i + 1}</span>
                            <p className="mt-2 leading-relaxed">{t}</p>
                          </li>
                        ))}
                      </ol>
                    </Panel>
                  )}
                </>
              )}
            </div>

            <aside className="xl:sticky xl:top-24 xl:self-start">
              <SystemStatus phase={phase} />
            </aside>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
