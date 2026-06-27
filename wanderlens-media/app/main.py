"""WanderLens Media — FastAPI 入口"""

from fastapi import FastAPI
from app.api import upload, raw, health, internal

app = FastAPI(
    title="WanderLens Media",
    description="RAW/AI 媒體管線微服務",
    version="0.1.0",
)

# 路由
app.include_router(health.router, prefix="/health", tags=["Health"])
app.include_router(upload.router, prefix="/upload", tags=["Upload"])
app.include_router(raw.router, prefix="/raw", tags=["Raw"])
app.include_router(internal.router, prefix="/internal", tags=["Internal"])