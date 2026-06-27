package com.wanderlens.api.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.wanderlens.api.entity.AlbumFavorite;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AlbumFavoriteMapper extends BaseMapper<AlbumFavorite> {
}