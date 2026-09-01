// Shape mirrors the future FastAPI `POST /analyze-email` response so mock data
// can be swapped for the real payload without touching any UI component.

export type ThreatLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | "INFO";
export type AuthResult = "PASS" | "FAIL" | "UNKNOWN" | "SOFTFAIL";

export interface AuthenticationCheck {
  mechanism: "SPF" | "DKIM" | "DMARC";
  result: AuthResult;
  explanation: string;
}

export interface ThreatIndicator {
  id: string;
  title: string;
  severity: Severity;
  explanation: string;
  category: "domain" | "identity" | "content" | "url" | "auth" | "infrastructure";
}

export interface SuspiciousLink {
  url: string;
  risk: Severity;
  reason: string;
}

export interface Geolocation {
  country: string;
  region: string;
  city: string;
  organization: string;
  latitude: number;
  longitude: number;
}

export interface RelayHop {
  id: string;
  label: string;
  hostname: string;
  type: string;
  status: "OK" | "SUSPECT" | "UNVERIFIED";
  detail: string;
}

export interface AnalysisResult {
  risk_score: number;
  threat_level: ThreatLevel;
  classification: string;
  sender: string;
  reply_to: string;
  return_path: string;
  domain: string;
  message_id: string;
  domain_risk: Severity;
  authentication: AuthenticationCheck[];
  indicators: ThreatIndicator[];
  suspicious_links: SuspiciousLink[];
  ips: { origin_ip: string; relay_ips: string[] };
  geolocation: Geolocation;
  relay_path: RelayHop[];
  confidence: number;
  forensic_summary: string;
  analyzed_at: string;
  source: "synthetic" | "api";
}

export type DemoScenario = "legitimate" | "phishing" | "spoofed";
