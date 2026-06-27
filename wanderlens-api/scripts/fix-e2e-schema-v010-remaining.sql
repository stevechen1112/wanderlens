ALTER TABLE `order` ADD COLUMN ecpay_trade_no VARCHAR(32) NULL AFTER payment_method;
ALTER TABLE `order` ADD COLUMN source_country VARCHAR(8) NULL AFTER manual_order;
ALTER TABLE `order` ADD COLUMN referral_code VARCHAR(32) NULL AFTER source_country;
