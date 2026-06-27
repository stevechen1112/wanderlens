package com.wanderlens.api.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Google Maps 工具類測試
 */
class GoogleMapsUtilTest {

    @Test
    void testCalculateTransportationFee_under10km() {
        GoogleMapsUtil util = new GoogleMapsUtil();
        // 10 公里以內不補貼
        assertEquals(0, util.calculateTransportationFee(5000, 5, 650));   // 5km
        assertEquals(0, util.calculateTransportationFee(10000, 5, 650));  // 10km
    }

    @Test
    void testCalculateTransportationFee_over10km() {
        GoogleMapsUtil util = new GoogleMapsUtil();
        // 15km: (15-10) * 2 * 5 = 50
        assertEquals(50, util.calculateTransportationFee(15000, 5, 650));
        // 20km: (20-10) * 2 * 5 = 100
        assertEquals(100, util.calculateTransportationFee(20000, 5, 650));
    }

    @Test
    void testCalculateTransportationFee_maxCap() {
        GoogleMapsUtil util = new GoogleMapsUtil();
        // 100km: (100-10) * 2 * 5 = 900, but capped at 650
        assertEquals(650, util.calculateTransportationFee(100000, 5, 650));
    }
}