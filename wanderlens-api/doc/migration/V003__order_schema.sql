-- WanderLens Schema Migration V003
-- 訂單與狀態機相關資料表

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ──────────────────────────────────────────────
-- 訂單
-- ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `order` (
    `id`                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    `order_no`            VARCHAR(20)  NOT NULL COMMENT '訂單編號（yyyyMMddHHmmssSS）',
    `booking_id`          BIGINT                COMMENT '預約條件 ID',
    `consumer_id`         BIGINT       NOT NULL COMMENT '消費者 ID',
    `photographer_id`     BIGINT                COMMENT '攝影師 ID',
    `stylist_id`          BIGINT                COMMENT '造型師 ID',
    `studio_id`           BIGINT                COMMENT '攝影棚 ID',
    `service_type_id`     BIGINT       NOT NULL COMMENT '拍攝類型 ID',
    `configuration_id`    BIGINT                COMMENT '拍攝配置 ID',
    `service_fee`         INT          DEFAULT 0 COMMENT '拍攝費',
    `unit_price`          INT          DEFAULT 0 COMMENT '每小時單價',
    `transportation_fee`  INT          DEFAULT 0 COMMENT '交通費',
    `coupon_code`         VARCHAR(50)           COMMENT '折扣碼',
    `coupon_discount`     INT          DEFAULT 0 COMMENT '折扣金額',
    `extra_time_fee`      INT          DEFAULT 0 COMMENT '加時費用',
    `total_fee`           INT          DEFAULT 0 COMMENT '總費用',
    `photographer_profit` INT          DEFAULT 0 COMMENT '攝影師應付',
    `status`              VARCHAR(30)  NOT NULL DEFAULT 'Draft' COMMENT '訂單狀態',
    `payment_method`      VARCHAR(20)           COMMENT '付款方式',
    `customer_name`       VARCHAR(100)          COMMENT '客戶姓名',
    `customer_phone`      VARCHAR(20)           COMMENT '客戶電話',
    `email`               VARCHAR(255)          COMMENT 'Email',
    `shooting_date`       DATE                  COMMENT '拍攝日期',
    `shooting_time`       VARCHAR(50)           COMMENT '拍攝時間',
    `shooting_duration`   DECIMAL(3,1)          COMMENT '拍攝時數',
    `shooting_location`   VARCHAR(255)          COMMENT '拍攝地點',
    `adult_num`           INT          DEFAULT 0 COMMENT '大人人數',
    `child_num`           INT          DEFAULT 0 COMMENT '小孩人數',
    `pic_num`             INT                   COMMENT '照片張數',
    `manual_order`        VARCHAR(1)   DEFAULT 'N' COMMENT '是否為手動訂單',
    `created_at`          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_at`         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_order_no` (`order_no`),
    KEY `idx_consumer_id` (`consumer_id`),
    KEY `idx_photographer_id` (`photographer_id`),
    KEY `idx_status` (`status`),
    KEY `idx_shooting_date` (`shooting_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='訂單';

-- ──────────────────────────────────────────────
-- 拍攝事件
-- ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `shoot_event` (
    `id`                 BIGINT AUTO_INCREMENT PRIMARY KEY,
    `order_id`           BIGINT       NOT NULL COMMENT '訂單 ID',
    `event_type`         VARCHAR(30)  NOT NULL COMMENT '事件類型',
    `event_time`         DATETIME     NOT NULL COMMENT '事件時間',
    `extra_time_minutes` INT                   COMMENT '加時分鐘',
    `extra_time_fee`     INT                   COMMENT '加時費用',
    `operator_id`        BIGINT                COMMENT '操作者 ID',
    KEY `idx_order_id` (`order_id`),
    KEY `idx_event_type` (`event_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='拍攝事件';

-- ──────────────────────────────────────────────
-- 訂單歷程
-- ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `order_history` (
    `id`            BIGINT AUTO_INCREMENT PRIMARY KEY,
    `order_id`      BIGINT       NOT NULL COMMENT '訂單 ID',
    `order_no`      VARCHAR(20)           COMMENT '訂單編號',
    `from_status`   VARCHAR(30)           COMMENT '原狀態',
    `to_status`     VARCHAR(30)           COMMENT '新狀態',
    `action`        VARCHAR(50)           COMMENT '動作',
    `action_detail` TEXT                  COMMENT '詳細說明',
    `exec_by`       VARCHAR(100)          COMMENT '執行者',
    `created_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='訂單歷程';

SET FOREIGN_KEY_CHECKS = 1;