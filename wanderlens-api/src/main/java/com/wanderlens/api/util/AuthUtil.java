package com.wanderlens.api.util;

import com.wanderlens.api.common.ResultCode;
import com.wanderlens.api.entity.ConversationParticipant;
import com.wanderlens.api.entity.Order;
import com.wanderlens.api.exception.ServiceException;
import com.wanderlens.api.mapper.ConversationParticipantMapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * 授權工具類
 *
 * 統一處理所有 Controller/Service 的權限驗證邏輯，
 * 確保使用者只能存取自己有權限的資源。
 *
 * 注意：攝影師/造型師帳號的 user.id 與 provider.id 可能不同
 * （透過 user.provider_id 關聯），訂單與供給方資源一律以
 * {@link ProviderIdResolver} 解析出的 provider.id 比對。
 */
@Component
@RequiredArgsConstructor
public class AuthUtil {

    private final ProviderIdResolver providerIdResolver;
    private final ConversationParticipantMapper conversationParticipantMapper;

    /**
     * 從 request 取得 userId
     */
    public Long getUserId(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new ServiceException(ResultCode.UNAUTHORIZED);
        }
        return userId;
    }

    /**
     * 從 request 取得角色
     */
    public String getRole(HttpServletRequest request) {
        String role = (String) request.getAttribute("role");
        if (role == null) {
            throw new ServiceException(ResultCode.UNAUTHORIZED);
        }
        return role;
    }

    /**
     * 驗證使用者為指定角色
     */
    public void requireRole(HttpServletRequest request, String... roles) {
        String role = getRole(request);
        for (String r : roles) {
            if (r.equals(role)) return;
        }
        throw new ServiceException(ResultCode.FORBIDDEN, "無權限執行此操作");
    }

    /**
     * 驗證使用者為管理員
     */
    public void requireAdmin(HttpServletRequest request) {
        requireRole(request, "ADMIN", "SUPPORT", "FINANCE");
    }

    /**
     * 驗證使用者為訂單相關方（消費者、攝影師、造型師）或管理員
     */
    public void requireOrderAccess(HttpServletRequest request, Order order) {
        Long userId = getUserId(request);
        String role = getRole(request);

        // 管理員可存取所有訂單
        if ("ADMIN".equals(role) || "SUPPORT".equals(role) || "FINANCE".equals(role)) {
            return;
        }

        // 消費者只能看自己的訂單
        if ("CONSUMER".equals(role) && order.getConsumerId().equals(userId)) {
            return;
        }

        // 攝影師只能看自己接的訂單（以 provider.id 比對）
        if ("PHOTOGRAPHER".equals(role)) {
            Long providerId = providerIdResolver.resolve(userId);
            if (order.getPhotographerId() != null && order.getPhotographerId().equals(providerId)) {
                return;
            }
        }

        // 造型師只能看自己接的訂單（以 provider.id 比對）
        if ("STYLIST".equals(role) && order.getStylistId() != null) {
            Long providerId = providerIdResolver.resolve(userId);
            if (order.getStylistId().equals(providerId)) {
                return;
            }
        }

        throw new ServiceException(ResultCode.FORBIDDEN, "無權限存取此訂單");
    }

    /**
     * 驗證使用者為訂單消費者
     */
    public void requireOrderConsumer(HttpServletRequest request, Order order) {
        Long userId = getUserId(request);
        if (!order.getConsumerId().equals(userId)) {
            throw new ServiceException(ResultCode.FORBIDDEN, "非此訂單的消費者");
        }
    }

    /**
     * 驗證使用者為訂單攝影師
     */
    public void requireOrderPhotographer(HttpServletRequest request, Order order) {
        Long providerId = providerIdResolver.resolve(request);
        if (order.getPhotographerId() == null || !order.getPhotographerId().equals(providerId)) {
            throw new ServiceException(ResultCode.FORBIDDEN, "非此訂單的攝影師");
        }
    }

    /**
     * 驗證使用者為供給方本人或管理員
     */
    public void requireProviderOrAdmin(HttpServletRequest request, Long providerId) {
        String role = getRole(request);
        if ("ADMIN".equals(role) || "SUPPORT".equals(role) || "EDITOR".equals(role)) {
            return;
        }
        Long resolvedProviderId = providerIdResolver.resolve(request);
        if (providerId != null && providerId.equals(resolvedProviderId)) {
            return;
        }
        throw new ServiceException(ResultCode.FORBIDDEN, "無權限存取此供給方資料");
    }

    /**
     * 驗證使用者為溝通室參與者或管理員（新版：查 participant 表）
     */
    public void requireConversationAccess(Long userId, String role, Long conversationId) {
        if ("ADMIN".equals(role) || "SUPPORT".equals(role)) {
            return;
        }
        Long count = conversationParticipantMapper.selectCount(
                new LambdaQueryWrapper<ConversationParticipant>()
                        .eq(ConversationParticipant::getConversationId, conversationId)
                        .eq(ConversationParticipant::getUserId, userId)
                        .eq(ConversationParticipant::getIsActive, true)
        );
        if (count == null || count == 0) {
            throw new ServiceException(ResultCode.FORBIDDEN, "非此溝通室的參與者或已被移除");
        }
    }

    /**
     * 驗證使用者為溝通室參與者或管理員（舊版：向後相容，過渡期保留）
     * @deprecated 改用 {@link #requireConversationAccess(Long, String, Long)}
     */
    @Deprecated
    public void requireConversationAccess(Long userId, String role, Long participantAId, Long participantBId) {
        if ("ADMIN".equals(role) || "SUPPORT".equals(role)) {
            return;
        }
        if (!userId.equals(participantAId) && !userId.equals(participantBId)) {
            throw new ServiceException(ResultCode.FORBIDDEN, "非此溝通室的參與者");
        }
    }
}