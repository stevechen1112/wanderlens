package com.wanderlens.api.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.wanderlens.api.entity.Album;
import com.wanderlens.api.entity.Order;
import com.wanderlens.api.entity.enums.OrderStatus;
import com.wanderlens.api.entity.dto.RecallItemDto;
import com.wanderlens.api.mapper.AlbumMapper;
import com.wanderlens.api.service.impl.RecallServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RecallServiceTest {

    @Mock
    private OrderService orderService;

    @Mock
    private AlbumMapper albumMapper;

    @InjectMocks
    private RecallServiceImpl recallService;

    @Test
    void getFeed_includesAnniversaryRecall() {
        LocalDate today = LocalDate.now();
        Order order = new Order();
        order.setId(100L);
        order.setConsumerId(1L);
        order.setStatus(OrderStatus.CLOSED.getCode());
        order.setShootingDate(today.minusYears(1));
        order.setShootingLocation("大稻埕");

        when(orderService.list(any(LambdaQueryWrapper.class)))
                .thenReturn(List.of(order))
                .thenReturn(List.of())
                .thenReturn(List.of())
                .thenReturn(List.of())
                .thenReturn(List.of())
                .thenReturn(List.of())
                .thenReturn(List.of());

        Album album = new Album();
        album.setId(50L);
        when(albumMapper.selectOne(any())).thenReturn(album);

        List<RecallItemDto> feed = recallService.getFeed(1L);
        assertFalse(feed.isEmpty());
        assertEquals("ANNIVERSARY", feed.get(0).getType());
        assertEquals(50L, feed.get(0).getAlbumId());
    }
}
