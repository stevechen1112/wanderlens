package com.wanderlens.api.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * LINE Messaging Channel 測試
 */
class LineMessagingChannelTest {

    @Test
    void testIsAvailableWithEmptyToken() {
        LineMessagingChannel channel = new LineMessagingChannel();
        // channelAccessToken 為空（@Value 未注入）
        assertFalse(channel.isAvailable("U123456789"));
    }

    @Test
    void testIsAvailableWithEmptyRecipient() {
        LineMessagingChannel channel = new LineMessagingChannel();
        assertFalse(channel.isAvailable(null));
        assertFalse(channel.isAvailable(""));
    }

    @Test
    void testGetName() {
        LineMessagingChannel channel = new LineMessagingChannel();
        assertEquals("LINE_MESSAGING", channel.getName());
    }
}