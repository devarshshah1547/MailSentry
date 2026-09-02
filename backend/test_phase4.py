import sys
import os

sys.path.insert(0, os.path.abspath("."))

from parser import parse_raw_email
from analyzer import analyze_identity


def test_identity_analysis():
    # 1. Aligned Sender
    legit_email = """Return-Path: <notifications@internal-corp.example>
From: IT Notifications <notifications@internal-corp.example>
Reply-To: notifications@internal-corp.example
To: analyst@company.example
Subject: Test

Body
"""
    parsed1 = parse_raw_email(legit_email)
    inds1 = analyze_identity(parsed1)
    assert len(inds1) == 1
    assert inds1[0].id == "aligned-identity"
    print("Aligned sender tested OK.")

    # 2. Mismatched Reply-To & Suspicious Domain
    phishing = """Return-Path: <mailer@randomdomain.com>
From: PayPal Security <support@paypa1.com>
Reply-To: verify-account@randomdomain.com
Subject: URGENT

Body
"""
    parsed2 = parse_raw_email(phishing)
    inds2 = analyze_identity(parsed2)
    ids = [i.id for i in inds2]
    assert "replyto" in ids
    assert "sender-mismatch" in ids
    assert "sus-domain" in ids
    assert "exec-imp" in ids  # "security" is a sensitive role
    print("Mismatched Reply-To & Lookalike tested OK.")

    # 3. Executive Impersonation & External Return-Path
    spoofed = """Return-Path: <bounce@vps-relay-77.example>
From: Priya Menon (CFO) <p.menon@company-finance.example>
Reply-To: cfo.office@company-finance.example
Subject: Confidential - wire transfer

Body
"""
    parsed3 = parse_raw_email(spoofed)
    inds3 = analyze_identity(parsed3)
    ids3 = [i.id for i in inds3]
    assert "exec-imp" in ids3  # CFO role from untrusted domain
    assert "sus-domain" in ids3  # company-finance is a lookalike of company.example
    print("Executive impersonation tested OK.")

    print("All Phase 4 tests passed.")


if __name__ == "__main__":
    test_identity_analysis()
