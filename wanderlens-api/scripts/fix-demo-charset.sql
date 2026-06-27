-- 修復示範資料 UTF-8 亂碼
--
-- 背景：user / provider / attraction_post 等表的中文欄位在早期寫入時，
-- 因連線字元集未使用 utf8mb4，導致中文被替換成字面 '?'（HEX 0x3F），
-- 原始值已不可逆復原。以下以正確 utf8mb4 重新賦值（為合理示範資料，
-- 非原始內容）。比照 V012__fix_charset_reseed.sql 的修復模式，以 id 對應更新。

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- 使用者顯示名稱
UPDATE `user` SET `username` = '系統管理員'   WHERE `id` = 1 AND `username` LIKE '%?%';
UPDATE `user` SET `username` = '示範攝影師'   WHERE `id` = 2 AND `username` LIKE '%?%';
UPDATE `user` SET `username` = '示範修圖師'   WHERE `id` = 3 AND `username` LIKE '%?%';
UPDATE `user` SET `username` = '示範消費者'   WHERE `id` = 4 AND `username` LIKE '%?%';

-- 供給方（攝影師）
UPDATE `provider`
SET `name` = '示範攝影師', `nick_name` = '小攝', `city` = '臺北市'
WHERE `id` = 1;

-- 熱門拍攝地點
UPDATE `attraction_post` SET `name` = '台北101觀景台',   `area` = '臺北市' WHERE `id` = 1;
UPDATE `attraction_post` SET `name` = '象山步道',        `area` = '臺北市' WHERE `id` = 2;
UPDATE `attraction_post` SET `name` = '淡水漁人碼頭',    `area` = '新北市' WHERE `id` = 3;
