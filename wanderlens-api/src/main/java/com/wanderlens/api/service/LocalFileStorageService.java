package com.wanderlens.api.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * 本地/物件儲存抽象（Banner、頭像等靜態檔）
 */
public interface LocalFileStorageService {

    /**
     * 儲存檔案並回傳可存取 URL 路徑（相對 API）
     */
    String store(String usage, String uuid, MultipartFile file) throws IOException;
}
