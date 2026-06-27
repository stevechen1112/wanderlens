-- 修復 UTF-8 亂碼：重設 service_type 中文名稱
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

UPDATE `service_type` SET `name`='個人寫真',     `name_en`='Personal Portrait',    `name_jp`='個人写真',      `name_kr`='개인 사진'    WHERE `id`=1;
UPDATE `service_type` SET `name`='情侶寫真',     `name_en`='Couple Portrait',      `name_jp`='カップル写真',  `name_kr`='커플 사진'    WHERE `id`=2;
UPDATE `service_type` SET `name`='全家福',       `name_en`='Family Portrait',      `name_jp`='家族写真',      `name_kr`='가족 사진'    WHERE `id`=3;
UPDATE `service_type` SET `name`='寶寶寫真',     `name_en`='Baby Portrait',        `name_jp`='ベビー写真',    `name_kr`='아기 사진'    WHERE `id`=4;
UPDATE `service_type` SET `name`='孕婦寫真',     `name_en`='Maternity Portrait',   `name_jp`='マタニティ写真', `name_kr`='임신 사진'    WHERE `id`=5;
UPDATE `service_type` SET `name`='個人藝術寫真', `name_en`='Art Portrait',         `name_jp`='アート写真',    `name_kr`='아트 사진'    WHERE `id`=6;
UPDATE `service_type` SET `name`='畢業寫真',     `name_en`='Graduation Portrait',  `name_jp`='卒業写真',      `name_kr`='졸업 사진'    WHERE `id`=7;
UPDATE `service_type` SET `name`='企業形象照',   `name_en`='Corporate Portrait',   `name_jp`='企業写真',      `name_kr`='기업 사진'    WHERE `id`=8;
UPDATE `service_type` SET `name`='活動紀錄',     `name_en`='Event Photography',    `name_jp`='イベント記録',  `name_kr`='이벤트 기록'  WHERE `id`=9;
UPDATE `service_type` SET `name`='婚禮',         `name_en`='Wedding',              `name_jp`='結婚式',        `name_kr`='결혼식'       WHERE `id`=10;
UPDATE `service_type` SET `name`='高規格婚禮',   `name_en`='Premium Wedding',      `name_jp`='プレミアム結婚式', `name_kr`='프리미엄 결혼식' WHERE `id`=11;
UPDATE `service_type` SET `name`='婚紗攝影',     `name_en`='Pre-wedding',          `name_jp`='ウェディング',  `name_kr`='웨딩'         WHERE `id`=12;
UPDATE `service_type` SET `name`='空間攝影',     `name_en`='Space Photography',    `name_jp`='空間写真',      `name_kr`='공간 사진'    WHERE `id`=13;
