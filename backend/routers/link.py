from fastapi import APIRouter

router = APIRouter()


@router.post("/link")
async def check_link(url: str, lang: str = "ko"):
    # TODO: Google Safe Browsing API 연동
    return {"status": "not_implemented"}
