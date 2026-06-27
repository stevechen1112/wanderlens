-- WanderLens Schema Migration V005
-- 站內溝通相關資料表

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ──────────────────────────────────────────────
-- 溝通室
-- ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `conversation` (
    `id`                BIGINT AUTO_INCREMENT PRIMARY KEY,
    `conversation_type` VARCHAR(30)  NOT NULL COMMENT 'ADMIN/CUSTOMER_SERVICE/ORDER',
    `order_id`          BIGINT                COMMENT '關聯訂單 ID（ORDER 類型）',
    `participant_a_id`  BIGINT       NOT NULL COMMENT '參與者 A',
    `participant_b_id`  BIGINT       NOT NULL COMMENT '參與者 B',
    `status`            VARCHAR(20)  NOT NULL DEFAULT 'OPEN' COMMENT 'OPEN/READONLY/CLOSED',
    `created_at`        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_at`       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY `idx_order_id` (`order_id`),
    KEY `idx_participant_a` (`participant_a_id`),
    KEY `idx_participant_b` (`participant_b_id`),
    KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='溝通室';

-- ──────────────────────────────────────────────
-- 訊息
-- ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `message` (
    `id`              BIGINT AUTO_INCREMENT PRIMARY KEY,
    `conversation_id` BIGINT       NOT NULL COMMENT '溝通室 ID',
    `sender_id`       BIGINT       NOT NULL COMMENT '發送者 ID（0=系統）',
    `message_type`    VARCHAR(20)  NOT NULL COMMENT 'TEXT/IMAGE/SYSTEM/TEMPLATE',
    `content`         TEXT                  COMMENT '訊息內容',
    `image_url`       VARCHAR(500)          COMMENT '圖片 URL（IMAGE 類型）',
    `is_read`         TINYINT(1)   DEFAULT 0 COMMENT '是否已讀',
    `read_at`         DATETIME              COMMENT '已讀時間',
    `created_at`      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY `idx_conversation_id` (`conversation_id`),
    KEY `idx_sender_id` (`sender_id`),
    KEY `idx_is_read` (`is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='訊息';

-- ──────────────────────────────────────────────
-- 溝通調閱日誌
-- ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `conversation_access_log` (
    `id`              BIGINT AUTO_INCREMENT PRIMARY KEY,
    `conversation_id` BIGINT       NOT NULL COMMENT '溝通室 ID',
    `accessor_id`     BIGINT       NOT NULL COMMENT '調閱者 ID',
    `reason`          VARCHAR(255)          COMMENT '調閱原因',
    `accessed_at`     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY `idx_conversation_id` (`conversation_id`),
    KEY `idx_accessor_id` (`accessor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='溝通調閱日誌';

SET FOREIGN_KEY_CHECKS = 1;