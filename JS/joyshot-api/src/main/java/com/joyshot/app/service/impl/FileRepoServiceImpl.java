package com.joyshot.app.service.impl;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.joyshot.app.entity.FileRepo;
import com.joyshot.app.entity.PhotographerWorks;
import com.joyshot.app.mapper.FileRepoMapper;
import com.joyshot.app.mapper.PhotographerWorksMapper;
import com.joyshot.app.service.FileRepoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * @author avery
 */
@Service
public class FileRepoServiceImpl extends ServiceImpl<FileRepoMapper, FileRepo>
        implements FileRepoService {

    @Value("${file.upload-location}")
    private String SERVER_UPLOAD_PATH;

    @Autowired
    private FileRepoMapper fileRepoMapper;

    @Autowired
    private PhotographerWorksMapper photographerWorksMapper;

    /**
     * 將檔案放到主機
     * 寫一筆紀錄至 FileRepo
     * @param usage
     * @param file
     * @return
     */
    @Override
    public FileRepo handleUpload(String usage, MultipartFile file) throws IOException {
        //save to disk
//        String serverPath = fileAtServerPath(usage);
        String extraDir = usage + StrUtil.SLASH;
        Map<String, String> result = handleWriteFile(extraDir, file);

        //save to db
        FileRepo fileRepo = addFileRepoRecord(result, file.getSize(), usage);
        return fileRepo;
    }

    /**
     * 作品集
     * @param phId
     * @param file
     * @return
     */
    @Override
    public FileRepo handleWorksUpload(Integer phId, MultipartFile file) throws IOException {
        //save to disk
        String serverPath = fileAtServerPath("works") + phId + StrUtil.SLASH;;
        Map<String, String> result = handleWriteFile(serverPath, file);

        //save to db
        FileRepo fileRepo = addFileRepoRecord(result, file.getSize(), "works");

        //save to photographer_works
        PhotographerWorks works = new PhotographerWorks();
        works.setFileUuid(fileRepo.getUuid());
        works.setPhId(phId);
        photographerWorksMapper.insert(works);
        return fileRepo;
    }

    private FileRepo addFileRepoRecord(Map<String, String> result,
                                       long fileSize,
                                       String usage) {
        String source = result.get("source");
        String fileUrl = result.get("frontendFileUrl");
        String uuid = result.get("uuid");

        FileRepo fileRepo = new FileRepo();
        fileRepo.setName(source);
        fileRepo.setType(FileUtil.extName(source));
        fileRepo.setUrl(fileUrl);
        fileRepo.setSize(fileSize / 1024);//轉成KB
        fileRepo.setUuid(uuid);
        fileRepo.setFileUsage(usage);
        fileRepoMapper.insertFile(fileRepo);
        return fileRepo;
    }

    /**
     * 寫檔案到目錄
     * @param file
     * @return
     * @throws IOException
     */
    private Map<String, String> handleWriteFile(String extraDir, MultipartFile file) throws IOException {
        //處理檔名
        String uuid = IdUtil.fastSimpleUUID();
        String source = file.getOriginalFilename();//原始檔名
        String destination = uuid + StrUtil.DOT + FileUtil.extName(source); //寫進目錄時轉換後的檔名

        //處理目錄
//        String serverPath = fileAtServerPath(usage);

        //寫入，將檔案存放到主機
//        String fileAtServerPath = SERVER_UPLOAD_PATH;
        File directory = new File(SERVER_UPLOAD_PATH + extraDir);
        if (!directory.exists()){
            directory.mkdirs();
        }
        try {
            file.transferTo( new File(SERVER_UPLOAD_PATH + extraDir + destination));
        } catch (Exception e) {
            throw e;
        }

        Map<String, String> result = new HashMap<>();
        result.put("source", source);
        result.put("frontendFileUrl", extraDir + destination);
        result.put("uuid", uuid);
        return result;

//        result.put("uuid", uuid);
//        result.put("fileId", fileRepo.getId()+"");
//        result.put("fileName", source);
//        return result;
    }


    private String fileAtServerPath(String usage) {
        if("user_profile".equals(usage)) {
            return "user_profile" + StrUtil.SLASH;
        } else if ("area_feature_image".equals(usage)) {
            return "area_feature_image" + StrUtil.SLASH;
        } else if ("service_cat".equals(usage)) {
            return "service_cat" + StrUtil.SLASH;
        } else if ("instagram".equals(usage)) {
            return "instagram" + StrUtil.SLASH;
        } else if ("attraction".equals(usage)) {
            return "attraction" + StrUtil.SLASH;
        } else if ("works".equals(usage)) {
            return "works" + StrUtil.SLASH;
        }
        return "";
    }
}




