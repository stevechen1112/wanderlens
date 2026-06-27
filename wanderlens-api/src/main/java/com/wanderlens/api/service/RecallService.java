package com.wanderlens.api.service;

import com.wanderlens.api.entity.dto.RecallItemDto;

import java.util.List;

public interface RecallService {

    List<RecallItemDto> getFeed(Long consumerId);
}
