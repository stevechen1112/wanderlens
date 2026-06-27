-- V010: 缺口清單補強（MySQL 8 相容版，無 IF NOT EXISTS）

ALTER TABLE `user`
    ADD COLUMN `line_user_id` VARCHAR(64) NULL COMMENT 'LINE Messaging API userId' AFTER `line_auth_code`;

ALTER TABLE `provider`
    ADD COLUMN `suspended_until` DATETIME NULL COMMENT '暫停接案到期時間' AFTER `violation_level`;

ALTER TABLE `order`
    ADD COLUMN `source_country` VARCHAR(8) NULL COMMENT '客源國 ISO 代碼' AFTER `manual_order`,
    ADD COLUMN `referral_code` VARCHAR(32) NULL COMMENT '推薦碼' AFTER `source_country`,
    ADD COLUMN `second_photographer_id` BIGINT NULL COMMENT '第二位攝影師（雙機）' AFTER `photographer_id`;

CREATE TABLE IF NOT EXISTS `affiliate_partner` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `empno` VARCHAR(50) NULL,
    `phone` VARCHAR(20) NULL,
    `referral_code` VARCHAR(32) NOT NULL UNIQUE,
    `bank_account` VARCHAR(100) NULL,
    `commission_rate` DECIMAL(5,2) DEFAULT 5.00 COMMENT '佣金百分比',
    `click_count` INT DEFAULT 0,
    `conversion_count` INT DEFAULT 0,
    `total_commission` INT DEFAULT 0,
    `status` VARCHAR(20) DEFAULT 'active',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `modified_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `affiliate_click` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `affiliate_id` BIGINT NOT NULL,
    `referral_code` VARCHAR(32) NOT NULL,
    `source_url` VARCHAR(500) NULL,
    `ip_address` VARCHAR(45) NULL,
    `user_agent` VARCHAR(500) NULL,
    `converted` TINYINT(1) DEFAULT 0,
    `order_id` BIGINT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_affiliate_click_code (`referral_code`),
    INDEX idx_affiliate_click_affiliate (`affiliate_id`)
);

CREATE TABLE IF NOT EXISTS `scene_recommendation` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `service_type_id` BIGINT NULL,
    `scene_tag` VARCHAR(50) NULL COMMENT 'WEDDING/BABY/TRAVEL/CAREER/SPACE',
    `partner_name` VARCHAR(100) NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `description` VARCHAR(500) NULL,
    `image_url` VARCHAR(500) NULL,
    `affiliate_url` VARCHAR(500) NOT NULL,
    `commission_rate` DECIMAL(5,2) DEFAULT 0,
    `priority` INT DEFAULT 0,
    `active` CHAR(1) DEFAULT 'Y',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `modified_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `market_signal` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `source_country` VARCHAR(8) NOT NULL,
    `source_city` VARCHAR(100) NULL,
    `signal_type` VARCHAR(50) NOT NULL COMMENT 'VISIT/SHARE/REFERRAL/BOOKING_INTENT',
    `count_value` INT DEFAULT 1,
    `metadata` JSON NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_market_signal_country (`source_country`, `signal_type`)
);
