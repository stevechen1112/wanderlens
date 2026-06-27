package com.wanderlens.api.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

/**
 * Google Maps API 工具
 */
@Slf4j
@Component
public class GoogleMapsUtil {

    @Value("${wanderlens.google.maps-api-key:}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String DIRECTIONS_API = "https://maps.googleapis.com/maps/api/directions/json";
    private static final String PLACES_API = "https://maps.googleapis.com/maps/api/place/textsearch/json";
    private static final String GEOCODE_API = "https://maps.googleapis.com/maps/api/geocode/json";
    private static final String AUTOCOMPLETE_API = "https://maps.googleapis.com/maps/api/place/autocomplete/json";

    public long getDrivingDistance(String origin, String destination) {
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("Google Maps API key 未設定");
            return 0;
        }
        try {
            String url = DIRECTIONS_API + "?origin=" + URLEncoder.encode(origin, StandardCharsets.UTF_8)
                    + "&destination=" + URLEncoder.encode(destination, StandardCharsets.UTF_8)
                    + "&key=" + apiKey + "&language=zh-TW";

            String json = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(json);
            if ("OK".equals(root.path("status").asText())) {
                JsonNode legs = root.path("routes").path(0).path("legs");
                if (legs.isArray() && !legs.isEmpty()) {
                    return legs.get(0).path("distance").path("value").asLong();
                }
            }
            log.warn("Directions API 無結果: status={}", root.path("status").asText());
            return 0;
        } catch (Exception e) {
            log.error("Google Directions API 例外", e);
            return 0;
        }
    }

    public String searchPlaces(String query, String language) {
        try {
            String url = PLACES_API + "?query=" + URLEncoder.encode(query, StandardCharsets.UTF_8)
                    + "&language=" + (language != null ? language : "zh-TW")
                    + "&region=tw"
                    + "&key=" + apiKey;
            return restTemplate.getForObject(url, String.class);
        } catch (Exception e) {
            log.error("Google Places API 例外", e);
            return "{\"status\":\"ERROR\"}";
        }
    }

    public String autocomplete(String input, String language) {
        try {
            String url = AUTOCOMPLETE_API + "?input=" + URLEncoder.encode(input, StandardCharsets.UTF_8)
                    + "&language=" + (language != null ? language : "zh-TW")
                    + "&components=country:tw"
                    + "&key=" + apiKey;
            return restTemplate.getForObject(url, String.class);
        } catch (Exception e) {
            log.error("Google Autocomplete API 例外", e);
            return "{\"status\":\"ERROR\"}";
        }
    }

    public double[] geocode(String address) {
        if (apiKey == null || apiKey.isBlank()) {
            return new double[]{0.0, 0.0};
        }
        try {
            String url = GEOCODE_API + "?address=" + URLEncoder.encode(address, StandardCharsets.UTF_8)
                    + "&key=" + apiKey + "&language=zh-TW";

            String json = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(json);
            if ("OK".equals(root.path("status").asText())) {
                JsonNode location = root.path("results").path(0).path("geometry").path("location");
                if (!location.isMissingNode()) {
                    return new double[]{location.path("lat").asDouble(), location.path("lng").asDouble()};
                }
            }
            log.warn("Geocoder 無結果: address={}, status={}", address, root.path("status").asText());
            return new double[]{0.0, 0.0};
        } catch (Exception e) {
            log.error("Google Geocoder API 例外", e);
            return new double[]{0.0, 0.0};
        }
    }

    public int calculateTransportationFee(long distanceMeters, int perKmSubsidy, int maxFee) {
        long distanceKm = distanceMeters / 1000;
        if (distanceKm <= 10) {
            return 0;
        }
        int fee = (int) ((distanceKm - 10) * 2L * perKmSubsidy);
        return Math.min(fee, maxFee);
    }
}
