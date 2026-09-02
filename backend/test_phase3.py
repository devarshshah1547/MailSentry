import sys
import os

sys.path.insert(0, os.path.abspath("."))
from parser import parse_raw_email


def test_parser():
    # 1. Complete legitimate email
    legit_email = """Return-Path: <notifications@internal-corp.example>
Received: from mx01.internal-corp.example (mx01.internal-corp.example [203.0.113.24])
  by mail.company.example with ESMTPS; Tue, 01 Sep 2026 10:12:04 +0000
Authentication-Results: mail.company.example;
  spf=pass smtp.mailfrom=internal-corp.example;
  dkim=pass header.d=internal-corp.example;
  dmarc=pass policy.dmarc=none
Message-ID: <synthetic-legit-001@internal-corp.example>
From: IT Notifications <notifications@internal-corp.example>
Reply-To: notifications@internal-corp.example
To: analyst@company.example
Subject: Scheduled maintenance window - Sept 04

Hello,
Planned maintenance for the internal reporting portal is scheduled for
September 4th, 22:00-23:30 UTC. No action is required from your side.
- IT Operations
"""
    res1 = parse_raw_email(legit_email)
    assert res1.from_email == "notifications@internal-corp.example"
    assert (
        res1.return_path_email == "notifications@internal-corp.example"
    ), f"Got: {res1.return_path_email}"
    assert "203.0.113.24" in res1.received_ips
    assert "spf=pass" in res1.auth_results[0]

    # 2. Phishing email
    phishing_email = """Return-Path: <mailer@randomdomain.com>
Received: from unknown (185.203.118.42)
  by mail.company.example with SMTP; Tue, 01 Sep 2026 03:41:55 +0000
From: PayPal Security <support@paypa1-security.com>
Reply-To: verify-account@randomdomain.com
Subject: URGENT: Your account has been limited

Verify now: http://secure-account-verification.example/login?session=8f21ab
"""
    res2 = parse_raw_email(phishing_email)
    assert res2.from_domain == "paypa1-security.com"
    assert res2.reply_to_domain == "randomdomain.com"
    assert (
        "http://secure-account-verification.example/login?session=8f21ab" in res2.urls
    )

    # 3. Spoofed email
    spoofed = """From: Priya Menon (CFO) <p.menon@company.example>
Reply-To: cfo.office@company-finance.example
Subject: Confidential - wire transfer approval needed today

Please process 48,500 immediately.
"""
    res3 = parse_raw_email(spoofed)
    assert res3.from_name == "Priya Menon (CFO)"
    assert res3.from_email == "p.menon@company.example"
    assert res3.reply_to_domain == "company-finance.example"

    # 4. Missing Reply-To
    missing_rt = """From: a@a.com\nTo: b@b.com\n\nBody"""
    res4 = parse_raw_email(missing_rt)
    assert res4.reply_to_email == ""

    # 5. Missing Auth headers
    missing_auth = """From: a@a.com\n\nBody"""
    res5 = parse_raw_email(missing_auth)
    assert len(res5.auth_results) == 0

    # 6. Multiple Received headers
    multi_recv = """Received: hop3 (1.1.1.1)
Received: hop2 (2.2.2.2)
Received: hop1 (3.3.3.3)
From: a@a.com\n\nBody"""
    res6 = parse_raw_email(multi_recv)
    assert res6.received_ips == ["1.1.1.1", "2.2.2.2", "3.3.3.3"]

    # 7. Malformed/minimal email
    malformed = """Just some random text without proper headers."""
    res7 = parse_raw_email(malformed)
    assert res7.from_email == ""
    assert res7.subject == ""

    print("All Phase 3 tests passed.")


if __name__ == "__main__":
    test_parser()
