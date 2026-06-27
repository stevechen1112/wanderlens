package com.wanderlens.api.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.wanderlens.api.entity.Availability;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import java.util.List;

@Mapper
public interface AvailabilityMapper extends BaseMapper<Availability> {

    /**
     * 依供給方 ID + 日期範圍查詢可用時段
     */
    @Select("SELECT * FROM availability " +
            "WHERE provider_id = #{providerId} " +
            "AND schedule_date BETWEEN #{startDate} AND #{endDate} " +
            "AND active = 'Y' " +
            "AND locked_by_order_id IS NULL " +
            "ORDER BY schedule_date, slot_start")
    List<Availability> findAvailable(Long providerId, String startDate, String endDate);
}