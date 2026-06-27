"""影像處理工具"""

from PIL import Image
import io


def get_image_size(image_data: bytes) -> tuple[int, int]:
    """取得圖片尺寸"""
    img = Image.open(io.BytesIO(image_data))
    return img.size


def resize_image(image_data: bytes, max_width: int, quality: int = 85) -> bytes:
    """縮放圖片"""
    img = Image.open(io.BytesIO(image_data))
    if img.width > max_width:
        ratio = max_width / img.width
        img = img.resize((max_width, int(img.height * ratio)), Image.LANCZOS)
    output = io.BytesIO()
    img.save(output, format="JPEG", quality=quality)
    return output.getvalue()