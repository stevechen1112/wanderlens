package com.joyshot.app.service.impl;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.joyshot.app.controller.dto.ServiceAreaDTO;
import com.joyshot.app.entity.Area;
import com.joyshot.app.entity.Menu;
import com.joyshot.app.entity.Photographer;
import com.joyshot.app.entity.PhotographerArea;
import com.joyshot.app.exception.ServiceException;
import com.joyshot.app.mapper.AreaMapper;
import com.joyshot.app.service.AreaService;
import com.joyshot.app.service.PhotographerAreaService;
import com.joyshot.app.mapper.PhotographerAreaMapper;
import com.joyshot.app.service.PhotographerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
* @author avery
* @description【photographer_area】的資料庫操作Service实现
*/
@Service
public class PhotographerAreaServiceImpl extends ServiceImpl<PhotographerAreaMapper, PhotographerArea>
    implements PhotographerAreaService{

    @Autowired
    private PhotographerAreaMapper photographerAreaMapper;

    @Autowired
    private PhotographerService photographerService;

    @Autowired
    private AreaService areaService;

    @Autowired
    private AreaMapper areaMapper;


    @Override
    public List<Area> getServiceArea(Integer pid) {
        Photographer photographer = photographerService.getById(pid);

        //先找到主要服務縣市
        Area mainArea = areaService.getById(photographer.getCityId());
        List<Area> rootNodes = areaMapper.findSameGroupArea(mainArea.getAreaGroup());

//        QueryWrapper<Area> query = new QueryWrapper<>();
//        query.eq("id", photographer.getCityId());
////        query.in("id", new String[]{"5","6"});
//        List<Area> rootNodes = areaService.list(query);

        for (Area area : rootNodes) {
            //找出鄉鎮區
            QueryWrapper<Area> queryChild = new QueryWrapper<>();
            queryChild.eq("parent_id", area.getId());
            List<Area> childNotes = areaService.list(queryChild);
            area.setChildren(childNotes);
        }
        return rootNodes;
    }

    @Override
    @Transactional(rollbackFor = {ServiceException.class})
    public boolean saveAreaService(Integer pid, ServiceAreaDTO serviceAreaDTO) {
        int i = photographerAreaMapper.deleteCurrent(pid);
        System.out.println("刪除了 " + i + " 筆服務區域的設定值");

        String[] rootNodes = serviceAreaDTO.getRootNodes();
        String[] selectedNodes = serviceAreaDTO.getSelectedNodes();
        for (String node: rootNodes) {
            List<Area> childNodes = areaMapper.getByParentId(node);
            for(Area childArea: childNodes) {
                String childId = childArea.getId()+"";
                for (String selectedId: selectedNodes) {
                    if (selectedId.equals(childId)) {
                        PhotographerArea areaCanServe = new PhotographerArea();
                        areaCanServe.setPhId(pid);
                        areaCanServe.setAreaParentId(Integer.parseInt(node));
                        areaCanServe.setAreaId(Integer.parseInt(selectedId));
                        areaCanServe.setZipCode(childArea.getZipCode());
                        photographerAreaMapper.insert(areaCanServe);
                    }
                }
            }
        }
        return true;
    }

}




