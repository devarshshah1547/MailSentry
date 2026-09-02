from models import (
    ThreatIndicator,
    AuthenticationCheck,
    SuspiciousLink,
    RelayHop,
    Geolocation,
    ThreatLevel,
)
from parser import ParsedEmail, extract_ipv4s
from typing import List, Tuple
from urllib.parse import urlparse
import re

# Common sensitive roles that attackers impersonate
SENSITIVE_ROLES = [
    "ceo",
    "cfo",
    "cto",
    "coo",
    "president",
    "director",
    "vp",
    "manager",
    "finance",
    "support",
    "security",
    "admin",
    "it helpdesk",
]

# For the MVP, we assume these are the domains the system is protecting or trusts
TRUSTED_DOMAINS = ["company.example", "internal-corp.example", "paypal.com"]


def is_lookalike(domain1: str, domain2: str) -> bool:
    if not domain1 or not domain2 or domain1 == domain2:
        return False
    # Simple substitution heuristics
    d1_clean = (
        domain1.replace("0", "o")
        .replace("1", "l")
        .replace("1", "i")
        .replace("5", "s")
        .replace("rn", "m")
        .replace("-", "")
    )
    d2_clean = (
        domain2.replace("0", "o")
        .replace("1", "l")
        .replace("1", "i")
        .replace("5", "s")
        .replace("rn", "m")
        .replace("-", "")
    )

    if d1_clean == d2_clean and domain1 != domain2:
        return True

    brand = domain2.split(".")[0]
    if brand in domain1 and domain1 != domain2:
        # Very loose heuristic for MVP
        if "security" in domain1 or "support" in domain1 or "finance" in domain1:
            return True

    return False


def analyze_identity(email: ParsedEmail) -> List[ThreatIndicator]:
    indicators: List[ThreatIndicator] = []

    from_domain = email.from_domain
    reply_to_domain = email.reply_to_domain
    return_path_domain = email.return_path_domain
    display_name = email.from_name.lower()

    # 1. Reply-To Mismatch
    if reply_to_domain and from_domain and reply_to_domain != from_domain:
        indicators.append(
            ThreatIndicator(
                id="replyto",
                title="Reply-To Mismatch",
                severity="HIGH",
                explanation=f"Replies would be routed to an unrelated domain ({reply_to_domain}) rather than the apparent sender ({from_domain}).",
                category="identity",
            )
        )

    # 2. Sender Identity Mismatch / External Return-Path
    if return_path_domain and from_domain and return_path_domain != from_domain:
        indicators.append(
            ThreatIndicator(
                id="sender-mismatch",
                title="Sender Identity Mismatch",
                severity="MEDIUM",
                explanation=f"The underlying envelope sender ({return_path_domain}) does not match the visible From domain ({from_domain}).",
                category="identity",
            )
        )

    # 3. Executive / Role Impersonation
    is_sensitive_role = any(role in display_name for role in SENSITIVE_ROLES)

    if is_sensitive_role:
        # Claims to be a sensitive role. Are they sending from a trusted domain?
        if from_domain not in TRUSTED_DOMAINS:
            indicators.append(
                ThreatIndicator(
                    id="exec-imp",
                    title="Executive / Role Impersonation",
                    severity="CRITICAL",
                    explanation=f"Message claims to originate from a sensitive role ('{email.from_name}') but originates from an external or untrusted domain ({from_domain}).",
                    category="identity",
                )
            )

    # 4. Suspicious Domain (Lookalike)
    for trusted in TRUSTED_DOMAINS:
        if is_lookalike(from_domain, trusted):
            # Check if we already have it
            if not any(i.id == "sus-domain" for i in indicators):
                indicators.append(
                    ThreatIndicator(
                        id="sus-domain",
                        title="Suspicious Domain",
                        severity="HIGH",
                        explanation=f"Domain ({from_domain}) resembles a trusted brand but uses altered naming.",
                        category="domain",
                    )
                )
            break

    # 5. Aligned Identity (INFO)
    if not indicators:
        if from_domain and from_domain == reply_to_domain == return_path_domain:
            indicators.append(
                ThreatIndicator(
                    id="aligned-identity",
                    title="Aligned Sender Identity",
                    severity="INFO",
                    explanation="From, Reply-To and Return-Path all reference the same organisational domain.",
                    category="identity",
                )
            )
        elif from_domain and not reply_to_domain and from_domain == return_path_domain:
            indicators.append(
                ThreatIndicator(
                    id="aligned-identity",
                    title="Aligned Sender Identity",
                    severity="INFO",
                    explanation="From and Return-Path reference the same domain, with no conflicting Reply-To.",
                    category="identity",
                )
            )

    return indicators


def analyze_authentication(email: ParsedEmail) -> List[AuthenticationCheck]:
    checks: List[AuthenticationCheck] = []

    # Gather all raw strings to search for authentication results
    auth_strings = " ".join(email.auth_results + email.received_spf).lower()

    # SPF Analysis
    spf_result = "UNKNOWN"
    spf_explanation = "No usable SPF authentication evidence was found."
    if (
        "spf=pass" in auth_strings
        or "spf: pass" in auth_strings
        or "spf pass" in auth_strings
    ):
        spf_result = "PASS"
        spf_explanation = "Sending infrastructure matches the published authorization evidence for the domain."
    elif (
        "spf=fail" in auth_strings
        or "spf: fail" in auth_strings
        or "spf=hardfail" in auth_strings
    ):
        spf_result = "FAIL"
        spf_explanation = "The observed sending infrastructure does not match the expected authorization evidence."
    elif "spf=softfail" in auth_strings or "spf: softfail" in auth_strings:
        spf_result = "SOFTFAIL"
        spf_explanation = (
            "The sending infrastructure is in transition or not strictly authorized."
        )

    checks.append(
        AuthenticationCheck(
            mechanism="SPF", result=spf_result, explanation=spf_explanation
        )
    )

    # DKIM Analysis
    dkim_result = "UNKNOWN"
    dkim_explanation = (
        "No usable signature was present, so message integrity could not be evaluated."
    )
    has_dkim_sig = len(email.dkim_signatures) > 0

    if (
        "dkim=pass" in auth_strings
        or "dkim: pass" in auth_strings
        or "dkim pass" in auth_strings
    ):
        dkim_result = "PASS"
        dkim_explanation = (
            "Message signature is intact and aligned with the sending domain."
        )
    elif (
        "dkim=fail" in auth_strings
        or "dkim: fail" in auth_strings
        or "dkim fail" in auth_strings
    ):
        dkim_result = "FAIL"
        dkim_explanation = (
            "Signature validation failed or message was altered in transit."
        )
    elif has_dkim_sig:
        dkim_explanation = "A DKIM signature is present but its validation status is unknown from the headers."

    checks.append(
        AuthenticationCheck(
            mechanism="DKIM", result=dkim_result, explanation=dkim_explanation
        )
    )

    # DMARC Analysis
    dmarc_result = "UNKNOWN"
    dmarc_explanation = (
        "DMARC policy could not be established from the available evidence."
    )
    if (
        "dmarc=pass" in auth_strings
        or "dmarc: pass" in auth_strings
        or "dmarc pass" in auth_strings
    ):
        dmarc_result = "PASS"
        dmarc_explanation = (
            "Domain alignment policy is satisfied by the observed SPF or DKIM evidence."
        )
    elif (
        "dmarc=fail" in auth_strings
        or "dmarc: fail" in auth_strings
        or "dmarc fail" in auth_strings
    ):
        dmarc_result = "FAIL"
        dmarc_explanation = "Domain alignment failed for the claimed sending domain."

    checks.append(
        AuthenticationCheck(
            mechanism="DMARC", result=dmarc_result, explanation=dmarc_explanation
        )
    )

    return checks


def analyze_content(
    email: ParsedEmail,
) -> Tuple[List[ThreatIndicator], List[SuspiciousLink]]:
    indicators: List[ThreatIndicator] = []
    suspicious_links: List[SuspiciousLink] = []

    body = email.body.lower()
    subject = email.subject.lower()
    full_text = f"{subject} {body}"

    # Keyword categories
    urgency_keywords = [
        "urgent",
        "immediately",
        "within 24 hours",
        "action required",
        "final warning",
        "suspend",
    ]
    credential_keywords = [
        "verify your account",
        "confirm your identity",
        "reset password",
        "login",
        "confirm your password",
        "verify now",
    ]
    payment_keywords = [
        "wire transfer",
        "invoice attached",
        "unpaid invoice",
        "process the attached",
        "payment",
        "vendor payment",
        "confidential",
    ]

    has_urgency = any(kw in full_text for kw in urgency_keywords)
    has_credential = any(kw in full_text for kw in credential_keywords)
    has_payment = any(kw in full_text for kw in payment_keywords)

    # 1. Content Indicators
    if has_credential and has_urgency:
        indicators.append(
            ThreatIndicator(
                id="credential",
                title="Credential Harvesting Language",
                severity="HIGH",
                explanation="Body pressures the recipient to verify or confirm credentials under a deadline.",
                category="content",
            )
        )
    elif has_credential:
        indicators.append(
            ThreatIndicator(
                id="credential-mild",
                title="Suspicious Call To Action",
                severity="MEDIUM",
                explanation="Message contains requests to login or verify identity.",
                category="content",
            )
        )

    if has_payment and (has_urgency or "confidential" in full_text):
        indicators.append(
            ThreatIndicator(
                id="bec",
                title="Payment Fraud Language",
                severity="HIGH",
                explanation="Urgent or confidential financial request, common in Business Email Compromise.",
                category="content",
            )
        )
    elif has_urgency and not has_credential and not has_payment:
        indicators.append(
            ThreatIndicator(
                id="urgency",
                title="Urgency / Coercion",
                severity="LOW",
                explanation="Message contains urgent language often used to coerce recipients.",
                category="content",
            )
        )

    # 2. URL Analysis
    for url in email.urls:
        url_lower = url.lower()
        risk = "INFO"
        reason = ""

        # Plaintext HTTP
        if url_lower.startswith("http://"):
            risk = "MEDIUM"
            reason = "Link is served over plaintext HTTP."

        # Login/credential paths
        if "login" in url_lower or "session=" in url_lower or "verify" in url_lower:
            if risk == "MEDIUM":
                risk = "HIGH"
                reason = "Credential-collection page served over plaintext HTTP."
            else:
                risk = "MEDIUM"
                reason = "URL points to an external login or verification endpoint."

        # URL parsing for IP and domain lookalikes
        try:
            parsed_url = urlparse(url)
            host = parsed_url.hostname or ""

            # Check for IP-based URL
            if re.match(r"^\d+\.\d+\.\d+\.\d+$", host):
                risk = "HIGH"
                reason = "URL uses a raw IP address instead of a domain name."

            # Suspicious lookalikes in URLs
            for trusted in TRUSTED_DOMAINS:
                if is_lookalike(host, trusted):
                    risk = "CRITICAL"
                    reason = f"Lookalike domain '{host}' used in a link to deceive the recipient."
                    break
        except Exception:
            pass

        if risk in ["MEDIUM", "HIGH", "CRITICAL"]:
            # Ensure we aren't adding duplicates
            if not any(l.url == url for l in suspicious_links):
                suspicious_links.append(
                    SuspiciousLink(url=url, risk=risk, reason=reason)
                )

    # Add a general indicator if there are critical/high suspicious links
    high_risk_links = [l for l in suspicious_links if l.risk in ("HIGH", "CRITICAL")]
    if high_risk_links:
        if not any(i.id == "sus-url" for i in indicators):
            indicators.append(
                ThreatIndicator(
                    id="sus-url",
                    title="Suspicious URL",
                    severity="HIGH",
                    explanation="Message contains one or more high-risk links designed for credential harvesting or deception.",
                    category="url",
                )
            )

    return indicators, suspicious_links


def analyze_domain_risk(email: ParsedEmail) -> Tuple[str, str]:
    from_domain = email.from_domain

    if not from_domain:
        return "INFO", "Domain not evaluated (missing)."

    if from_domain in TRUSTED_DOMAINS:
        return (
            "LOW",
            "Domain is recognized as trusted internal or known good infrastructure.",
        )

    # Check for lookalike
    for trusted in TRUSTED_DOMAINS:
        if is_lookalike(from_domain, trusted):
            return (
                "CRITICAL",
                f"Domain closely resembles a trusted brand ({trusted}) but uses altered characters.",
            )

    # Check for excessive hyphens or unusual structure
    if from_domain.count("-") >= 3:
        return (
            "HIGH",
            "Domain structure is highly unusual, containing excessive hyphens typical of disposable infrastructure.",
        )

    # Check for unrelated sender/reply domains
    if email.reply_to_domain and email.reply_to_domain != from_domain:
        return (
            "MEDIUM",
            "Domain risk elevated due to mismatch between sending domain and Reply-To domain.",
        )

    # Default unknown domain
    return (
        "INFO",
        "Unknown domain; insufficient live DNS/WHOIS data for deep reputation analysis.",
    )


def analyze_relay_path(email: ParsedEmail) -> Tuple[str, List[RelayHop]]:
    relay_path: List[RelayHop] = []
    originating_ip = "Unknown"

    # Received headers are prepended by each MTA.
    # index 0 (top-most) = Final hop
    # index -1 (bottom-most) = First hop (Origin)
    # We reverse it to build a chronological timeline (Hop 1 = Origin).
    chronological_received = list(reversed(email.received_headers))

    hop_number = 1
    for rec in chronological_received:
        ips = extract_ipv4s(rec)

        # 'Received: from [IP or Domain] ...'
        # The first IP listed is usually the sending server for this hop.
        ip_address = ips[0] if ips else "Unknown"

        # Simple domain extraction heuristic from the 'from' clause
        domain = "Unknown"
        domain_match = re.search(
            r"from\s+([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})", rec, re.IGNORECASE
        )
        if domain_match:
            domain = domain_match.group(1)

        is_suspicious = False
        # For the hackathon MVP, we can flag specific test IPs or patterns as suspicious
        if ip_address in ["103.45.67.89", "1.1.1.1"]:
            is_suspicious = True

        status = "SUSPECT" if is_suspicious else "OK"

        if hop_number == 1:
            label = "Probable Originating IP"
            hop_type = "SENDER"
            originating_ip = ip_address
        elif hop_number == len(chronological_received):
            label = "Final Delivery"
            hop_type = "MX"
        else:
            label = "Intermediate Relay"
            hop_type = "MTA"

        relay_path.append(
            RelayHop(
                id=f"hop-{hop_number}",
                label=label,
                hostname=domain if domain != "Unknown" else ip_address,
                type=hop_type,
                status=status,
                detail=f"IP: {ip_address}",
            )
        )
        hop_number += 1

    return originating_ip, relay_path


def get_geolocation(ip_address: str) -> Geolocation:
    import ipaddress

    # Handle missing/unknown IP
    if not ip_address or ip_address.lower() == "unknown":
        return Geolocation(
            country="Unknown Country",
            region="Unknown Region",
            city="Unknown City",
            organization="Unknown ISP",
            latitude=0.0,
            longitude=0.0,
        )

    # Handle private/local IPs
    try:
        ip_obj = ipaddress.ip_address(ip_address)
        if ip_obj.is_private or ip_obj.is_loopback:
            return Geolocation(
                country="Internal Network",
                region="Local",
                city="Localhost",
                organization="Private Infrastructure",
                latitude=0.0,
                longitude=0.0,
            )
    except ValueError:
        pass  # Not a valid IP string

    # Mock Database for MVP
    MOCK_GEO_DB = {
        "103.45.67.89": {
            "country": "Russia",
            "region": "Leningrad Oblast",
            "city": "St. Petersburg",
            "organization": "AS12345 Bulletproof Hosting",
            "latitude": 59.9311,
            "longitude": 30.3609,
        },
        "9.9.9.9": {
            "country": "North Korea",
            "region": "Pyongyang",
            "city": "Pyongyang",
            "organization": "AS999 KPTC",
            "latitude": 39.0392,
            "longitude": 125.7625,
        },
        "1.1.1.1": {
            "country": "United States",
            "region": "California",
            "city": "San Francisco",
            "organization": "Cloudflare, Inc.",
            "latitude": 37.7749,
            "longitude": -122.4194,
        },
    }

    if ip_address in MOCK_GEO_DB:
        return Geolocation(**MOCK_GEO_DB[ip_address])

    # Fallback for unknown public IPs
    return Geolocation(
        country="Unknown Region",
        region="Unknown Region",
        city="Unknown City",
        organization="Unknown ISP",
        latitude=0.0,
        longitude=0.0,
    )


def calculate_threat_score(
    indicators: List[ThreatIndicator],
    auth_checks: List[AuthenticationCheck],
    domain_risk: str,
) -> int:
    score = 0

    # 1. Evaluate explicit ThreatIndicators
    for indicator in indicators:
        if indicator.severity == "CRITICAL":
            score += 50
        elif indicator.severity == "HIGH":
            score += 30
        elif indicator.severity == "MEDIUM":
            score += 15
        elif indicator.severity == "LOW":
            score += 5

    # 2. Evaluate Authentication Checks
    for check in auth_checks:
        if check.result == "FAIL":
            score += 20

    # 3. Evaluate overall Domain Risk
    if domain_risk == "CRITICAL":
        score += 50
    elif domain_risk == "HIGH":
        score += 30
    elif domain_risk == "MEDIUM":
        score += 15

    # Cap the final score between 0 and 100
    return min(max(score, 0), 100)


def get_threat_level(score: int) -> ThreatLevel:
    if score >= 80:
        return "CRITICAL"
    elif score >= 60:
        return "HIGH"
    elif score >= 30:
        return "MEDIUM"
    else:
        return "LOW"


def generate_forensic_summary(
    threat_level: ThreatLevel, indicators: List[ThreatIndicator]
) -> str:
    if threat_level == "LOW":
        return "No significant threats detected. Domain and content appear aligned with standard patterns."

    # Sort indicators by severity so we mention the worst ones first
    severity_rank = {"CRITICAL": 4, "HIGH": 3, "MEDIUM": 2, "LOW": 1, "INFO": 0}
    sorted_inds = sorted(
        indicators, key=lambda x: severity_rank.get(x.severity, 0), reverse=True
    )

    # Get top 2 unique indicator titles that are at least MEDIUM severity
    top_titles = []
    for ind in sorted_inds:
        if ind.severity in ["CRITICAL", "HIGH", "MEDIUM"]:
            if ind.title not in top_titles:
                top_titles.append(ind.title)
        if len(top_titles) >= 2:
            break

    includes_text = f" Includes: {', '.join(top_titles)}." if top_titles else ""

    if threat_level in ["MEDIUM", "HIGH"]:
        return f"Message exhibits anomalous characteristics requiring caution.{includes_text}"

    if threat_level == "CRITICAL":
        return f"High confidence of malicious intent.{includes_text}"

    return "Status unknown."
