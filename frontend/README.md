# CyberTrace Insight

Build a premium, futuristic 3D cybersecurity investigation dashboard for a college hackathon project called:

“AI-Powered Email Threat Detection, GeoLocation and Forensic Intelligence Platform”

IMPORTANT:
I am responsible ONLY for the frontend/UI. Build a polished frontend prototype that initially works with realistic MOCK DATA. Do NOT build the backend, database, authentication system, or unnecessary features.

The future backend will be FastAPI with:
POST /analyze-email

The frontend architecture must make it easy to replace mock data with the real API response later.

## DESIGN DIRECTION

Create a visually impressive **3D Cyber Security Operations Center (SOC)** interface.

Style:

* Futuristic cybersecurity
* Dark premium interface
* Glassmorphism
* 3D depth
* Subtle neon cyan / electric blue / violet accents
* Black/charcoal background
* Soft glowing borders
* Layered cards
* Subtle shadows
* Professional rather than gaming-style
* High-end enterprise cybersecurity dashboard aesthetic
* Responsive on desktop and laptop screens

Use a sophisticated dark background with a subtle animated cyber-grid / radial glow.

Do NOT make it overly colorful.
Do NOT use excessive animations.
Do NOT make it look like a gaming website.
The interface must look credible enough for cybersecurity judges.

## 3D UI EFFECTS

Use tasteful 3D effects throughout the dashboard:

* Glass cards with realistic depth
* Slight perspective on important cards
* Floating data panels
* Soft outer glow
* Hover cards that subtly move toward the user
* 3D-looking risk score visualization
* Depth between dashboard layers
* Subtle animated grid in the background
* Animated data flow in the relay path
* Smooth transitions

Animations should be fast and subtle.

Avoid:

* spinning everything
* excessive particles
* distracting animations
* giant 3D objects
* unnecessary page transitions

Performance is important.

## APPLICATION STRUCTURE

Create a SINGLE main investigation dashboard.

No unnecessary pages.

Layout:

---

## TOP NAVIGATION

Left:
CYBERTRACE
AI EMAIL FORENSIC INTELLIGENCE

Center:
Dashboard
Investigate
Threat Intelligence

Right:
System Status ● ONLINE
Settings icon

Use a minimal professional navigation bar.

---

## HERO / INVESTIGATION AREA

Large heading:

EMAIL THREAT
INVESTIGATION

Subtitle:

Analyze suspicious email content, trace infrastructure,
identify threat indicators and generate a forensic assessment.

Add a large glassmorphism email input panel.

Header:

RAW EMAIL / HEADER ANALYSIS

Inside:

Large textarea:

“Paste raw email content and headers here…”

Buttons:

[ Analyze Email ]

[ Load Demo ]

Allow Load Demo to open/select:

1. Legitimate Email
2. Phishing Email
3. Spoofed / Impersonation Email

Analyze Email must trigger the mock analysis flow.

---

## ANALYSIS LOADING STATE

When Analyze Email is clicked:

Show an impressive but subtle investigation animation.

Display sequential statuses:

● Receiving email data
● Parsing headers
● Extracting sender information
● Checking SPF / DKIM / DMARC
● Detecting suspicious indicators
● Tracing IP infrastructure
● Resolving approximate geolocation
● Generating forensic assessment

Then display the results.

Make the loading experience feel like a real cybersecurity analysis system.

---

## RESULT DASHBOARD

After analysis, show:

TOP SUMMARY SECTION

Three large 3D glass cards:

1. THREAT LEVEL

HIGH

Show a large glowing status indicator.

2. RISK SCORE

87 / 100

Create a circular 3D-style gauge / radial visualization.

3. CLASSIFICATION

PHISHING /
IMPERSONATION

Below this add a small timestamp:

Analysis completed • Synthetic Investigation

---

## SENDER INTELLIGENCE

Create a large glass card.

Title:

SENDER INTELLIGENCE

Display:

Sender
[support@paypa1-security.com](mailto:support@paypa1-security.com)

Reply-To
[verify-account@randomdomain.com](mailto:verify-account@randomdomain.com)

Return-Path
[mailer@randomdomain.com](mailto:mailer@randomdomain.com)

Domain
paypa1-security.com

Message-ID
[synthetic-message-id@example.com](mailto:synthetic-message-id@example.com)

Make email addresses and domains visually distinguishable.

Add a small badge:

DOMAIN RISK: HIGH

---

## AUTHENTICATION ANALYSIS

Create three premium cards:

SPF
✕

FAIL

DKIM
?
UNKNOWN

DMARC
✕

FAIL

Each card should have:

* Status icon
* Result
* Short explanation on hover/click

Example:

SPF failed because the sender infrastructure
does not match the expected authorization evidence.

Do not claim real verification when using mock data.

---

## THREAT FINDINGS

Create a large card titled:

THREAT FINDINGS

Show findings as individual rows:

⚠ Suspicious domain detected
⚠ Reply-To mismatch
⚠ Credential harvesting language
⚠ Suspicious URL
⚠ Authentication failure

Each finding should have:

* severity badge
* icon
* short explanation

Example:

HIGH
Suspicious Domain
Domain resembles a trusted brand but uses altered naming.

---

## SUSPICIOUS LINKS

Create a dedicated section showing detected URLs.

Example:

http://secure-account-verification.example

Show:

* URL
* Risk level
* Detection reason

Use truncation for very long URLs.

---

## ORIGIN INTELLIGENCE

Create a visually impressive 3D card.

Title:

ORIGIN INTELLIGENCE

Show:

Origin IP
185.xxx.xxx.xxx

Country
Example Country

Region
Example Region

City
Example City

ISP / Organization
Example Hosting Provider

Add a small globe/map-inspired visualization.

IMPORTANT:
Clearly label this as:

PROBABLE ORIGINATING INFRASTRUCTURE

Do NOT say this is definitely the attacker's physical location.

Also show:

ATTRIBUTION CONFIDENCE
82%

Use a circular or horizontal confidence visualization.

---

## RELAY PATH VISUALIZATION

Create a horizontal/vertical visual network path:

SENDER
↓
MAIL SERVER
↓
INTERMEDIATE SERVER
↓
ORIGIN IP

Use glowing nodes connected by animated lines.

Each node should display:

* hostname
* type
* status

When hovering over a node, show details.

The path should visually communicate how the email traveled through infrastructure.

---

## THREAT INDICATORS

Create an “INDICATORS” section with compact 3D chips/cards.

Examples:

Suspicious Domain
Reply-To Mismatch
Phishing Keywords
Suspicious URL
Authentication Failure
Infrastructure Indicator

Each indicator should have:

* severity
* icon
* short explanation

---

## FORENSIC ASSESSMENT

Create a large premium card at the bottom.

Title:

FORENSIC ASSESSMENT

Show:

ATTRIBUTION CONFIDENCE
82%

FORENSIC SUMMARY

“Email demonstrates multiple indicators consistent with phishing/impersonation. The earliest observed IP is associated with the identified infrastructure.”

Make the summary visually prominent.

Add a disclaimer:

“Geolocation and attribution are approximate and based on available evidence.”

---

## RIGHT-SIDE / FLOATING THREAT PANEL

On desktop, add a slim floating panel showing:

LIVE INVESTIGATION

System Status
● Online

Analysis Engine
● Ready

Threat Detection
● Active

GeoLocation
● Available

Forensics
● Ready

This should look like a futuristic SOC monitoring panel.

On smaller screens, move this panel below the main content.

---

## MOCK DATA

Create three realistic synthetic datasets:

1. LEGITIMATE EMAIL

Threat Level:
LOW

Risk Score:
12

Classification:
LEGITIMATE

Authentication:
SPF PASS
DKIM PASS
DMARC PASS

No major threat indicators.

2. PHISHING EMAIL

Threat Level:
HIGH

Risk Score:
87

Classification:
PHISHING / IMPERSONATION

SPF:
FAIL

DKIM:
UNKNOWN

DMARC:
FAIL

Indicators:

* Suspicious domain
* Reply-To mismatch
* Credential harvesting language
* Suspicious URL
* Authentication failure

3. SPOOFED EMAIL

Threat Level:
CRITICAL

Risk Score:
94

Classification:
SPOOFING / IMPERSONATION

Use realistic synthetic data.

Never use real people's private information.

---

## INTERACTION REQUIREMENTS

Analyze Email button:

Before clicking:
Show only the input interface.

After clicking:
Show loading state.

After loading:
Show investigation results.

Load Demo:
Allow user to select one of the three demo scenarios.

Reset:
Add a subtle “New Investigation” button to clear results and return to the input screen.

Tooltips:
Add tooltips for technical terms such as:
SPF
DKIM
DMARC
IP
Attribution Confidence

---

## ERROR STATE

If the email input is empty:

Show:

“Please paste an email or load a demo before starting analysis.”

If malformed:

“Unable to analyze email. Please check the email format and try again.”

Make errors visually clear but professional.

---

## RESPONSIVE DESIGN

Desktop:
Use a multi-column SOC dashboard layout.

Tablet:
Reduce columns and stack cards intelligently.

Mobile:
Single-column layout.

The dashboard must remain usable on laptop screens used during the hackathon presentation.

---

## TECHNICAL FRONTEND REQUIREMENTS

Use the existing Lovable project structure if one exists.

First inspect the existing project.

Do NOT delete working functionality.

Do NOT perform unrelated refactoring.

Keep components modular.

Suggested components:

Dashboard
EmailInput
AnalysisLoader
ThreatOverview
RiskScore
SenderIntelligence
AuthenticationStatus
ThreatFindings
SuspiciousLinks
OriginIntelligence
RelayPath
ThreatIndicators
ForensicAssessment
SystemStatus

Keep mock analysis data in a clean state/object structure.

Example conceptual structure:

analysisResult = {
risk_score,
threat_level,
classification,
sender,
reply_to,
return_path,
authentication,
indicators,
ips,
geolocation,
relay_path,
confidence,
forensic_summary
}

This structure must make future FastAPI integration easy.

Future API:

POST /analyze-email

Request:

{
"email_content": "<raw email content>"
}

The UI should eventually be able to map the API response directly into the existing dashboard.

Do NOT implement the backend now.

---

## IMPORTANT VISUAL PRIORITIES

The judges should immediately understand:

1. What the application does
2. Where to paste an email
3. How to analyze it
4. Whether the email is dangerous
5. Why it is dangerous
6. Where the infrastructure appears to originate
7. How the email traveled
8. What the forensic conclusion is

The risk score and threat level must be the strongest visual elements after analysis.

The application should feel like a real cybersecurity forensic investigation tool rather than a generic admin dashboard.

---

## FINAL POLISH

Add:

* subtle micro-interactions
* smooth hover states
* keyboard accessibility
* clear typography
* consistent spacing
* polished empty states
* polished loading state
* polished error state
* professional icons
* responsive layout
* accessible contrast

Use realistic synthetic content.

Do not add:

* user authentication
* database
* Supabase
* admin panel
* complex case management
* unnecessary pages
* unnecessary APIs
* ML model
* backend functionality

After implementation:

1. Tell me which files were created or modified.
2. Explain how to run the frontend.
3. Explain how to test the three demo scenarios.
4. Explain where the FastAPI POST /analyze-email integration should be connected.
5. Do not perform unrelated refactoring.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0d5eceb1-ae7b-42bc-803e-c31adf319ba0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
