package com.wanderlens.api.integration;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * 全鏈路整合測試：透過真實 MySQL/Redis（dev profile）驗證
 * 註冊 → 取得當前使用者 → 更新個人資料 三個新端點與 JWT 過濾鏈。
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class AuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private static String token;
    private static String empno;

    @Test
    @Order(1)
    void register_thenMe_thenUpdate_fullStack() throws Exception {
        empno = "e2e_" + System.currentTimeMillis();
        String registerBody = objectMapper.writeValueAsString(java.util.Map.of(
                "empno", empno,
                "username", "E2E測試用戶",
                "phone", "0900000000",
                "email", empno + "@example.com",
                "password", "pw123456"
        ));

        MvcResult res = mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("200"))
                .andExpect(jsonPath("$.data.token").isNotEmpty())
                .andExpect(jsonPath("$.data.role").value("CONSUMER"))
                .andReturn();

        JsonNode body = objectMapper.readTree(res.getResponse().getContentAsString());
        token = body.path("data").path("token").asText();
        assertNotNull(token);
        assertFalse(token.isBlank());
    }

    @Test
    @Order(2)
    void me_returnsCurrentUser() throws Exception {
        assertNotNull(token, "register 測試需先成功");
        mockMvc.perform(get("/auth/me").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("200"))
                .andExpect(jsonPath("$.data.empno").value(empno))
                .andExpect(jsonPath("$.data.role").value("CONSUMER"));
    }

    @Test
    @Order(3)
    void updateMe_persistsNewName() throws Exception {
        assertNotNull(token, "register 測試需先成功");
        String updateBody = objectMapper.writeValueAsString(java.util.Map.of(
                "username", "E2E改名後",
                "phone", "0911222333"
        ));

        mockMvc.perform(put("/auth/me")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("200"))
                .andExpect(jsonPath("$.data.username").value("E2E改名後"));

        // 再次 GET 確認已持久化到資料庫
        mockMvc.perform(get("/auth/me").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.username").value("E2E改名後"));
    }

    @Test
    @Order(4)
    void register_duplicateEmpno_returnsBusinessError() throws Exception {
        assertNotNull(empno, "register 測試需先成功");
        String dupBody = objectMapper.writeValueAsString(java.util.Map.of(
                "empno", empno,
                "username", "重複帳號",
                "phone", "0900000000",
                "password", "pw123456"
        ));
        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(dupBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("400"));
    }
}
