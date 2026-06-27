"""RAW 下載 API（精修用）

安全：需有效的 retouch_token（外包修圖公司專用，含 order_id + retouch_company_id）
"""

from fastapi import APIRouter, HTTPException, Header
from app.services.storage_service import storage_service
from app.core.config import settings
from app.core.security import verify_retouch_token
import logging
import re

logger = logging.getLogger(__name__)

router = APIRouter()

# 允許的 asset_id 字元：英數、底線、連字號、單一斜線分隔
_ASSET_ID_PATTERN = re.compile(r"^[A-Za-z0-9_\-]+/[A-Za-z0-9_\-./]+$")


@router.get("/{asset_id}")
async def download_raw(
    asset_id: str,
    x_retouch_token: str = Header(..., alias="X-Retouch-Token"),
):
    """取得 RAW 預簽下載 URL（外包修圖用）

    asset_id 格式: {order_id}/{object_name}
    需在 Header 帶入 X-Retouch-Token（由 api 服務核發，含 order_id + retouch_company_id）
    """
    # 驗證 retouch token
    token_info = verify_retouch_token(x_retouch_token)
    if not token_info:
        raise HTTPException(status_code=403, detail="Invalid or expired retouch token")

    # 安全：嚴格驗證 asset_id 格式，防止 path traversal
    if ".." in asset_id or asset_id.startswith("/") or not _ASSET_ID_PATTERN.match(asset_id):
        raise HTTPException(status_code=400, detail="Invalid asset_id")

    parts = asset_id.split("/", 1)
    if len(parts) != 2:
        raise HTTPException(status_code=400, detail="Invalid asset_id")

    order_id = parts[0]

    # 驗證 token 的 order_id 與請求的 order_id 一致
    token_order_id = str(token_info.get("order_id", ""))
    if token_order_id != order_id:
        raise HTTPException(status_code=403, detail="Token does not match requested order")

    # 使用原始 asset_id 作為 object_name（已驗證格式安全）
    object_name = asset_id

    url = storage_service.get_presigned_url(
        settings.bucket_raw, object_name, expires_hours=2
    )
    logger.info(f"RAW 下載: order={order_id}, retouch_company={token_info.get('retouch_company_id')}")
    return {"url": url, "expires_in_hours": 2}