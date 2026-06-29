# WanderLens 多人訂單對話系統 — 功能規格與技術開發計畫

**版本：v1.1**
**日期：2026-06-29**
**狀態：規劃中**

> **v1.1 變更**：補上 6 項缺口（呼叫端影響清單、getMyConversationSummaries pseudocode、markAsRead 邏輯、ConversationService interface 方法簽名、精確檔案路徑、ConversationSummaryDto 變更）；新增功能設計建議（§10）。

---

# 目錄

1. [功能概述](#1-功能概述)
2. [現有系統分析](#2-現有系統分析)
3. [差距分析](#3-差距分析)
4. [技術設計](#4-技術設計)
5. [API 規格](#5-api-規格)
6. [業務規則與邊界案例](#6-業務規則與邊界案例)
7. [前端規格](#7-前端規格)
8. [開發階段與 Task Plan](#8-開發階段與-task-plan)
9. [風險與注意事項](#9-風險與注意事項)

---

# 1. 功能概述

## 1.1 核心需求

> 消費者跟攝影師的溝通管道是透過站內訊息方式，而且是以訂單為單位。成立後訂單內的成員（及系統方）才能互相對話。例如消費者與攝影師，或日後的造型師及站方，可以多人對話。但是該訂單結案後就不能再使用，但一切對話記錄都會存在系統方供站方檢視。只是除了站方外，該對話串他們就看不到，至少不能再發話。

## 1.2 完整功能清單

| # | 功能 | 說明 |
| :---: | --- | --- |
| F1 | 以訂單為單位建立對話 | 每個訂單有唯一的多人對話室，非一對一 |
| F2 | 訂單成立後自動開啟 | 付款完成後系統自動建立對話室，加入消費者與攝影師 |
| F3 | 多人對話 | 消費者、攝影師、造型師、站方可同時在同一對話室溝通 |
| F4 | 後來加入者可看歷史 | 造型師或站方後續加入時，可看到加入前的全部歷史訊息 |
| F5 | 結案後唯讀 | 訂單狀態轉為 `Closed` 後，對話室自動轉為唯讀，不可再發話 |
| F6 | 結案後歷史仍可見 | 消費者與攝影師在結案後仍可在列表中看到對話室，點入可瀏覽歷史訊息 |
| F7 | 站方永久可見 | ADMIN / SUPPORT 角色可查看任何對話室的完整歷史，不受結案影響 |
| F8 | 站方可管理參與者 | 站方可新增參與者（如造型師）或移除參與者（如違規攝影師） |
| F9 | 對話記錄永久留存 | 所有訊息不刪除，站方調閱時記錄 access log |
| F10 | 系統訊息 | 成員加入/移除、訂單狀態變更時自動發送系統訊息 |

---

# 2. 現有系統分析

## 2.1 已具備的能力

| 能力 | 實作位置 | 說明 |
| --- | --- | --- |
| 訂單對話建立 | `ConversationServiceImpl.openOrderConversation()` | 訂單成立後建立 ORDER 類型對話 |
| 三種對話類型 | `ConversationType` enum | `ORDER` / `CUSTOMER_SERVICE` / `ADMIN` |
| 三種對話狀態 | `ConversationStatus` enum | `OPEN` / `READONLY` / `CLOSED` |
| 結案自動唯讀 | `OrderServiceImpl.transition()` L197 | `toStatus == CLOSED` → `setReadonlyForOrder()` |
| 爭議自動重開 | `OrderServiceImpl.transition()` L199 | `toStatus == DISPUTED` → `reopenForOrder()` |
| 發話前狀態檢查 | `requireWritableConversation()` | `READONLY` 狀態拋 `CONVERSATION_READONLY` 錯誤 |
| 站方萬能通行 | `AuthUtil.requireConversationAccess()` L141 | `ADMIN/SUPPORT` 跳過 participant 檢查 |
| 站方調閱記錄 | `ConversationServiceImpl.accessMessages()` | 寫入 `ConversationAccessLog` 表 |
| SSE 即時推送 | `ConversationEventHub` | 新訊息即時推送給訂閱者 |
| 敏感資訊遮罩 | `maskSensitiveInfo()` | 電話/Email 自動部分隱碼 |
| 系統訊息 | `sendSystemMessage()` | senderId=0，自動發送 |

## 2.2 現有資料模型

### `conversation` 表

```java
public class Conversation {
    private Long id;
    private String conversationType;   // ADMIN / CUSTOMER_SERVICE / ORDER
    private Long orderId;              // 關聯訂單 ID
    private Long participantAId;       // 參與者 A
    private Long participantBId;       // 參與者 B
    private String status;             // OPEN / READONLY / CLOSED
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
}
```

### `message` 表

```java
public class Message {
    private Long id;
    private Long conversationId;
    private Long senderId;
    private String messageType;        // TEXT / IMAGE / SYSTEM / TEMPLATE
    private String content;
    private String imageUrl;
    private Boolean isRead;
    private LocalDateTime readAt;
    private LocalDateTime createdAt;
}
```

### `conversation_access_log` 表

```java
public class ConversationAccessLog {
    private Long id;
    private Long conversationId;
    private Long accessorId;           // 調閱者 ID
    private String reason;             // 調閱原因
    private LocalDateTime accessedAt;
}
```

## 2.3 現有存取控制

```java
// AuthUtil.requireConversationAccess()
public void requireConversationAccess(Long userId, String role, 
                                       Long participantAId, Long participantBId) {
    if ("ADMIN".equals(role) || "SUPPORT".equals(role)) {
        return;  // 站方直接通過
    }
    if (!userId.equals(participantAId) && !userId.equals(participantBId)) {
        throw new ServiceException(ResultCode.FORBIDDEN, "非此溝通室的參與者");
    }
}
```

---

# 3. 差距分析

| 需求 | 現有狀態 | 差距 | 優先級 |
| --- | :---: | --- | :---: |
| F1 訂單為單位 | ✅ 已有 | — | — |
| F2 自動開啟 | ✅ 已有 | — | — |
| F3 多人對話 | ❌ 只支援 1 對 1 | 🔴 需改資料模型 | P0 |
| F4 後來者可看歷史 | ✅ 自然行為 | 無（訊息查詢無加入時間過濾） | — |
| F5 結案唯讀 | ✅ 已實作 | 前端需補 UI | P1 |
| F6 結案後歷史可見 | 🟡 READONLY 列表仍可見 | 前端需補唯讀 UI | P1 |
| F7 站方永久可見 | ✅ 已實作 | — | — |
| F8 站方管理參與者 | ❌ 無 | 🔴 需新增 API | P0 |
| F9 記錄永久留存 | ✅ 已實作 | — | — |
| F10 系統訊息 | ✅ 已實作 | — | — |

---

# 4. 技術設計

## 4.1 核心變更：從 1-to-1 改為 1-to-many

### 現有模型（1-to-1）

```
conversation
├── participantAId (消費者)
└── participantBId (攝影師)
```

### 新模型（1-to-many）

```
conversation
├── id
├── conversation_type
├── order_id
├── status
└── ...

conversation_participant
├── id
├── conversation_id  → conversation.id
├── user_id
├── user_type         (CONSUMER / PHOTOGRAPHER / STYLIST)
├── is_active         (軟刪除旗標)
├── joined_at
├── removed_at
└── removed_by
```

## 4.2 資料庫 Migration

### 新增 `conversation_participant` 表

```sql
CREATE TABLE conversation_participant (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    conversation_id BIGINT NOT NULL,
    user_id         BIGINT NOT NULL,
    user_type       VARCHAR(20) NOT NULL COMMENT 'CONSUMER / PHOTOGRAPHER / STYLIST',
    is_active       BOOLEAN NOT NULL DEFAULT TRUE COMMENT '軟刪除旗標',
    joined_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    removed_at      DATETIME NULL COMMENT '被移除時間',
    removed_by      BIGINT NULL COMMENT '移除者 ID（站方）',
    UNIQUE KEY uk_conv_user (conversation_id, user_id),
    INDEX idx_user_id (user_id),
    INDEX idx_conversation_active (conversation_id, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 遷移現有資料

```sql
-- 將現有 conversation 的 participantAId / participantBId 遷移到新表
INSERT INTO conversation_participant (conversation_id, user_id, user_type, is_active, joined_at)
SELECT id, participant_a_id, 
    CASE 
        WHEN conversation_type = 'ORDER' THEN 
            CASE WHEN participant_a_id = (SELECT consumer_id FROM `order` WHERE id = order_id) 
                 THEN 'CONSUMER' ELSE 'PHOTOGRAPHER' END
        ELSE 'CONSUMER'
    END,
    TRUE, created_at
FROM conversation
WHERE participant_a_id IS NOT NULL;

INSERT INTO conversation_participant (conversation_id, user_id, user_type, is_active, joined_at)
SELECT id, participant_b_id, 'PHOTOGRAPHER', TRUE, created_at
FROM conversation
WHERE participant_b_id IS NOT NULL AND conversation_type = 'ORDER';
```

### `conversation` 表變更

```sql
-- 保留 participantAId / participantBId 作為 legacy（不刪，向後相容過渡期）
-- 過渡期後可 drop
-- ALTER TABLE conversation DROP COLUMN participant_a_id;
-- ALTER TABLE conversation DROP COLUMN participant_b_id;
```

## 4.3 Entity 層變更

### 新增 `ConversationParticipant.java`

```java
@Data
@TableName("conversation_participant")
public class ConversationParticipant {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Long conversationId;
    private Long userId;
    private String userType;      // CONSUMER / PHOTOGRAPHER / STYLIST
    private Boolean isActive;     // true = 在對話中, false = 已被移除
    private LocalDateTime joinedAt;
    private LocalDateTime removedAt;
    private Long removedBy;
}
```

### `Conversation.java` 新增關聯

```java
// 非 DB 欄位，僅用於查詢時填充
@TableField(exist = false)
private List<ConversationParticipant> participants;
```

## 4.4 存取控制改寫

### `AuthUtil.requireConversationAccess()` 改寫

**簽名變更**：`requireConversationAccess(userId, role, participantAId, participantBId)` → `requireConversationAccess(userId, role, conversationId)`

**所有呼叫點**（共 6 處，全在 `ConversationController.java`）：

| 行號 | 方法 | 原呼叫 | 新呼叫 |
| ---: | --- | --- | --- |
| L91 | `getConversation()` | `requireConversationAccess(userId, role, conv.getParticipantAId(), conv.getParticipantBId())` | `requireConversationAccess(userId, role, conv.getId())` |
| L105 | `getMessages()` | 同上 | 同上 |
| L119 | `streamMessages()` | 同上 | 同上 |
| L154 | `uploadImage()` | `requireConversationAccess(senderId, role, conv.getParticipantAId(), conv.getParticipantBId())` | `requireConversationAccess(senderId, role, conv.getId())` |
| L168 | `markAsRead()` | 同上 | 同上 |
| L186 | `getOrderConversation()` | 同上 | 同上 |

> **注意**：`AuthUtil` 不應直接依賴 `ConversationParticipantMapper`（層級不對）。建議由 `ConversationService` 提供查詢方法，`AuthUtil` 呼叫 `conversationService.isActiveParticipant(conversationId, userId)`。

```java
public void requireConversationAccess(Long userId, String role, Long conversationId) {
    // 站方萬能通行
    if ("ADMIN".equals(role) || "SUPPORT".equals(role)) {
        return;
    }
    
    if (!conversationService.isActiveParticipant(conversationId, userId)) {
        throw new ServiceException(ResultCode.FORBIDDEN, "非此溝通室的參與者或已被移除");
    }
}
```

### `ConversationServiceImpl.verifySenderAccess()` 改寫

```java
private void verifySenderAccess(Conversation conversation, Long senderId, String role) {
    // 站方可在 CUSTOMER_SERVICE / ADMIN 類型對話中發話
    if (isStaffRole(role)
            && (ConversationType.CUSTOMER_SERVICE.getCode().equals(conversation.getConversationType())
            || ConversationType.ADMIN.getCode().equals(conversation.getConversationType()))) {
        return;
    }
    
    // 查 participant 表，確認 senderId 是活躍參與者
    ConversationParticipant participant = participantMapper.selectOne(
        new LambdaQueryWrapper<ConversationParticipant>()
            .eq(ConversationParticipant::getConversationId, conversation.getId())
            .eq(ConversationParticipant::getUserId, senderId)
            .eq(ConversationParticipant::getIsActive, true)
    );
    
    if (participant == null) {
        throw new ServiceException(ResultCode.FORBIDDEN, "非此溝通室的參與者或已被移除");
    }
}
```

## 4.5 Service 層變更

### `ConversationService` interface 新增方法簽名

```java
public interface ConversationService extends IService<Conversation> {
    // ── 現有方法（簽名變更） ──
    // openOrderConversation 簽名變更：
    Conversation openOrderConversation(Long orderId, List<Long> participantIds, List<String> userTypes);
    
    // ── 新增方法 ──
    boolean isActiveParticipant(Long conversationId, Long userId);
    
    ConversationParticipant addParticipant(Long conversationId, Long userId, String userType);
    
    void removeParticipant(Long conversationId, Long userId, Long removedBy);
    
    List<ConversationParticipant> getParticipants(Long conversationId, boolean activeOnly);
    
    // ── 現有方法（簽名不變，impl 改寫） ──
    // getMyConversationSummaries, getSupportConversationSummaries, getOrderConversation,
    // getOrderConversations, openCustomerServiceConversation, openAdminConversation,
    // setReadonly, setReadonlyForOrder, reopen, reopenForOrder, getMessages,
    // sendTextMessage, sendImageMessage, sendSystemMessage, markAsRead,
    // accessMessages, getAccessLogs
}
```

### `openOrderConversation` 改寫

```java
@Override
@Transactional
public Conversation openOrderConversation(Long orderId, List<Long> participantIds, 
                                           List<String> userTypes) {
    // 查是否已有該訂單的對話室（一個訂單只有一個多人對話）
    Conversation existing = getOne(new LambdaQueryWrapper<Conversation>()
            .eq(Conversation::getOrderId, orderId)
            .eq(Conversation::getConversationType, ConversationType.ORDER.getCode()));
    
    if (existing != null) {
        // 已存在，檢查是否有新參與者需要加入
        for (int i = 0; i < participantIds.size(); i++) {
            addParticipantIfNotExists(existing.getId(), participantIds.get(i), userTypes.get(i));
        }
        return existing;
    }
    
    // 新建對話室
    Conversation conversation = new Conversation();
    conversation.setConversationType(ConversationType.ORDER.getCode());
    conversation.setOrderId(orderId);
    conversation.setStatus(ConversationStatus.OPEN.getCode());
    save(conversation);
    
    // 寫入所有參與者
    for (int i = 0; i < participantIds.size(); i++) {
        addParticipant(conversation.getId(), participantIds.get(i), userTypes.get(i));
    }
    
    sendSystemMessage(conversation.getId(),
            "訂單已成立，供給方請於 24 小時內主動聯繫客戶確認拍攝細節。");
    
    return conversation;
}
```

### 新增 `addParticipant`

```java
@Transactional
public ConversationParticipant addParticipant(Long conversationId, Long userId, String userType) {
    // 檢查是否已存在（可能之前被移除，現在重新加入）
    ConversationParticipant existing = participantMapper.selectOne(
        new LambdaQueryWrapper<ConversationParticipant>()
            .eq(ConversationParticipant::getConversationId, conversationId)
            .eq(ConversationParticipant::getUserId, userId)
    );
    
    if (existing != null) {
        if (Boolean.TRUE.equals(existing.getIsActive())) {
            return existing; // 已在對話中
        }
        // 重新啟用
        existing.setIsActive(true);
        existing.setRemovedAt(null);
        existing.setRemovedBy(null);
        participantMapper.updateById(existing);
        
        User user = userMapper.selectById(userId);
        sendSystemMessage(conversationId, 
            String.format("%s %s 已重新加入對話", userType, user != null ? user.getUsername() : ""));
        return existing;
    }
    
    // 全新加入
    ConversationParticipant participant = new ConversationParticipant();
    participant.setConversationId(conversationId);
    participant.setUserId(userId);
    participant.setUserType(userType);
    participant.setIsActive(true);
    participant.setJoinedAt(LocalDateTime.now());
    participantMapper.insert(participant);
    
    User user = userMapper.selectById(userId);
    sendSystemMessage(conversationId, 
        String.format("%s %s 已加入對話", userType, user != null ? user.getUsername() : ""));
    
    return participant;
}
```

### 新增 `removeParticipant`

```java
@Transactional
public void removeParticipant(Long conversationId, Long userId, Long removedBy) {
    ConversationParticipant participant = participantMapper.selectOne(
        new LambdaQueryWrapper<ConversationParticipant>()
            .eq(ConversationParticipant::getConversationId, conversationId)
            .eq(ConversationParticipant::getUserId, userId)
            .eq(ConversationParticipant::getIsActive, true)
    );
    
    if (participant == null) {
        throw new ServiceException(ResultCode.NOT_FOUND, "該使用者不在對話中");
    }
    
    // 不能移除消費者
    if ("CONSUMER".equals(participant.getUserType())) {
        throw new ServiceException(ResultCode.BAD_REQUEST, "不能移除訂單的消費者");
    }
    
    // 不能移除自己
    if (userId.equals(removedBy)) {
        throw new ServiceException(ResultCode.BAD_REQUEST, "不能移除自己");
    }
    
    // 軟刪除
    participant.setIsActive(false);
    participant.setRemovedAt(LocalDateTime.now());
    participant.setRemovedBy(removedBy);
    participantMapper.updateById(participant);
    
    User user = userMapper.selectById(userId);
    sendSystemMessage(conversationId, 
        String.format("%s %s 已被站方移出對話", participant.getUserType(), 
            user != null ? user.getUsername() : ""));
}
```

### 新增 `getParticipants`

```java
public List<ConversationParticipant> getParticipants(Long conversationId, boolean activeOnly) {
    LambdaQueryWrapper<ConversationParticipant> wrapper = new LambdaQueryWrapper<ConversationParticipant>()
            .eq(ConversationParticipant::getConversationId, conversationId);
    
    if (activeOnly) {
        wrapper.eq(ConversationParticipant::getIsActive, true);
    }
    
    return participantMapper.selectList(wrapper);
}
```

### 新增 `isActiveParticipant`

```java
@Override
public boolean isActiveParticipant(Long conversationId, Long userId) {
    Long count = participantMapper.selectCount(
        new LambdaQueryWrapper<ConversationParticipant>()
            .eq(ConversationParticipant::getConversationId, conversationId)
            .eq(ConversationParticipant::getUserId, userId)
            .eq(ConversationParticipant::getIsActive, true)
    );
    return count != null && count > 0;
}
```

### 改寫 `getMyConversationSummaries`

```java
@Override
public List<ConversationSummaryDto> getMyConversationSummaries(Long userId, String role) {
    List<Conversation> conversations;
    
    if (isStaffRole(role)) {
        // 站方：查客服 + 管理通道（不查 ORDER，站方透過後台調閱）
        conversations = list(new LambdaQueryWrapper<Conversation>()
                .in(Conversation::getConversationType,
                        ConversationType.CUSTOMER_SERVICE.getCode(),
                        ConversationType.ADMIN.getCode())
                .ne(Conversation::getStatus, ConversationStatus.CLOSED.getCode())
                .orderByDesc(Conversation::getModifiedAt));
    } else {
        // 一般用戶：查 participant 表找出所有活躍參與的對話
        List<Long> conversationIds = participantMapper.selectList(
            new LambdaQueryWrapper<ConversationParticipant>()
                .eq(ConversationParticipant::getUserId, userId)
                .eq(ConversationParticipant::getIsActive, true)
                .select(ConversationParticipant::getConversationId)
        ).stream().map(ConversationParticipant::getConversationId).toList();
        
        if (conversationIds.isEmpty()) return Collections.emptyList();
        
        conversations = list(new LambdaQueryWrapper<Conversation>()
                .in(Conversation::getId, conversationIds)
                .ne(Conversation::getStatus, ConversationStatus.CLOSED.getCode())
                .orderByDesc(Conversation::getModifiedAt));
    }
    return toSummaries(conversations, userId, role);
}
```

### 改寫 `markAsRead`

現有邏輯依賴 `participantAId` / `participantBId` 判斷「不是自己發的訊息就標已讀」。多人對話後需改為：

```java
@Override
@Transactional
public void markAsRead(Long conversationId, Long userId, String role) {
    Conversation conv = getById(conversationId);
    if (conv == null) return;

    var wrapper = new LambdaUpdateWrapper<Message>()
            .eq(Message::getConversationId, conversationId)
            .eq(Message::getIsRead, false)
            .ne(Message::getSenderId, userId)  // 不是自己發的
            .set(Message::getIsRead, true)
            .set(Message::getReadAt, LocalDateTime.now());

    // 站方在客服/管理通道中只標記對方（非站方）發的訊息
    if (isStaffRole(role)
            && (ConversationType.CUSTOMER_SERVICE.getCode().equals(conv.getConversationType())
            || ConversationType.ADMIN.getCode().equals(conv.getConversationType()))) {
        wrapper.ne(Message::getSenderId, AppConstant.PLATFORM_USER_ID);
    }
    
    messageMapper.update(null, wrapper);
}
```

> **注意**：多人對話中，`isRead` 是 per-user 的概念，但 `message` 表只有一個 `isRead` 欄位。A 讀了不代表 B 也讀了。**短期方案**：維持現有邏輯（任一非發送者讀取即標已讀），用於列表未讀數計算，誤差可接受。**長期方案**：新增 `message_read_status` 表記錄每個 participant 的已讀狀態（見 §10.1）。

### `ConversationSummaryDto` 變更

```java
@Data
public class ConversationSummaryDto {
    private Long id;
    private String conversationType;
    private Long orderId;
    private String status;
    
    // ── legacy（過渡期保留，前端可不再依賴） ──
    private Long participantAId;
    private Long participantBId;
    private String peerName;
    
    // ── 新增 ──
    /** 參與者數量 */
    private Integer participantCount;
    /** 參與者列表（精簡：userId + userType + username） */
    private List<ParticipantBrief> participants;
    /** 對話標題（多人時顯示「訂單 #xxx」或參與者名稱組合） */
    private String title;
    
    private String lastMessage;
    private LocalDateTime lastMessageAt;
    private Integer unreadCount;
    private LocalDateTime modifiedAt;
}

@Data
public class ParticipantBrief {
    private Long userId;
    private String userType;    // CONSUMER / PHOTOGRAPHER / STYLIST
    private String username;
    private String avatar;
}
```

---

# 5. API 規格

## 5.1 現有 API（保持不變）

| 方法 | 路徑 | 說明 | 備註 |
| --- | --- | --- | --- |
| `GET` | `/conversations` | 我的對話列表 | 改用 participant 表查詢 |
| `GET` | `/conversations/{id}` | 對話詳情 | 回傳含 participants 列表 |
| `GET` | `/conversations/{id}/messages` | 訊息列表（分頁） | 不變 |
| `GET` | `/conversations/{id}/stream` | SSE 即時推送 | 不變 |
| `POST` | `/conversations/{id}/messages` | 發送文字訊息 | 不變 |
| `POST` | `/conversations/{id}/messages/image` | 發送圖片訊息（URL） | 不變 |
| `POST` | `/conversations/{id}/messages/image-upload` | 上傳並發送圖片 | 不變 |
| `POST` | `/conversations/{id}/read` | 標記已讀 | 不變 |
| `GET` | `/conversations/order/{orderId}` | 取得訂單對話室 | 回傳唯一多人對話 |
| `GET` | `/conversations/order/{orderId}/all` | 取得訂單所有對話 | 改為回傳該訂單的唯一對話（向後相容） |

## 5.2 新增 API

### 參與者管理

| 方法 | 路徑 | 說明 | 權限 |
| --- | --- | --- | --- |
| `GET` | `/conversations/{id}/participants` | 查看參與者列表 | 該對話參與者 |
| `POST` | `/conversations/{id}/participants` | 新增參與者 | ADMIN / SUPPORT |
| `DELETE` | `/conversations/{id}/participants/{userId}` | 移除參與者 | ADMIN / SUPPORT |

### `GET /conversations/{id}/participants`

**Response:**
```json
{
  "code": "200",
  "data": [
    {
      "id": 1,
      "userId": 101,
      "userType": "CONSUMER",
      "username": "王小明",
      "isActive": true,
      "joinedAt": "2026-06-29T10:00:00"
    },
    {
      "id": 2,
      "userId": 202,
      "userType": "PHOTOGRAPHER",
      "username": "張攝影",
      "isActive": true,
      "joinedAt": "2026-06-29T10:00:00"
    },
    {
      "id": 3,
      "userId": 303,
      "userType": "STYLIST",
      "username": "李造型",
      "isActive": false,
      "joinedAt": "2026-06-29T12:00:00",
      "removedAt": "2026-06-29T14:00:00",
      "removedBy": 1
    }
  ]
}
```

### `POST /conversations/{id}/participants`

**Request Body:**
```json
{
  "userId": 303,
  "userType": "STYLIST"
}
```

**Response:**
```json
{
  "code": "200",
  "data": {
    "id": 3,
    "conversationId": 1,
    "userId": 303,
    "userType": "STYLIST",
    "isActive": true,
    "joinedAt": "2026-06-29T12:00:00"
  }
}
```

### `DELETE /conversations/{id}/participants/{userId}`

**Response:**
```json
{
  "code": "200",
  "message": "已移除參與者"
}
```

---

# 6. 業務規則與邊界案例

## 6.1 參與者管理規則

| 規則 | 說明 | 實作位置 |
| --- | --- | --- |
| 不能移除消費者 | 消費者是訂單主體 | `removeParticipant()` |
| 不能移除自己 | 站方不能把自己移出對話 | `removeParticipant()` |
| 移除時發送系統訊息 | 所有現有參與者可見 | `removeParticipant()` |
| 被移除者立即失去存取權 | `is_active = false` | `requireConversationAccess()` |
| 被移除者的歷史訊息保留 | 訊息不刪除，發話者身分顯示不變 | 無需處理 |
| 可重新加入 | `is_active` 設回 `true`，`joined_at` 保留原始值 | `addParticipant()` |
| 重新加入時發送系統訊息 | 「{userType} {name} 已重新加入對話」 | `addParticipant()` |

## 6.2 邊界案例

| 場景 | 預期行為 |
| --- | --- |
| 攝影師被移除，訂單需重新媒合 | 移除時觸發 `OrderServiceImpl` 的 `REMATCHING` 狀態轉移（由 Controller 層判斷並呼叫） |
| 造型師被移除，拍攝尚未開始 | 系統檢查該訂單是否還需要造型師，若需要則提示站方重新指派 |
| 被移除的成員嘗試發話 | `verifySenderAccess()` → `is_active = false` → 拋 `FORBIDDEN` |
| 被移除的成員嘗試讀取歷史 | `requireConversationAccess()` → `is_active = false` → 拋 `FORBIDDEN` |
| 被移除的成員嘗試 SSE 訂閱 | `requireConversationAccess()` → 拋 `FORBIDDEN` |
| 訂單結案後站方新增參與者 | 允許（如爭議處理需拉入新站方人員），但對話仍為 READONLY |
| 訂單結案後站方移除參與者 | 允許，但消費者不可移除 |
| 同一人被重複加入 | `addParticipant()` 檢查已存在 → 若 `is_active = false` 則重新啟用 |
| 對話室不存在時操作參與者 | 拋 `CONVERSATION_NOT_FOUND` |

## 6.3 訂單狀態與對話狀態連動

| 訂單狀態轉移 | 對話狀態變更 | 觸發時機 |
| --- | --- | --- |
| 任何狀態 → `Closed` | `OPEN` → `READONLY` | `OrderServiceImpl.transition()` |
| 任何狀態 → `Disputed` | `READONLY` → `OPEN` | `OrderServiceImpl.transition()` |
| 訂單 `Paid` | 自動建立對話室 | 訂單建立流程中呼叫 `openOrderConversation()` |

---

# 7. 前端規格

## 7.1 消費者 App（`wanderlens-app`）

### 對話列表（`ConversationListScreen`）

- 顯示所有 `is_active = true` 的對話
- 結案後（`READONLY`）的對話仍顯示，但加「已結案」標籤
- 顯示參與者頭像（多人時顯示群組圖示）

### 對話室（`ConversationRoomScreen`）

- 頂部顯示參與者列表（頭像 + 名稱 + 身分）
- 訊息氣泡標示發話者身分（消費者/攝影師/造型師/系統）
- 系統訊息置中顯示，灰色背景
- **唯讀模式**（`status === 'READONLY'`）：
  - 頂部顯示黃色橫幅：「訂單已結案，對話為唯讀模式」
  - 隱藏輸入框與傳送按鈕
  - 隱藏圖片上傳按鈕
- 正常模式：輸入框 + 傳送按鈕 + 圖片上傳

## 7.2 攝影師 App（`wanderlens-provider-app`）

- 與消費者 App 相同邏輯
- 額外：若自己被移出對話，列表不再顯示該對話

## 7.3 消費者 Web（`wanderlens-web`）

- 與 App 相同邏輯
- 桌面端可顯示較大的參與者側欄

## 7.4 攝影師 Web（`wanderlens-provider`）

- 與 App 相同邏輯

## 7.5 營運後台（`wanderlens-admin`）

### 對話詳情頁

- 顯示完整訊息歷史（不受 READONLY 限制）
- 右側欄：參與者列表
  - 每個參與者顯示：頭像、名稱、身分、加入時間
  - 活躍參與者：顯示「移除」按鈕
  - 已移除參與者：灰色顯示 + 「已移除」標籤 + 移除時間 + 移除者
- 頂部：**「新增參與者」按鈕**
  - 點擊後彈出搜尋框 → 輸入使用者 ID 或名稱 → 選擇身分（攝影師/造型師）→ 確認

### 對話列表

- 站方可查看所有對話（含已結案）
- 篩選：訂單編號、狀態、類型

---

# 8. 開發階段與 Task Plan

## Phase 1：唯讀模式 UI（0.5-1 天）

> **目標**：結案後對話不可發話，但歷史仍可見。不改資料模型。

| ID | 任務 | 負責端 | 預估 |
| :---: | --- | --- | :---: |
| P1-1 | 消費者 App `ConversationRoomScreen` 唯讀 UI | `wanderlens-app` | 0.5d |
| P1-2 | 攝影師 App `ConversationRoomScreen` 唯讀 UI | `wanderlens-provider-app` | 0.5d |
| P1-3 | Web 端對話室唯讀 UI | `wanderlens-web` + `wanderlens-provider` | 0.5d |

**Phase 1 總工時**：約 1 天（三端可並行）

## Phase 2：多人對話 + 參與者管理（7-8 天）

> **目標**：完整多人對話系統，含站方管理參與者。需改資料模型。

| ID | 任務 | 負責端 | 預估 | 依賴 |
| :---: | --- | --- | :---: | --- |
| P2-1 | DB migration：新增 `conversation_participant` 表 + 遷移現有資料 | API | 0.5d | — |
| P2-2 | 新增 `ConversationParticipant` entity + mapper | API | 0.5d | P2-1 |
| P2-3 | 改寫 `openOrderConversation` 支援多 participant | API | 1d | P2-2 |
| P2-4 | 改寫 `requireConversationAccess` 查 participant 表 | API | 0.5d | P2-2 |
| P2-5 | 改寫 `verifySenderAccess` 查 participant 表 | API | 0.5d | P2-2 |
| P2-6 | 改寫 `getMyConversationSummaries` 用 participant 表 | API | 0.5d | P2-2 |
| P2-7 | 新增 `addParticipant` / `removeParticipant` / `getParticipants` | API | 1d | P2-2 |
| P2-8 | 新增 3 個 participant API 端點 | API | 0.5d | P2-7 |
| P2-9 | 前端：多人對話室 UI（參與者頭像、發話者標示） | App × 2 | 2d | P2-3 |
| P2-10 | 後台：參與者管理（列表 + 新增 + 移除按鈕） | `wanderlens-admin` | 1d | P2-8 |
| P2-11 | 整合測試（多人對話 + 移除 + 重新加入 + 結案唯讀） | All | 1d | 以上全部 |

**Phase 2 總工時**：約 7-8 天

---

# 9. 風險與注意事項

## 9.1 技術風險

| 風險 | 等級 | 緩解 |
| --- | :---: | --- |
| DB migration 失敗導致現有對話無法使用 | 🟡 中 | 保留 `participantAId/BId` 作為 legacy 過渡期；migration 腳本先在 staging 驗證 |
| `requireConversationAccess` 改寫後漏掉某個呼叫點 | 🟡 中 | 全專案 grep 所有呼叫點，逐一確認 |
| 多人對話的 SSE 推送對象增加，效能影響 | 🟢 低 | 目前每對話室參與者 ≤ 5 人，SSE 訂閱數可控 |
| 前端多人 UI 在小型手機螢幕上擁擠 | 🟢 低 | 參與者頭像用小型圓形圖示，超過 3 人顯示「+N」 |

## 9.2 向後相容

- `conversation` 表的 `participantAId` / `participantBId` 在過渡期保留
- 舊 API（`GET /conversations/order/{orderId}`）行為不變
- 前端先接 Phase 1（唯讀 UI），Phase 2 上線後再升級多人 UI

## 9.3 與其他模組的交互

| 模組 | 交互點 | 說明 |
| --- | --- | --- |
| `OrderServiceImpl` | `transition()` → `setReadonlyForOrder()` | 結案時觸發，不變 |
| `OrderServiceImpl` | `transition()` → `reopenForOrder()` | 爭議時觸發，不變 |
| `MatchService` | 即時媒合成功 → 建立訂單 → 建立對話 | 建立對話時傳入多 participant |
| `NotifyService` | 新訊息 → 推播通知 | 不變 |

---

# 附錄 A：現有檔案清單（需修改）

| 檔案 | 變更類型 | Phase |
| --- | :---: | :---: |
| `wanderlens-api/.../entity/Conversation.java` | 新增 `participants` 欄位 | P2 |
| `wanderlens-api/.../entity/ConversationParticipant.java` | **新建** | P2 |
| `wanderlens-api/.../mapper/ConversationParticipantMapper.java` | **新建** | P2 |
| `wanderlens-api/.../service/ConversationService.java` | 新增方法簽名 | P2 |
| `wanderlens-api/.../service/impl/ConversationServiceImpl.java` | 改寫多個方法 | P2 |
| `wanderlens-api/.../controller/conversation/ConversationController.java` | 新增 3 端點 | P2 |
| `wanderlens-api/.../util/AuthUtil.java` | 改寫 `requireConversationAccess` | P2 |
| `wanderlens-api/.../resources/db/migration/` | **新建** migration SQL | P2 |
| `wanderlens-app/src/screens/conversation/ConversationRoomScreen.tsx` | 唯讀 UI + 多人 UI | P1 + P2 |
| `wanderlens-app/src/screens/conversation/ConversationListScreen.tsx` | 唯讀標籤 | P1 |
| `wanderlens-provider-app/src/screens/conversation/ConversationRoomScreen.tsx` | 唯讀 UI + 多人 UI | P1 + P2 |
| `wanderlens-provider-app/src/screens/conversation/ConversationListScreen.tsx` | 唯讀標籤 | P1 |
| `wanderlens-web/src/pages/conversations/index.vue` | 唯讀標籤 + 多人頭像 | P1 + P2 |
| `wanderlens-web/src/pages/conversations/[id].vue` | 唯讀 UI + 多人 UI + 發話者標示 | P1 + P2 |
| `wanderlens-web/src/api/album-api.ts` | 新增 participant API 呼叫 | P2 |
| `wanderlens-provider/src/views/conversation/ConversationList.vue` | 唯讀標籤 + 多人頭像 | P1 + P2 |
| `wanderlens-provider/src/views/conversation/ConversationRoom.vue` | 唯讀 UI + 多人 UI + 發話者標示 | P1 + P2 |
| `wanderlens-provider/src/api/index.ts` | 新增 participant API 呼叫 | P2 |
| `wanderlens-admin/src/views/support/ConversationAccess.vue` | 參與者管理 + 多人檢視（重構） | P2 |
| `wanderlens-app/src/api/index.ts` | 新增 participant API 呼叫 | P2 |
| `wanderlens-provider-app/src/api/index.ts` | 新增 participant API 呼叫 | P2 |

---

---

# 10. 功能設計建議

> 以下為檢視過程中發現的設計問題與建議，供討論後決定是否納入。

## 10.1 `isRead` 在多人對話的語意問題

**問題**：`message` 表只有一個 `isRead` boolean 欄位。在 1-to-1 對話中，「對方讀了」很明確。但在多人對話中，A 讀了不代表 B 也讀了——未讀數會不準確。

**短期方案（Phase 2 內）**：維持現有邏輯。任一非發送者讀取即標 `isRead = true`。列表未讀數僅供參考。對於 ≤ 5 人的對話室，誤差可接受。

**長期方案（未來）**：新增 `message_read_status` 表：
```sql
CREATE TABLE message_read_status (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    message_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    read_at DATETIME NOT NULL,
    UNIQUE KEY uk_msg_user (message_id, user_id)
);
```
未讀數改為：`SELECT COUNT(*) FROM message m WHERE m.conversation_id = ? AND m.sender_id != ? AND NOT EXISTS (SELECT 1 FROM message_read_status WHERE message_id = m.id AND user_id = ?)`

**建議**：Phase 2 先不做，列入技術債。等用戶回饋未讀數不準確時再啟動。

## 10.2 被移除者是否能看到「自己被移除」的提示

**問題**：被移除後，該用戶的對話列表不再顯示該對話（`is_active = false`）。但用戶可能困惑——昨天還在的對話今天突然消失了。

**建議**：被移除時，透過 `NotifyService` 發送一則站內通知：「您已被移出訂單 #xxx 的對話室」。讓用戶知道為什麼對話消失了，而非默默消失。

**實作**：`removeParticipant()` 末尾加入 `notifyService.triggerFlow("participant_removed", userId, ...)`。工時 +0.5d。

## 10.3 結案唯讀後，站方是否仍可發話

**問題**：文件 §6.2 寫「訂單結案後站方新增參與者允許，但對話仍為 READONLY」。但 `requireWritableConversation()` 會擋所有 READONLY 對話的發話，包括站方。

**目前行為**：站方在 READONLY 對話中**也不能發話**。

**建議**：這其實是合理的——結案就是結案，站方不應在已結案的對話中繼續發話。若爭議處理需要溝通，應透過 `reopenForOrder()` 重新開啟對話（已有此邏輯）。**維持現有行為，不需改動**。

## 10.4 Web 端對話室即時性

**問題**：消費者 Web（`wanderlens-web/src/pages/conversations/[id].vue`）和攝影師 Web（`wanderlens-provider/src/views/conversation/ConversationRoom.vue`）目前都用**輪詢**（setInterval），沒有接 SSE。只有攝影師 App 有 `useConversationStream`。

**影響**：Web 端訊息延遲可達 10 秒，App 端即時。同一對話中，Web 用戶體驗差於 App 用戶。

**建議**：Phase 1 唯讀 UI 不需要即時性（結案後沒有新訊息）。Phase 2 多人對話上線時，Web 端也應接入 SSE（Nuxt 可用 `EventSource` API，Vue 可用 `@microsoft/fetch-event-source`）。列入 Phase 2 範圍，+1d。

## 10.5 攝影師 Web 對話室已經有唯讀 UI

**發現**：`wanderlens-provider/src/views/conversation/ConversationRoom.vue` 第 57 行已有：
```html
<div v-else class="text-center text-sm text-gray-400 mt-4">{{ t('conversation.readonly') }}</div>
```

且 i18n 已有 `conversation.readonly` key（`"This conversation is read-only"`）。

**結論**：攝影師 Web 的唯讀 UI **已經完成**，Phase 1 不需改動此檔案。只需確認消費者 Web 和兩端 App 補上相同邏輯。

## 10.6 後台對話調閱頁面過於簡陋

**問題**：`wanderlens-admin/src/views/support/ConversationAccess.vue` 目前只是一個輸入框 + 調閱按鈕，沒有對話列表、沒有參與者管理、沒有篩選。

**建議**：Phase 2 的 P2-10（後台參與者管理）應擴大範圍，將此頁面重構為完整的「對話管理中心」：
- 左側：對話列表（含篩選：訂單編號、狀態、類型）
- 右側：訊息歷史 + 參與者側欄
- 頂部：新增/移除參與者按鈕

工時從 1d 調整為 1.5d。

---

— 文件結束 —
