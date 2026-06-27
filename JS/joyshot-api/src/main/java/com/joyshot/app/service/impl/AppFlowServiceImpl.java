package com.joyshot.app.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.joyshot.app.entity.AppFlow;
import com.joyshot.app.entity.AppFlowUser;
import com.joyshot.app.exception.ServiceException;
import com.joyshot.app.mapper.AppFlowUserMapper;
import com.joyshot.app.service.AppFlowService;
import com.joyshot.app.mapper.AppFlowMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
* @author avery
* @description【app_flow】的資料庫操作Service实现
*/
@Service
public class AppFlowServiceImpl extends ServiceImpl<AppFlowMapper, AppFlow>
    implements AppFlowService{

    @Autowired
    private AppFlowMapper appFlowMapper;

    @Autowired
    private AppFlowUserMapper appFlowUserMapper;

    @Override
    public IPage<AppFlow> selectPage(IPage<AppFlow> page, String keyword) {
        return appFlowMapper.selectPageWithKeyword(page, keyword);
    }

    @Transactional(rollbackFor = {ServiceException.class})
    @Override
    public boolean saveAppFlow(AppFlow obj) {

        //先刪
        boolean b = appFlowUserMapper.deleteByFlowId(obj.getId());

        //再新增
        String[] userIds = obj.getLineNotifyUserOption();
        if (userIds != null) {
            for (String s : userIds) {
                AppFlowUser flowUser = new AppFlowUser();
                flowUser.setFlowId(obj.getId());
                flowUser.setUserId(Integer.parseInt(s));
                appFlowUserMapper.insert(flowUser);
            }
        }

        return false;
    }
}




