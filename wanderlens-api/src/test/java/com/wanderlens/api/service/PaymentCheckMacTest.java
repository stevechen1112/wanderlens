package com.wanderlens.api.service;

import com.wanderlens.api.service.impl.PaymentServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Map;
import java.util.TreeMap;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 綠界 CheckMacValue 演算法單元測試
 */
class PaymentCheckMacTest {

    @Test
    void computeCheckMacValue_isDeterministic() throws Exception {
        PaymentServiceImpl service = new PaymentServiceImpl(null, null, null, null);
        ReflectionTestUtils.setField(service, "hashKey", "testHashKey");
        ReflectionTestUtils.setField(service, "hashIv", "testHashIv");

        Map<String, String> params = new TreeMap<>();
        params.put("MerchantID", "2000132");
        params.put("MerchantTradeNo", "WL20260625001");
        params.put("TotalAmount", "1000");

        var method = PaymentServiceImpl.class.getDeclaredMethod("computeCheckMacValue", Map.class);
        method.setAccessible(true);
        String mac1 = (String) method.invoke(service, params);
        String mac2 = (String) method.invoke(service, params);

        assertNotNull(mac1);
        assertEquals(64, mac1.length());
        assertEquals(mac1, mac2);
    }
}
