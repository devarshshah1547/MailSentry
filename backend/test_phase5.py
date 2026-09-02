import sys
import os

sys.path.insert(0, os.path.abspath("."))

from parser import parse_raw_email
from analyzer import analyze_authentication


def get_mech(checks, mech):
    for c in checks:
        if c.mechanism == mech:
            return c.result
    return None


def test_auth():
    # 1. All pass
    res1 = analyze_authentication(
        parse_raw_email("Authentication-Results: spf=pass dkim=pass dmarc=pass")
    )
    assert get_mech(res1, "SPF") == "PASS"
    assert get_mech(res1, "DKIM") == "PASS"
    assert get_mech(res1, "DMARC") == "PASS"

    # 2. SPF fail
    res2 = analyze_authentication(
        parse_raw_email("Authentication-Results: spf=fail dkim=pass dmarc=pass")
    )
    assert get_mech(res2, "SPF") == "FAIL"

    # 3. DKIM fail
    res3 = analyze_authentication(
        parse_raw_email("Authentication-Results: spf=pass dkim=fail dmarc=pass")
    )
    assert get_mech(res3, "DKIM") == "FAIL"

    # 4. DMARC fail
    res4 = analyze_authentication(
        parse_raw_email("Authentication-Results: spf=fail dkim=fail dmarc=fail")
    )
    assert get_mech(res4, "DMARC") == "FAIL"

    # 5. Missing auth headers
    res5 = analyze_authentication(parse_raw_email("Subject: Hello"))
    assert get_mech(res5, "SPF") == "UNKNOWN"
    assert get_mech(res5, "DKIM") == "UNKNOWN"
    assert get_mech(res5, "DMARC") == "UNKNOWN"

    # 6. Mixed results (e.g. spf softfail)
    res6 = analyze_authentication(
        parse_raw_email("Authentication-Results: spf=softfail dkim=pass dmarc=fail")
    )
    assert get_mech(res6, "SPF") == "SOFTFAIL"
    assert get_mech(res6, "DMARC") == "FAIL"

    print("All Phase 5 tests passed.")


if __name__ == "__main__":
    test_auth()
