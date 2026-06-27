package com.wanderlens.api.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Slf4j
@Component
public class MatchingEventHub {

    private final Map<Long, List<SseEmitter>> emitters = new ConcurrentHashMap<>();

    public SseEmitter subscribe(Long requestId) {
        SseEmitter emitter = new SseEmitter(120_000L);
        emitters.computeIfAbsent(requestId, k -> new CopyOnWriteArrayList<>()).add(emitter);
        emitter.onCompletion(() -> remove(requestId, emitter));
        emitter.onTimeout(() -> remove(requestId, emitter));
        emitter.onError(e -> remove(requestId, emitter));
        try {
            emitter.send(SseEmitter.event().name("connected").data("ok"));
        } catch (IOException e) {
            remove(requestId, emitter);
        }
        return emitter;
    }

    public void publish(Long requestId, String event, Object data) {
        List<SseEmitter> list = emitters.get(requestId);
        if (list == null || list.isEmpty()) return;
        for (SseEmitter emitter : list) {
            try {
                emitter.send(SseEmitter.event().name(event).data(data));
            } catch (IOException e) {
                remove(requestId, emitter);
            }
        }
    }

    private void remove(Long requestId, SseEmitter emitter) {
        List<SseEmitter> list = emitters.get(requestId);
        if (list != null) {
            list.remove(emitter);
            if (list.isEmpty()) emitters.remove(requestId);
        }
        try {
            emitter.complete();
        } catch (Exception ignored) {
            // already closed
        }
    }
}
