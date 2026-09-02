import sys
import os

sys.path.insert(0, os.path.abspath("."))

from parser import parse_raw_email
from analyzer import analyze_content


def test_content_analysis():
    # 1. Legitimate maintenance email
    legit_email = """Subject: Scheduled maintenance window
Body: Planned maintenance for the internal reporting portal is scheduled for September 4th. No action is required from your side."""
    res1 = parse_raw_email(legit_email)
    inds1, links1 = analyze_content(res1)
    assert len(inds1) == 0
    assert len(links1) == 0

    # 2. Phishing login email (credential harvesting)
    phishing_email = """Subject: URGENT: Your account has been limited
Body: We detected unusual activity. Your account will be permanently suspended within 24 hours unless you confirm your password.
Verify now: http://secure-account-verification.example/login?session=8f21ab"""
    res2 = parse_raw_email(phishing_email)
    inds2, links2 = analyze_content(res2)
    ids2 = [i.id for i in inds2]
    assert "credential" in ids2  # Has credential + urgency
    assert "sus-url" in ids2

    # Check suspicious link
    assert len(links2) == 1
    assert links2[0].risk == "HIGH"

    # 3. Payment fraud
    payment = """Subject: Confidential - wire transfer approval
Body: I am in a meeting. Please process the attached vendor payment of 48,500 immediately."""
    res3 = parse_raw_email(payment)
    inds3, links3 = analyze_content(res3)
    ids3 = [i.id for i in inds3]
    assert "bec" in ids3

    # 4. Normal HTTPS link vs Suspicious HTTP
    links_email = "Subject: Test\n\nNormal link: https://company.example/docs\nSuspicious link: http://1.1.1.1/payload"
    res4 = parse_raw_email(links_email)
    inds4, links4 = analyze_content(res4)
    # The normal link should NOT be in suspicious_links, or if it is, risk=INFO
    # We filter out INFO from suspicious_links in our analyzer logic, we only append MEDIUM, HIGH, CRITICAL
    assert len(links4) == 1
    assert links4[0].url == "http://1.1.1.1/payload"
    assert (
        links4[0].risk == "HIGH"
    )  # IP address URL over HTTP gets HIGH due to IP-based check

    print("All Phase 6 tests passed.")


if __name__ == "__main__":
    test_content_analysis()
