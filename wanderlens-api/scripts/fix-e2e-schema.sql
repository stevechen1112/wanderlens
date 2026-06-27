ALTER TABLE `order` ADD COLUMN second_photographer_id BIGINT NULL COMMENT '第二位攝影師（雙機）' AFTER photographer_id;
ALTER TABLE `order` ADD COLUMN ecpay_trade_no VARCHAR(32) NULL COMMENT '綠界 TradeNo' AFTER payment_method;
ALTER TABLE `order` ADD COLUMN source_country VARCHAR(8) NULL COMMENT '客源國 ISO 代碼' AFTER manual_order;
ALTER TABLE `order` ADD COLUMN referral_code VARCHAR(32) NULL COMMENT '推薦碼' AFTER source_country;

UPDATE availability a
INNER JOIN user u ON a.provider_id = u.id
SET a.provider_id = COALESCE(u.provider_id, u.id)
WHERE u.role = 'PHOTOGRAPHER'
  AND u.provider_id IS NOT NULL
  AND a.provider_id <> u.provider_id;
