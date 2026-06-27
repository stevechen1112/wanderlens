package com.wanderlens.api.config;

import com.wanderlens.api.service.MatchBroadcastEngine;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.listener.PatternTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;

@Configuration
@RequiredArgsConstructor
public class MatchRedisListenerConfig {

    private final MatchBroadcastEngine broadcastEngine;

    @Bean
    RedisMessageListenerContainer matchRedisListenerContainer(RedisConnectionFactory connectionFactory) {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        MessageListenerAdapter adapter = new MessageListenerAdapter(broadcastEngine, "handleMessage");
        container.addMessageListener(adapter, new PatternTopic(MatchBroadcastEngine.CHANNEL));
        return container;
    }
}
