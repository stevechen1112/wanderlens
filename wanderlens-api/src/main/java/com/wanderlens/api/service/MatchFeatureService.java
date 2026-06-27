package com.wanderlens.api.service;

import com.wanderlens.api.entity.dto.MatchFeatureFlagsDto;

public interface MatchFeatureService {

    MatchFeatureFlagsDto getFlags();

    void updateFlags(MatchFeatureFlagsDto flags);

    void assertInstantMatchEnabled();

    void assertProviderOnlineAllowed();

    void assertServiceTypeAllowed(Long serviceTypeId);
}
