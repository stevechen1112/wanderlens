-- WanderLens Schema Migration V014
-- 即時媒合

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS `match_request` (
    `id`                   BIGINT AUTO_INCREMENT PRIMARY KEY,
    `consumer_id`          BIGINT         NOT NULL,
    `service_type_id`      BIGINT         NOT NULL,
    `configuration_id`     BIGINT                  COMMENT '拍攝配置',
    `status`               VARCHAR(30)    NOT NULL DEFAULT 'SEARCHING',
    `city`                 VARCHAR(50)             COMMENT '城市',
    `shooting_location`    VARCHAR(255)   NOT NULL,
    `shooting_lat`         DOUBLE                  COMMENT '緯度',
    `shooting_lng`         DOUBLE                  COMMENT '經度',
    `duration_hours`       DECIMAL(4,2)   NOT NULL DEFAULT 1.00,
    `scheduled_time`       DATETIME       NOT NULL COMMENT '預計開拍時間',
    `estimated_fee`        INT            NOT NULL DEFAULT 0,
    `radius_km`            INT            NOT NULL DEFAULT 10,
    `broadcast_round`      INT            NOT NULL DEFAULT 1,
    `matched_provider_id`  BIGINT                  COMMENT '得標攝影師',
    `order_id`             BIGINT                  COMMENT '成立訂單',
    `customer_name`        VARCHAR(100),
    `customer_phone`       VARCHAR(30),
    `expires_at`           DATETIME       NOT NULL,
    `created_at`           DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_at`          DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY `idx_consumer` (`consumer_id`),
    KEY `idx_status` (`status`),
    KEY `idx_expires` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='即時媒合需求';

SET FOREIGN_KEY_CHECKS = 1;
