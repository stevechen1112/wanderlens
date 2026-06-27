"""預覽圖與縮圖產生服務"""

from app.services.storage_service import storage_service
from app.core.config import settings
from PIL import Image, ImageDraw, ImageFont
import io
import logging

logger = logging.getLogger(__name__)

WATERMARK_TEXT = "WanderLens"
WATERMARK_OPACITY = 64


class PreviewService:

    def _apply_watermark(self, img: Image.Image) -> Image.Image:
        """右下角品牌水印（公開預覽用）"""
        watermarked = img.copy().convert("RGBA")
        overlay = Image.new("RGBA", watermarked.size, (0, 0, 0, 0))
        draw = ImageDraw.Draw(overlay)
        try:
            font = ImageFont.truetype("arial.ttf", max(16, watermarked.width // 40))
        except OSError:
            font = ImageFont.load_default()
        text = WATERMARK_TEXT
        bbox = draw.textbbox((0, 0), text, font=font)
        tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
        x = watermarked.width - tw - 16
        y = watermarked.height - th - 12
        draw.text((x, y), text, fill=(255, 255, 255, WATERMARK_OPACITY), font=font)
        return Image.alpha_composite(watermarked, overlay).convert("RGB")

    def generate_previews(self, order_id: int, object_name: str, image_data: bytes) -> dict:
        """產生預覽圖（800px）和縮圖（200px）"""
        img = Image.open(io.BytesIO(image_data))

        # 預覽圖（最大 800px 寬）+ 水印
        preview_img = img.copy()
        if preview_img.width > 800:
            ratio = 800 / preview_img.width
            preview_img = preview_img.resize((800, int(preview_img.height * ratio)), Image.LANCZOS)
        preview_img = self._apply_watermark(preview_img)

        preview_output = io.BytesIO()
        preview_img.save(preview_output, format="JPEG", quality=85)
        preview_data = preview_output.getvalue()

        preview_name = f"{order_id}/preview_{object_name.split('/')[-1]}"
        storage_service.upload_file(settings.bucket_ai, preview_name, preview_data, "image/jpeg")

        # 縮圖（最大 200px 寬）
        thumb_img = img.copy()
        if thumb_img.width > 200:
            ratio = 200 / thumb_img.width
            thumb_img = thumb_img.resize((200, int(thumb_img.height * ratio)), Image.LANCZOS)

        thumb_output = io.BytesIO()
        thumb_img.save(thumb_output, format="JPEG", quality=75)
        thumb_data = thumb_output.getvalue()

        thumb_name = f"{order_id}/thumb_{object_name.split('/')[-1]}"
        storage_service.upload_file(settings.bucket_ai, thumb_name, thumb_data, "image/jpeg")

        base_url = f"{settings.minio_endpoint}/{settings.bucket_ai}"
        return {
            "preview": f"{base_url}/{preview_name}",
            "thumbnail": f"{base_url}/{thumb_name}",
        }


preview_service = PreviewService()