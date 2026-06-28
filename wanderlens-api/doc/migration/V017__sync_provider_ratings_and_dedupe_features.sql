-- 全量同步 provider.rating 與 provider_rating 平均（與 ratingSummary 一致）
UPDATE `provider` p
LEFT JOIN (
  SELECT `provider_id`, ROUND(AVG(`stars`), 1) AS `avg_rating`
  FROM `provider_rating`
  GROUP BY `provider_id`
) r ON r.`provider_id` = p.`id`
SET p.`rating` = COALESCE(r.`avg_rating`, 0.0);

-- 攝影特色：同 provider + 語系 + 類型僅保留 id 最小的一筆
DELETE pf FROM `provider_feature` pf
INNER JOIN (
  SELECT `provider_id`, `language`, `feature_type`, MIN(`id`) AS `keep_id`
  FROM `provider_feature`
  GROUP BY `provider_id`, `language`, `feature_type`
  HAVING COUNT(*) > 1
) dup ON pf.`provider_id` = dup.`provider_id`
  AND pf.`language` = dup.`language`
  AND pf.`feature_type` = dup.`feature_type`
  AND pf.`id` <> dup.`keep_id`;
