package com.wanderlens.api.scheduler;

import com.wanderlens.api.service.MatchRequestService;
import com.wanderlens.api.service.impl.PhotographerOnlineServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class MatchTimeoutManager {

    private final MatchRequestService matchRequestService;

    @Scheduled(fixedRate = 1000)
    public void checkTimeouts() {
        try {
            matchRequestService.processTimeouts();
        } catch (Exception e) {
            log.warn("Match timeout check failed: {}", e.getMessage());
        }
    }
}
