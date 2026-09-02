import sys
import os

sys.path.insert(0, os.path.abspath("."))

from analyzer import get_geolocation


def test_geolocation():
    # 1. Known malicious IP from DB
    geo1 = get_geolocation("103.45.67.89")
    assert geo1.country == "Russia"
    assert "Bulletproof" in geo1.organization

    # 2. Local IP
    geo2 = get_geolocation("127.0.0.1")
    assert geo2.country == "Internal Network"

    geo3 = get_geolocation("192.168.1.100")
    assert geo3.country == "Internal Network"

    # 3. Unknown public IP
    geo4 = get_geolocation("8.8.8.8")
    assert geo4.country == "Unknown Region"
    assert geo4.latitude == 0.0

    print("All Phase 9 tests passed.")


if __name__ == "__main__":
    test_geolocation()
