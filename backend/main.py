import os
from datetime import datetime, timezone
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from models import EmailAnalysisRequest, AnalysisResponse, IPInformation
from parser import parse_raw_email
from analyzer import (
    analyze_identity,
    analyze_authentication,
    analyze_content,
    analyze_domain_risk,
    analyze_relay_path,
    get_geolocation,
    calculate_threat_score,
    get_threat_level,
    generate_forensic_summary,
)

# Load environment variables
load_dotenv()

app = FastAPI(title="MailSentry Backend", version="1.0.0")

# Configure CORS
origins_str = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173,http://localhost:8080,http://127.0.0.1:8080",
)
origins = [origin.strip() for origin in origins_str.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "MailSentry backend"}


@app.post("/analyze-email", response_model=AnalysisResponse)
async def analyze_email(request: EmailAnalysisRequest):
    if len(request.email_content) > 5_000_000:
        raise HTTPException(status_code=413, detail="Payload too large")

    try:
        # Phase 3: Parse email
        parsed = parse_raw_email(request.email_content)

        # Phases 4-9: Analysis modules
        identity_inds = analyze_identity(parsed)
        auth_checks = analyze_authentication(parsed)
        content_inds, suspicious_links = analyze_content(parsed)
        domain_risk_level, domain_risk_exp = analyze_domain_risk(parsed)
        origin_ip, relay_path = analyze_relay_path(parsed)
        geo = get_geolocation(origin_ip)

        # Aggregate indicators
        all_indicators = identity_inds + content_inds

        # Add a domain risk indicator if it's HIGH or CRITICAL to surface it
        if domain_risk_level in ["HIGH", "CRITICAL"]:
            from models import ThreatIndicator

            if not any(i.id == "sus-domain" for i in all_indicators):
                all_indicators.append(
                    ThreatIndicator(
                        id="sus-domain",
                        title="Suspicious Domain Infrastructure",
                        severity=domain_risk_level,
                        explanation=domain_risk_exp,
                        category="domain",
                    )
                )

        # Phase 10: Calculate score
        score = calculate_threat_score(all_indicators, auth_checks, domain_risk_level)

        # Phase 11: Determine threat level
        threat_level = get_threat_level(score)

        # Phase 12: Forensic summary
        summary = generate_forensic_summary(threat_level, all_indicators)

        # Map classification string based on threat level
        classification_map = {
            "LOW": "Clean",
            "MEDIUM": "Suspicious Activity",
            "HIGH": "Phishing / BEC",
            "CRITICAL": "Phishing / BEC",
        }
        classification = classification_map.get(threat_level, "Unknown")

        # IP Info
        ip_info = IPInformation(origin_ip=origin_ip, relay_ips=parsed.received_ips)

        # Phase 13: Assemble response
        return AnalysisResponse(
            risk_score=score,
            threat_level=threat_level,
            classification=classification,
            sender=parsed.from_email or "unknown",
            reply_to=parsed.reply_to_email or "unknown",
            return_path=parsed.return_path_email or "unknown",
            domain=parsed.from_domain or "unknown",
            message_id=parsed.raw_message_id or "unknown",
            domain_risk=domain_risk_level,
            authentication=auth_checks,
            indicators=all_indicators,
            suspicious_links=suspicious_links,
            ips=ip_info,
            geolocation=geo,
            relay_path=relay_path,
            confidence=95,
            forensic_summary=summary,
            analyzed_at=datetime.now(timezone.utc).isoformat(),
            source="api",
        )
    except Exception as e:
        import traceback

        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")


from demo_emails import DEMO_EMAILS


@app.get("/demo-emails")
async def get_demo_emails():
    return DEMO_EMAILS
