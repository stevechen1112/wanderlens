package com.joyshot.app.service;

import com.joyshot.app.entity.Area;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 * @author avery
 */
public interface AreaService extends IService<Area> {

    List<Area> findAll(String keyword);

}
