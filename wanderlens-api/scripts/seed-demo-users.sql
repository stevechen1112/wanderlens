-- WanderLens 示範帳號種子（密碼皆為 123456，BCrypt）
-- 可重複執行（依 empno 更新密碼與狀態）
SET NAMES utf8mb4;

-- BCrypt(123456) — 與 Spring BCryptPasswordEncoder 相容
SET @pwd = '$2b$10$4xlYwRCaTqc/K9B6yaCHm.Xmu9RAGM/zVFcJ0Ucb4662ejMjuWiFy';

-- 1) 營運後台 admin
INSERT INTO `user` (`empno`, `password`, `username`, `phone`, `email`, `role`, `status`)
VALUES ('admin', @pwd, '示範管理員', '0900000001', 'admin@wanderlens.test', 'ADMIN', 'ACTIVE')
ON DUPLICATE KEY UPDATE
  `password` = @pwd,
  `username` = VALUES(`username`),
  `role` = 'ADMIN',
  `status` = 'ACTIVE',
  `modified_at` = NOW();

-- 2) 消費者 consumer1
INSERT INTO `user` (`empno`, `password`, `username`, `phone`, `email`, `role`, `status`)
VALUES ('consumer1', @pwd, '示範消費者', '0912345678', 'consumer1@wanderlens.test', 'CONSUMER', 'ACTIVE')
ON DUPLICATE KEY UPDATE
  `password` = @pwd,
  `username` = VALUES(`username`),
  `role` = 'CONSUMER',
  `status` = 'ACTIVE',
  `modified_at` = NOW();

-- 3) 攝影師 provider + user photographer1
INSERT INTO `provider`
  (`provider_uuid`, `provider_type`, `name`, `nick_name`, `phone`, `email`, `city`, `go_live`, `service_item`, `review_status`)
SELECT '11111111-1111-1111-1111-111111111111', 'PHOTOGRAPHER', '示範攝影師', 'Lens 大師', '0923456789', 'photographer1@wanderlens.test', '臺北市', 'Y', '1,2,3', 'APPROVED'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `provider` WHERE `provider_uuid` = '11111111-1111-1111-1111-111111111111');

SET @provider_id = (SELECT id FROM `provider` WHERE `provider_uuid` = '11111111-1111-1111-1111-111111111111' LIMIT 1);

UPDATE `provider`
SET `career` = '全職攝影',
    `experience` = 5,
    `unit_price` = 1200,
    `intro` = COALESCE(`intro`, '專注人像與旅遊寫真，擅長自然光與街景氛圍。')
WHERE `id` = @provider_id;

INSERT INTO `user` (`empno`, `password`, `username`, `phone`, `email`, `role`, `provider_id`, `status`)
VALUES ('photographer1', @pwd, '示範攝影師', '0923456789', 'photographer1@wanderlens.test', 'PHOTOGRAPHER', @provider_id, 'ACTIVE')
ON DUPLICATE KEY UPDATE
  `password` = @pwd,
  `username` = VALUES(`username`),
  `role` = 'PHOTOGRAPHER',
  `provider_id` = @provider_id,
  `status` = 'ACTIVE',
  `modified_at` = NOW();

SELECT id, empno, username, role, provider_id, status FROM `user`
WHERE empno IN ('admin', 'consumer1', 'photographer1')
ORDER BY FIELD(role, 'ADMIN', 'CONSUMER', 'PHOTOGRAPHER'), empno;
