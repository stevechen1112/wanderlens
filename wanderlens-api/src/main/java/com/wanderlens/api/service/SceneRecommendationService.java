package com.wanderlens.api.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.wanderlens.api.entity.SceneRecommendation;

import java.util.List;

public interface SceneRecommendationService extends IService<SceneRecommendation> {
    List<SceneRecommendation> getByOrderContext(Long serviceTypeId, String sceneTag);
    List<SceneRecommendation> listActive();
    SceneRecommendation saveRecommendation(SceneRecommendation rec);
}
