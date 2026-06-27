package com.joyshot.app.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.joyshot.app.entity.ActionLog;
import com.joyshot.app.mapper.ActionLogMapper;
import com.joyshot.app.service.ActionLogService;
import org.springframework.stereotype.Service;

/**
 * @author avery
 * @description【action_log】的資料庫操作Service实现
 */
@Service
public class ActionLogServiceImpl extends ServiceImpl<ActionLogMapper, ActionLog>
        implements ActionLogService {

}




