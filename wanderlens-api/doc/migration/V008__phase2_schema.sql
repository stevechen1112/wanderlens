-- WanderLens Schema Migration V008
-- Phase 2: 攝影棚 + 精修工單

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ── 攝影棚 ──
CREATE TABLE IF NOT EXISTS `studio` (
    `id`                      BIGINT AUTO_INCREMENT PRIMARY KEY,
    `studio_uuid`             VARCHAR(36)  NOT NULL COMMENT 'UUID',
    `name`                    VARCHAR(100) NOT NULL COMMENT '棚名',
    `studio_type`             VARCHAR(50)           COMMENT '棚型',
    `phone`                   VARCHAR(20)           COMMENT '電話',
    `email`                   VARCHAR(255)          COMMENT 'Email',
    `city`                    VARCHAR(50)           COMMENT '縣市',
    `district_name`           VARCHAR(50)           COMMENT '鄉鎮區',
    `address`                 VARCHAR(255)          COMMENT '地址',
    `addr_lng`                DOUBLE                COMMENT '經度',
    `addr_lat`                DOUBLE                COMMENT '緯度',
    `environment_images`      TEXT                  COMMENT '環境照（逗號分隔 URL）',
    `supported_service_types` VARCHAR(255)          COMMENT '可容納服務類型（逗號分隔 ID）',
    `hourly_rate`             INT          DEFAULT 0 COMMENT '每小時價格',
    `go_live`                 VARCHAR(1)   DEFAULT 'N' COMMENT '上架 Y/N',
    `created_at`              DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_at`             DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_studio_uuid` (`studio_uuid`),
    KEY `idx_city` (`city`),
    KEY `idx_go_live` (`go_live`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='攝影棚';

-- ── 攝影棚檔期 ──
CREATE TABLE IF NOT EXISTS `studio_availability` (
    `id`                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    `studio_id`           BIGINT       NOT NULL COMMENT '攝影棚 ID',
    `schedule_date`       DATE         NOT NULL COMMENT '日期',
    `slot_start`          TIME         NOT NULL COMMENT '開始時間',
    `slot_end`            TIME         NOT NULL COMMENT '結束時間',
    `active`              VARCHAR(1)   DEFAULT 'Y' COMMENT 'Y/N',
    `locked_by_order_id`  BIGINT                COMMENT '被訂單鎖定時的訂單 ID',
    `created_at`          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_at`         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY `idx_studio_date` (`studio_id`, `schedule_date`),
    KEY `idx_locked` (`locked_by_order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='攝影棚檔期';

-- ── 精修工單 ──
CREATE TABLE IF NOT EXISTS `retouch_job` (
    `id`                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    `order_id`            BIGINT       NOT NULL COMMENT '訂單 ID',
    `consumer_id`         BIGINT       NOT NULL COMMENT '消費者 ID',
    `media_asset_ids`     TEXT                  COMMENT '選片清單（JSON）',
    `retouch_company_id`  BIGINT                COMMENT '外包修圖公司 ID',
    `status`              VARCHAR(20)  DEFAULT 'REQUESTED' COMMENT '工單狀態',
    `spec`                TEXT                  COMMENT '修圖規格',
    `fee`                 INT                   COMMENT '精修費用',
    `delivery_deadline`   DATETIME              COMMENT '交期',
    `created_at`          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_at`         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY `idx_order_id` (`order_id`),
    KEY `idx_company_id` (`retouch_company_id`),
    KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='精修工單';

SET FOREIGN_KEY_CHECKS = 1;