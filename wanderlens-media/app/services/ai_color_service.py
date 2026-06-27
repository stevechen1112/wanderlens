"""AI 基本調光調色服務

功能：
- 自動亮度 / 對比 / 色階 / 飽和度調整
- 場景偵測（人像 / 風景 / 夜景）→ 動態參數選擇
- EXIF 資料保留
- 並行處理控制（Semaphore）
- 處理狀態回報至 api 服務
"""

from app.services.storage_service import storage_service
from app.services.api_client import api_client
from app.services.preview_service import preview_service
from app.core.config import settings
from PIL import Image, ImageEnhance, ImageOps, ImageStat
import io
import logging
import asyncio
import functools

logger = logging.getLogger(__name__)

# 並行處理控制：限制同時處理的圖片數量
_processing_semaphore = asyncio.Semaphore(settings.ai_max_concurrency if hasattr(settings, 'ai_max_concurrency') else 3)


def _detect_scene(img: Image.Image) -> str:
    """偵測場景類型，回傳 'portrait' / 'landscape' / 'night' / 'general'"""
    try:
        stat = ImageStat.Stat(img)
        mean_brightness = sum(stat.mean) / len(stat.mean)  # 0-255

        if mean_brightness < 50:
            return "night"
        # 簡易人像偵測：檢查是否偏暖膚色調（紅 > 綠 > 藍）
        if len(stat.mean) >= 3:
            r, g, b = stat.mean[0], stat.mean[1], stat.mean[2]
            if r > g > b and r > 80:
                return "portrait"
        if img.width > img.height * 1.5:
            return "landscape"
        return "general"
    except Exception:
        return "general"


# 場景參數表
_SCENE_PARAMS = {
    "portrait": {"brightness": 1.02, "contrast": 1.08, "color": 1.05, "cutoff": 1},
    "landscape": {"brightness": 1.05, "contrast": 1.15, "color": 1.12, "cutoff": 1},
    "night": {"brightness": 1.15, "contrast": 1.2, "color": 1.1, "cutoff": 2},
    "general": {"brightness": 1.05, "contrast": 1.1, "color": 1.08, "cutoff": 1},
}


class AiColorService:

    async def process_async(self, order_id: int, object_name: str, asset_type: str) -> dict:
        """非同步處理（含並行控制）"""
        async with _processing_semaphore:
            return await asyncio.get_event_loop().run_in_executor(
                None, functools.partial(self.process, order_id, object_name, asset_type)
            )

    def process(self, order_id: int, object_name: str, asset_type: str) -> dict:
        """
        AI 基本調光調色
        - 場景偵測 → 動態參數
        - 自動亮度 / 對比 / 色階 / 飽和度
        - EXIF 保留
        - 產生預覽圖 + 縮圖
        - 回報狀態至 api 服務
        """
        try:
            # 回報處理中
            api_client.report_ai_status_sync(order_id, "processing", f"開始處理 {object_name}")

            # 從 JPEG bucket 下載原始檔
            jpeg_data = storage_service.download_file(settings.bucket_jpeg, object_name)

            # 開啟圖片
            img = Image.open(io.BytesIO(jpeg_data))

            # 保留原始 EXIF
            exif_data = img.info.get("exif", None)

            # 自動方向修正（EXIF）
            img = ImageOps.exif_transpose(img)

            # 場景偵測 → 選擇參數
            scene = _detect_scene(img)
            params = _SCENE_PARAMS.get(scene, _SCENE_PARAMS["general"])
            logger.info(f"場景偵測: order={order_id}, file={object_name}, scene={scene}")

            # 自動色階
            img = ImageOps.autocontrast(img, cutoff=params["cutoff"])

            # 亮度增強
            enhancer = ImageEnhance.Brightness(img)
            img = enhancer.enhance(params["brightness"])

            # 對比增強
            enhancer = ImageEnhance.Contrast(img)
            img = enhancer.enhance(params["contrast"])

            # 飽和度增強
            enhancer = ImageEnhance.Color(img)
            img = enhancer.enhance(params["color"])

            # 限制最大寬度
            if img.width > settings.ai_max_width:
                ratio = settings.ai_max_width / img.width
                img = img.resize((settings.ai_max_width, int(img.height * ratio)), Image.LANCZOS)

            # 儲存到 AI bucket（保留 EXIF）
            output = io.BytesIO()
            save_kwargs = {
                "format": settings.ai_output_format.upper(),
                "quality": settings.ai_output_quality,
            }
            if exif_data:
                save_kwargs["exif"] = exif_data
            img.save(output, **save_kwargs)
            ai_data = output.getvalue()

            ai_object_name = f"{order_id}/ai_{object_name.split('/')[-1]}"
            storage_service.upload_file(
                settings.bucket_ai, ai_object_name, ai_data, "image/jpeg"
            )

            # 產生預覽圖 + 縮圖
            preview_urls = preview_service.generate_previews(
                order_id, ai_object_name, ai_data
            )

            ai_url = f"{settings.minio_endpoint}/{settings.bucket_ai}/{ai_object_name}"

            # 回報完成
            api_client.report_ai_status_sync(order_id, "completed", f"AI 調色完成: {object_name}")

            logger.info(f"AI 調色完成: order={order_id}, file={object_name}, scene={scene}")
            return {
                "success": True,
                "ai_url": ai_url,
                "preview_url": preview_urls.get("preview"),
                "thumbnail_url": preview_urls.get("thumbnail"),
                "scene": scene,
            }

        except Exception as e:
            logger.error(f"AI 調色失敗: order={order_id}, file={object_name}, error={e}")
            # 回報失敗
            try:
                api_client.report_ai_status_sync(order_id, "failed", f"AI 調色失敗: {str(e)}")
            except Exception:
                pass  # 回報失敗不影響主流程
            return {"success": False, "error": str(e)}


ai_color_service = AiColorService()