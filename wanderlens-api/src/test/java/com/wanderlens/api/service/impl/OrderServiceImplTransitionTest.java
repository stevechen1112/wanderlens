package com.wanderlens.api.service.impl;

import com.wanderlens.api.entity.Order;
import com.wanderlens.api.entity.OrderHistory;
import com.wanderlens.api.entity.enums.OrderStatus;
import com.wanderlens.api.exception.ServiceException;
import com.wanderlens.api.mapper.OrderHistoryMapper;
import com.wanderlens.api.mapper.OrderMapper;
import com.wanderlens.api.mapper.ProviderMapper;
import com.wanderlens.api.mapper.ShootEventMapper;
import com.wanderlens.api.mapper.StudioAvailabilityMapper;
import com.wanderlens.api.service.AvailabilityService;
import com.wanderlens.api.service.ConversationService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class OrderServiceImplTransitionTest {

    @Mock
    private OrderHistoryMapper orderHistoryMapper;
    @Mock
    private ShootEventMapper shootEventMapper;
    @Mock
    private AvailabilityService availabilityService;
    @Mock
    private StudioAvailabilityMapper studioAvailabilityMapper;
    @Mock
    private ProviderMapper providerMapper;
    @Mock
    private ConversationService conversationService;
    @Mock
    private OrderMapper orderMapper;

    @Spy
    @InjectMocks
    private OrderServiceImpl orderService;

    @Test
    void confirmReadyToShoot_movesConfirmedToReadyToShoot() {
        Order order = baseOrder(OrderStatus.CONFIRMED.getCode());
        doReturn(order).when(orderService).getById(1L);
        doReturn(true).when(orderService).updateById(any(Order.class));

        Order result = orderService.confirmReadyToShoot(1L, 10L);

        assertEquals(OrderStatus.READY_TO_SHOOT.getCode(), result.getStatus());
        verify(orderHistoryMapper).insert(any(OrderHistory.class));
    }

    @Test
    void confirmReadyToShoot_rejectsWrongPhotographer() {
        Order order = baseOrder(OrderStatus.CONFIRMED.getCode());
        doReturn(order).when(orderService).getById(1L);

        assertThrows(ServiceException.class, () -> orderService.confirmReadyToShoot(1L, 99L));
    }

    @Test
    void contactCustomer_movesWaitingToConfirmed() {
        Order order = baseOrder(OrderStatus.WAITING_PROVIDER_CONTACT.getCode());
        doReturn(order).when(orderService).getById(1L);
        doReturn(true).when(orderService).updateById(any(Order.class));

        Order result = orderService.contactCustomer(1L, 10L);

        assertEquals(OrderStatus.CONFIRMED.getCode(), result.getStatus());
    }

    private Order baseOrder(String status) {
        Order order = new Order();
        order.setId(1L);
        order.setOrderNo("WL-TEST-001");
        order.setPhotographerId(10L);
        order.setConsumerId(4L);
        order.setStatus(status);
        return order;
    }
}
