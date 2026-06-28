package com.wanderlens.api.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.wanderlens.api.common.ResultCode;
import com.wanderlens.api.entity.Order;
import com.wanderlens.api.entity.Provider;
import com.wanderlens.api.entity.ProviderRating;
import com.wanderlens.api.entity.User;
import com.wanderlens.api.entity.enums.OrderStatus;
import com.wanderlens.api.exception.ServiceException;
import com.wanderlens.api.mapper.ProviderMapper;
import com.wanderlens.api.entity.dto.RatingSummaryDto;
import com.wanderlens.api.mapper.ProviderRatingMapper;
import com.wanderlens.api.service.OrderService;
import com.wanderlens.api.service.ProviderRatingService;
import com.wanderlens.api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProviderRatingServiceImpl implements ProviderRatingService {

    private final ProviderRatingMapper providerRatingMapper;
    private final ProviderMapper providerMapper;
    private final OrderService orderService;
    private final UserService userService;

    @Override
    @Transactional
    public ProviderRating submitRating(Long consumerId, Long orderId, Long providerId, int stars, String comments) {
        if (stars < 1 || stars > 5) {
            throw new ServiceException(ResultCode.BAD_REQUEST, "評分需在 1-5 之間");
        }

        Order order = orderService.getById(orderId);
        if (order == null) {
            throw new ServiceException(ResultCode.ORDER_NOT_FOUND);
        }
        if (!consumerId.equals(order.getConsumerId())) {
            throw new ServiceException(ResultCode.FORBIDDEN, "僅訂單消費者可評價");
        }
        if (!OrderStatus.CLOSED.getCode().equals(order.getStatus())
                && !OrderStatus.DELIVERED.getCode().equals(order.getStatus())) {
            throw new ServiceException(ResultCode.ORDER_STATUS_INVALID, "訂單尚未交付完成，無法評價");
        }

        ProviderRating existing = providerRatingMapper.selectOne(new LambdaQueryWrapper<ProviderRating>()
                .eq(ProviderRating::getOrderId, orderId)
                .eq(ProviderRating::getProviderId, providerId));
        if (existing != null) {
            throw new ServiceException(ResultCode.BAD_REQUEST, "此訂單已評價過");
        }

        User user = userService.getById(consumerId);
        ProviderRating rating = new ProviderRating();
        rating.setProviderId(providerId);
        rating.setOrderId(orderId);
        rating.setStars(stars);
        rating.setComments(comments);
        rating.setAuthor(user != null ? user.getUsername() : "匿名");
        providerRatingMapper.insert(rating);

        recalculateProviderRating(providerId);
        applyGovernance(providerId, stars);
        return rating;
    }

    private void applyGovernance(Long providerId, int stars) {
        if (stars >= 2) return;
        Provider provider = providerMapper.selectById(providerId);
        if (provider == null) return;
        provider.setViolationLevel("WARNING");
        providerMapper.updateById(provider);
    }

    @Override
    public RatingSummaryDto getSummary(Long providerId) {
        List<ProviderRating> ratings = providerRatingMapper.selectList(
                new LambdaQueryWrapper<ProviderRating>()
                        .eq(ProviderRating::getProviderId, providerId)
                        .orderByDesc(ProviderRating::getCreatedAt));
        Map<String, Integer> distribution = new HashMap<>();
        for (int i = 1; i <= 5; i++) distribution.put(String.valueOf(i), 0);
        for (ProviderRating r : ratings) {
            distribution.merge(String.valueOf(r.getStars()), 1, Integer::sum);
        }
        double avg = ratings.stream().mapToInt(ProviderRating::getStars).average().orElse(0);
        double roundedAvg = BigDecimal.valueOf(avg).setScale(1, RoundingMode.HALF_UP).doubleValue();
        List<RatingSummaryDto.RatingItemDto> recent = ratings.stream().limit(20).map(r ->
                RatingSummaryDto.RatingItemDto.builder()
                        .id(r.getId())
                        .stars(r.getStars())
                        .comments(r.getComments())
                        .consumerName(r.getAuthor())
                        .createdAt(r.getCreatedAt() != null ? r.getCreatedAt().toString() : null)
                        .build()).collect(Collectors.toList());
        return RatingSummaryDto.builder()
                .averageRating(roundedAvg)
                .totalCount(ratings.size())
                .distribution(distribution)
                .recentRatings(recent)
                .build();
    }

    @Override
    public List<ProviderRating> getByProviderId(Long providerId, int page, int size) {
        return providerRatingMapper.selectPage(new Page<>(page, size),
                new LambdaQueryWrapper<ProviderRating>()
                        .eq(ProviderRating::getProviderId, providerId)
                        .orderByDesc(ProviderRating::getCreatedAt)).getRecords();
    }

    @Override
    public List<ProviderRating> getRecentRatings(int page, int size) {
        return providerRatingMapper.selectPage(new Page<>(page, size),
                new LambdaQueryWrapper<ProviderRating>()
                        .orderByDesc(ProviderRating::getCreatedAt)).getRecords();
    }

    @Override
    @Transactional
    public void recalculateProviderRating(Long providerId) {
        List<ProviderRating> ratings = providerRatingMapper.selectList(
                new LambdaQueryWrapper<ProviderRating>().eq(ProviderRating::getProviderId, providerId));
        Provider provider = providerMapper.selectById(providerId);
        if (provider == null) {
            return;
        }
        BigDecimal rating = ratings.isEmpty()
                ? BigDecimal.ZERO.setScale(1, RoundingMode.HALF_UP)
                : BigDecimal.valueOf(ratings.stream().mapToInt(ProviderRating::getStars).average().orElse(0))
                        .setScale(1, RoundingMode.HALF_UP);
        provider.setRating(rating);
        providerMapper.updateById(provider);
    }
}
