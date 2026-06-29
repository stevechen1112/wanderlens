-- WanderLens 多人訂單對話系統 — DB Migration
-- 新增 conversation_participant 表，支援多人對話
-- 日期：2026-06-29
-- 版本：v1.0

CREATE TABLE IF NOT EXISTS conversation_participant (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    conversation_id BIGINT NOT NULL,
    user_id         BIGINT NOT NULL,
    user_type       VARCHAR(20) NOT NULL COMMENT 'CONSUMER / PHOTOGRAPHER / STYLIST',
    is_active       BOOLEAN NOT NULL DEFAULT TRUE COMMENT '軟刪除旗標：true=在對話中, false=已被移除',
    joined_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    removed_at      DATETIME NULL COMMENT '被移除時間',
    removed_by      BIGINT NULL COMMENT '移除者 ID（站方 user_id）',
    UNIQUE KEY uk_conv_user (conversation_id, user_id),
    INDEX idx_user_id (user_id),
    INDEX idx_conversation_active (conversation_id, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='對話參與者（多人對話支援）';

-- 遷移現有 conversation 的 participantAId / participantBId 到新表
-- participantAId 通常是消費者（ORDER 類型）或站方（CUSTOMER_SERVICE / ADMIN 類型）
INSERT INTO conversation_participant (conversation_id, user_id, user_type, is_active, joined_at)
SELECT id, participant_a_id,
    CASE
        WHEN conversation_type != 'ORDER' THEN 'ADMIN'
        WHEN participant_a_id = (SELECT consumer_id FROM `order` WHERE id = order_id)
             THEN 'CONSUMER'
        ELSE 'PHOTOGRAPHER'
    END,
    TRUE, created_at
FROM conversation
WHERE participant_a_id IS NOT NULL;

-- participantBId 通常是攝影師（ORDER 類型）或消費者（CUSTOMER_SERVICE / ADMIN 類型）
INSERT INTO conversation_participant (conversation_id, user_id, user_type, is_active, joined_at)
SELECT id, participant_b_id,
    CASE
        WHEN conversation_type != 'ORDER' THEN 'CONSUMER'
        ELSE 'PHOTOGRAPHER'
    END,
    TRUE, created_at
FROM conversation
WHERE participant_b_id IS NOT NULL;

-- 注意：conversation 表的 participant_a_id / participant_b_id 欄位保留（legacy 過渡期）
-- 過渡期結束後可執行：
-- ALTER TABLE conversation DROP COLUMN participant_a_id;
-- ALTER TABLE conversation DROP COLUMN participant_b_id;