"""檔案格式驗證工具"""

SUPPORTED_RAW_FORMATS = {".cr2", ".nef", ".arw", ".raf", ".dng", ".rw2", ".orf", ".pef"}
SUPPORTED_IMAGE_FORMATS = {".jpg", ".jpeg", ".png", ".webp"}


def is_valid_raw(filename: str) -> bool:
    ext = "." + filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    return ext in SUPPORTED_RAW_FORMATS


def is_valid_image(filename: str) -> bool:
    ext = "." + filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    return ext in SUPPORTED_IMAGE_FORMATS


def get_asset_type(filename: str) -> str:
    """判斷資產類型"""
    if is_valid_raw(filename):
        return "RAW"
    ext = "." + filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if ext in {".jpg", ".jpeg"}:
        return "JPEG"
    return "UNKNOWN"