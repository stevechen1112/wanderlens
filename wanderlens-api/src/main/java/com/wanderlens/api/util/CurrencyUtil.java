package com.wanderlens.api.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Base64;

/**
 * 多幣別換算（Phase 5 展示用匯率，正式環境可改接外部 API）
 */
@Component
@Slf4j
public class CurrencyUtil {

    private static final java.util.Map<String, Double> TWD_TO = java.util.Map.of(
            "TWD", 1.0,
            "USD", 0.031,
            "JPY", 4.72,
            "KRW", 41.5
    );

    public int convertFromTwd(int twdAmount, String currency) {
        if (currency == null || currency.isBlank() || "TWD".equalsIgnoreCase(currency)) {
            return twdAmount;
        }
        Double rate = TWD_TO.get(currency.toUpperCase());
        if (rate == null) {
            return twdAmount;
        }
        return (int) Math.round(twdAmount * rate);
    }

    public String formatPrice(int twdAmount, String currency) {
        String code = currency != null ? currency.toUpperCase() : "TWD";
        int amount = convertFromTwd(twdAmount, code);
        return switch (code) {
            case "USD" -> "$" + amount;
            case "JPY" -> "¥" + amount;
            case "KRW" -> "₩" + amount;
            default -> "NT$" + amount;
        };
    }

    public java.util.Map<String, Double> getRates() {
        return TWD_TO;
    }
}
