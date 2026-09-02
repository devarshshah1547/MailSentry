# MailSentry Backend

MailSentry is a forensic email analysis engine designed to ingest raw `.eml` payloads, parse them for cryptographic headers and structural anomalies, and output a strict JSON classification report.

## Architecture

The backend is built with **FastAPI** and **Pydantic** for extreme speed and strict type enforcement.

- `main.py`: The FastAPI entrypoint and orchestration layer. It receives the `POST /analyze-email` request, routes the payload through the analysis pipeline, and maps the output.
- `parser.py`: The Email Parsing module. It securely parses raw `email` strings, extracting origin domains, reply-to fields, message IDs, and the chronological stack of `Received` IPs.
- `analyzer.py`: The Threat Logic engine. Contains heuristic functions for Identity checks, Authentication parsing (SPF/DKIM/DMARC), Content scraping (urgency/credentials), URL analysis, Domain risk scoring, and Geolocation.
- `models.py`: The Pydantic schema contracts. It strictly enforces the shape of the data moving through the pipeline and ensures the API response is 100% compliant with the React frontend's TypeScript interfaces.
- `demo_emails.py`: Contains pre-baked forensic scenarios (Clean, Suspicious, Malicious) for demonstration purposes.

## How to Run

1. **Activate the virtual environment**:
   ```bash
   .\.venv\Scripts\activate
   ```
2. **Start the API server**:
   ```bash
   python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```
   The API will be available at `http://127.0.0.1:8000`. The interactive Swagger documentation is available at `http://127.0.0.1:8000/docs`.

## How to Test

Test scripts for individual phases are included in the repository.
To run the full end-to-end endpoint integration test, execute:
```bash
python test_phase13.py
```
To run the strict contract validation test, execute:
```bash
python test_phase17.py
```
