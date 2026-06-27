package com.joyshot.app.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.joyshot.app.entity.OrderHistory;
import com.joyshot.app.service.OrderHistoryService;
import com.joyshot.app.mapper.OrderHistoryMapper;
import org.springframework.stereotype.Service;

/**
* @author avery
* @description【js_order_history】的資料庫操作Service实现
*/
@Service
public class OrderHistoryServiceImpl extends ServiceImpl<OrderHistoryMapper, OrderHistory>
    implements OrderHistoryService{

}




