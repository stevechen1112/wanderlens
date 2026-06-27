package com.joyshot.app.controller;


import cn.hutool.core.util.IdUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.joyshot.app.common.Result;
import com.joyshot.app.common.Status;
import com.joyshot.app.controller.dto.ScheduleForm;
import com.joyshot.app.controller.dto.ServiceAreaDTO;
import com.joyshot.app.entity.*;
import com.joyshot.app.mapper.*;
import com.joyshot.app.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * @author avery
 */
@RestController
@RequestMapping("/api/photographer")
public class PhotographerController extends AppBaseController {

    @Autowired
    private PhotographerService photographerService;

    @Autowired
    private PhotographerMapper photographerMapper;

    @Autowired
    private PhotographerRatingMapper photographerRatingMapper;

    @Autowired
    private PhotographerFeatureMapper photographerFeatureMapper;

    @Autowired
    private PhotographerFeatureService photographerFeatureService;

    @Autowired
    private PhotographerRatingService photographerRatingService;

    @Autowired
    private PhotographerWorksMapper photographerWorksMapper;

    @Autowired
    private PhotographerWorksService photographerWorksService;

    @Autowired
    private PhotographerAreaService photographerAreaService;

    @Autowired
    private PhotographerAreaMapper photographerAreaMapper;

    @Autowired
    private PhotographerScheduleService photographerScheduleService;

    @Autowired
    private PhotographerScheduleMapper photographerScheduleMapper;

    @Autowired
    private PhotographerBankService photographerBankService;
    @Autowired
    private PhotographerBankMapper photographerBankMapper;

    /**
     * 取得 攝影師 基本資料
     * @param pid
     * @return
     */
    @GetMapping("/{pid}")
    public Result getOne(@PathVariable Integer pid) {
        Photographer photographer = photographerService.getPhotographerInfoById(pid);
        return (photographer != null) ? Result.success(photographer) : Result.error(Status.CODE_ERROR, "get_photographer_failed");
    }

    @GetMapping("/all")
    public Result selectByPage(@RequestParam Integer pageNum,
                            @RequestParam Integer pageSize,
                            @RequestParam String queryField,
                            @RequestParam String keyword) {
        IPage<Photographer> page = new Page<>(pageNum, pageSize);
        Page<Photographer> result = photographerMapper.selectByPage(page, queryField, keyword);
        return (result != null) ? Result.success(result) : Result.error(Status.CODE_ERROR, "get_photographer_failed");
    }

    @GetMapping("/groupby")
    public Result selectGroupBy() {
        List<GroupByDTO> data = photographerMapper.selectGroupByCity();
        return Result.success(data);
    }

    @GetMapping("/feature/{pid}")
    public Result selectFeature(@PathVariable Integer pid) {
        List<PhotographerFeature> data = photographerFeatureMapper.selectFeatureByPid(pid);
        return Result.success(data);
    }

    /**
     * 取得攝影師可負責的區域
     * @param pid
     * @return
     */
    @GetMapping("/service/area/{pid}")
    public Result getServiceArea(@PathVariable Integer pid) {
        List<Area> areaNodes = photographerAreaService.getServiceArea(pid);
        return areaNodes != null ? Result.success(areaNodes) : Result.error(Status.CODE_ERROR, "get_service_area_failed");
    }

    /**
     * 設定攝影師可負責的區域
     * @param pid
     * @param serviceAreaDTO
     * @return
     */
    @PostMapping("/service/area/{pid}")
    public Result saveServiceArea(@PathVariable Integer pid, @RequestBody ServiceAreaDTO serviceAreaDTO ) {
        boolean result = photographerAreaService.saveAreaService(pid, serviceAreaDTO);
        return result ? Result.success(): Result.error(Status.CODE_ERROR, "set_service_area_failed");
    }

    /**
     * 取得攝影師接案時段
     * @param phId
     * @param year
     * @param month
     * @return
     */
    @GetMapping("/schedule")
    public Result getSchedule(@RequestParam Integer phId,
                              @RequestParam Integer year,
                              @RequestParam Integer month) {
        String monthFilter = year + "/" + ((month<10) ? "0"+month : month) + "/";
        List<PhotographerSchedule> list = photographerScheduleMapper.getScheduleByMonth(phId, monthFilter);
        return list != null ? Result.success(list): Result.error(Status.CODE_ERROR, "get_schedule_failed");
    }

    /**
     * 設定攝影師接案時段
     * @param pid
     * @param scheduleForm
     * @return
     */
    @PostMapping("/schedule/{pid}")
    public Result saveSchedule(@PathVariable Integer pid, @RequestBody ScheduleForm scheduleForm) {
        System.out.println(pid);
        System.out.println(scheduleForm);
        boolean result = photographerScheduleService.saveSchedule(pid, scheduleForm);
        return result ? Result.success(): Result.error(Status.CODE_ERROR, "set_schedule_failed");
    }

    /**
     * 刪除攝影師接案時段
     * @param sid
     * @return
     */
    @DeleteMapping("/schedule/{sid}")
    public Result deleteSchedule(@PathVariable Integer sid) {
        boolean result = photographerScheduleService.removeById(sid);
        return result ? Result.success(): Result.error(Status.CODE_ERROR, "delete_schedule_failed");
    }

    /**
     * 取得攝影師已設定的負責區域
     * @param pid
     * @return
     */
    @GetMapping("/service/area/setting/{pid}")
    public Result getServiceAreaSetting(@PathVariable Integer pid) {
        List<Integer> areaNodes = photographerAreaMapper.getServiceAreaSetting(pid);
        return areaNodes != null ? Result.success(areaNodes) : Result.error(Status.CODE_ERROR, "get_service_area_setting_failed");
    }

    /**
     * 依縣市取得攝影師
     * @param pageNum
     * @param pageSize
     * @param area
     * @param request
     * @return
     */
    @GetMapping("/area/{area}")
    public Result find(@RequestParam Integer pageNum,
                       @RequestParam Integer pageSize,
                       @PathVariable Integer area,
                       HttpServletRequest request) {
        IPage<Photographer> page = new Page<>(pageNum, pageSize);
        Page<Photographer> result = photographerMapper.selectByArea1(page, area);
        return Result.success(result);
    }

    /**
     * 取得所有，不分攝影師
     * @param pageNum
     * @param pageSize
     * @return
     */
    @GetMapping("/ratings")
    public Result getLatestRatings(@RequestParam Integer pageNum,
                       @RequestParam Integer pageSize) {
        IPage<PhotographerRating> page = new Page<>(pageNum, pageSize);
        Page<PhotographerRating> result = photographerRatingMapper.selectLatest(page);
        return Result.success(result);
    }

    @GetMapping("/ratings-all")
    public Result getAllRatings() {
        Integer count = photographerRatingMapper.selectAll();
        return Result.success(count);
    }


    @GetMapping("/rating/{pid}")
    public Result getPhotographerRatings(@PathVariable Integer pid) {
        List<PhotographerRating> data = photographerRatingMapper.selectRatingByPid(pid);
        return Result.success(data);
    }
    @DeleteMapping("/rating/{id}")
    public Result deleteRating(@PathVariable Integer id) {
        int i = photographerRatingMapper.deleteById(id);
        return i > 0 ? Result.success() : Result.error(Status.CODE_ERROR, "delete_failed");
    }

    /**
     * 攝影師的手機號是否註冊過
     * @param photographer
     * @return
     */
    @PostMapping("/exists")
    public Result checkPhotographerExist(@RequestBody Photographer photographer) {
        Photographer info = photographerMapper.getPhotographerInfoByPhone(photographer.getPhone());
        return info != null ? Result.success("user_registered") : Result.success("user_not_register");
    }

    /**
     * 一開始先建立攝影師的基本資料
     * @param photographer
     * @return
     */
    @PostMapping
    public Result saveBasicInfo(@RequestBody Photographer photographer) {
        if (photographer.getId() == null) {
            photographer.setPhUuid(IdUtil.fastSimpleUUID());
        }
        boolean result = photographerService.saveOrUpdatePhotographer(photographer);
        return result ? Result.success(photographer) : Result.error(Status.CODE_ERROR, "save_failed");
    }

    /**
     * 刪除攝影師
     * @param id
     * @return
     */
    @DeleteMapping("/{id}")
    public Result delete(@PathVariable Integer id) {
        boolean result = photographerService.deleteById(id);
        return result ? Result.success() : Result.error(Status.CODE_ERROR, "delete_failed");
    }

    @PostMapping("/feature")
    public Result createFeature(@RequestBody PhotographerFeature photographerFeature) {
        boolean result = photographerFeatureService.saveOrUpdate(photographerFeature);
        return result ? Result.success() : Result.error(Status.CODE_ERROR, "update_failed");
    }

    @PostMapping("/rating")
    public Result createRating(@RequestBody PhotographerRating photographerRating) {
        boolean result = photographerRatingService.saveOrUpdate(photographerRating);
        return result ? Result.success() : Result.error(Status.CODE_ERROR, "update_failed");
    }

    @DeleteMapping("/feature/{id}")
    public Result deleteFeature(@PathVariable Integer id) {
        int i = photographerFeatureMapper.deleteById(id);
        return i > 0 ? Result.success() : Result.error(Status.CODE_ERROR, "delete_failed");
    }

    @GetMapping("/works/{pid}")
    public Result selectWorks(@PathVariable Integer pid) {
        List<PhotographerWorks> data = photographerWorksMapper.selectWorksByPid(pid);
        return Result.success(data);
    }

    @DeleteMapping("/works/{id}")
    public Result deleteWorks(@PathVariable Integer id) {
        boolean result = photographerWorksService.deleteWorkById(id);
        return result ? Result.success() : Result.error(Status.CODE_ERROR, "delete_failed");
    }

    /**
     * 前台用-基本資料
     * @param uuid
     * @return
     */
    @GetMapping("/info/{uuid}")
    public Result getOneForFrontend(@PathVariable String uuid) {
        Photographer photographer = photographerService.getPhotographerInfoByUuid(uuid);
        return (photographer != null) ? Result.success(photographer) : Result.error(Status.CODE_ERROR, "get_photographer_failed");
    }

    /**
     * 前台用-作品資料
     * @param uuid
     * @return
     */
    @GetMapping("/info/works/{uuid}")
    public Result selectWorks(@PathVariable String uuid) {
        Photographer photographer = photographerMapper.getPhotographerInfoByUuid(uuid);
        List<PhotographerWorks> data = photographerWorksMapper.selectWorksByPid(photographer.getId() );
        return Result.success(data);
    }

    /**
     * 取得攝影師銀行帳號資料
     * @param pid
     * @return
     */
    @GetMapping("/bank/{pid}")
    public Result getBankInfo(@PathVariable Integer pid) {
        PhotographerBank bank = photographerBankMapper.getBankInfo(pid);
        return Result.success(bank);
    }

    /**
     * 設定攝影師銀行帳號資料
     * @param bank
     * @return
     */
    @PostMapping("/bank")
    public Result saveBankInfo( @RequestBody PhotographerBank bank ) {
        boolean result = photographerBankService.saveOrUpdate(bank);
        return result ? Result.success(): Result.error(Status.CODE_ERROR, "set_bank_failed");
    }

    /**
     * 設定攝影師上架狀態
     * @param photographer
     * @return
     */
    @PostMapping("/live")
    public Result saveGoLiveStatus(@RequestBody Photographer photographer) {
        int result = photographerMapper.saveGoLiveStatus(photographer.getId(), photographer.getGoLive());
        return result>0 ? Result.success(photographer) : Result.error(Status.CODE_ERROR, "save_goLive_failed");
    }

    /**
     * 取得攝影師上架數
     * @return
     */
    @GetMapping("/live/all")
    public Result getGoLiveCount() {
        int result = photographerMapper.getGoLiveCount();
        return Result.success(result) ;
    }

    @GetMapping("/q")
    public Result getPhotographerByCritieria(@RequestParam String keyword) {
        List<Photographer> photographers = photographerMapper.findByName(keyword);
        return Result.success(photographers) ;
    }

    /**
     * 攝影師主控台
     * @return
     */
    @GetMapping("/area/schedule")
    public Result saveSchedule(@RequestParam String city,
                               @RequestParam Integer year,
                               @RequestParam Integer month) {
        String monthFilter = year + "/" + ((month<10) ? "0"+month : month) + "/";
        List<ScheduleDTO> schedules = photographerScheduleMapper.getScheduleGroupByCity(city, monthFilter);
        return schedules != null ? Result.success(schedules): Result.error(Status.CODE_ERROR, "get_schedule_failed");
    }

    /**
     * 取得特定日期有設定時程的攝影師
     * @return
     */
    @GetMapping("/date")
    public Result getSchedule(@RequestParam String scheduleDate, @RequestParam String city) {

        List<PhotographerSchedule> list = photographerScheduleMapper.getPhotographerByDate(scheduleDate, city);
        return list != null ? Result.success(list): Result.error(Status.CODE_ERROR, "get_schedule_failed");
    }

}
