import sys
import os

sys.path.insert(0, os.path.abspath("."))

from parser import parse_raw_email
from analyzer import analyze_domain_risk


def test_domain_risk():
    # 1. Trusted domain
    res1 = parse_raw_email("From: a@company.example")
    risk1, exp1 = analyze_domain_risk(res1)
    assert risk1 == "LOW"

    # 2. Lookalike domain (e.g., c0mpany.example or paypa1.com)
    res2 = parse_raw_email("From: a@paypa1.com")
    risk2, exp2 = analyze_domain_risk(res2)
    assert risk2 == "CRITICAL"
    assert "resembles a trusted brand" in exp2

    # 3. Unrelated Reply-To domain
    res3 = parse_raw_email("From: a@somedomain.com\nReply-To: b@otherdomain.com")
    risk3, exp3 = analyze_domain_risk(res3)
    assert risk3 == "MEDIUM"

    # 4. Unknown domain
    res4 = parse_raw_email("From: a@unknown-startup.com")
    risk4, exp4 = analyze_domain_risk(res4)
    assert risk4 == "INFO"

    # 5. Unusual structure (excessive hyphens)
    res5 = parse_raw_email("From: a@my-very-long-suspicious-domain.com")
    risk5, exp5 = analyze_domain_risk(res5)
    assert risk5 == "HIGH"

    print("All Phase 7 tests passed.")


if __name__ == "__main__":
    test_domain_risk()
