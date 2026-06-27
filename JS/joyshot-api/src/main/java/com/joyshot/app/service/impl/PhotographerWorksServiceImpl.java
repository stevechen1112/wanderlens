package com.joyshot.app.service.impl;

import cn.hutool.core.io.FileUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.joyshot.app.entity.FileRepo;
import com.joyshot.app.entity.PhotographerWorks;
import com.joyshot.app.mapper.FileRepoMapper;
import com.joyshot.app.service.PhotographerWorksService;
import com.joyshot.app.mapper.PhotographerWorksMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
* @author avery
* @description【photographer_works】的資料庫操作Service实现
*/
@Service
public class PhotographerWorksServiceImpl extends ServiceImpl<PhotographerWorksMapper, PhotographerWorks>
    implements PhotographerWorksService{

    @Value("${file.upload-location}")
    private String SERVER_UPLOAD_PATH;

    @Autowired
    private PhotographerWorksMapper photographerWorksMapper;

    @Autowired
    private FileRepoMapper fileRepoMapper;


    /**
     * 刪除一個作品，需要處理:
     * 1.先刪除作品集紀錄 photographer_works
     * 2.再刪除FileRepo紀錄 file_repo
     * 3.最後刪除實體檔案
     * @param id
     * @return
     */
    @Override
    public boolean deleteWorkById(Integer id) {
        PhotographerWorks photographerWorks = photographerWorksMapper.selectById(id);
        int i = photographerWorksMapper.deleteById(id);//先刪除作品集紀錄
        boolean del = false;
        if (i > 0) {
            String fileUuid = photographerWorks.getFileUuid();
            FileRepo fileRepo = fileRepoMapper.getFileRepoByUuid(fileUuid);

            //再刪除FileRepo紀錄
            int i1 = fileRepoMapper.deleteById(fileRepo.getId());

            //最後刪除實體檔案
            if (i1 > 0) {
                del = FileUtil.del(SERVER_UPLOAD_PATH + fileRepo.getUrl());
                System.out.println("刪實體檔:"+SERVER_UPLOAD_PATH + fileRepo.getUrl()+"=>"+del);
            }
        }
        return del;
    }
}





