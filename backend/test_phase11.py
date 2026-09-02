import sys
import os

sys.path.insert(0, os.path.abspath("."))

from analyzer import get_threat_level


def test_threat_level():
    # 0 - 29 -> LOW
    assert get_threat_level(0) == "LOW"
    assert get_threat_level(29) == "LOW"

    # 30 - 59 -> MEDIUM
    assert get_threat_level(30) == "MEDIUM"
    assert get_threat_level(59) == "MEDIUM"

    # 60 - 79 -> HIGH
    assert get_threat_level(60) == "HIGH"
    assert get_threat_level(79) == "HIGH"

    # 80 - 100 -> CRITICAL
    assert get_threat_level(80) == "CRITICAL"
    assert get_threat_level(100) == "CRITICAL"

    print("All Phase 11 tests passed.")


if __name__ == "__main__":
    test_threat_level()
