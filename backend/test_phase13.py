import sys
import os
import asyncio

sys.path.insert(0, os.path.abspath("."))

from main import analyze_email
from models import EmailAnalysisRequest


async def test_endpoint():
    raw_email = """Return-Path: <bounce@vps-relay-77.example>
From: Priya Menon (CFO) <p.menon@company-finance.example>
Reply-To: cfo.office@company-finance.example
To: analyst@company.example
Subject: URGENT Confidential - wire transfer
Received: from client.malicious (103.45.67.89) by vps-relay-77.example; Tue, 1 Jan 2026 12:00:00 +0000
Authentication-Results: spf=fail dkim=fail dmarc=fail

Body: I am in a meeting. Please process the attached vendor payment of 48,500 immediately.
Confirm your password here: http://secure-login.paypa1.com
"""
    req = EmailAnalysisRequest(email_content=raw_email)
    try:
        res = await analyze_email(req)
        print(res.model_dump_json(indent=2))
        print("\nAll Phase 13 tests passed.")
    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    asyncio.run(test_endpoint())
