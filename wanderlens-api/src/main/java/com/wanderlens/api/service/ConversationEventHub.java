package com.wanderlens.api.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * 對話即時事件推送（SSE）
 */
@Slf4j
@Component
public class ConversationEventHub {

    private final Map<Long, List<SseEmitter>> emitters = new ConcurrentHashMap<>();

    public SseEmitter subscribe(Long conversationId) {
        SseEmitter emitter = new SseEmitter(0L);
        emitters.computeIfAbsent(conversationId, k -> new CopyOnWriteArrayList<>()).add(emitter);
        emitter.onCompletion(() -> remove(conversationId, emitter));
        emitter.onTimeout(() -> remove(conversationId, emitter));
        emitter.onError(e -> remove(conversationId, emitter));
        try {
            emitter.send(SseEmitter.event().name("connected").data("ok"));
        } catch (IOException e) {
            remove(conversationId, emitter);
        }
        return emitter;
    }

    public void publish(Long conversationId, String event, Object data) {
        List<SseEmitter> list = emitters.get(conversationId);
        if (list == null || list.isEmpty()) return;
        for (SseEmitter emitter : list) {
            try {
                emitter.send(SseEmitter.event().name(event).data(data));
            } catch (IOException e) {
                remove(conversationId, emitter);
            }
        }
    }

    private void remove(Long conversationId, SseEmitter emitter) {
        List<SseEmitter> list = emitters.get(conversationId);
        if (list != null) {
            list.remove(emitter);
            if (list.isEmpty()) emitters.remove(conversationId);
        }
        try {
            emitter.complete();
        } catch (Exception ignored) {
            // already closed
        }
    }
}
