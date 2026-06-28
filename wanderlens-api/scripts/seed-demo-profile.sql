-- WanderLens 示範攝影師公開 profile 媒體與評價（可重複執行）
SET NAMES utf8mb4;

SET @provider_id = (SELECT id FROM `provider` WHERE `provider_uuid` = '11111111-1111-1111-1111-111111111111' LIMIT 1);

-- 若示範攝影師不存在則略過（請先執行 seed-demo-users.sql）
SELECT IF(@provider_id IS NULL, 'SKIP: demo provider not found', CONCAT('Seeding provider id=', @provider_id)) AS status;

-- 以下僅在 @provider_id 存在時執行
UPDATE `provider`
SET
  `avatar` = IF(@provider_id IS NULL, `avatar`, 'https://picsum.photos/seed/wl-lens-avatar/400/400'),
  `banner_img` = IF(@provider_id IS NULL, `banner_img`, 'https://picsum.photos/seed/wl-lens-banner/1600/600'),
  `intro` = IF(@provider_id IS NULL, `intro`, '專注人像與旅遊寫真，擅長自然光與街景氛圍。合作過上百組情侶、家庭與個人寫真，致力於捕捉真實情感與獨特光影。')
WHERE `id` = @provider_id AND @provider_id IS NOT NULL;

-- 攝影特色（冪等：示範帳號整批重置，避免舊 seed 殘留重複）
DELETE FROM `provider_feature`
 WHERE @provider_id IS NOT NULL AND `provider_id` = @provider_id;

INSERT INTO `provider_feature`
  (`provider_id`, `language`, `feature_type`, `feature_title`, `feature_content`, `enable`, `sort`)
SELECT @provider_id, 'tw', 'style', '風格', '自然光、街景隨拍、電影感色調', 'Y', 1 FROM DUAL WHERE @provider_id IS NOT NULL
UNION ALL SELECT @provider_id, 'tw', 'service', '服務', '含基本修圖、48 小時交件、可協助姿勢引導', 'Y', 2 FROM DUAL WHERE @provider_id IS NOT NULL
UNION ALL SELECT @provider_id, 'tw', 'equipment', '器材', '全片幅相機、35mm / 85mm 定焦鏡', 'Y', 3 FROM DUAL WHERE @provider_id IS NOT NULL;

-- 作品集（file_repo + provider_works）
DELETE pw FROM `provider_works` pw
 INNER JOIN `file_repo` fr ON fr.uuid = pw.file_uuid
 WHERE @provider_id IS NOT NULL AND pw.provider_id = @provider_id AND fr.name LIKE 'demo-lens-work-%';
DELETE FROM `file_repo` WHERE `name` LIKE 'demo-lens-work-%';

INSERT INTO `file_repo` (`name`, `type`, `size`, `url`, `uuid`, `file_usage`) VALUES
  ('demo-lens-work-1.jpg', 'image/jpeg', 0, 'https://picsum.photos/seed/wl-lens-w1/800/800', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'provider_works'),
  ('demo-lens-work-2.jpg', 'image/jpeg', 0, 'https://picsum.photos/seed/wl-lens-w2/800/800', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'provider_works'),
  ('demo-lens-work-3.jpg', 'image/jpeg', 0, 'https://picsum.photos/seed/wl-lens-w3/800/800', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'provider_works'),
  ('demo-lens-work-4.jpg', 'image/jpeg', 0, 'https://picsum.photos/seed/wl-lens-w4/800/800', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'provider_works'),
  ('demo-lens-work-5.jpg', 'image/jpeg', 0, 'https://picsum.photos/seed/wl-lens-w5/800/800', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'provider_works'),
  ('demo-lens-work-6.jpg', 'image/jpeg', 0, 'https://picsum.photos/seed/wl-lens-w6/800/800', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 'provider_works')
ON DUPLICATE KEY UPDATE `url` = VALUES(`url`);

INSERT INTO `provider_works` (`provider_id`, `file_uuid`, `sort_order`)
SELECT @provider_id, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 1 FROM DUAL
WHERE @provider_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM `provider_works` WHERE `provider_id` = @provider_id AND `file_uuid` = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1');
INSERT INTO `provider_works` (`provider_id`, `file_uuid`, `sort_order`)
SELECT @provider_id, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 2 FROM DUAL
WHERE @provider_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM `provider_works` WHERE `provider_id` = @provider_id AND `file_uuid` = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2');
INSERT INTO `provider_works` (`provider_id`, `file_uuid`, `sort_order`)
SELECT @provider_id, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 3 FROM DUAL
WHERE @provider_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM `provider_works` WHERE `provider_id` = @provider_id AND `file_uuid` = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3');
INSERT INTO `provider_works` (`provider_id`, `file_uuid`, `sort_order`)
SELECT @provider_id, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 4 FROM DUAL
WHERE @provider_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM `provider_works` WHERE `provider_id` = @provider_id AND `file_uuid` = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4');
INSERT INTO `provider_works` (`provider_id`, `file_uuid`, `sort_order`)
SELECT @provider_id, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 5 FROM DUAL
WHERE @provider_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM `provider_works` WHERE `provider_id` = @provider_id AND `file_uuid` = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5');
INSERT INTO `provider_works` (`provider_id`, `file_uuid`, `sort_order`)
SELECT @provider_id, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 6 FROM DUAL
WHERE @provider_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM `provider_works` WHERE `provider_id` = @provider_id AND `file_uuid` = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6');

-- 示範評價
DELETE FROM `provider_rating`
 WHERE @provider_id IS NOT NULL AND `provider_id` = @provider_id AND `author` IN ('小美', '阿哲', '家庭客');

INSERT INTO `provider_rating` (`provider_id`, `order_id`, `author`, `stars`, `comments`, `created_at`)
SELECT @provider_id, NULL, '小美', 5, '攝影師很會引導姿勢，照片自然又有質感，大推！', '2026-05-10 14:00:00' FROM DUAL WHERE @provider_id IS NOT NULL
UNION ALL SELECT @provider_id, NULL, '阿哲', 5, '交件速度快，色調是我喜歡的電影感，會再預約。', '2026-05-18 10:30:00' FROM DUAL WHERE @provider_id IS NOT NULL
UNION ALL SELECT @provider_id, NULL, '家庭客', 4, '全家福拍得很溫馨，小朋友也很有耐心，整體很滿意。', '2026-06-01 16:20:00' FROM DUAL WHERE @provider_id IS NOT NULL;

-- 依實際評價重算 provider.rating（與前台 ratingSummary 一致）
UPDATE `provider` p
SET p.`rating` = (
  SELECT ROUND(AVG(r.`stars`), 1) FROM `provider_rating` r WHERE r.`provider_id` = p.`id`
)
WHERE p.`id` = @provider_id AND @provider_id IS NOT NULL
  AND EXISTS (SELECT 1 FROM `provider_rating` r WHERE r.`provider_id` = @provider_id);

SELECT 'profile' AS t, nick_name, avatar IS NOT NULL AS has_avatar, banner_img IS NOT NULL AS has_banner, rating FROM `provider` WHERE @provider_id IS NOT NULL AND id = @provider_id;
SELECT 'works' AS t, COUNT(*) AS n FROM `provider_works` WHERE @provider_id IS NOT NULL AND provider_id = @provider_id;
SELECT 'ratings' AS t, COUNT(*) AS n FROM `provider_rating` WHERE @provider_id IS NOT NULL AND provider_id = @provider_id;