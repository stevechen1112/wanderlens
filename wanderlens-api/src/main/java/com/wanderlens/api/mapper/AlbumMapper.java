package com.wanderlens.api.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.wanderlens.api.entity.Album;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AlbumMapper extends BaseMapper<Album> {
}