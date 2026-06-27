package com.wanderlens.api.controller.order;

import com.wanderlens.api.common.Result;
import com.wanderlens.api.common.ResultCode;
import com.wanderlens.api.entity.Order;
import com.wanderlens.api.service.OrderService;
import com.wanderlens.api.service.PaymentService;
import com.wanderlens.api.util.AuthUtil;
import com.wanderlens.api.util.ProviderIdResolver;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderControllerNotFoundTest {

    @Mock
    private OrderService orderService;
    @Mock
    private PaymentService paymentService;
    @Mock
    private AuthUtil authUtil;
    @Mock
    private ProviderIdResolver providerIdResolver;
    @Mock
    private HttpServletRequest request;

    @InjectMocks
    private OrderController orderController;

    @Test
    void getOrder_returnsOrderNotFoundWhenMissing() {
        when(orderService.getById(99L)).thenReturn(null);

        Result<Order> result = orderController.getOrder(request, 99L);

        assertEquals(ResultCode.ORDER_NOT_FOUND.getCode(), result.getCode());
    }
}
