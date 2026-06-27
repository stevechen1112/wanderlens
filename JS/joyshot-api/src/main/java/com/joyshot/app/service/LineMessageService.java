package com.joyshot.app.service;

import com.joyshot.app.entity.LineMessage;
import com.baomidou.mybatisplus.extension.service.IService;

import java.io.IOException;

/**
* @author avery
* @description【line_message】的資料庫操作Service
*/
public interface LineMessageService extends IService<LineMessage> {

    void lineGroupNotifyMsg(LineMessage lineMessage) throws IOException;
}
