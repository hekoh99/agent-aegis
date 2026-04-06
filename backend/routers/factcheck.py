from fastapi import APIRouter

router = APIRouter()


@router.post("/factcheck")
async def factcheck(text: str, lang: str = "ko"):
    # TODO: Claude API 연동
    return {"status": "not_implemented"}
