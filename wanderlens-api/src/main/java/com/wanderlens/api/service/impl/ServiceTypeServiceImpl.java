package com.wanderlens.api.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wanderlens.api.common.ResultCode;
import com.wanderlens.api.entity.ServiceType;
import com.wanderlens.api.exception.ServiceException;
import com.wanderlens.api.mapper.ServiceTypeMapper;
import com.wanderlens.api.service.ServiceTypeService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiceTypeServiceImpl extends ServiceImpl<ServiceTypeMapper, ServiceType> implements ServiceTypeService {

    @Override
    public List<ServiceType> listActive() {
        return list(new LambdaQueryWrapper<ServiceType>()
                .eq(ServiceType::getActive, "Y")
                .orderByAsc(ServiceType::getSortOrder));
    }

    @Override
    public String getSuggestedConfig(Long serviceTypeId) {
        ServiceType st = getById(serviceTypeId);
        if (st == null) {
            throw new ServiceException(ResultCode.NOT_FOUND, "拍攝類型不存在");
        }
        return st.getSuggestedConfig();
    }
}