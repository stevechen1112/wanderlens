package com.wanderlens.api.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wanderlens.api.common.ResultCode;
import com.wanderlens.api.entity.dto.MatchFeatureFlagsDto;
import com.wanderlens.api.exception.ServiceException;
import com.wanderlens.api.service.MatchFeatureService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class MatchFeatureServiceImpl implements MatchFeatureService {

    private static final String FLAGS_KEY = "match:feature:flags";

    private final StringRedisTemplate stringRedisTemplate;
    private final ObjectMapper objectMapper;

    @Override
    public MatchFeatureFlagsDto getFlags() {
        try {
            String json = stringRedisTemplate.opsForValue().get(FLAGS_KEY);
            if (json == null || json.isBlank()) {
                return defaultFlags();
            }
            return objectMapper.readValue(json, MatchFeatureFlagsDto.class);
        } catch (Exception e) {
            log.warn("Failed to read match feature flags, using defaults", e);
            return defaultFlags();
        }
    }

    @Override
    public void updateFlags(MatchFeatureFlagsDto flags) {
        try {
            stringRedisTemplate.opsForValue().set(FLAGS_KEY, objectMapper.writeValueAsString(flags));
            log.info("Match feature flags updated: instant={}, travel={}, street={}",
                    flags.isInstantMatchEnabled(), flags.isTravelInstantEnabled(), flags.isStreetInstantEnabled());
        } catch (Exception e) {
            throw new ServiceException(ResultCode.INTERNAL_ERROR, "無法更新即時媒合開關");
        }
    }

    @Override
    public void assertInstantMatchEnabled() {
        if (!getFlags().isInstantMatchEnabled()) {
            throw new ServiceException(ResultCode.BAD_REQUEST, "即時媒合功能尚未開放");
        }
    }

    @Override
    public void assertProviderOnlineAllowed() {
        assertInstantMatchEnabled();
    }

    @Override
    public void assertServiceTypeAllowed(Long serviceTypeId) {
        assertInstantMatchEnabled();
        MatchFeatureFlagsDto flags = getFlags();
        if (serviceTypeId == null) return;
        if ((serviceTypeId == 11L || serviceTypeId == 12L) && !flags.isTravelInstantEnabled()) {
            throw new ServiceException(ResultCode.BAD_REQUEST, "旅拍即時媒合尚未開放");
        }
        if (serviceTypeId != 11L && serviceTypeId != 12L && !flags.isStreetInstantEnabled()) {
            throw new ServiceException(ResultCode.BAD_REQUEST, "街拍隨行尚未開放");
        }
    }

    private MatchFeatureFlagsDto defaultFlags() {
        MatchFeatureFlagsDto dto = new MatchFeatureFlagsDto();
        dto.setInstantMatchEnabled(false);
        dto.setTravelInstantEnabled(true);
        dto.setStreetInstantEnabled(true);
        return dto;
    }
}
