"""48h SLA 監控服務"""

from app.core.config import settings
import redis
import logging
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

redis_client = redis.Redis(
    host=settings.redis_host,
    port=settings.redis_port,
    decode_responses=True,
)

SLA_PREFIX = "sla:order:"


class SlaService:

    def start_timer(self, order_id: int):
        """開始 SLA 倒數"""
        key = SLA_PREFIX + str(order_id)
        redis_client.set(key, datetime.now().isoformat())
        logger.info(f"SLA 計時開始: order={order_id}")

    def get_elapsed_hours(self, order_id: int) -> float:
        """取得已過時數"""
        key = SLA_PREFIX + str(order_id)
        start = redis_client.get(key)
        if not start:
            return 0.0
        start_time = datetime.fromisoformat(start)
        elapsed = datetime.now() - start_time
        return elapsed.total_seconds() / 3600

    def is_approaching_deadline(self, order_id: int) -> bool:
        """是否即將逾時（36h+）"""
        return self.get_elapsed_hours(order_id) >= settings.sla_alert_hours

    def is_overdue(self, order_id: int) -> bool:
        """是否已逾時（48h+）"""
        return self.get_elapsed_hours(order_id) >= settings.sla_hours

    def get_status(self, order_id: int) -> dict:
        """取得 SLA 狀態"""
        hours = self.get_elapsed_hours(order_id)
        return {
            "order_id": order_id,
            "elapsed_hours": round(hours, 1),
            "sla_hours": settings.sla_hours,
            "remaining_hours": round(max(0, settings.sla_hours - hours), 1),
            "status": "OVERDUE" if self.is_overdue(order_id) else
                      "APPROACHING" if self.is_approaching_deadline(order_id) else
                      "ON_TRACK",
        }

    def clear_timer(self, order_id: int):
        """清除計時器（交付完成時）"""
        redis_client.delete(SLA_PREFIX + str(order_id))


sla_service = SlaService()