import { Globe2, MapPin } from "lucide-react";
import type { AnalysisResult } from "@/types/analysis";
import { Panel, PanelHeader, Field, InfoTip } from "./primitives";

function GlobeViz({ lat, lon }: { lat: number; lon: number }) {
  // Simple orthographic-ish projection for a decorative marker.
  const x = 70 + (lon / 180) * 52;
  const y = 70 - (lat / 90) * 52;
  return (
    <div className="relative grid place-items-center">
      <span className="absolute size-28 rounded-full bg-cyber-cyan/20 blur-2xl" aria-hidden />
      <svg viewBox="0 0 140 140" className="relative size-40" role="img" aria-label="Approximate origin marker on a stylised globe">
        <circle cx="70" cy="70" r="54" fill="oklch(0.2 0.03 250 / 60%)" stroke="var(--cyber-cyan)" strokeOpacity="0.35" />
        {[18, 34, 46].map((r) => (
          <ellipse key={r} cx="70" cy="70" rx={r} ry="54" fill="none" stroke="var(--cyber-cyan)" strokeOpacity="0.16" />
        ))}
        {[-34, -16, 0, 16, 34].map((dy) => (
          <line key={dy} x1="16" y1={70 + dy} x2="124" y2={70 + dy} stroke="var(--cyber-cyan)" strokeOpacity="0.14" />
        ))}
        <circle cx={x} cy={y} r="9" fill="var(--severity-high)" fillOpacity="0.18" className="animate-pulse-soft" />
        <circle cx={x} cy={y} r="3.2" fill="var(--severity-high)" style={{ filter: "drop-shadow(0 0 6px var(--severity-high))" }} />
      </svg>
    </div>
  );
}

export function OriginIntelligence({ result }: { result: AnalysisResult }) {
  const g = result.geolocation;
  return (
    <Panel tilt className="animate-rise overflow-hidden">
      <PanelHeader
        title="Origin Intelligence"
        icon={<Globe2 className="size-4" aria-hidden />}
        right={
          <span className="rounded-md border border-cyber-violet/35 bg-cyber-violet/10 px-2 py-0.5 font-mono text-[0.58rem] tracking-[0.14em] text-cyber-violet uppercase">
            Probable Originating Infrastructure
          </span>
        }
      />
      <div className="grid gap-6 p-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <Field label="Origin IP" value={result.ips.origin_ip} tone="text-cyber-cyan" />
            <InfoTip label="IP" text="The earliest externally observed IP address in the relay chain — the closest available proxy for where the message entered public infrastructure." />
          </div>
          <Field label="Country" value={g.country} mono={false} />
          <Field label="Region" value={g.region} mono={false} />
          <Field label="City" value={g.city} mono={false} />
          <Field label="ISP / Organization" value={g.organization} mono={false} />
          <div>
            <div className="flex items-center gap-1.5 font-mono text-[0.62rem] tracking-[0.18em] text-muted-foreground uppercase">
              Attribution Confidence
              <InfoTip label="Attribution Confidence" text="Strength of the evidence linking this message to the identified infrastructure. Not a claim about a person or a physical location." />
            </div>
            <div className="mt-2 flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/8">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-violet transition-[width] duration-700"
                  style={{ width: `${result.confidence}%` }}
                />
              </div>
              <span className="font-mono text-sm font-semibold text-cyber-cyan tabular-nums">{result.confidence}%</span>
            </div>
          </div>
        </div>
        <GlobeViz lat={g.latitude} lon={g.longitude} />
      </div>
      <p className="flex items-start gap-2 border-t border-border/70 px-5 py-3 text-xs text-muted-foreground">
        <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden />
        Indicates probable originating infrastructure only. This is not a determination of the sender&apos;s physical location.
      </p>
    </Panel>
  );
}
