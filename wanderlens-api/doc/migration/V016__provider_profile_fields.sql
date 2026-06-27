-- 攝影師公開 profile 擴充欄位（對齊 Joyshot career/experience + 自訂單價）
ALTER TABLE provider
    ADD COLUMN career VARCHAR(50) NULL COMMENT '身份別（全職/兼職等）' AFTER intro_kr,
    ADD COLUMN experience DECIMAL(4,1) NULL COMMENT '攝影年資' AFTER career,
    ADD COLUMN unit_price INT NULL COMMENT '每小時單價（未設定則用平台預設）' AFTER experience;
