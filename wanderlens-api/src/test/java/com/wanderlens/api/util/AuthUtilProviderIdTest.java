package com.wanderlens.api.util;

import com.wanderlens.api.entity.Order;
import com.wanderlens.api.exception.ServiceException;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * 鎖住 user.id 與 provider.id 不一致的權限回歸：
 * 攝影師訂單存取必須以解析後的 provider.id 比對，而非原始 user.id。
 */
@ExtendWith(MockitoExtension.class)
class AuthUtilProviderIdTest {

    @Mock
    private ProviderIdResolver providerIdResolver;

    @Mock
    private HttpServletRequest request;

    @InjectMocks
    private AuthUtil authUtil;

    @Test
    void photographer_canAccess_whenResolvedProviderIdMatches() {
        when(request.getAttribute("userId")).thenReturn(100L);
        when(request.getAttribute("role")).thenReturn("PHOTOGRAPHER");
        when(providerIdResolver.resolve(100L)).thenReturn(55L);

        Order order = new Order();
        order.setPhotographerId(55L);
        order.setConsumerId(200L);

        assertDoesNotThrow(() -> authUtil.requireOrderAccess(request, order));
    }

    @Test
    void photographer_denied_whenPhotographerIdEqualsUserIdButNotProviderId() {
        // 舊 bug：以 user.id(100) 比對 photographerId 會誤通過；
        // 修復後以 provider.id(55) 比對，photographerId=100 應被拒絕。
        when(request.getAttribute("userId")).thenReturn(100L);
        when(request.getAttribute("role")).thenReturn("PHOTOGRAPHER");
        when(providerIdResolver.resolve(100L)).thenReturn(55L);

        Order order = new Order();
        order.setPhotographerId(100L);
        order.setConsumerId(200L);

        assertThrows(ServiceException.class, () -> authUtil.requireOrderAccess(request, order));
    }

    @Test
    void requireOrderPhotographer_usesResolvedProviderId() {
        when(providerIdResolver.resolve(request)).thenReturn(55L);

        Order matching = new Order();
        matching.setPhotographerId(55L);
        assertDoesNotThrow(() -> authUtil.requireOrderPhotographer(request, matching));

        Order mismatching = new Order();
        mismatching.setPhotographerId(77L);
        assertThrows(ServiceException.class, () -> authUtil.requireOrderPhotographer(request, mismatching));
    }
}
