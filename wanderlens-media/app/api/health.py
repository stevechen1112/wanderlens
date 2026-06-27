"""健康檢查"""

from fastapi import APIRouter

router = APIRouter()


@router.get("")
@router.get("/")
async def health_check():
    return {"status": "UP", "service": "wanderlens-media", "version": "0.1.0"}