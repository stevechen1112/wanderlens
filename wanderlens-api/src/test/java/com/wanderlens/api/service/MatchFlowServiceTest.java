package com.wanderlens.api.service;

import com.wanderlens.api.common.ResultCode;
import com.wanderlens.api.entity.dto.CreateInstantMatchRequest;
import com.wanderlens.api.exception.ServiceException;
import com.wanderlens.api.service.impl.MatchRequestServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * S2-014 即時媒合核心流程單元測試（競爭協議前驗證）
 */
@ExtendWith(MockitoExtension.class)
class MatchFlowServiceTest {

    @Mock
    private MatchFeatureService matchFeatureService;

    @InjectMocks
    private MatchRequestServiceImpl matchRequestService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(matchRequestService, "defaultUnitPrice", 800);
    }

    @Test
    void createRequest_rejectsWhenFeatureDisabled() {
        doThrow(new ServiceException(ResultCode.BAD_REQUEST, "即時媒合功能尚未開放"))
                .when(matchFeatureService).assertInstantMatchEnabled();

        CreateInstantMatchRequest req = new CreateInstantMatchRequest();
        req.setServiceTypeId(1L);
        req.setShootingLocation("台北市");
        req.setDurationHours(BigDecimal.ONE);

        ServiceException ex = assertThrows(ServiceException.class,
                () -> matchRequestService.createRequest(1L, req));
        assertTrue(ex.getMessage().contains("尚未開放"));
    }

    @Test
    void createRequest_rejectsInvalidDuration() {
        doNothing().when(matchFeatureService).assertInstantMatchEnabled();

        CreateInstantMatchRequest req = new CreateInstantMatchRequest();
        req.setServiceTypeId(1L);
        req.setShootingLocation("台北市");
        req.setDurationHours(BigDecimal.ZERO);

        assertThrows(ServiceException.class, () -> matchRequestService.createRequest(1L, req));
    }
}
