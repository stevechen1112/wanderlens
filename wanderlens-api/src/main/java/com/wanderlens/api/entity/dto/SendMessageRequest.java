package com.wanderlens.api.entity.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 發送訊息請求 DTO
 */
@Data
public class SendMessageRequest {

    @NotBlank(message = "訊息內容不可為空")
    private String content;
}