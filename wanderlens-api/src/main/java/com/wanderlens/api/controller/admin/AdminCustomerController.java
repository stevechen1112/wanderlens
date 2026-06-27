package com.wanderlens.api.controller.admin;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.wanderlens.api.common.Result;
import com.wanderlens.api.entity.Order;
import com.wanderlens.api.entity.User;
import com.wanderlens.api.mapper.OrderMapper;
import com.wanderlens.api.mapper.UserMapper;
import com.wanderlens.api.util.AuthUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 客戶管理 API（Admin）
 */
@RestController
@RequestMapping("/customers")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Admin - Customers", description = "客戶管理")
public class AdminCustomerController {

    private final UserMapper userMapper;
    private final OrderMapper orderMapper;
    private final AuthUtil authUtil;

    @GetMapping
    @Operation(summary = "客戶列表")
    public Result<List<Map<String, Object>>> list(HttpServletRequest request,
                                                   @RequestParam(required = false) String keyword) {
        authUtil.requireAdmin(request);
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getRole, "CONSUMER");
        if (keyword != null && !keyword.isBlank()) {
            wrapper.and(w -> w.like(User::getUsername, keyword)
                    .or().like(User::getPhone, keyword)
                    .or().like(User::getEmail, keyword));
        }
        wrapper.orderByDesc(User::getCreatedAt);
        List<User> users = userMapper.selectList(wrapper);
        users.forEach(u -> u.setPassword(null));

        // 加入訂單數
        List<Map<String, Object>> result = new ArrayList<>();
        for (User u : users) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", u.getId());
            item.put("username", u.getUsername());
            item.put("phone", u.getPhone());
            item.put("email", u.getEmail());
            item.put("area", u.getArea());
            item.put("createdAt", u.getCreatedAt());
            Long orderCount = orderMapper.selectCount(
                    new LambdaQueryWrapper<Order>().eq(Order::getConsumerId, u.getId()));
            item.put("orderCount", orderCount);
            result.add(item);
        }
        return Result.ok(result);
    }
}