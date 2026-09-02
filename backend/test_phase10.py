import sys
import os

sys.path.insert(0, os.path.abspath("."))

from models import ThreatIndicator, AuthenticationCheck
from analyzer import calculate_threat_score


def test_threat_score():
    # 1. Perfectly clean (score 0)
    score1 = calculate_threat_score([], [], "LOW")
    assert score1 == 0

    # 2. Minor anomalies (score ~25)
    # 1 MEDIUM indicator = 15
    # 1 LOW indicator = 5
    # Domain Risk LOW = 0
    # Expected: 20
    inds2 = [
        ThreatIndicator(
            id="i1",
            title="test",
            severity="MEDIUM",
            explanation="test",
            category="domain",
        ),
        ThreatIndicator(
            id="i2", title="test", severity="LOW", explanation="test", category="domain"
        ),
    ]
    score2 = calculate_threat_score(inds2, [], "LOW")
    assert score2 == 20

    # 3. Obvious phishing (score > 80, caps at 100)
    # 1 CRITICAL indicator = 50
    # 1 HIGH indicator = 30
    # SPF FAIL = 20
    # Domain Risk CRITICAL = 50
    # Expected: 150 -> Capped at 100
    inds3 = [
        ThreatIndicator(
            id="i1",
            title="test",
            severity="CRITICAL",
            explanation="test",
            category="domain",
        ),
        ThreatIndicator(
            id="i2",
            title="test",
            severity="HIGH",
            explanation="test",
            category="domain",
        ),
    ]
    auth3 = [AuthenticationCheck(mechanism="SPF", result="FAIL", explanation="test")]
    score3 = calculate_threat_score(inds3, auth3, "CRITICAL")
    assert score3 == 100

    print("All Phase 10 tests passed.")


if __name__ == "__main__":
    test_threat_score()
