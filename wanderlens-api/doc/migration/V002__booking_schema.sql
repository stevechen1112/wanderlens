-- WanderLens Schema Migration V002
-- 預約與媒合相關資料表

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ──────────────────────────────────────────────
-- 拍攝類型
-- ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `service_type` (
    `id`               BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name`             VARCHAR(100) NOT NULL COMMENT '類型名稱',
    `name_en`          VARCHAR(100)          COMMENT '英',
    `name_jp`          VARCHAR(100)          COMMENT '日',
    `name_kr`          VARCHAR(100)          COMMENT '韓',
    `icon_url`         VARCHAR(255)          COMMENT '圖示 URL',
    `suggested_config` TEXT                  COMMENT '建議配置（JSON）',
    `sort_order`       INT          DEFAULT 0 COMMENT '排序',
    `active`           VARCHAR(1)   DEFAULT 'Y' COMMENT 'Y/N',
    `created_at`       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_at`      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='拍攝類型';

-- ──────────────────────────────────────────────
-- 拍攝配置
-- ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `configuration` (
    `id`                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    `shoot_location`      VARCHAR(20)  NOT NULL COMMENT 'OUTDOOR/STUDIO/BOTH',
    `photographer_count`  INT          NOT NULL DEFAULT 1 COMMENT '1 或 2',
    `need_stylist`        TINYINT(1)   NOT NULL DEFAULT 0 COMMENT '是否需要造型師',
    `label`               VARCHAR(100)          COMMENT '配置標籤'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='拍攝配置';

-- ──────────────────────────────────────────────
-- 供給方行事曆
-- ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `availability` (
    `id`                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    `provider_id`         BIGINT       NOT NULL COMMENT '供給方 ID',
    `schedule_date`       DATE         NOT NULL COMMENT '日期',
    `slot_start`          TIME         NOT NULL COMMENT '開始時間',
    `slot_end`            TIME         NOT NULL COMMENT '結束時間',
    `buffer_before`       INT          DEFAULT 0 COMMENT '前置緩衝（分鐘，造型師用）',
    `max_value`           INT          DEFAULT 1 COMMENT '可預約數',
    `active`              VARCHAR(1)   DEFAULT 'Y' COMMENT 'Y/N',
    `locked_by_order_id`  BIGINT                COMMENT '被訂單鎖定時的訂單 ID',
    `created_at`          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_at`         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY `idx_provider_date` (`provider_id`, `schedule_date`),
    KEY `idx_locked` (`locked_by_order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='供給方行事曆';

-- ──────────────────────────────────────────────
-- 供給方服務地區
-- ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `provider_area` (
    `id`              BIGINT AUTO_INCREMENT PRIMARY KEY,
    `provider_id`     BIGINT       NOT NULL COMMENT '供給方 ID',
    `area_parent_id`  BIGINT                COMMENT '父區域 ID',
    `area_id`         BIGINT       NOT NULL COMMENT '區域 ID',
    `zip_code`        VARCHAR(10)           COMMENT '郵遞區號',
    `created_at`      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_at`     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY `idx_provider_id` (`provider_id`),
    KEY `idx_area_id` (`area_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='供給方服務地區';

-- ──────────────────────────────────────────────
-- 供給方匯款資料
-- ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `provider_bank` (
    `id`           BIGINT AUTO_INCREMENT PRIMARY KEY,
    `provider_id`  BIGINT       NOT NULL COMMENT '供給方 ID',
    `bank_code`    VARCHAR(10)           COMMENT '銀行代碼',
    `bank_name`    VARCHAR(100)          COMMENT '銀行名稱',
    `bank_branch`  VARCHAR(100)          COMMENT '分行',
    `account_name` VARCHAR(100)          COMMENT '戶名',
    `account_no`   VARCHAR(50)           COMMENT '帳號',
    `note`         VARCHAR(255)          COMMENT '備註',
    `created_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY `idx_provider_id` (`provider_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='供給方匯款資料';

-- ──────────────────────────────────────────────
-- 供給方特色資料
-- ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `provider_feature` (
    `id`              BIGINT AUTO_INCREMENT PRIMARY KEY,
    `provider_id`     BIGINT       NOT NULL COMMENT '供給方 ID',
    `language`        VARCHAR(5)   NOT NULL COMMENT '語系（tw/en/jp/kr）',
    `feature_type`    VARCHAR(50)           COMMENT '特色類型',
    `feature_title`   VARCHAR(255)          COMMENT '特色標題',
    `feature_content` TEXT                  COMMENT '特色內容',
    `enable`          VARCHAR(1)   DEFAULT 'Y' COMMENT 'Y/N',
    `sort`            INT          DEFAULT 0 COMMENT '排序',
    `created_at`      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_at`     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY `idx_provider_id` (`provider_id`),
    KEY `idx_language` (`language`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='供給方特色資料';

-- ──────────────────────────────────────────────
-- 供給方作品集
-- ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `provider_works` (
    `id`           BIGINT AUTO_INCREMENT PRIMARY KEY,
    `provider_id`  BIGINT       NOT NULL COMMENT '供給方 ID',
    `file_uuid`    VARCHAR(36)  NOT NULL COMMENT '檔案 UUID',
    `sort_order`   INT          DEFAULT 0 COMMENT '排序',
    `created_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY `idx_provider_id` (`provider_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='供給方作品集';

-- ──────────────────────────────────────────────
-- 供給方評價
-- ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `provider_rating` (
    `id`           BIGINT AUTO_INCREMENT PRIMARY KEY,
    `provider_id`  BIGINT       NOT NULL COMMENT '供給方 ID',
    `order_id`     BIGINT                COMMENT '訂單 ID',
    `author`       VARCHAR(100)          COMMENT '評價者姓名',
    `stars`        INT          NOT NULL COMMENT '星等（1-5）',
    `comments`     TEXT                  COMMENT '評價內容',
    `created_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY `idx_provider_id` (`provider_id`),
    KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='供給方評價';

-- ──────────────────────────────────────────────
-- 初始拍攝類型資料
-- ──────────────────────────────────────────────

INSERT INTO `service_type` (`name`, `name_en`, `name_jp`, `name_kr`, `suggested_config`, `sort_order`, `active`) VALUES
    ('個人寫真',     'Personal Portrait',    '個人写真',      '개인 사진',    '{"shootLocation":"OUTDOOR","photographerCount":1,"needStylist":false}', 1, 'Y'),
    ('情侶寫真',     'Couple Portrait',      'カップル写真',  '커플 사진',    '{"shootLocation":"OUTDOOR","photographerCount":1,"needStylist":false}', 2, 'Y'),
    ('全家福',       'Family Portrait',      '家族写真',      '가족 사진',    '{"shootLocation":"OUTDOOR","photographerCount":1,"needStylist":false}', 3, 'Y'),
    ('寶寶寫真',     'Baby Portrait',        'ベビー写真',    '아기 사진',    '{"shootLocation":"STUDIO","photographerCount":1,"needStylist":false}',  4, 'Y'),
    ('孕婦寫真',     'Maternity Portrait',   'マタニティ写真', '임신 사진',    '{"shootLocation":"STUDIO","photographerCount":1,"needStylist":false}',  5, 'Y'),
    ('個人藝術寫真', 'Art Portrait',         'アート写真',    '아트 사진',    '{"shootLocation":"OUTDOOR","photographerCount":1,"needStylist":true}',  6, 'Y'),
    ('畢業寫真',     'Graduation Portrait',  '卒業写真',      '졸업 사진',    '{"shootLocation":"OUTDOOR","photographerCount":1,"needStylist":true}',  7, 'Y'),
    ('企業形象照',   'Corporate Portrait',   '企業写真',      '기업 사진',    '{"shootLocation":"STUDIO","photographerCount":1,"needStylist":true}',  8, 'Y'),
    ('活動紀錄',     'Event Photography',    'イベント記録',  '이벤트 기록',  '{"shootLocation":"OUTDOOR","photographerCount":1,"needStylist":false}', 9, 'Y'),
    ('婚禮',         'Wedding',              '結婚式',        '결혼식',       '{"shootLocation":"OUTDOOR","photographerCount":2,"needStylist":false}', 10, 'Y'),
    ('高規格婚禮',   'Premium Wedding',      'プレミアム結婚式','프리미엄 결혼식','{"shootLocation":"OUTDOOR","photographerCount":2,"needStylist":true}',  11, 'Y'),
    ('婚紗攝影',     'Pre-wedding',          'ウェディング',  '웨딩',         '{"shootLocation":"BOTH","photographerCount":1,"needStylist":true}',     12, 'Y'),
    ('空間攝影',     'Space Photography',    '空間写真',      '공간 사진',    '{"shootLocation":"OUTDOOR","photographerCount":1,"needStylist":false}', 13, 'Y')
ON DUPLICATE KEY UPDATE `modified_at` = NOW();

-- ──────────────────────────────────────────────
-- 初始配置資料
-- ──────────────────────────────────────────────

INSERT INTO `configuration` (`shoot_location`, `photographer_count`, `need_stylist`, `label`) VALUES
    ('OUTDOOR', 1, false, '外拍 + 單攝影師'),
    ('STUDIO',  1, false, '棚拍 + 單攝影師'),
    ('OUTDOOR', 1, true,  '外拍 + 單攝影師 + 造型師'),
    ('STUDIO',  1, true,  '棚拍 + 單攝影師 + 造型師'),
    ('OUTDOOR', 2, false, '外拍 + 雙攝影師'),
    ('OUTDOOR', 2, true,  '外拍 + 雙攝影師 + 造型師'),
    ('BOTH',    1, true,  '外拍 + 棚拍 + 單攝影師 + 造型師')
ON DUPLICATE KEY UPDATE `label` = VALUES(`label`);

SET FOREIGN_KEY_CHECKS = 1;