-- ──────────────────────────────────────────────
-- WanderLens 跨端整合示範資料
-- 目的：讓「Web 公開相簿 / 景點」「消費者 App 相簿+訂單+對話」「攝影師 App 訂單+對話+收益」
--      三端共用同一份後端資料，驗證系統整合。
--
-- id 慣例（以運行中 DB 實測）：
--   user.id=4  消費者 consumer1（消費者端 JWT userId）
--   user.id=2  攝影師 photographer1（攝影師端 JWT userId）
--   provider.id=1 攝影師供給方（order.photographer_id / album.photographer_id 用此）
--
-- 套用：docker cp 進容器後 mysql < 本檔
-- 可重複執行（先依標記刪除舊示範資料）
-- ──────────────────────────────────────────────
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ── 清除舊示範資料（冪等） ──
DELETE FROM media_asset
 WHERE order_id IN (SELECT id FROM `order` WHERE order_no LIKE 'DEMO-%');
DELETE FROM message
 WHERE conversation_id IN (
   SELECT id FROM conversation
    WHERE order_id IN (SELECT id FROM `order` WHERE order_no LIKE 'DEMO-%')
 );
DELETE FROM conversation
 WHERE order_id IN (SELECT id FROM `order` WHERE order_no LIKE 'DEMO-%');
DELETE FROM album
 WHERE consumer_id = 4 AND photographer_id = 1 AND album_type = 'PUBLIC';
DELETE FROM `order` WHERE order_no LIKE 'DEMO-%';

-- ── 訂單（consumer_id=4 / photographer_id=provider.id=1） ──
INSERT INTO `order`
 (order_no, consumer_id, photographer_id, service_type_id,
  service_fee, unit_price, transportation_fee, total_fee, photographer_profit,
  status, payment_method, customer_name, customer_phone, email,
  shooting_date, shooting_time, shooting_duration, shooting_location,
  adult_num, child_num, pic_num, created_at)
VALUES
 ('DEMO-0001', 4, 1, 1, 3500, 1500, 0, 6500, 5200,
  'WaitingProviderContact', 'CreditCard', '示範消費者', '0912345678', 'consumer1@wanderlens.test',
  '2026-07-05', '14:00 - 16:00', 2.0, '台北101 觀景台',
  2, 0, 50, '2026-06-24 10:12:00'),
 ('DEMO-0002', 4, 1, 2, 4200, 1800, 200, 8000, 6400,
  'ReadyToShoot', 'CreditCard', '示範消費者', '0912345678', 'consumer1@wanderlens.test',
  '2026-07-12', '09:30 - 12:00', 2.5, '陽明山 擎天崗',
  2, 1, 80, '2026-06-22 16:40:00'),
 ('DEMO-0003', 4, 1, 1, 3500, 1500, 0, 6500, 5200,
  'Delivered', 'CreditCard', '示範消費者', '0912345678', 'consumer1@wanderlens.test',
  '2026-06-10', '16:00 - 18:00', 2.0, '淡水漁人碼頭',
  2, 0, 60, '2026-06-08 09:00:00'),
 ('DEMO-FFL', 4, 1, 2, 4200, 1800, 200, 8000, 6400,
  'ReadyToShoot', 'CreditCard', '示範消費者', '0912345678', 'consumer1@wanderlens.test',
  '2026-07-20', '10:00 - 12:00', 2.0, '陽明山 擎天崗 E2E',
  2, 0, 40, '2026-06-27 08:00:00');

SET @o1 = (SELECT id FROM `order` WHERE order_no = 'DEMO-0001');
SET @o3 = (SELECT id FROM `order` WHERE order_no = 'DEMO-0003');

-- ── 公開相簿（consumer_id=4 / photographer_id=1 / PUBLIC） ──
-- 同時出現在：Web 公開相簿、消費者 App「我的相簿」、消費者首頁精選
INSERT INTO album
 (order_id, consumer_id, photographer_id, title, shoot_date, shoot_location, city, service_type_id, album_type, created_at)
VALUES
 (@o3,  4, 1, '台北101 城市寫真', '2026-06-10', '台北101 觀景台', '臺北市', 1, 'PUBLIC', '2026-06-12 11:00:00'),
 (NULL, 4, 1, '陽明山 自然光人像', '2026-05-20', '陽明山 擎天崗', '臺北市', 2, 'PUBLIC', '2026-05-22 11:00:00'),
 (NULL, 4, 1, '淡水 黃昏婚紗',   '2026-05-05', '淡水漁人碼頭',  '新北市', 3, 'PUBLIC', '2026-05-07 11:00:00'),
 (NULL, 4, 1, '九份 老街旅拍',   '2026-04-18', '九份老街',      '新北市', 1, 'PUBLIC', '2026-04-20 11:00:00');

-- ── 訂單溝通室（participant_a=消費者 user 4 / participant_b=攝影師 user 2） ──
INSERT INTO conversation
 (conversation_type, order_id, participant_a_id, participant_b_id, status, created_at)
VALUES
 ('ORDER', @o1, 4, 2, 'OPEN', '2026-06-24 10:13:00');

SET @c1 = (SELECT id FROM conversation WHERE order_id = @o1 AND conversation_type = 'ORDER' LIMIT 1);

-- ── 對話訊息 ──
INSERT INTO message
 (conversation_id, sender_id, message_type, content, is_read, created_at)
VALUES
 (@c1, 0, 'SYSTEM', '訂單已成立，供給方請於 24 小時內主動聯繫客戶確認拍攝細節。', 1, '2026-06-24 10:13:00'),
 (@c1, 2, 'TEXT',   '您好，我是您這次拍攝的攝影師，想先跟您確認當天的集合地點與時間。', 1, '2026-06-24 10:25:00'),
 (@c1, 4, 'TEXT',   '您好！想約在台北101 一樓大廳，下午兩點方便嗎？', 1, '2026-06-24 10:31:00'),
 (@c1, 2, 'TEXT',   '沒問題，當天我會提早 15 分鐘到，並帶上廣角與定焦兩顆鏡頭，期待與您合作！', 0, '2026-06-24 10:34:00');

SET @album3 = (SELECT id FROM album WHERE order_id = @o3 LIMIT 1);

-- ── 相簿照片（DEMO-0003 已交付相簿，供 album-flow PhotoViewer／收藏） ──
INSERT INTO media_asset
 (album_id, order_id, asset_type, file_url, preview_url, thumbnail_url, status, mime_type, created_at)
VALUES
 (@album3, @o3, 'AI_BASIC',
  'https://picsum.photos/seed/wl-demo-1/1200/800',
  'https://picsum.photos/seed/wl-demo-1/800/600',
  'https://picsum.photos/seed/wl-demo-1/200/150',
  'READY', 'image/jpeg', '2026-06-12 12:00:00'),
 (@album3, @o3, 'AI_BASIC',
  'https://picsum.photos/seed/wl-demo-2/1200/800',
  'https://picsum.photos/seed/wl-demo-2/800/600',
  'https://picsum.photos/seed/wl-demo-2/200/150',
  'READY', 'image/jpeg', '2026-06-12 12:01:00');

SET FOREIGN_KEY_CHECKS = 1;

-- ── 結果檢視 ──
SELECT '訂單' AS t, order_no, status, total_fee FROM `order` WHERE order_no LIKE 'DEMO-%';
SELECT '相簿' AS t, id, title, city, album_type FROM album WHERE consumer_id = 4 AND album_type = 'PUBLIC';
SELECT '對話' AS t, id, order_id, participant_a_id, participant_b_id FROM conversation WHERE order_id = @o1;
SELECT '訊息數' AS t, COUNT(*) AS n FROM message WHERE conversation_id = @c1;
