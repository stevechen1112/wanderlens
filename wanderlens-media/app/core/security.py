"""上傳 / 修圖 token 驗證（由 api 核發，media 驗證）"""

import redis
from app.core.config import settings


redis_client = redis.Redis(
    host=settings.redis_host,
    port=settings.redis_port,
    decode_responses=True,
)

UPLOAD_TOKEN_PREFIX = "media:upload-token:"
RETOUCH_TOKEN_PREFIX = "media:retouch-token:"


def verify_upload_token(token: str) -> dict | None:
    """
    驗證上傳 token，回傳 {order_id, provider_id, asset_type} 或 None
    token 由 api 服務核發，存於 Redis（TTL 30 分鐘）
    """
    key = UPLOAD_TOKEN_PREFIX + token
    value = redis_client.get(key)
    if not value:
        return None

    parts = value.split(":")
    if len(parts) != 3:
        return None

    return {
        "order_id": int(parts[0]),
        "provider_id": int(parts[1]),
        "asset_type": parts[2],
    }


def consume_upload_token(token: str) -> bool:
    """消費 token（使用後刪除）"""
    key = UPLOAD_TOKEN_PREFIX + token
    return redis_client.delete(key) > 0


def verify_retouch_token(token: str) -> dict | None:
    """
    驗證修圖 token，回傳 {order_id, retouch_company_id} 或 None
    token 由 api 服務核發，存於 Redis（TTL 24 小時）
    """
    key = RETOUCH_TOKEN_PREFIX + token
    value = redis_client.get(key)
    if not value:
        return None

    parts = value.split(":")
    if len(parts) != 2:
        return None

    return {
        "order_id": int(parts[0]),
        "retouch_company_id": int(parts[1]),
    }