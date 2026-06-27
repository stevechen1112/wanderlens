-- S2-015 內部封測種子資料
-- 用途：為 E2E / 封測準備攝影師檔期、消費者偏好範例
-- 執行前請確認 migrations V013~V015 已套用
-- 測試帳號密碼預設為 123456（依實際環境調整 empno）

SET NAMES utf8mb4;

-- 1) 為封測攝影師建立未來 14 天可接案時段（10:00-18:00）
INSERT INTO availability (provider_id, schedule_date, slot_start, slot_end, buffer_before, max_value, active, locked_by_order_id, created_at, modified_at)
SELECT COALESCE(u.provider_id, u.id), d.schedule_date, '10:00:00', '18:00:00', 0, 1, 'Y', NULL, NOW(), NOW()
FROM user u
CROSS JOIN (
  SELECT DATE_ADD(CURDATE(), INTERVAL seq DAY) AS schedule_date
  FROM (
    SELECT 0 AS seq UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4
    UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9
    UNION SELECT 10 UNION SELECT 11 UNION SELECT 12 UNION SELECT 13
  ) days
) d
WHERE u.role = 'PHOTOGRAPHER'
  AND u.empno IN ('photographer1', 'photographer2', 'photographer3', 'beta_p01', 'beta_p02')
  AND NOT EXISTS (
    SELECT 1 FROM availability a
    WHERE a.provider_id = COALESCE(u.provider_id, u.id)
      AND a.schedule_date = d.schedule_date
      AND a.slot_start = '10:00:00'
      AND a.slot_end = '18:00:00'
  );

-- 2) 封測消費者偏好範例
INSERT INTO consumer_preference (user_id, preferred_service_type_ids, preferred_cities, budget_min, budget_max, push_recall_enabled, created_at, modified_at)
SELECT u.id, '1,2,3', '台北市,新北市', 3000, 15000, 1, NOW(), NOW()
FROM user u
WHERE u.role = 'CONSUMER'
  AND u.empno IN ('consumer1', 'beta_c01')
  AND NOT EXISTS (SELECT 1 FROM consumer_preference cp WHERE cp.user_id = u.id);

-- 3) 查詢封測帳號清單（執行後人工確認）
SELECT id, empno, username, role FROM user
WHERE empno IN ('consumer1','photographer1','photographer2','admin','beta_c01','beta_p01','beta_p02')
ORDER BY role, empno;
