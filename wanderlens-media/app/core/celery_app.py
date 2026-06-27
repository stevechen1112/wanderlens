"""Celery 實例配置"""

from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "wanderlens-media",
    broker=f"redis://{settings.redis_host}:{settings.redis_port}/2",
    backend=f"redis://{settings.redis_host}:{settings.redis_port}/3",
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="Asia/Taipei",
    enable_utc=False,
    task_acks_late=True,
    worker_prefetch_multiplier=1,
    task_routes={
        "app.tasks.ai_tasks.*": {"queue": "ai"},
        "app.tasks.verify_tasks.*": {"queue": "verify"},
        "app.tasks.sla_tasks.*": {"queue": "sla"},
    },
)