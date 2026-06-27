-- WanderLens Schema Migration V004
-- 金流與清算相關資料表

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ──────────────────────────────────────────────
-- 清算帳本
-- ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `ledger_entry` (
    `id`           BIGINT AUTO_INCREMENT PRIMARY KEY,
    `order_id`     BIGINT       NOT NULL COMMENT '訂單 ID',
    `entry_type`   VARCHAR(30)  NOT NULL COMMENT '分錄類型',
    `amount`       INT          NOT NULL COMMENT '金額',
    `provider_id`  BIGINT                COMMENT '關聯供給方 ID',
    `status`       VARCHAR(20)  DEFAULT 'PENDING' COMMENT 'PENDING/SETTLED',
    `settled_at`   DATETIME              COMMENT '撥款時間',
    `created_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY `idx_order_id` (`order_id`),
    KEY `idx_provider_id` (`provider_id`),
    KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='清算帳本';

-- ──────────────────────────────────────────────
-- 折扣碼
-- ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `coupon` (
    `id`                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    `coupon_name`         VARCHAR(100)          COMMENT '折扣碼名稱',
    `coupon_code`         VARCHAR(50)  NOT NULL COMMENT '折扣碼',
    `discount`            INT          NOT NULL COMMENT '折扣金額',
    `date_start`          DATE                  COMMENT '開始日期',
    `date_end`            DATE                  COMMENT '結束日期',
    `usage_count`         INT          DEFAULT 0 COMMENT '可使用次數',
    `usage_count_current` INT          DEFAULT 0 COMMENT '已使用次數',
    `usage_price`         INT                  COMMENT '低消金額',
    `usage_service`       VARCHAR(255)          COMMENT '適用服務類型（逗號分隔 ID）',
    `coupon_owner`        BIGINT                COMMENT '推廣員 ID',
    `created_at`          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_at`         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_coupon_code` (`coupon_code`),
    KEY `idx_coupon_owner` (`coupon_owner`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='折扣碼';

SET FOREIGN_KEY_CHECKS = 1;