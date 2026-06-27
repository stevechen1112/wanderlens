"""格式驗證工具測試"""

from app.utils.format_utils import is_valid_raw, is_valid_image, get_asset_type


def test_is_valid_raw():
    assert is_valid_raw("photo.CR2") is True
    assert is_valid_raw("photo.nef") is True
    assert is_valid_raw("photo.arw") is True
    assert is_valid_raw("photo.jpg") is False
    assert is_valid_raw("photo.png") is False


def test_is_valid_image():
    assert is_valid_image("photo.jpg") is True
    assert is_valid_image("photo.JPEG") is True
    assert is_valid_image("photo.png") is True
    assert is_valid_image("photo.cr2") is False


def test_get_asset_type():
    assert get_asset_type("IMG_0001.CR2") == "RAW"
    assert get_asset_type("IMG_0001.jpg") == "JPEG"
    assert get_asset_type("document.pdf") == "UNKNOWN"