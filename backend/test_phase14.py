import sys
import os

sys.path.insert(0, os.path.abspath("."))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_demo_emails():
    response = client.get("/demo-emails")
    assert response.status_code == 200

    data = response.json()
    assert "legitimate" in data
    assert "spoofed" in data
    assert "phishing" in data

    assert "Scheduled maintenance" in data["legitimate"]
    assert "newsletter" in data["spoofed"]
    assert "URGENT Confidential - wire transfer" in data["phishing"]

    print("All Phase 14 tests passed.")


if __name__ == "__main__":
    test_demo_emails()
