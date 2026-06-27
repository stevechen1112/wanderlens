package com.joyshot.app.mapper;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.joyshot.app.entity.Order;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.joyshot.app.entity.PhotographerWorks;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

/**
* @author avery
* @description【order】的資料庫操作Mapper
* @Entity com.joyshot.app.entity.Order
*/
public interface OrderMapper extends BaseMapper<Order> {

    Page<Order> selectByPage(IPage<Order> page, String queryField, String keyword);

    Page<Order> selectMyOrder(IPage<Order> page, String queryField, String keyword, Integer photographerId);

    @Update("Update js_order set status = 'pay_success', payment_order_no=#{tradeNo}, payment_method=#{paymentMethod},rtn_code=#{rtnCode} where id=#{orderId}")
    void updateOrderPaid(String orderId, String tradeNo, String rtnCode, String paymentMethod);

    @Update("Update js_order set status = 'pay_failed', payment_order_no=#{tradeNo}, payment_method=#{paymentMethod},rtn_code=#{rtnCode} where id=#{orderId}")
    void updateOrderPayFailed(String orderId, String tradeNo, String rtnCode, String paymentMethod);

    @Select("Select * from js_order where order_no = #{tradeNo}")
    Order findByTradeNo(String tradeNo);

    List<Order> findShootingDateTime24HourLater(String startDate, String endDate);

    List<Order> findShootingDateTimeAfter12Hour(String startDate, String endDate);

    @Update("Update js_order set driver_link = #{sharedLink} where id = #{orderId}")
    void updateDriverLink(String orderId, String sharedLink);

    Page<Order> selectUploadedOrder(IPage<Order> page, String queryField, String keyword, String status);

    @Update("Update js_order set status='uploaded' where id = #{orderId}")
    void photoFinishUpload(Integer orderId);

    @Update("Update js_order set status='confirm-uploaded' where id = #{orderId}")
    void photoConfirmUpload(Integer orderId);

    @Select("Select * from js_order where concat(id,order_no) = #{orderNo}")
    Order findOrderByOrderNo(String orderNo);

    @Select("Select * from js_order where order_no = #{orderNo}")
    Order findByOrderNo(String orderNo);

    Page<Order> selectProcessingOrder(IPage<Order> page, String queryField, String keyword);

    Page<Order> selectPaySuccessOrder(IPage<Order> page, String queryField, String keyword);

    Page<Order> selectClosedOrder(IPage<Order> page, String queryField, String keyword);

    @Update("Update js_order set status='pay_success', payment_order_no=#{tradeNo}, payment_method='paypal' where order_no = #{invoiceId}")
    void updatePayPalPaid(String tradeNo, String invoiceId);

    @Select("Select * from js_order where concat(id,order_no) = #{orderNo}")
    Order getOrderByOrderNo(String invoiceId);

    @Update("Update js_order set status='pay_failed', payment_method='paypal' where order_no = #{invoiceId}")
    void updatePayPalFailed(String invoiceId);

    List<Order> findOrderNotPaid(String startDate, String endDate);

    @Update("Update js_order set status='contact' where id = #{orderId}")
    void finishContact(Integer orderId);

    List<Order> findNotContactCustomerOrder();

    Order findOrderWithPhotographer(Integer orderId);



    @Update("Update js_order set status='close' where id = #{orderId}")
    void finishTransfer(Integer orderId);

    /**
     * 已通知客戶看照片
     * @return
     */
    List<Order> findClosingOrder();

    Page<Order> selectOrderHasCoupon(IPage<Order> page, String queryField, String keyword);

    @Update("Update js_order set status='auto_cancel', ph_uuid = null where id = #{id}")
    void cancelOrder(Integer id);

    @Update("Update js_order set status='cancel' where id = #{id}")
    void cancelPhotographerOrder(Integer id);

    @Update("Update js_order set pic_num = #{picNum} where id = #{orderId}")
    boolean savePicNum(Integer orderId, Integer picNum);

    @Update("Update js_order set backup_done = 'Y' where order_no = #{orderNo}")
    void finishBackup(String orderNo);

    List<Order> findOrderInContact(String startDate, String endDate);

    List<Order> selectOrderByPhUuid(String phUuid);

    @Select("SELECT COUNT(DISTINCT customer_name) AS rowcount FROM js_order WHERE customer_name NOT LIKE '%test%'; ")
    Integer getCustomerCount();

    @Select("SELECT count(*) from js_order where status in ('close', 'confirm-uploaded', 'processing', 'uploaded', 'contact')")
    Integer getOrderCount();

    @Select("SELECT sum(total_fee) from js_order where status in ('close', 'confirm-uploaded', 'processing', 'uploaded', 'contact')")
    Integer getOrderSum();
}




