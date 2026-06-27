package com.wanderlens.api.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wanderlens.api.entity.Configuration;
import com.wanderlens.api.mapper.ConfigurationMapper;
import com.wanderlens.api.service.ConfigurationService;
import org.springframework.stereotype.Service;

@Service
public class ConfigurationServiceImpl extends ServiceImpl<ConfigurationMapper, Configuration> implements ConfigurationService {
}