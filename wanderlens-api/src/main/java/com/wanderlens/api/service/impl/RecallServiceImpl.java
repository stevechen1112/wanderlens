package com.wanderlens.api.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.wanderlens.api.entity.Album;
import com.wanderlens.api.entity.Order;
import com.wanderlens.api.entity.enums.OrderStatus;
import com.wanderlens.api.entity.dto.RecallItemDto;
import com.wanderlens.api.mapper.AlbumMapper;
import com.wanderlens.api.service.OrderService;
import com.wanderlens.api.service.RecallService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecallServiceImpl implements RecallService {

    private static final long BABY_SERVICE_TYPE_ID = 4L;
    private static final List<Long> TRAVEL_SERVICE_TYPE_IDS = List.of(11L, 12L);

    private final OrderService orderService;
    private final AlbumMapper albumMapper;

    @Override
    public List<RecallItemDto> getFeed(Long consumerId) {
        LocalDate today = LocalDate.now();
        List<RecallItemDto> items = new ArrayList<>();

        for (int yearsAgo = 1; yearsAgo <= 5; yearsAgo++) {
            LocalDate anniversaryDate = today.minusYears(yearsAgo);
            List<Order> orders = orderService.list(new LambdaQueryWrapper<Order>()
                    .eq(Order::getConsumerId, consumerId)
                    .eq(Order::getStatus, OrderStatus.CLOSED.getCode())
                    .eq(Order::getShootingDate, anniversaryDate));
            for (Order order : orders) {
                Album album = findAlbum(order.getId());
                items.add(RecallItemDto.builder()
                        .type("ANNIVERSARY")
                        .title(yearsAgo + " 週年回憶")
                        .subtitle("一年前的今天，您在 "
                                + defaultLocation(order.getShootingLocation()) + " 留下了美好時光")
                        .orderId(order.getId())
                        .albumId(album != null ? album.getId() : null)
                        .shootingDate(order.getShootingDate())
                        .shootingLocation(order.getShootingLocation())
                        .actionLabel("回顧照片")
                        .build());
            }
        }

        List<Order> babyOrders = orderService.list(new LambdaQueryWrapper<Order>()
                .eq(Order::getConsumerId, consumerId)
                .eq(Order::getStatus, OrderStatus.CLOSED.getCode())
                .eq(Order::getServiceTypeId, BABY_SERVICE_TYPE_ID));
        for (Order order : babyOrders) {
            if (order.getShootingDate() == null) continue;
            long monthsSince = ChronoUnit.MONTHS.between(order.getShootingDate(), today);
            if (monthsSince < 1 || monthsSince > 12) continue;
            Album album = findAlbum(order.getId());
            items.add(RecallItemDto.builder()
                    .type("BABY_MONTH")
                    .title("寶寶 " + monthsSince + " 個月")
                    .subtitle("記錄成長的每一刻，回顧 " + monthsSince + " 個月前的溫馨時光")
                    .orderId(order.getId())
                    .albumId(album != null ? album.getId() : null)
                    .shootingDate(order.getShootingDate())
                    .shootingLocation(order.getShootingLocation())
                    .actionLabel("查看成長相簿")
                    .build());
        }

        LocalDate travelSince = today.minusMonths(12);
        List<Order> travelOrders = orderService.list(new LambdaQueryWrapper<Order>()
                .eq(Order::getConsumerId, consumerId)
                .eq(Order::getStatus, OrderStatus.CLOSED.getCode())
                .in(Order::getServiceTypeId, TRAVEL_SERVICE_TYPE_IDS)
                .ge(Order::getShootingDate, travelSince)
                .le(Order::getShootingDate, today.minusDays(30)));
        for (Order order : travelOrders) {
            Album album = findAlbum(order.getId());
            items.add(RecallItemDto.builder()
                    .type("TRAVEL")
                    .title("旅遊回憶")
                    .subtitle("回味您在 " + defaultLocation(order.getShootingLocation()) + " 的旅拍時光")
                    .orderId(order.getId())
                    .albumId(album != null ? album.getId() : null)
                    .shootingDate(order.getShootingDate())
                    .shootingLocation(order.getShootingLocation())
                    .actionLabel("重溫旅程")
                    .build());
        }

        items.sort(Comparator.comparing(RecallItemDto::getShootingDate, Comparator.nullsLast(Comparator.reverseOrder())));
        return items.stream().limit(20).toList();
    }

    private Album findAlbum(Long orderId) {
        return albumMapper.selectOne(new LambdaQueryWrapper<Album>()
                .eq(Album::getOrderId, orderId)
                .last("LIMIT 1"));
    }

    private String defaultLocation(String location) {
        return location != null && !location.isBlank() ? location : "台灣";
    }
}
