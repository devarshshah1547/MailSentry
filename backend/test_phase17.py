import sys
import os
import asyncio

sys.path.insert(0, os.path.abspath("."))

from models import EmailAnalysisRequest
from main import analyze_email


async def test_contract():
    raw_email = "Subject: test\n\nBody"
    req = EmailAnalysisRequest(email_content=raw_email)

    # 1. Call function directly
    res = await analyze_email(req)

    # 2. Convert to dict (simulating JSON transport)
    res_dict = res.model_dump()

    # 3. Define the strict required keys based on the frontend contract
    required_keys = {
        "risk_score",
        "threat_level",
        "classification",
        "sender",
        "reply_to",
        "return_path",
        "domain",
        "message_id",
        "domain_risk",
        "authentication",
        "indicators",
        "suspicious_links",
        "ips",
        "geolocation",
        "relay_path",
        "confidence",
        "forensic_summary",
        "analyzed_at",
        "source",
    }

    # Check that all required keys are present
    missing_keys = required_keys - set(res_dict.keys())
    assert not missing_keys, f"Missing keys in response: {missing_keys}"

    # Check that NO extra keys leaked
    extra_keys = set(res_dict.keys()) - required_keys
    assert not extra_keys, f"Extra keys leaking in response: {extra_keys}"

    # Check that ips has exactly origin_ip and relay_ips
    ip_keys = set(res_dict["ips"].keys())
    assert ip_keys == {
        "origin_ip",
        "relay_ips",
    }, f"IPInformation keys mismatch: {ip_keys}"

    print("All Phase 17 tests passed. Response contract strictly validated.")


if __name__ == "__main__":
    asyncio.run(test_contract())
