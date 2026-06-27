package com.joyshot.app.service;

import com.joyshot.app.entity.Menu;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 * @author avery
 */
public interface MenuService extends IService<Menu> {

    List<Menu> findAll(String keyword);
}
