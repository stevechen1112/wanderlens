package com.wanderlens.api.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wanderlens.api.entity.dto.MatchOnlineRequest;
import com.wanderlens.api.entity.dto.MatchSettingsDto;
import com.wanderlens.api.service.MatchFeatureService;
import com.wanderlens.api.service.PhotographerOnlineService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class PhotographerOnlineServiceImpl implements PhotographerOnlineService {

    private static final String HEARTBEAT_PREFIX = "online:heartbeat:";
    private static final String LOCATION_PREFIX = "online:location:";
    private static final String CITY_SET_PREFIX = "online:photographer:";
    private static final String SETTINGS_PREFIX = "match:settings:";

    private final StringRedisTemplate stringRedisTemplate;
    private final ObjectMapper objectMapper;
    private final MatchFeatureService matchFeatureService;

    @Override
    public void goOnline(Long photographerId, MatchOnlineRequest request) {
        matchFeatureService.assertProviderOnlineAllowed();
        String city = request.getCity() != null ? request.getCity() : "default";
        stringRedisTemplate.opsForSet().add(CITY_SET_PREFIX + city, photographerId.toString());
        stringRedisTemplate.opsForValue().set(HEARTBEAT_PREFIX + photographerId, "1", Duration.ofSeconds(30));

        Map<String, String> location = new HashMap<>();
        if (request.getLat() != null) location.put("lat", request.getLat().toString());
        if (request.getLng() != null) location.put("lng", request.getLng().toString());
        location.put("city", city);
        stringRedisTemplate.opsForHash().putAll(LOCATION_PREFIX + photographerId, location);
        log.info("Photographer online: id={}, city={}", photographerId, city);
    }

    @Override
    public void goOffline(Long photographerId) {
        stringRedisTemplate.delete(HEARTBEAT_PREFIX + photographerId);
        Map<Object, Object> loc = stringRedisTemplate.opsForHash().entries(LOCATION_PREFIX + photographerId);
        if (loc.get("city") != null) {
            stringRedisTemplate.opsForSet().remove(CITY_SET_PREFIX + loc.get("city"), photographerId.toString());
        }
        Set<String> keys = stringRedisTemplate.keys(CITY_SET_PREFIX + "*");
        if (keys != null) {
            for (String key : keys) {
                stringRedisTemplate.opsForSet().remove(key, photographerId.toString());
            }
        }
        stringRedisTemplate.delete(LOCATION_PREFIX + photographerId);
        log.info("Photographer offline: id={}", photographerId);
    }

    @Override
    public boolean isOnline(Long photographerId) {
        return Boolean.TRUE.equals(stringRedisTemplate.hasKey(HEARTBEAT_PREFIX + photographerId));
    }

    @Override
    public void heartbeat(Long photographerId) {
        if (!isOnline(photographerId)) return;
        stringRedisTemplate.expire(HEARTBEAT_PREFIX + photographerId, 30, TimeUnit.SECONDS);
    }

    @Override
    public Map<String, Object> getOnlineStatus(Long photographerId) {
        Map<String, Object> status = new HashMap<>();
        status.put("online", isOnline(photographerId));
        status.put("location", stringRedisTemplate.opsForHash().entries(LOCATION_PREFIX + photographerId));
        return status;
    }

    @Override
    public void saveSettings(Long photographerId, MatchSettingsDto settings) {
        try {
            stringRedisTemplate.opsForValue().set(SETTINGS_PREFIX + photographerId, objectMapper.writeValueAsString(settings));
        } catch (Exception e) {
            log.warn("Save match settings failed: {}", e.getMessage());
        }
    }

    @Override
    public MatchSettingsDto getSettings(Long photographerId) {
        try {
            String json = stringRedisTemplate.opsForValue().get(SETTINGS_PREFIX + photographerId);
            if (json == null) return new MatchSettingsDto();
            return objectMapper.readValue(json, MatchSettingsDto.class);
        } catch (Exception e) {
            return new MatchSettingsDto();
        }
    }

    public Set<String> getOnlinePhotographerIds(String city) {
        return stringRedisTemplate.opsForSet().members(CITY_SET_PREFIX + (city != null ? city : "default"));
    }

    public Map<Object, Object> getLocation(Long photographerId) {
        return stringRedisTemplate.opsForHash().entries(LOCATION_PREFIX + photographerId);
    }
}
