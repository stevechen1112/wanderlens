-- WanderLens Schema Migration V009
-- Phase 3: 相簿收藏

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS `album_favorite` (
    `id`              BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id`         BIGINT       NOT NULL COMMENT '使用者 ID',
    `album_id`        BIGINT       NOT NULL COMMENT '相簿 ID',
    `media_asset_id`  BIGINT                COMMENT '媒體資產 ID',
    `created_at`      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_user_album_asset` (`user_id`, `album_id`, `media_asset_id`),
    KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='相簿收藏';

SET FOREIGN_KEY_CHECKS = 1;