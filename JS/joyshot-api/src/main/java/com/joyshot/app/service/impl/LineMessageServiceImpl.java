package com.joyshot.app.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.joyshot.app.entity.FileRepo;
import com.joyshot.app.entity.LineMessage;
import com.joyshot.app.entity.User;
import com.joyshot.app.mapper.FileRepoMapper;
import com.joyshot.app.mapper.UserMapper;
import com.joyshot.app.service.LineMessageService;
import com.joyshot.app.mapper.LineMessageMapper;
import com.joyshot.app.service.LineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

/**
* @author avery
* @description【line_message】的資料庫操作Service实现
*/
@Service
public class LineMessageServiceImpl extends ServiceImpl<LineMessageMapper, LineMessage>
    implements LineMessageService{

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private LineService lineService;

    @Autowired
    private FileRepoMapper fileRepoMapper;

    @Override
    public void lineGroupNotifyMsg(LineMessage lineMessage) throws IOException {
        save(lineMessage);

        FileRepo fileRepo = fileRepoMapper.getFileRepoByUuid(lineMessage.getImageUuid());
        List<User> users;
        if("photographer".equals(lineMessage.getTargetUser()) ) {
            users = userMapper.findPhotographer();
        } else {
            users = userMapper.findManager();
        }

        lineService.sendGroupNotify(lineMessage.getLineMessage(), fileRepo, users);
        System.out.println("send");
    }
}




