-- WanderLens 資料庫初始化 Schema
-- V001__init_schema.sql

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ──────────────────────────────────────────────
-- 使用者與權限
-- ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `user` (
    `id`            BIGINT AUTO_INCREMENT PRIMARY KEY,
    `empno`         VARCHAR(50)  NOT NULL COMMENT '登入帳號',
    `password`      VARCHAR(255) NOT NULL COMMENT '密碼（BCrypt）',
    `username`      VARCHAR(100) NOT NULL COMMENT '姓名',
    `phone`         VARCHAR(20)           COMMENT '電話',
    `email`         VARCHAR(255)          COMMENT 'Email',
    `avatar`        VARCHAR(255)          COMMENT '大頭照 URL',
    `role`          VARCHAR(30)  NOT NULL COMMENT '角色',
    `role_id`       BIGINT                COMMENT '角色 ID（RBAC）',
    `area`          VARCHAR(50)           COMMENT '所在區域',
    `provider_id`   BIGINT                COMMENT '關聯 Provider ID',
    `affiliate_id`  BIGINT                COMMENT '關聯推廣員 ID',
    `line_token`    VARCHAR(255)          COMMENT 'LINE Notify token',
    `line_auth_code` VARCHAR(255)         COMMENT 'LINE OAuth 授權碼',
    `status`        VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE' COMMENT '帳號狀態',
    `created_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_empno` (`empno`),
    KEY `idx_role` (`role`),
    KEY `idx_provider_id` (`provider_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='使用者';

CREATE TABLE IF NOT EXISTS `role` (
    `id`           BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name`         VARCHAR(100) NOT NULL COMMENT '角色名稱',
    `eng_name`     VARCHAR(100)          COMMENT '英文名稱',
    `description`  VARCHAR(255)          COMMENT '說明',
    `created_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色';

CREATE TABLE IF NOT EXISTS `menu` (
    `id`           BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name`         VARCHAR(100) NOT NULL COMMENT '選單名稱',
    `path`         VARCHAR(255)          COMMENT '路由路徑',
    `icon`         VARCHAR(100)          COMMENT '圖示',
    `description`  VARCHAR(255)          COMMENT '說明',
    `daily`        TINYINT(1)   DEFAULT 0 COMMENT '是否為每日使用',
    `parent_id`    BIGINT                COMMENT '父選單 ID',
    `sort_order`   INT          DEFAULT 0 COMMENT '排序',
    `created_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='選單';

CREATE TABLE IF NOT EXISTS `role_menu` (
    `id`        BIGINT AUTO_INCREMENT PRIMARY KEY,
    `role_id`   BIGINT NOT NULL COMMENT '角色 ID',
    `menu_id`   BIGINT NOT NULL COMMENT '選單 ID',
    UNIQUE KEY `uk_role_menu` (`role_id`, `menu_id`),
    KEY `idx_role_id` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色-選單關聯';

-- ──────────────────────────────────────────────
-- 供給方
-- ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `provider` (
    `id`              BIGINT AUTO_INCREMENT PRIMARY KEY,
    `provider_uuid`   VARCHAR(36)  NOT NULL COMMENT 'UUID（前台用）',
    `provider_type`   VARCHAR(20)  NOT NULL COMMENT '供給方類型（PHOTOGRAPHER/STYLIST/STUDIO）',
    `name`            VARCHAR(100) NOT NULL COMMENT '姓名/名稱',
    `nick_name`       VARCHAR(100)          COMMENT '暱稱',
    `nick_name_en`    VARCHAR(100)          COMMENT '暱稱（英）',
    `nick_name_jp`    VARCHAR(100)          COMMENT '暱稱（日）',
    `nick_name_kr`    VARCHAR(100)          COMMENT '暱稱（韓）',
    `phone`           VARCHAR(20)           COMMENT '電話',
    `email`           VARCHAR(255)          COMMENT 'Email',
    `city`            VARCHAR(50)           COMMENT '縣市',
    `district_name`   VARCHAR(50)           COMMENT '鄉鎮區',
    `address`         VARCHAR(255)          COMMENT '地址',
    `addr_lng`        DOUBLE                COMMENT '經度',
    `addr_lat`        DOUBLE                COMMENT '緯度',
    `avatar`          VARCHAR(255)          COMMENT '大頭照 URL',
    `banner_img`      VARCHAR(255)          COMMENT '代表圖 URL',
    `intro`           TEXT                  COMMENT '介紹',
    `intro_en`        TEXT                  COMMENT '介紹（英）',
    `intro_jp`        TEXT                  COMMENT '介紹（日）',
    `intro_kr`        TEXT                  COMMENT '介紹（韓）',
    `rating`          DECIMAL(2,1) DEFAULT 0.0 COMMENT '評價',
    `go_live`         VARCHAR(1)   DEFAULT 'N' COMMENT '上架狀態（Y/N）',
    `service_item`    VARCHAR(255)          COMMENT '服務項目（逗號分隔 ID）',
    `violation_count` INT          DEFAULT 0 COMMENT '違規次數',
    `violation_level` VARCHAR(20)  DEFAULT 'NONE' COMMENT '違規等級',
    `review_status`   VARCHAR(20)  DEFAULT 'PENDING' COMMENT '審核狀態',
    `created_at`      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_at`     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_provider_uuid` (`provider_uuid`),
    KEY `idx_provider_type` (`provider_type`),
    KEY `idx_phone` (`phone`),
    KEY `idx_go_live` (`go_live`),
    KEY `idx_city` (`city`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='供給方';

-- ──────────────────────────────────────────────
-- 初始角色資料
-- ──────────────────────────────────────────────

INSERT INTO `role` (`name`, `eng_name`, `description`) VALUES
    ('消費者',     'CONSUMER',        '一般消費者'),
    ('攝影師',     'PHOTOGRAPHER',    '攝影供給方'),
    ('造型師',     'STYLIST',         '造型供給方'),
    ('攝影棚管理者', 'STUDIO_MANAGER',  '攝影棚供給方'),
    ('平台營運',   'ADMIN',           '平台管理員'),
    ('客服',       'SUPPORT',         '客服人員'),
    ('財務',       'FINANCE',         '財務人員'),
    ('外包修圖',   'RETOUCH_COMPANY', '外包修圖公司')
ON DUPLICATE KEY UPDATE `modified_at` = NOW();

SET FOREIGN_KEY_CHECKS = 1;