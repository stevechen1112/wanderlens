"""RAW 格式處理工具"""

import rawpy
import io
from PIL import Image


def raw_to_jpeg(raw_data: bytes, quality: int = 90) -> bytes:
    """RAW 轉 JPEG"""
    with rawpy.imread(io.BytesIO(raw_data)) as raw:
        rgb = raw.postprocess()
    img = Image.fromarray(rgb)
    output = io.BytesIO()
    img.save(output, format="JPEG", quality=quality)
    return output.getvalue()


def get_raw_metadata(raw_data: bytes) -> dict:
    """取得 RAW 檔案 metadata"""
    with rawpy.imread(io.BytesIO(raw_data)) as raw:
        return {
            "camera": raw.color_matrix.size,
            "width": raw.raw_width,
            "height": raw.raw_height,
        }