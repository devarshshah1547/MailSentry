CLEAN_EMAIL = """Return-Path: <notifications@company.example>
From: IT Notifications <notifications@company.example>
Reply-To: notifications@company.example
To: analyst@company.example
Subject: Scheduled maintenance window
Received: from mx1.company.example (192.168.1.100) by mx2.company.example; Tue, 1 Jan 2026 12:05:00 +0000
Authentication-Results: spf=pass dkim=pass dmarc=pass

Planned maintenance for the internal reporting portal is scheduled for September 4th. 
No action is required from your side.
"""

SUSPICIOUS_EMAIL = """Return-Path: <bounce@marketing-sender.example>
From: Company Newsletter <newsletter@company.example>
Reply-To: noreply@marketing-sender.example
To: user@company.example
Subject: Your weekly update
Received: from outbound.marketing-sender.example (8.8.8.8) by mx.company.example; Tue, 1 Jan 2026 12:00:00 +0000
Authentication-Results: spf=softfail dkim=pass dmarc=fail

Here is your weekly update on industry trends.
Click here to read more: http://tracking.marketing-sender.example/link
"""

MALICIOUS_EMAIL = """Return-Path: <bounce@vps-relay-77.example>
From: Priya Menon (CFO) <p.menon@company-finance.example>
Reply-To: cfo.office@company-finance.example
To: analyst@company.example
Subject: URGENT Confidential - wire transfer
Received: from client.malicious (103.45.67.89) by vps-relay-77.example; Tue, 1 Jan 2026 12:00:00 +0000
Authentication-Results: spf=fail dkim=fail dmarc=fail

I am in a meeting. Please process the attached vendor payment of 48,500 immediately.
Confirm your password here: http://secure-login.paypa1.com
"""

DEMO_EMAILS = {
    "legitimate": CLEAN_EMAIL,
    "spoofed": SUSPICIOUS_EMAIL,
    "phishing": MALICIOUS_EMAIL,
}
