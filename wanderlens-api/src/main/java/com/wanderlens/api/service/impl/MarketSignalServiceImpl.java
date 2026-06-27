package com.wanderlens.api.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wanderlens.api.entity.MarketSignal;
import com.wanderlens.api.mapper.MarketSignalMapper;
import com.wanderlens.api.service.MarketSignalService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MarketSignalServiceImpl extends ServiceImpl<MarketSignalMapper, MarketSignal>
        implements MarketSignalService {

    @Override
    public void recordSignal(String sourceCountry, String sourceCity, String signalType, String metadata) {
        MarketSignal signal = new MarketSignal();
        signal.setSourceCountry(sourceCountry != null ? sourceCountry : "TW");
        signal.setSourceCity(sourceCity);
        signal.setSignalType(signalType);
        signal.setCountValue(1);
        signal.setMetadata(metadata);
        save(signal);
    }

    @Override
    public List<Map<String, Object>> getDashboardSummary(int days) {
        LocalDateTime since = LocalDateTime.now().minusDays(Math.max(1, days));
        List<MarketSignal> signals = list(new LambdaQueryWrapper<MarketSignal>()
                .ge(MarketSignal::getCreatedAt, since));

        Map<String, Map<String, Integer>> grouped = new HashMap<>();
        for (MarketSignal s : signals) {
            String key = s.getSourceCountry() + "|" + s.getSignalType();
            grouped.computeIfAbsent(key, k -> new HashMap<>())
                    .merge("count", s.getCountValue() != null ? s.getCountValue() : 1, Integer::sum);
        }

        List<Map<String, Object>> result = new ArrayList<>();
        grouped.forEach((key, counts) -> {
            String[] parts = key.split("\\|", 2);
            Map<String, Object> row = new HashMap<>();
            row.put("sourceCountry", parts[0]);
            row.put("signalType", parts.length > 1 ? parts[1] : "UNKNOWN");
            row.put("total", counts.getOrDefault("count", 0));
            result.add(row);
        });
        return result.stream()
                .sorted((a, b) -> Integer.compare((int) b.get("total"), (int) a.get("total")))
                .collect(Collectors.toList());
    }
}
