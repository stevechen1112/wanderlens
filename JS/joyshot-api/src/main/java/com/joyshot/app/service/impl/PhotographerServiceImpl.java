package com.joyshot.app.service.impl;

import cn.hutool.core.util.IdUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.google.maps.errors.ApiException;
import com.google.maps.model.DirectionsLeg;
import com.joyshot.app.entity.*;
import com.joyshot.app.exception.ServiceException;
import com.joyshot.app.mapper.*;
import com.joyshot.app.service.PhotographerService;
import com.joyshot.app.service.ServiceCatService;
import com.joyshot.app.service.UserService;
import com.joyshot.app.util.MapUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import cn.hutool.core.io.FileUtil;

import java.io.File;
import java.nio.file.Path;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
* @author avery
* @description【photographer】的資料庫操作Service实现
*/
@Service
public class PhotographerServiceImpl extends ServiceImpl<PhotographerMapper, Photographer>
    implements PhotographerService{

    @Value("${file.upload-location}")
    private String SERVER_UPLOAD_PATH;

    @Autowired
    private PhotographerMapper photographerMapper;

    @Autowired
    private AreaMapper areaMapper;

    @Autowired
    private DictMapper dictMapper;

    @Autowired
    private MapUtil mapUtil;

    @Autowired
    private PhotographerWorksMapper photographerWorksMapper;

    @Autowired
    private FileRepoMapper fileRepoMapper;

    @Autowired
    private ServiceCatService serviceCatService;

    @Autowired
    private ServiceCatMapper serviceCatMapper;

    @Autowired
    private UserService userService;




    @Override
    public List<Photographer> search(PhotographerSearchForm form) {
        int everyKmSubsidy = Integer.parseInt(dictMapper.selectKmSubsidy());//每公里補貼
        double onCustomer = Double.parseDouble(dictMapper.selectPercentSubsidy()); //客戶負擔比
        int unitPrice = Integer.parseInt(dictMapper.selectUnitPrice()); //每小時拍攝費
        int photogrpherProfit = Integer.parseInt(dictMapper.selectPayForPhotographer()); //每小時給攝影師的費用


        //取得縣市代碼
//        String city = form.getCity();
//        Integer areaParentId = areaMapper.findArea1ByName(city);
//        form.setAreaParentId(areaParentId);
        //取得縣市下級行政區代碼
//        Integer areaId = areaMapper.findArea2ByName(form.getCity_area(), areaParentId);
//        form.setAreaId(areaId);

        ServiceCat serviceCat = serviceCatService.getById(form.getQuery_service());

        System.out.println("查詢指定攝影師:"+form.getQuery_assign_ph_uuid()+form.getQuery_assign_photographer());
        List<Photographer> photographerList = photographerMapper.search(form);

        //找出符合條件的攝影師後，再來計算每位攝影師的交通費
        photographerList.forEach(photographer -> {
            //用攝影師住家地與拍攝地的距離來計算交通費
            String addrLat = photographer.getAddrLat().toString();
            String addrLng = photographer.getAddrLng().toString();
            String origin = addrLat + "," + addrLng ; //經度+緯度
            try {
                System.out.println(photographer.getName());
                DirectionsLeg leg = mapUtil.getDistinceBetween(origin, form.getQuery_placeId(), "zh-TW");
                System.out.println("DirectionsLeg:" + leg.distance);
                //先取得公里數至小數點一位

                double distanceInKm = Math.round(distanceBetweenInKm(leg) * 100.0) / 100.0;
                System.out.println("distanceInKm:" + distanceInKm);

                //總交通費，四捨五入
                int totalSubsidy = 0;
                //拍攝地點距離所在地10公里以上，每公里補貼4元，包含來回公里數，最高補貼650元
                if (distanceInKm >= 10) {
                    totalSubsidy = (int)(Math.round(((distanceInKm - 10) * 2 ) * (double) everyKmSubsidy));
                } else {
                    System.out.println(distanceInKm+"km, 不補助");
                }
                if (totalSubsidy >= 650) {
                    totalSubsidy = 650;
                }

                //客戶實際負擔交通費(後台有設定 客戶負擔交通費比)
                int customerSubsidy = (int)(Math.round(totalSubsidy * onCustomer));

                Order order = new Order();
                order.setCustId(-1);//目前沒有帳號，暫時用-1
                order.setServiceCat(serviceCat.getName());
                order.setServiceCatEn(serviceCat.getNameEn());
                order.setServiceCatJp(serviceCat.getNameJp());
                order.setServiceCatKr(serviceCat.getNameKr());
                order.setShootingDate(form.getQuery_date());
                order.setShootingTime(form.getQuery_hour() + ":" + ((form.getQuery_minute()==0)?"00":form.getQuery_minute()) );
                order.setShootingDuration(form.getQuery_duration());
                order.setShootingLocation(form.getQuery_placeName());
                order.setServiceFee((int)(form.getQuery_duration() * unitPrice));//拍攝服務費：時數x單價
                order.setTransportationFee(totalSubsidy);//總交通費
                order.setRatioOnCustomer(onCustomer);//本次的負擔比例
                order.setTransportationFeeOnCustomer(totalSubsidy);//客戶應付的交通費
                order.setTransportationFeeCustomerActualPay(customerSubsidy);//客戶實付的交通費
                order.setTotalFee(order.getTotal());
                order.setDistance(distanceInKm);//拍攝距離
                order.setUnitPrice(unitPrice);//單價
                order.setAdultNum(form.getAdults());
                order.setChildNum(form.getChildren());
                order.setHasPets(form.getPetsStatus());
                order.setPetsNotes(form.getPetsNote());
                order.setPhUuid(photographer.getPhUuid());
                order.setPhotographerProfit((int)(photogrpherProfit * order.getShootingDuration()));
                System.out.println("profile:" + ((int)(photogrpherProfit * order.getShootingDuration())));

                photographer.setOrder(order);

            } catch (InterruptedException e) {
                e.printStackTrace();
            } catch (ApiException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
        });

        return photographerList;
    }

    private float distanceBetweenInKm(DirectionsLeg leg) {
        //先取得公里數
        double distanceInKm = (double)leg.distance.inMeters / (double)1000;
        //四捨五入取小數點一位
        float finalKm = (float)Math.round(distanceInKm * 10)/10;
        System.out.println("distanceBetweenInKm:" + finalKm);
        return finalKm;
    }

    @Override
    public Photographer getPhotographerInfoById(Integer pid) {
        Photographer photographer = photographerMapper.getPhotographerInfoById(pid);
        List<ServiceCat> serviceCats = getPhotographerServiceCat(photographer);
        photographer.setServiceCats(serviceCats);
        return photographer;
    }

    @Override
    public Photographer getPhotographerInfoByUuid(String uuid) {
        Photographer photographer = photographerMapper.getPhotographerInfoByUuid(uuid);
        List<ServiceCat> serviceCats = getPhotographerServiceCat(photographer);
        photographer.setServiceCats(serviceCats);
        return photographer;
    }

    @Override
    @Transactional(rollbackFor = {ServiceException.class})
    public boolean saveOrUpdatePhotographer(Photographer photographer) {
        if (photographer.getId() == null) {
            photographer.setPhUuid(IdUtil.fastSimpleUUID());
        }
        saveOrUpdate(photographer);

        boolean update = userService.updateOrCreateUser(photographer);

        return update;
    }

    private List<ServiceCat> getPhotographerServiceCat(Photographer photographer) {
        String serviceItem = photographer.getServiceItem();

        List<ServiceCat> serviceCats = new ArrayList<>();
        if (serviceItem != null) {
            String[] items = serviceItem.split(",");
            serviceCats = serviceCatMapper.selectServiceByServiceItem(items);
        }
        return serviceCats;
    }

    /**
     * 刪除攝影師，也要把攝影師的評價、作品、時程、負責區域、特色...等資料一併刪除
     * 資料庫要設 delete cascade
     * @param id
     * @return
     */
    @Override
    @Transactional(rollbackFor = {ServiceException.class})
    public boolean deleteById(Integer id) {
        //刪FileRepo
        //查出works
        List<PhotographerWorks> photographerWorks = photographerWorksMapper.selectWorksByPid(id);

        boolean removeOk = removeById(id);//delete from photographer table
        if (removeOk) {
            //remove file record
            for(PhotographerWorks works: photographerWorks) {
                fileRepoMapper.removeByUuid(works.getFileUuid());
            }

            //remove physical file
            String filePath = SERVER_UPLOAD_PATH + "works/" + id;
            System.out.println("刪除攝影師作品整個目錄:" + filePath);
            File file = new File(filePath);
            if (file.exists()) {
                removeOk = FileUtil.del(filePath);
                System.out.println("目錄存在"+removeOk);
            }

            //
            userService.removePhotographer(id);
        }


        return removeOk;
    }
}




