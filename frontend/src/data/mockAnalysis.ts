import type { AnalysisResult, DemoScenario } from "@/types/analysis";

const now = () => new Date().toISOString();

export const DEMO_EMAILS: Record<DemoScenario, { label: string; description: string; raw: string }> = {
  legitimate: {
    label: "Legitimate Email",
    description: "Aligned authentication, trusted infrastructure",
    raw: `Return-Path: <notifications@internal-corp.example>
Received: from mx01.internal-corp.example (mx01.internal-corp.example [203.0.113.24])
  by mail.company.example with ESMTPS; Tue, 01 Sep 2026 10:12:04 +0000
Authentication-Results: mail.company.example;
  spf=pass smtp.mailfrom=internal-corp.example;
  dkim=pass header.d=internal-corp.example;
  dmarc=pass policy.dmarc=none
Message-ID: <synthetic-legit-001@internal-corp.example>
From: IT Notifications <notifications@internal-corp.example>
Reply-To: notifications@internal-corp.example
To: analyst@company.example
Subject: Scheduled maintenance window - Sept 04

Hello,

Planned maintenance for the internal reporting portal is scheduled for
September 4th, 22:00-23:30 UTC. No action is required from your side.

- IT Operations`,
  },
  phishing: {
    label: "Phishing Email",
    description: "Lookalike domain, credential harvesting language",
    raw: `Return-Path: <mailer@randomdomain.com>
Received: from unknown (185.203.118.42)
  by mail.company.example with SMTP; Tue, 01 Sep 2026 03:41:55 +0000
Authentication-Results: mail.company.example;
  spf=fail smtp.mailfrom=paypa1-security.com;
  dkim=none; dmarc=fail
Message-ID: <synthetic-message-id@example.com>
From: PayPal Security <support@paypa1-security.com>
Reply-To: verify-account@randomdomain.com
To: analyst@company.example
Subject: URGENT: Your account has been limited

Dear Customer,

We detected unusual activity. Your account will be permanently suspended
within 24 hours unless you confirm your password and billing details.

Verify now: http://secure-account-verification.example/login?session=8f21ab

PayPal Security Team`,
  },
  spoofed: {
    label: "Spoofed / Impersonation Email",
    description: "Executive impersonation from mismatched infrastructure",
    raw: `Return-Path: <bounce@vps-relay-77.example>
Received: from vps-relay-77.example (91.202.44.108)
  by mail.company.example with SMTP; Tue, 01 Sep 2026 01:08:19 +0000
Authentication-Results: mail.company.example;
  spf=fail smtp.mailfrom=vps-relay-77.example;
  dkim=fail header.d=company.example; dmarc=fail
Message-ID: <synthetic-spoof-003@vps-relay-77.example>
From: Priya Menon (CFO) <p.menon@company.example>
Reply-To: cfo.office@company-finance.example
To: analyst@company.example
Subject: Confidential - wire transfer approval needed today

I am in a meeting and cannot take calls. Please process the attached
vendor payment of 48,500 immediately and confirm by replying here only.

Sent from my iPhone`,
  },
};

const LEGITIMATE: AnalysisResult = {
  risk_score: 12,
  threat_level: "LOW",
  classification: "LEGITIMATE",
  sender: "notifications@internal-corp.example",
  reply_to: "notifications@internal-corp.example",
  return_path: "notifications@internal-corp.example",
  domain: "internal-corp.example",
  message_id: "synthetic-legit-001@internal-corp.example",
  domain_risk: "LOW",
  authentication: [
    { mechanism: "SPF", result: "PASS", explanation: "Sending infrastructure matches the published authorization evidence for the domain." },
    { mechanism: "DKIM", result: "PASS", explanation: "Message signature is intact and aligned with the sending domain." },
    { mechanism: "DMARC", result: "PASS", explanation: "Domain alignment policy is satisfied by the observed SPF and DKIM evidence." },
  ],
  indicators: [
    { id: "aligned-identity", title: "Aligned Sender Identity", severity: "INFO", explanation: "From, Reply-To and Return-Path all reference the same organisational domain.", category: "identity" },
    { id: "known-infra", title: "Consistent Infrastructure", severity: "INFO", explanation: "Relay chain stays inside infrastructure ranges consistent with the sending organisation.", category: "infrastructure" },
  ],
  suspicious_links: [],
  ips: { origin_ip: "203.0.113.24", relay_ips: ["203.0.113.24"] },
  geolocation: { country: "Example Country", region: "Example Region", city: "Example City", organization: "Example Corporate Network", latitude: 52.37, longitude: 4.89 },
  relay_path: [
    { id: "h1", label: "SENDER", hostname: "notifications@internal-corp.example", type: "Originating mailbox", status: "OK", detail: "Authenticated submission from a corporate mail client." },
    { id: "h2", label: "MAIL SERVER", hostname: "mx01.internal-corp.example", type: "Outbound MTA", status: "OK", detail: "Signed the message with a valid DKIM selector." },
    { id: "h3", label: "INTERMEDIATE", hostname: "relay02.internal-corp.example", type: "Internal relay", status: "OK", detail: "Standard internal hand-off, no header rewriting observed." },
    { id: "h4", label: "ORIGIN IP", hostname: "203.0.113.24", type: "Earliest observed IP", status: "OK", detail: "Address falls inside the organisation's declared sending range." },
  ],
  confidence: 91,
  forensic_summary:
    "No meaningful threat indicators were observed. Authentication evidence is complete and aligned, the relay chain is internally consistent, and the message content carries no coercive or credential-seeking language.",
  analyzed_at: now(),
  source: "synthetic",
};

const PHISHING: AnalysisResult = {
  risk_score: 87,
  threat_level: "HIGH",
  classification: "PHISHING / IMPERSONATION",
  sender: "support@paypa1-security.com",
  reply_to: "verify-account@randomdomain.com",
  return_path: "mailer@randomdomain.com",
  domain: "paypa1-security.com",
  message_id: "synthetic-message-id@example.com",
  domain_risk: "HIGH",
  authentication: [
    { mechanism: "SPF", result: "FAIL", explanation: "SPF failed because the sender infrastructure does not match the expected authorization evidence." },
    { mechanism: "DKIM", result: "UNKNOWN", explanation: "No usable signature was present, so message integrity could not be evaluated." },
    { mechanism: "DMARC", result: "FAIL", explanation: "Domain alignment could not be established from the available SPF or DKIM evidence." },
  ],
  indicators: [
    { id: "sus-domain", title: "Suspicious Domain", severity: "HIGH", explanation: "Domain resembles a trusted brand but uses altered naming (digit substituted for a letter).", category: "domain" },
    { id: "replyto", title: "Reply-To Mismatch", severity: "HIGH", explanation: "Replies would be routed to an unrelated domain rather than the apparent sender.", category: "identity" },
    { id: "credential", title: "Credential Harvesting Language", severity: "HIGH", explanation: "Body pressures the recipient to confirm a password and billing details under a deadline.", category: "content" },
    { id: "sus-url", title: "Suspicious URL", severity: "HIGH", explanation: "Link points to a non-brand host over plaintext HTTP with a session-style parameter.", category: "url" },
    { id: "auth-fail", title: "Authentication Failure", severity: "MEDIUM", explanation: "SPF and DMARC evidence both fail for the claimed sending domain.", category: "auth" },
    { id: "infra", title: "Infrastructure Indicator", severity: "MEDIUM", explanation: "Earliest observed hop is a low-reputation hosting range rather than brand infrastructure.", category: "infrastructure" },
  ],
  suspicious_links: [
    { url: "http://secure-account-verification.example/login?session=8f21ab&redirect=account-billing-confirm", risk: "HIGH", reason: "Credential-collection page on a non-brand host, served over plaintext HTTP." },
    { url: "http://paypa1-security.com/track/open.gif?id=9f2b1c8e", risk: "MEDIUM", reason: "Tracking pixel on the lookalike domain used to confirm recipient activity." },
  ],
  ips: { origin_ip: "185.xxx.xxx.xxx", relay_ips: ["185.xxx.xxx.xxx", "45.xxx.xxx.xxx"] },
  geolocation: { country: "Example Country", region: "Example Region", city: "Example City", organization: "Example Hosting Provider", latitude: 47.5, longitude: 19.05 },
  relay_path: [
    { id: "h1", label: "SENDER", hostname: "support@paypa1-security.com", type: "Claimed identity", status: "SUSPECT", detail: "Display name imitates a payments brand; domain uses altered spelling." },
    { id: "h2", label: "MAIL SERVER", hostname: "smtp.randomdomain.com", type: "Submission MTA", status: "SUSPECT", detail: "Return-Path domain differs from the visible sender domain." },
    { id: "h3", label: "INTERMEDIATE", hostname: "relay-node-14.example-host", type: "Bulk relay", status: "UNVERIFIED", detail: "Shared relay commonly used to obscure the originating host." },
    { id: "h4", label: "ORIGIN IP", hostname: "185.xxx.xxx.xxx", type: "Earliest observed IP", status: "SUSPECT", detail: "Hosting range with no association to the impersonated brand." },
  ],
  confidence: 82,
  forensic_summary:
    "Email demonstrates multiple indicators consistent with phishing/impersonation. The earliest observed IP is associated with the identified infrastructure.",
  analyzed_at: now(),
  source: "synthetic",
};

const SPOOFED: AnalysisResult = {
  risk_score: 94,
  threat_level: "CRITICAL",
  classification: "SPOOFING / IMPERSONATION",
  sender: "p.menon@company.example",
  reply_to: "cfo.office@company-finance.example",
  return_path: "bounce@vps-relay-77.example",
  domain: "company.example",
  message_id: "synthetic-spoof-003@vps-relay-77.example",
  domain_risk: "CRITICAL",
  authentication: [
    { mechanism: "SPF", result: "FAIL", explanation: "The submitting host is not authorised to send on behalf of the claimed internal domain." },
    { mechanism: "DKIM", result: "FAIL", explanation: "Signature validation failed against the internal domain being impersonated." },
    { mechanism: "DMARC", result: "FAIL", explanation: "Neither SPF nor DKIM aligns with the header From domain, so alignment fails outright." },
  ],
  indicators: [
    { id: "exec-imp", title: "Executive Impersonation", severity: "CRITICAL", explanation: "Message claims to originate from an internal finance executive while failing all domain authentication.", category: "identity" },
    { id: "replyto", title: "Reply-To Mismatch", severity: "CRITICAL", explanation: "Replies are redirected to a lookalike finance domain outside the organisation.", category: "identity" },
    { id: "bec", title: "Payment Fraud Language", severity: "HIGH", explanation: "Urgent wire transfer request with an explicit instruction to avoid voice verification.", category: "content" },
    { id: "auth-fail", title: "Full Authentication Failure", severity: "HIGH", explanation: "SPF, DKIM and DMARC all fail for a domain that normally publishes an enforcing policy.", category: "auth" },
    { id: "infra", title: "Disposable Infrastructure", severity: "HIGH", explanation: "Earliest hop is a short-lived virtual private server relay unrelated to corporate mail.", category: "infrastructure" },
  ],
  suspicious_links: [
    { url: "https://company-finance.example/secure/vendor-payment-approval?ref=48500", risk: "CRITICAL", reason: "Lookalike finance domain hosting a payment approval form." },
  ],
  ips: { origin_ip: "91.xxx.xxx.xxx", relay_ips: ["91.xxx.xxx.xxx"] },
  geolocation: { country: "Example Country", region: "Example Region", city: "Example City", organization: "Example VPS Provider", latitude: 50.09, longitude: 14.42 },
  relay_path: [
    { id: "h1", label: "SENDER", hostname: "p.menon@company.example", type: "Spoofed identity", status: "SUSPECT", detail: "Header From claims an internal executive mailbox with no matching authentication." },
    { id: "h2", label: "MAIL SERVER", hostname: "vps-relay-77.example", type: "External MTA", status: "SUSPECT", detail: "Externally hosted relay submitting mail for an internal domain." },
    { id: "h3", label: "INTERMEDIATE", hostname: "edge-gw-02.example-host", type: "Edge gateway", status: "UNVERIFIED", detail: "Header rewriting observed between hops, obscuring the true submission client." },
    { id: "h4", label: "ORIGIN IP", hostname: "91.xxx.xxx.xxx", type: "Earliest observed IP", status: "SUSPECT", detail: "Virtual private server range with no relationship to corporate infrastructure." },
  ],
  confidence: 88,
  forensic_summary:
    "Message impersonates an internal executive to authorise an urgent payment while failing every available authentication check. The earliest observed IP belongs to disposable hosting infrastructure and replies are redirected to a lookalike domain.",
  analyzed_at: now(),
  source: "synthetic",
};

export const MOCK_RESULTS: Record<DemoScenario, AnalysisResult> = {
  legitimate: LEGITIMATE,
  phishing: PHISHING,
  spoofed: SPOOFED,
};

/** Very small heuristic used only to pick which synthetic dataset to display. */
export function pickMockResult(raw: string): AnalysisResult {
  const text = raw.toLowerCase();
  if (text.includes("paypa1") || text.includes("secure-account-verification")) return MOCK_RESULTS.phishing;
  if (text.includes("wire transfer") || text.includes("vps-relay") || text.includes("company-finance")) return MOCK_RESULTS.spoofed;
  if (text.includes("spf=pass") || text.includes("internal-corp")) return MOCK_RESULTS.legitimate;
  const suspicious = ["urgent", "verify", "password", "suspend", "click here", "billing"].some((w) => text.includes(w));
  return suspicious ? MOCK_RESULTS.phishing : MOCK_RESULTS.legitimate;
}
