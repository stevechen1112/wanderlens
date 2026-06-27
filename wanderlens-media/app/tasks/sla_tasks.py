"""SLA 監控 Celery 任務"""

from app.core.celery_app import celery_app
from app.services.sla_service import sla_service
from app.services.api_client import api_client
from app.core.config import settings
import redis
import asyncio
import logging

logger = logging.getLogger(__name__)

redis_client = redis.Redis(
    host=settings.redis_host, port=settings.redis_port, decode_responses=True
)


@celery_app.task
def check_sla():
    """每小時檢查所有進行中的 SLA 計時器"""
    keys = redis_client.keys("sla:order:*")
    for key in keys:
        order_id = int(key.split(":")[-1])
        status = sla_service.get_status(order_id)

        if status["status"] == "OVERDUE":
            logger.warning(f"SLA 已逾時: order={order_id}, hours={status['elapsed_hours']}")
            asyncio.run(api_client.report_ai_status(
                order_id, "FAILED", f"SLA 逾時 ({status['elapsed_hours']}h)"
            ))
        elif status["status"] == "APPROACHING":
            logger.warning(f"SLA 即將逾時: order={order_id}, hours={status['elapsed_hours']}")
            asyncio.run(api_client.report_ai_status(
                order_id, "PROCESSING", f"SLA 即將逾時 ({status['elapsed_hours']}h)"
            ))