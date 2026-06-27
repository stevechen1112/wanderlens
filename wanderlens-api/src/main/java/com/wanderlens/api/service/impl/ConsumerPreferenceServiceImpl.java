package com.wanderlens.api.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.wanderlens.api.entity.ConsumerPreference;
import com.wanderlens.api.entity.dto.ConsumerPreferenceDto;
import com.wanderlens.api.mapper.ConsumerPreferenceMapper;
import com.wanderlens.api.service.ConsumerPreferenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConsumerPreferenceServiceImpl implements ConsumerPreferenceService {

    private final ConsumerPreferenceMapper preferenceMapper;

    @Override
    public ConsumerPreferenceDto getByUserId(Long userId) {
        ConsumerPreference pref = preferenceMapper.selectOne(
                new LambdaQueryWrapper<ConsumerPreference>().eq(ConsumerPreference::getUserId, userId));
        if (pref == null) {
            ConsumerPreferenceDto dto = new ConsumerPreferenceDto();
            dto.setPreferredServiceTypeIds(Collections.emptyList());
            dto.setPreferredCities(Collections.emptyList());
            dto.setPushRecallEnabled(true);
            return dto;
        }
        return toDto(pref);
    }

    @Override
    @Transactional
    public void save(Long userId, ConsumerPreferenceDto dto) {
        ConsumerPreference pref = preferenceMapper.selectOne(
                new LambdaQueryWrapper<ConsumerPreference>().eq(ConsumerPreference::getUserId, userId));
        if (pref == null) {
            pref = new ConsumerPreference();
            pref.setUserId(userId);
        }
        if (dto.getPreferredServiceTypeIds() != null) {
            pref.setPreferredServiceTypeIds(dto.getPreferredServiceTypeIds().stream()
                    .map(String::valueOf).collect(Collectors.joining(",")));
        }
        if (dto.getPreferredCities() != null) {
            pref.setPreferredCities(String.join(",", dto.getPreferredCities()));
        }
        pref.setBudgetMin(dto.getBudgetMin());
        pref.setBudgetMax(dto.getBudgetMax());
        if (dto.getPushRecallEnabled() != null) {
            pref.setPushRecallEnabled(dto.getPushRecallEnabled());
        }
        if (pref.getId() == null) {
            preferenceMapper.insert(pref);
        } else {
            preferenceMapper.updateById(pref);
        }
    }

    private ConsumerPreferenceDto toDto(ConsumerPreference pref) {
        ConsumerPreferenceDto dto = new ConsumerPreferenceDto();
        dto.setPreferredServiceTypeIds(parseLongList(pref.getPreferredServiceTypeIds()));
        dto.setPreferredCities(parseStringList(pref.getPreferredCities()));
        dto.setBudgetMin(pref.getBudgetMin());
        dto.setBudgetMax(pref.getBudgetMax());
        dto.setPushRecallEnabled(pref.getPushRecallEnabled() == null || pref.getPushRecallEnabled());
        return dto;
    }

    private List<Long> parseLongList(String raw) {
        if (raw == null || raw.isBlank()) return Collections.emptyList();
        return Arrays.stream(raw.split(",")).map(String::trim).filter(s -> !s.isEmpty())
                .map(Long::valueOf).collect(Collectors.toList());
    }

    private List<String> parseStringList(String raw) {
        if (raw == null || raw.isBlank()) return Collections.emptyList();
        return Arrays.stream(raw.split(",")).map(String::trim).filter(s -> !s.isEmpty()).collect(Collectors.toList());
    }
}
