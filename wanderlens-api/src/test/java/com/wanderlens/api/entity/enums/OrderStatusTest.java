package com.wanderlens.api.entity.enums;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 訂單狀態機整合測試
 * 測試所有合法與非法的狀態轉移路徑
 */
class OrderStatusTest {

    @Test
    void testMainFlowTransitions() {
        // 主流程：Draft → PendingPayment → Paid → ... → Closed
        assertTrue(OrderStatus.canTransition(OrderStatus.DRAFT, OrderStatus.PENDING_PAYMENT));
        assertTrue(OrderStatus.canTransition(OrderStatus.PENDING_PAYMENT, OrderStatus.PAID));
        assertTrue(OrderStatus.canTransition(OrderStatus.PAID, OrderStatus.WAITING_PROVIDER_CONTACT));
        assertTrue(OrderStatus.canTransition(OrderStatus.WAITING_PROVIDER_CONTACT, OrderStatus.CONFIRMED));
        assertTrue(OrderStatus.canTransition(OrderStatus.CONFIRMED, OrderStatus.READY_TO_SHOOT));
        assertTrue(OrderStatus.canTransition(OrderStatus.READY_TO_SHOOT, OrderStatus.SHOOTING_STARTED));
        assertTrue(OrderStatus.canTransition(OrderStatus.SHOOTING_STARTED, OrderStatus.SHOOTING_ENDED));
        assertTrue(OrderStatus.canTransition(OrderStatus.SHOOTING_ENDED, OrderStatus.UPLOADING_RAW));
        assertTrue(OrderStatus.canTransition(OrderStatus.UPLOADING_RAW, OrderStatus.AI_PROCESSING));
        assertTrue(OrderStatus.canTransition(OrderStatus.AI_PROCESSING, OrderStatus.DELIVERED));
        assertTrue(OrderStatus.canTransition(OrderStatus.DELIVERED, OrderStatus.CLOSED));
    }

    @Test
    void testRetouchFlow() {
        assertTrue(OrderStatus.canTransition(OrderStatus.DELIVERED, OrderStatus.RETOUCH_REQUESTED));
        assertTrue(OrderStatus.canTransition(OrderStatus.RETOUCH_REQUESTED, OrderStatus.RETOUCHING));
        assertTrue(OrderStatus.canTransition(OrderStatus.RETOUCHING, OrderStatus.RETOUCH_DELIVERED));
        assertTrue(OrderStatus.canTransition(OrderStatus.RETOUCH_DELIVERED, OrderStatus.CLOSED));
    }

    @Test
    void testExceptionFlow() {
        // 重新媒合
        assertTrue(OrderStatus.canTransition(OrderStatus.PAID, OrderStatus.REMATCHING));
        assertTrue(OrderStatus.canTransition(OrderStatus.REMATCHING, OrderStatus.WAITING_PROVIDER_CONTACT));

        // 改期
        assertTrue(OrderStatus.canTransition(OrderStatus.CONFIRMED, OrderStatus.RESCHEDULED));
        assertTrue(OrderStatus.canTransition(OrderStatus.RESCHEDULED, OrderStatus.READY_TO_SHOOT));

        // 爭議
        assertTrue(OrderStatus.canTransition(OrderStatus.DELIVERED, OrderStatus.DISPUTED));
        assertTrue(OrderStatus.canTransition(OrderStatus.DISPUTED, OrderStatus.REFUNDED));
        assertTrue(OrderStatus.canTransition(OrderStatus.DISPUTED, OrderStatus.CLOSED));

        // 取消
        assertTrue(OrderStatus.canTransition(OrderStatus.DRAFT, OrderStatus.CANCELLED));
        assertTrue(OrderStatus.canTransition(OrderStatus.PENDING_PAYMENT, OrderStatus.CANCELLED));
        assertTrue(OrderStatus.canTransition(OrderStatus.PAID, OrderStatus.CANCELLED));
    }

    @Test
    void testIllegalTransitions() {
        // 不可跳過狀態
        assertFalse(OrderStatus.canTransition(OrderStatus.DRAFT, OrderStatus.PAID));
        assertFalse(OrderStatus.canTransition(OrderStatus.PENDING_PAYMENT, OrderStatus.DELIVERED));
        assertFalse(OrderStatus.canTransition(OrderStatus.PAID, OrderStatus.SHOOTING_STARTED));

        // 不可從終態轉移
        assertFalse(OrderStatus.canTransition(OrderStatus.CLOSED, OrderStatus.DELIVERED));
        assertFalse(OrderStatus.canTransition(OrderStatus.CANCELLED, OrderStatus.PAID));
        assertFalse(OrderStatus.canTransition(OrderStatus.REFUNDED, OrderStatus.CLOSED));

        // 不可逆向
        assertFalse(OrderStatus.canTransition(OrderStatus.DELIVERED, OrderStatus.AI_PROCESSING));
        assertFalse(OrderStatus.canTransition(OrderStatus.SHOOTING_ENDED, OrderStatus.SHOOTING_STARTED));
    }

    @Test
    void testTerminalStates() {
        assertTrue(OrderStatus.isTerminal(OrderStatus.CLOSED));
        assertTrue(OrderStatus.isTerminal(OrderStatus.CANCELLED));
        assertTrue(OrderStatus.isTerminal(OrderStatus.REFUNDED));

        assertFalse(OrderStatus.isTerminal(OrderStatus.DRAFT));
        assertFalse(OrderStatus.isTerminal(OrderStatus.PAID));
        assertFalse(OrderStatus.isTerminal(OrderStatus.DELIVERED));
    }

    @Test
    void testFromCode() {
        assertEquals(OrderStatus.PAID, OrderStatus.fromCode("Paid"));
        assertEquals(OrderStatus.DELIVERED, OrderStatus.fromCode("Delivered"));
        assertEquals(OrderStatus.CLOSED, OrderStatus.fromCode("Closed"));

        assertThrows(IllegalArgumentException.class, () -> OrderStatus.fromCode("Unknown"));
    }
}