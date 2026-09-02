import sys
import os

sys.path.insert(0, os.path.abspath("."))

from fastapi.testclient import TestClient
from main import app
from models import EmailAnalysisRequest

client = TestClient(app)


def run_tests():
    print("Testing valid payload...")
    res = client.post(
        "/analyze-email",
        json={"email_content": "Return-Path: <test@example.com>\n\nBody"},
    )
    assert res.status_code == 200, f"Expected 200, got {res.status_code} - {res.text}"
    data = res.json()
    assert data["source"] == "api"
    assert data["threat_level"] == "LOW"
    assert isinstance(data["risk_score"], int)

    print("Testing empty input (whitespace)...")
    res = client.post("/analyze-email", json={"email_content": "   \n  "})
    assert res.status_code == 422, f"Expected 422, got {res.status_code} - {res.text}"
    print("Empty input blocked correctly.")

    print("Testing empty input (empty string)...")
    res = client.post("/analyze-email", json={"email_content": ""})
    assert res.status_code == 422, f"Expected 422, got {res.status_code} - {res.text}"
    print("Empty string blocked correctly.")

    print("Testing malformed payload (missing field)...")
    res = client.post("/analyze-email", json={"wrong_field": "test"})
    assert res.status_code == 422, f"Expected 422, got {res.status_code} - {res.text}"
    print("Malformed payload blocked correctly.")

    print("Testing model validation internally...")
    try:
        EmailAnalysisRequest(email_content="")
        assert False, "Should have raised ValueError"
    except ValueError:
        pass

    print("All Phase 2 tests passed!")


if __name__ == "__main__":
    run_tests()
