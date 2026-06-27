package com.wanderlens.api.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.wanderlens.api.entity.MediaAsset;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MediaAssetMapper extends BaseMapper<MediaAsset> {
}