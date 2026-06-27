package com.wanderlens.api.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.wanderlens.api.entity.InstagramPost;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface InstagramPostMapper extends BaseMapper<InstagramPost> {
}