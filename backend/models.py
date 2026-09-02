from pydantic import BaseModel, Field, field_validator
from typing import List, Literal


class EmailAnalysisRequest(BaseModel):
    email_content: str = Field(..., description="Raw email content to analyze")

    @field_validator("email_content")
    @classmethod
    def check_not_empty(cls, v: str) -> str:
        # Only trim leading/trailing whitespace of the overall string,
        # do not arbitrarily destroy internal raw email formatting.
        trimmed = v.strip()
        if not trimmed:
            raise ValueError("email_content cannot be empty or only whitespace")
        return trimmed


ThreatLevel = Literal[
    "LOW", "MEDIUM", "HIGH", "CRITICAL"
]
Severity = Literal["LOW", "MEDIUM", "HIGH", "CRITICAL", "INFO"]
AuthResult = Literal["PASS", "FAIL", "UNKNOWN", "SOFTFAIL"]
AuthMechanism = Literal["SPF", "DKIM", "DMARC"]
IndicatorCategory = Literal[
    "domain", "identity", "content", "url", "auth", "infrastructure"
]
RelayStatus = Literal["OK", "SUSPECT", "UNVERIFIED"]


class AuthenticationCheck(BaseModel):
    mechanism: AuthMechanism
    result: AuthResult
    explanation: str


class ThreatIndicator(BaseModel):
    id: str
    title: str
    severity: Severity
    explanation: str
    category: IndicatorCategory


class SuspiciousLink(BaseModel):
    url: str
    risk: Severity
    reason: str


class Geolocation(BaseModel):
    country: str
    region: str
    city: str
    organization: str
    latitude: float
    longitude: float


class RelayHop(BaseModel):
    id: str
    label: str
    hostname: str
    type: str
    status: RelayStatus
    detail: str


class IPInformation(BaseModel):
    origin_ip: str
    relay_ips: List[str]


class AnalysisResponse(BaseModel):
    risk_score: int = Field(..., ge=0, le=100)
    threat_level: ThreatLevel
    classification: str

    sender: str
    reply_to: str
    return_path: str
    domain: str
    message_id: str

    domain_risk: Severity

    authentication: List[AuthenticationCheck]
    indicators: List[ThreatIndicator]
    suspicious_links: List[SuspiciousLink]

    ips: IPInformation
    geolocation: Geolocation
    relay_path: List[RelayHop]

    confidence: int = Field(..., ge=0, le=100)
    forensic_summary: str
    analyzed_at: str
    source: Literal["synthetic", "api"]
