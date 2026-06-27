package com.wanderlens.api.controller;

import com.wanderlens.api.common.Result;
import com.wanderlens.api.util.GoogleMapsUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Google 服務 API
 * - Places 地點搜尋（取代 joyshot-node-server）
 * - Maps Directions 交通距離
 * - Geocoder 地址轉經緯度
 */
@RestController
@RequestMapping("/google")
@RequiredArgsConstructor
@Tag(name = "Google", description = "Google 服務")
public class GoogleController {

    private final GoogleMapsUtil googleMapsUtil;

    @GetMapping("/places/search")
    @Operation(summary = "地點搜尋（取代 node-server 代理）")
    public Result<String> searchPlaces(@RequestParam String query,
                                       @RequestParam(defaultValue = "zh-TW") String lang) {
        return Result.ok(googleMapsUtil.searchPlaces(query, lang));
    }

    @GetMapping("/maps/directions")
    @Operation(summary = "交通距離計算")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<Map<String, Object>> directions(@RequestParam String origin,
                                                   @RequestParam String destination) {
        long distance = googleMapsUtil.getDrivingDistance(origin, destination);
        int fee = googleMapsUtil.calculateTransportationFee(distance, 5, 650);
        return Result.ok(Map.of(
                "distanceMeters", distance,
                "transportationFee", fee
        ));
    }

    @GetMapping("/places/autocomplete")
    @Operation(summary = "地點自動完成")
    public Result<String> autocomplete(@RequestParam String input,
                                       @RequestParam(defaultValue = "zh-TW") String lang) {
        return Result.ok(googleMapsUtil.autocomplete(input, lang));
    }

    @GetMapping("/maps/geocode")
    @Operation(summary = "地址轉經緯度")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<double[]> geocode(@RequestParam String address) {
        return Result.ok(googleMapsUtil.geocode(address));
    }
}