package com.joyshot.app.service.impl;

import cn.hutool.core.util.IdUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.joyshot.app.entity.Affiliate;
import com.joyshot.app.entity.Photographer;
import com.joyshot.app.entity.Role;
import com.joyshot.app.exception.ServiceException;
import com.joyshot.app.mapper.RoleMapper;
import com.joyshot.app.service.AffiliateService;
import com.joyshot.app.mapper.AffiliateMapper;
import com.joyshot.app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
* @author avery
* @description【affiliate】的資料庫操作Service实现
*/
@Service
public class AffiliateServiceImpl extends ServiceImpl<AffiliateMapper, Affiliate>
    implements AffiliateService{

    @Autowired
    private UserService userService;

    @Autowired
    private AffiliateMapper affiliateMapper;

    @Autowired
    private RoleMapper roleMapper;


    @Override
    @Transactional(rollbackFor = {ServiceException.class})
    public boolean saveOrUpdateAffiliate(Affiliate affiliate) {
        if (affiliate.getId() == null) {
            affiliate.setUuid(IdUtil.fastSimpleUUID());
        }
        saveOrUpdate(affiliate);

        //建登入帳號
        Role role = roleMapper.selectRoleByName("affiliate");
        boolean update = userService.updateOrCreateAffiliateUser(affiliate, role);
        return update;
    }

    @Override
    public Affiliate getAffiliateInfoById(Integer affid) {
        Affiliate affiliate = affiliateMapper.getInfoById(affid);
        return affiliate;
    }

    /**
     * 刪除推廣員，也要把帳號資料一併刪除
     * @param id
     * @return
     */
    @Override
    @Transactional(rollbackFor = {ServiceException.class})
    public boolean deleteById(Integer id) {
        boolean removeOk = removeById(id);
        if (removeOk) {
            userService.removeAffiliate(id);
        }

        return true;
    }
}




