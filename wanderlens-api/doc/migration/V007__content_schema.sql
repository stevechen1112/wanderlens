-- WanderLens Schema Migration V007
-- 相簿、內容、媒體資產相關資料表

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ── 相簿 ──
CREATE TABLE IF NOT EXISTS `album` (
    `id`              BIGINT AUTO_INCREMENT PRIMARY KEY,
    `order_id`        BIGINT                COMMENT '訂單 ID',
    `consumer_id`     BIGINT       NOT NULL COMMENT '消費者 ID',
    `photographer_id` BIGINT                COMMENT '攝影師 ID',
    `title`           VARCHAR(255)          COMMENT '相簿標題',
    `shoot_date`      DATE                  COMMENT '拍攝日期',
    `shoot_location`  VARCHAR(255)          COMMENT '拍攝地點',
    `city`            VARCHAR(50)           COMMENT '城市',
    `service_type_id` BIGINT                COMMENT '拍攝類型 ID',
    `album_type`      VARCHAR(20)  DEFAULT 'PRIVATE' COMMENT 'PRIVATE/PUBLIC',
    `created_at`      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_at`     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY `idx_consumer_id` (`consumer_id`),
    KEY `idx_order_id` (`order_id`),
    KEY `idx_album_type` (`album_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='相簿';

-- ── 媒體資產 ──
CREATE TABLE IF NOT EXISTS `media_asset` (
    `id`            BIGINT AUTO_INCREMENT PRIMARY KEY,
    `album_id`      BIGINT                COMMENT '相簿 ID',
    `order_id`      BIGINT                COMMENT '訂單 ID',
    `asset_type`    VARCHAR(20)  NOT NULL COMMENT 'RAW/JPEG/AI_BASIC/RETOUCH',
    `file_url`      VARCHAR(500)          COMMENT '檔案 URL',
    `preview_url`   VARCHAR(500)          COMMENT '預覽圖 URL',
    `thumbnail_url` VARCHAR(500)          COMMENT '縮圖 URL',
    `file_size`     BIGINT                COMMENT '檔案大小',
    `mime_type`     VARCHAR(50)           COMMENT 'MIME 類型',
    `status`        VARCHAR(20)  DEFAULT 'UPLOADING' COMMENT 'UPLOADING/UPLOADED/PROCESSING/READY/FAILED',
    `created_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY `idx_album_id` (`album_id`),
    KEY `idx_order_id` (`order_id`),
    KEY `idx_asset_type` (`asset_type`),
    KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='媒體資產';

-- ── 授權 ──
CREATE TABLE IF NOT EXISTS `consent` (
    `id`                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    `media_asset_id`      BIGINT                COMMENT '媒體資產 ID',
    `album_id`            BIGINT                COMMENT '相簿 ID',
    `consumer_consent`    VARCHAR(20)           COMMENT '消費者授權層級',
    `provider_consent`    VARCHAR(20)           COMMENT '攝影師授權層級',
    `consent_by_consumer` TINYINT(1) DEFAULT 0  COMMENT '消費者已同意',
    `consent_by_provider` TINYINT(1) DEFAULT 0  COMMENT '攝影師已同意',
    `has_minor`           TINYINT(1) DEFAULT 0  COMMENT '含未成年人',
    `revoked_at`          DATETIME              COMMENT '撤回時間',
    `created_at`          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_at`         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY `idx_album_id` (`album_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='授權';

-- ── 場景標籤 ──
CREATE TABLE IF NOT EXISTS `scene_tag` (
    `id`             BIGINT AUTO_INCREMENT PRIMARY KEY,
    `album_id`       BIGINT       NOT NULL COMMENT '相簿 ID',
    `media_asset_id` BIGINT                COMMENT '媒體資產 ID',
    `tag_category`   VARCHAR(30)  NOT NULL COMMENT '標籤類別',
    `tag_value`      VARCHAR(100) NOT NULL COMMENT '標籤值',
    `tag_source`     VARCHAR(20)           COMMENT '標籤來源',
    `created_at`     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY `idx_album_id` (`album_id`),
    KEY `idx_tag_category` (`tag_category`, `tag_value`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='場景標籤';

-- ── 行為事件 ──
CREATE TABLE IF NOT EXISTS `behavior_event` (
    `id`             BIGINT AUTO_INCREMENT PRIMARY KEY,
    `event_type`     VARCHAR(50)  NOT NULL COMMENT '事件類型',
    `user_id`        BIGINT                COMMENT '使用者 ID',
    `album_id`       BIGINT                COMMENT '相簿 ID',
    `media_asset_id` BIGINT                COMMENT '媒體資產 ID',
    `metadata`       TEXT                  COMMENT '附加資料（JSON）',
    `created_at`     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY `idx_user_id` (`user_id`, `event_type`, `created_at`),
    KEY `idx_album_id` (`album_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='行為事件';

-- ── 區域 ──
CREATE TABLE IF NOT EXISTS `area` (
    `id`          BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name`        VARCHAR(100) NOT NULL COMMENT '區域名稱',
    `name_en`     VARCHAR(100)          COMMENT '英',
    `name_jp`     VARCHAR(100)          COMMENT '日',
    `name_kr`     VARCHAR(100)          COMMENT '韓',
    `parent_id`   BIGINT                COMMENT '父區域 ID',
    `image_uuid`  VARCHAR(36)           COMMENT '特色圖 UUID',
    `min_hour`    INT          DEFAULT 1 COMMENT '最低拍攝時數',
    `zip_code`    VARCHAR(10)           COMMENT '郵遞區號',
    `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='行政區域';

-- ── Banner ──
CREATE TABLE IF NOT EXISTS `banner` (
    `id`          BIGINT AUTO_INCREMENT PRIMARY KEY,
    `language`    VARCHAR(5)            COMMENT '語系',
    `image_uuid`  VARCHAR(36)           COMMENT '圖片 UUID',
    `image_usage` VARCHAR(50)           COMMENT '用途（banner_desktop/banner_mobile/homepage_hero）',
    `active`      VARCHAR(1)   DEFAULT 'Y' COMMENT 'Y/N',
    `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Banner';

-- ── News ──
CREATE TABLE IF NOT EXISTS `news` (
    `id`          BIGINT AUTO_INCREMENT PRIMARY KEY,
    `language`    VARCHAR(5)            COMMENT '語系',
    `topic`       VARCHAR(255)          COMMENT '公告主題',
    `status`      VARCHAR(10)  DEFAULT 'on' COMMENT 'on/off',
    `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='公告';

-- ── FAQ ──
CREATE TABLE IF NOT EXISTS `faq` (
    `id`          BIGINT AUTO_INCREMENT PRIMARY KEY,
    `language`    VARCHAR(5)            COMMENT '語系',
    `question`    VARCHAR(500) NOT NULL COMMENT '問題',
    `answer`      TEXT         NOT NULL COMMENT '答案',
    `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='FAQ';

-- ── 景點文章 ──
CREATE TABLE IF NOT EXISTS `attraction_post` (
    `id`          BIGINT AUTO_INCREMENT PRIMARY KEY,
    `language`    VARCHAR(5)            COMMENT '語系',
    `area`        VARCHAR(50)           COMMENT '區域',
    `name`        VARCHAR(100)          COMMENT '景點名稱',
    `image_uuid`  VARCHAR(36)           COMMENT '圖片 UUID',
    `post_url`    VARCHAR(500)          COMMENT '文章 URL',
    `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='景點文章';

-- ── IG 貼文 ──
CREATE TABLE IF NOT EXISTS `instagram_post` (
    `id`           BIGINT AUTO_INCREMENT PRIMARY KEY,
    `ig_image_uuid` VARCHAR(36)          COMMENT 'IG 圖片 UUID',
    `ig_url`       VARCHAR(500)          COMMENT 'IG 連結',
    `title`        VARCHAR(255)          COMMENT '標題',
    `created_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='IG 貼文';

-- ── 檔案儲存 ──
CREATE TABLE IF NOT EXISTS `file_repo` (
    `id`          BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name`        VARCHAR(255)          COMMENT '檔名',
    `type`        VARCHAR(50)           COMMENT 'MIME 類型',
    `size`        BIGINT                COMMENT '檔案大小',
    `url`         VARCHAR(500)          COMMENT 'URL',
    `uuid`        VARCHAR(36)  NOT NULL COMMENT 'UUID',
    `file_usage`  VARCHAR(50)           COMMENT '用途',
    `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_uuid` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='檔案儲存';

SET FOREIGN_KEY_CHECKS = 1;