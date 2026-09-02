import sys
import os

sys.path.insert(0, os.path.abspath("."))

from models import ThreatIndicator
from analyzer import generate_forensic_summary


def test_forensic_summary():
    # 1. Clean email summary
    sum1 = generate_forensic_summary("LOW", [])
    assert (
        sum1
        == "No significant threats detected. Domain and content appear aligned with standard patterns."
    )

    # 2. Suspicious email summary
    inds2 = [
        ThreatIndicator(
            id="i1",
            title="Sender Identity Mismatch",
            severity="MEDIUM",
            explanation="test",
            category="domain",
        )
    ]
    sum2 = generate_forensic_summary("MEDIUM", inds2)
    assert "Message exhibits anomalous characteristics requiring caution." in sum2
    assert "Includes: Sender Identity Mismatch." in sum2

    # 3. Malicious email summary
    inds3 = [
        ThreatIndicator(
            id="i1",
            title="Suspicious Domain",
            severity="HIGH",
            explanation="test",
            category="domain",
        ),
        ThreatIndicator(
            id="i2",
            title="Credential Harvesting Language",
            severity="CRITICAL",
            explanation="test",
            category="content",
        ),
        ThreatIndicator(
            id="i3",
            title="Low Risk Thing",
            severity="LOW",
            explanation="test",
            category="domain",
        ),
    ]
    sum3 = generate_forensic_summary("CRITICAL", inds3)
    assert "High confidence of malicious intent." in sum3
    # Should list top 2 severe indicators (CRITICAL then HIGH)
    assert "Includes: Credential Harvesting Language, Suspicious Domain." in sum3

    print("All Phase 12 tests passed.")


if __name__ == "__main__":
    test_forensic_summary()
