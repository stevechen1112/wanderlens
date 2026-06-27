package com.joyshot.app.service;

import com.joyshot.app.entity.FileRepo;
import com.baomidou.mybatisplus.extension.service.IService;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

/**
 * @author avery
 */
public interface FileRepoService extends IService<FileRepo> {

    FileRepo handleUpload(String usage, MultipartFile file) throws IOException;

    //作品集
    FileRepo handleWorksUpload(Integer phId, MultipartFile file) throws IOException;
}
