package com.wanderlens.api.service;

import com.wanderlens.api.entity.dto.CreateInstantMatchRequest;
import com.wanderlens.api.entity.dto.MatchRequestDto;
import com.wanderlens.api.entity.dto.MatchSettingsDto;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;

public interface MatchRequestService {

    MatchRequestDto createRequest(Long consumerId, CreateInstantMatchRequest request);

    MatchRequestDto getRequest(Long consumerId, Long requestId);

    void cancelRequest(Long consumerId, Long requestId);

    MatchRequestDto acceptRequest(Long providerId, Long requestId);

    void declineRequest(Long providerId, Long requestId);

    Map<String, Object> payAfterMatch(Long consumerId, Long requestId);

    Map<String, Object> getStats(Long providerId);

    void processTimeouts();

    SseEmitter subscribe(Long consumerId, Long requestId);
}
