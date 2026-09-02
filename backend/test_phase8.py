import sys
import os

sys.path.insert(0, os.path.abspath("."))

from parser import parse_raw_email
from analyzer import analyze_relay_path


def test_relay_path():
    # 1. Single hop
    single = """Received: from client.example (1.2.3.4) by mx.example; Tue, 1 Jan 2026 12:00:00 +0000"""
    res1 = parse_raw_email(single)
    ip1, path1 = analyze_relay_path(res1)
    assert ip1 == "1.2.3.4"
    assert len(path1) == 1
    assert path1[0].id == "hop-1"
    assert "1.2.3.4" in path1[0].detail
    assert path1[0].hostname == "client.example"

    # 2. Multi hop (top is final hop, bottom is first hop)
    multi = """Received: from mx2.example (5.6.7.8) by final.example; Tue, 1 Jan 2026 12:05:00 +0000
Received: from mx1.example (103.45.67.89) by mx2.example; Tue, 1 Jan 2026 12:03:00 +0000
Received: from sender.malicious (9.9.9.9) by mx1.example; Tue, 1 Jan 2026 12:01:00 +0000"""
    res2 = parse_raw_email(multi)
    ip2, path2 = analyze_relay_path(res2)

    assert ip2 == "9.9.9.9"  # Bottom-most is origin
    assert len(path2) == 3

    # Chronological checks
    assert path2[0].id == "hop-1"
    assert "9.9.9.9" in path2[0].detail
    assert path2[0].hostname == "sender.malicious"

    assert path2[1].id == "hop-2"
    assert "103.45.67.89" in path2[1].detail
    assert path2[1].status == "SUSPECT"  # Our hardcoded malicious IP for MVP

    assert path2[2].id == "hop-3"
    assert "5.6.7.8" in path2[2].detail

    # 3. No hops (graceful fallback)
    res3 = parse_raw_email("Subject: No received headers")
    ip3, path3 = analyze_relay_path(res3)
    assert ip3 == "Unknown"
    assert len(path3) == 0

    print("All Phase 8 tests passed.")


if __name__ == "__main__":
    test_relay_path()
