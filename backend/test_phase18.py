import sys
import os
import asyncio

sys.path.insert(0, os.path.abspath("."))

from main import analyze_email
from models import EmailAnalysisRequest
from fastapi import HTTPException


async def test_performance_limits():
    # Create a 6MB payload
    # 6 million 'A's is 6MB
    large_payload = "A" * 6_000_000

    req = EmailAnalysisRequest(email_content=large_payload)

    try:
        await analyze_email(req)
        assert False, "Should have thrown a 413 error"
    except HTTPException as e:
        assert e.status_code == 413
        assert "Payload too large" in e.detail

    print("All Phase 18 tests passed. Large payload correctly rejected.")


if __name__ == "__main__":
    asyncio.run(test_performance_limits())
