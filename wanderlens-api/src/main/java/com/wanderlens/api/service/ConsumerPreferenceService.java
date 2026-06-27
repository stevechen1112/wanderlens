package com.wanderlens.api.service;

import com.wanderlens.api.entity.dto.ConsumerPreferenceDto;

public interface ConsumerPreferenceService {
    ConsumerPreferenceDto getByUserId(Long userId);
    void save(Long userId, ConsumerPreferenceDto dto);
}
