package com.wanderlens.api.service.impl;

import com.wanderlens.api.service.LocalFileStorageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Slf4j
@Service
public class LocalFileStorageServiceImpl implements LocalFileStorageService {

    @Value("${wanderlens.storage.local-path:uploads}")
    private String localPath;

    @Value("${wanderlens.storage.public-url-prefix:/api/files/serve}")
    private String publicUrlPrefix;

    @Override
    public String store(String usage, String uuid, MultipartFile file) throws IOException {
        String ext = extractExtension(file.getOriginalFilename());
        Path dir = Paths.get(localPath, usage);
        Files.createDirectories(dir);
        String filename = uuid + (ext.isEmpty() ? "" : "." + ext);
        Path target = dir.resolve(filename);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        String url = publicUrlPrefix + "/" + usage + "/" + filename;
        log.info("檔案已儲存: usage={}, url={}", usage, url);
        return url;
    }

    private static String extractExtension(String name) {
        if (name == null || !name.contains(".")) return "";
        return name.substring(name.lastIndexOf('.') + 1).toLowerCase();
    }
}
