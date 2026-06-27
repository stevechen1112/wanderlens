"""內部介面 — 與 wanderlens-api 通訊"""

from fastapi import APIRouter, Depends, Header, HTTPException, status
from app.services.api_client import api_client
from app.services.verify_service import verify_service
from app.services.ai_color_service import ai_color_service
from app.services.sla_service import sla_service
from app.core.config import settings
import logging

router = APIRouter()
logger = logging.getLogger(__name__)


async def verify_service_api_key(x_service_api_key: str = Header(..., alias="X-Service-API-Key")):
    """驗證內部介面 API key，防止未授權存取"""
    expected = settings.media_service_api_key
    if not expected:
        logger.error("media_service_api_key 未設定，拒絕所有內部請求")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Service API key not configured",
        )
    if x_service_api_key != expected:
        logger.warning("內部介面 API key 驗證失敗")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid service API key",
        )
    return True


@router.post("/verify", dependencies=[Depends(verify_service_api_key)])
async def verify_result(
    order_id: int,
    success: bool,
    file_count: int = 0,
    total_size: int = 0,
    detail: str = "",
):
    """驗收結果回報給 api"""
    await api_client.report_verify_result(order_id, success, file_count, total_size, detail)
    return {"status": "reported"}


@router.post("/ai-status", dependencies=[Depends(verify_service_api_key)])
async def ai_status(
    order_id: int,
    status: str,
    detail: str = "",
):
    """AI 處理狀態回報給 api"""
    await api_client.report_ai_status(order_id, status, detail)
    return {"status": "reported"}


@router.get("/status/{order_id}", dependencies=[Depends(verify_service_api_key)])
async def media_status(order_id: int):
    """取得訂單的媒體處理狀態"""
    return sla_service.get_status(order_id)