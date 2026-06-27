-- 台灣行政區域種子（縣市 + 鄉鎮區，供接案地點 / BasicInfo 使用）
-- 可重複執行（依 id 更新名稱與 zip_code）
SET NAMES utf8mb4;

-- 縣市（parent_id = NULL）
INSERT INTO `area` (`id`, `name`, `name_en`, `parent_id`, `min_hour`, `zip_code`) VALUES
 (1,  '臺北市', 'Taipei City',       NULL, 2, NULL),
 (2,  '新北市', 'New Taipei City',   NULL, 2, NULL),
 (3,  '桃園市', 'Taoyuan City',      NULL, 2, NULL),
 (4,  '臺中市', 'Taichung City',     NULL, 2, NULL),
 (5,  '高雄市', 'Kaohsiung City',    NULL, 2, NULL),
 (6,  '臺南市', 'Tainan City',       NULL, 2, NULL)
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`), `name_en` = VALUES(`name_en`), `min_hour` = VALUES(`min_hour`), `modified_at` = NOW();

-- 臺北市
INSERT INTO `area` (`id`, `name`, `parent_id`, `min_hour`, `zip_code`) VALUES
 (101, '中正區', 1, 2, '100'),
 (102, '大同區', 1, 2, '103'),
 (103, '中山區', 1, 2, '104'),
 (104, '松山區', 1, 2, '105'),
 (105, '大安區', 1, 2, '106'),
 (106, '萬華區', 1, 2, '108'),
 (107, '信義區', 1, 2, '110'),
 (108, '士林區', 1, 2, '111'),
 (109, '北投區', 1, 2, '112'),
 (110, '內湖區', 1, 2, '114'),
 (111, '南港區', 1, 2, '115'),
 (112, '文山區', 1, 2, '116')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `parent_id` = VALUES(`parent_id`), `min_hour` = VALUES(`min_hour`), `zip_code` = VALUES(`zip_code`), `modified_at` = NOW();

-- 新北市
INSERT INTO `area` (`id`, `name`, `parent_id`, `min_hour`, `zip_code`) VALUES
 (201, '板橋區', 2, 2, '220'),
 (202, '三重區', 2, 2, '241'),
 (203, '中和區', 2, 2, '235'),
 (204, '永和區', 2, 2, '234'),
 (205, '新莊區', 2, 2, '242'),
 (206, '新店區', 2, 2, '231'),
 (207, '土城區', 2, 2, '236'),
 (208, '淡水區', 2, 2, '251'),
 (209, '汐止區', 2, 2, '221'),
 (210, '瑞芳區', 2, 2, '224')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `parent_id` = VALUES(`parent_id`), `min_hour` = VALUES(`min_hour`), `zip_code` = VALUES(`zip_code`), `modified_at` = NOW();

-- 桃園市
INSERT INTO `area` (`id`, `name`, `parent_id`, `min_hour`, `zip_code`) VALUES
 (301, '桃園區', 3, 2, '330'),
 (302, '中壢區', 3, 2, '320'),
 (303, '平鎮區', 3, 2, '324'),
 (304, '八德區', 3, 2, '334'),
 (305, '龜山區', 3, 2, '333')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `parent_id` = VALUES(`parent_id`), `min_hour` = VALUES(`min_hour`), `zip_code` = VALUES(`zip_code`), `modified_at` = NOW();

-- 臺中市
INSERT INTO `area` (`id`, `name`, `parent_id`, `min_hour`, `zip_code`) VALUES
 (401, '中區',   4, 2, '400'),
 (402, '西區',   4, 2, '403'),
 (403, '北區',   4, 2, '404'),
 (404, '南區',   4, 2, '402'),
 (405, '西屯區', 4, 2, '407')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `parent_id` = VALUES(`parent_id`), `min_hour` = VALUES(`min_hour`), `zip_code` = VALUES(`zip_code`), `modified_at` = NOW();

-- 高雄市
INSERT INTO `area` (`id`, `name`, `parent_id`, `min_hour`, `zip_code`) VALUES
 (501, '新興區', 5, 2, '800'),
 (502, '前金區', 5, 2, '801'),
 (503, '苓雅區', 5, 2, '802'),
 (504, '左營區', 5, 2, '813'),
 (505, '三民區', 5, 2, '807')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `parent_id` = VALUES(`parent_id`), `min_hour` = VALUES(`min_hour`), `zip_code` = VALUES(`zip_code`), `modified_at` = NOW();

-- 臺南市
INSERT INTO `area` (`id`, `name`, `parent_id`, `min_hour`, `zip_code`) VALUES
 (601, '中西區', 6, 2, '700'),
 (602, '東區',   6, 2, '701'),
 (603, '安平區', 6, 2, '708')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `parent_id` = VALUES(`parent_id`), `min_hour` = VALUES(`min_hour`), `zip_code` = VALUES(`zip_code`), `modified_at` = NOW();

SELECT COUNT(*) AS area_count FROM `area`;
