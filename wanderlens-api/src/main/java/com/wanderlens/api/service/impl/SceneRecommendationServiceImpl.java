package com.wanderlens.api.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wanderlens.api.entity.SceneRecommendation;
import com.wanderlens.api.mapper.SceneRecommendationMapper;
import com.wanderlens.api.service.SceneRecommendationService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SceneRecommendationServiceImpl extends ServiceImpl<SceneRecommendationMapper, SceneRecommendation>
        implements SceneRecommendationService {

    @Override
    public List<SceneRecommendation> getByOrderContext(Long serviceTypeId, String sceneTag) {
        LambdaQueryWrapper<SceneRecommendation> wrapper = new LambdaQueryWrapper<SceneRecommendation>()
                .eq(SceneRecommendation::getActive, "Y")
                .orderByDesc(SceneRecommendation::getPriority);
        if (serviceTypeId != null) {
            wrapper.and(w -> w.eq(SceneRecommendation::getServiceTypeId, serviceTypeId)
                    .or().isNull(SceneRecommendation::getServiceTypeId));
        }
        if (sceneTag != null && !sceneTag.isBlank()) {
            wrapper.and(w -> w.eq(SceneRecommendation::getSceneTag, sceneTag)
                    .or().isNull(SceneRecommendation::getSceneTag));
        }
        return list(wrapper.last("LIMIT 6"));
    }

    @Override
    public List<SceneRecommendation> listActive() {
        return list(new LambdaQueryWrapper<SceneRecommendation>()
                .eq(SceneRecommendation::getActive, "Y")
                .orderByDesc(SceneRecommendation::getPriority));
    }

    @Override
    public SceneRecommendation saveRecommendation(SceneRecommendation rec) {
        if (rec.getActive() == null) rec.setActive("Y");
        saveOrUpdate(rec);
        return rec;
    }
}
