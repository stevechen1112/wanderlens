package com.wanderlens.api.service;

import com.wanderlens.api.entity.dto.MatchOnlineRequest;
import com.wanderlens.api.entity.dto.MatchSettingsDto;

import java.util.Map;

public interface PhotographerOnlineService {

    void goOnline(Long photographerId, MatchOnlineRequest request);

    void goOffline(Long photographerId);

    boolean isOnline(Long photographerId);

    void heartbeat(Long photographerId);

    Map<String, Object> getOnlineStatus(Long photographerId);

    void saveSettings(Long photographerId, MatchSettingsDto settings);

    MatchSettingsDto getSettings(Long photographerId);
}
