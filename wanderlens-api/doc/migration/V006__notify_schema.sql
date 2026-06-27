-- WanderLens Schema Migration V006
-- 通知與排程相關資料表

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ──────────────────────────────────────────────
-- 站內通知
-- ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `notify_message` (
    `id`            BIGINT AUTO_INCREMENT PRIMARY KEY,
    `message_owner` BIGINT       NOT NULL COMMENT '通知擁有者 ID',
    `message`       VARCHAR(500) NOT NULL COMMENT '通知內容',
    `message_url`   VARCHAR(500)          COMMENT '通知連結 URL',
    `is_read`       TINYINT(1)   DEFAULT 0 COMMENT '是否已讀',
    `created_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY `idx_message_owner` (`message_owner`),
    KEY `idx_is_read` (`is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='站內通知';

-- ──────────────────────────────────────────────
-- 通知流程設定
-- ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `app_flow` (
    `id`          BIGINT AUTO_INCREMENT PRIMARY KEY,
    `flow_type`   VARCHAR(50)  NOT NULL COMMENT '流程類型',
    `flow_name`   VARCHAR(100)          COMMENT '流程名稱',
    `flow_cat`    VARCHAR(50)           COMMENT '流程分類',
    `seq`         INT          DEFAULT 0 COMMENT '順序',
    `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY `idx_flow_type` (`flow_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='通知流程設定';

-- ──────────────────────────────────────────────
-- 初始通知流程資料
-- ──────────────────────────────────────────────

INSERT INTO `app_flow` (`flow_type`, `flow_name`, `flow_cat`, `seq`) VALUES
    ('order_created',       '訂單成立',       'order',    1),
    ('order_paid',          '付款成功',       'order',    2),
    ('payment_failed',      '付款失敗',       'order',    3),
    ('contact_reminder',    '聯繫提醒',       'schedule', 4),
    ('upload_reminder',     'RAW上傳提醒',    'schedule', 5),
    ('auto_cancel',         '自動取消',       'schedule', 6),
    ('sla_alert',           'SLA告警',        'schedule', 7),
    ('photo_uploaded',      '照片已上傳',     'delivery', 8),
    ('photo_delivered',     '照片已交付',     'delivery', 9),
    ('closing_notification','關帳通知',       'finance',  10),
    ('retouch_requested',   '精修已申請',     'retouch',  11),
    ('retouch_delivered',   '精修已交付',     'retouch',  12),
    ('dispute_opened',      '爭議已開啟',     'support',  13),
    ('dispute_resolved',    '爭議已解決',     'support',  14)
ON DUPLICATE KEY UPDATE `modified_at` = NOW();

SET FOREIGN_KEY_CHECKS = 1;