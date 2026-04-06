from fastapi import APIRouter

router = APIRouter()


@router.post("/phishing")
async def check_phishing(text: str, lang: str = "ko"):
    # TODO: Claude API 연동
    return {"status": "not_implemented"}
