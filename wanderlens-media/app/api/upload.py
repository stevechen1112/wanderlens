"""上傳 API 路由"""

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.upload_service import upload_service
from app.core.security import verify_upload_token

router = APIRouter()


@router.post("/init")
async def init_upload(token: str = Form(...)):
    """初始化上傳（驗證 token）"""
    info = verify_upload_token(token)
    if not info:
        raise HTTPException(status_code=401, detail="Invalid upload token")
    return {"valid": True, **info}


@router.post("/{token}/jpeg")
async def upload_jpeg(token: str, file: UploadFile = File(...)):
    """JPEG 快路徑上傳"""
    file_data = await file.read()
    result = upload_service.upload_jpeg(token, file_data, file.filename)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result.get("error", "Upload failed"))
    return result


@router.post("/{token}/raw")
async def upload_raw(token: str, file: UploadFile = File(...)):
    """RAW 上傳"""
    file_data = await file.read()
    result = upload_service.upload_raw(token, file_data, file.filename)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result.get("error", "Upload failed"))
    return result


@router.post("/{token}/complete")
async def complete_upload(
    token: str,
    order_id: int = Form(...),
    file_count: int = Form(...),
    total_size: int = Form(...),
):
    """批次上傳完成 → 觸發驗收"""
    return upload_service.complete_upload(token, order_id, file_count, total_size)