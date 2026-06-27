package com.joyshot.app.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.joyshot.app.entity.NotifyMessage;
import com.joyshot.app.service.NotifyMessageService;
import com.joyshot.app.mapper.NotifyMessageMapper;
import org.springframework.stereotype.Service;

/**
* @author avery
* @description【notify_message】的資料庫操作Service实现
*/
@Service
public class NotifyMessageServiceImpl extends ServiceImpl<NotifyMessageMapper, NotifyMessage>
    implements NotifyMessageService{

}




