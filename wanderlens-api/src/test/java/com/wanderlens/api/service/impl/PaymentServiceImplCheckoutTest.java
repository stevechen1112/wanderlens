package com.wanderlens.api.service.impl;

import com.wanderlens.api.common.ResultCode;
import com.wanderlens.api.entity.Order;
import com.wanderlens.api.entity.enums.OrderStatus;
import com.wanderlens.api.exception.ServiceException;
import com.wanderlens.api.service.ConversationService;
import com.wanderlens.api.service.LedgerService;
import com.wanderlens.api.service.NotifyService;
import com.wanderlens.api.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceImplCheckoutTest {

    @Mock
    private OrderService orderService;
    @Mock
    private NotifyService notifyService;
    @Mock
    private ConversationService conversationService;
    @Mock
    private LedgerService ledgerService;

    @InjectMocks
    private PaymentServiceImpl paymentService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(paymentService, "merchantId", "3002607");
        ReflectionTestUtils.setField(paymentService, "hashKey", "test-key");
        ReflectionTestUtils.setField(paymentService, "hashIv", "test-iv");
        ReflectionTestUtils.setField(paymentService, "returnUrl", "http://localhost/api/payment/ecpay/callback");
        ReflectionTestUtils.setField(paymentService, "frontendWebUrl", "http://localhost:3001");
        ReflectionTestUtils.setField(paymentService, "ecpayMode", "Test");
        ReflectionTestUtils.setField(paymentService, "stagingPaymentSimulateEnabled", true);
    }

    @Test
    void generateEcpayCheckout_transitionsDraftToPendingPayment() {
        Order draft = new Order();
        draft.setId(42L);
        draft.setOrderNo("WL20260915001");
        draft.setConsumerId(4L);
        draft.setStatus(OrderStatus.DRAFT.getCode());
        draft.setTotalFee(3600);

        Order pending = new Order();
        pending.setId(42L);
        pending.setOrderNo("WL20260915001");
        pending.setConsumerId(4L);
        pending.setStatus(OrderStatus.PENDING_PAYMENT.getCode());
        pending.setTotalFee(3600);

        when(orderService.getById(42L)).thenReturn(draft);
        when(orderService.transition(eq(42L), eq(OrderStatus.PENDING_PAYMENT), anyString(), anyString(), anyString()))
                .thenReturn(pending);

        String form = paymentService.generateEcpayCheckout(42L);

        assertNotNull(form);
        assertTrue(form.contains("ecpayForm"));
        verify(orderService).transition(42L, OrderStatus.PENDING_PAYMENT,
                "CHECKOUT_INIT", "消費者進入付款頁", "4");
    }

    @Test
    void generateEcpayCheckout_rejectsPaidOrder() {
        Order paid = new Order();
        paid.setId(99L);
        paid.setOrderNo("WLPAID");
        paid.setConsumerId(4L);
        paid.setStatus(OrderStatus.PAID.getCode());
        paid.setTotalFee(3600);

        when(orderService.getById(99L)).thenReturn(paid);

        ServiceException ex = assertThrows(ServiceException.class,
                () -> paymentService.generateEcpayCheckout(99L));
        assertEquals(ResultCode.ORDER_STATUS_INVALID.getCode(), ex.getCode());
        verify(orderService, never()).transition(anyLong(), any(), anyString(), anyString(), anyString());
    }
}
