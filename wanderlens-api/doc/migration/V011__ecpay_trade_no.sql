-- V011: 綠界交易編號（退款用）

ALTER TABLE `order`
    ADD COLUMN `ecpay_trade_no` VARCHAR(32) NULL COMMENT '綠界 TradeNo' AFTER `payment_method`;
