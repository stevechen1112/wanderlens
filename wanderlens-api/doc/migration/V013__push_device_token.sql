-- WanderLens Schema Migration V013
-- App 推播 device token

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS `notify_device_token` (
    `id`         BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id`    BIGINT       NOT NULL COMMENT '使用者 ID',
    `token`      VARCHAR(512) NOT NULL COMMENT '推播 token（Expo 或 FCM）',
    `platform`   VARCHAR(20)  NOT NULL DEFAULT 'EXPO' COMMENT 'EXPO | FCM',
    `app_type`   VARCHAR(20)  NOT NULL DEFAULT 'CONSUMER' COMMENT 'CONSUMER | PROVIDER',
    `device_id`  VARCHAR(128)          COMMENT '裝置識別（可選）',
    `active`     TINYINT(1)   NOT NULL DEFAULT 1,
    `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_token` (`token`(255)),
    KEY `idx_user_app` (`user_id`, `app_type`, `active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='App 推播 device token';

SET FOREIGN_KEY_CHECKS = 1;
