import os

import httpx

API_KEY = os.getenv("GOOGLE_SAFE_BROWSING_API_KEY")
LOOKUP_URL = "https://safebrowsing.googleapis.com/v4/threatMatches:find"


async def check_url(url: str) -> dict:
    body = {
        "client": {"clientId": "agent-aegis", "clientVersion": "1.0"},
        "threatInfo": {
            "threatTypes": [
                "MALWARE",
                "SOCIAL_ENGINEERING",
                "UNWANTED_SOFTWARE",
                "POTENTIALLY_HARMFUL_APPLICATION",
            ],
            "platformTypes": ["ANY_PLATFORM"],
            "threatEntryTypes": ["URL"],
            "threatEntries": [{"url": url}],
        },
    }
    async with httpx.AsyncClient() as client:
        resp = await client.post(LOOKUP_URL, params={"key": API_KEY}, json=body)
        data = resp.json()

    if data.get("matches"):
        return {"safe": False, "threats": data["matches"]}
    return {"safe": True, "threats": []}
