

ALTER TABLE service_cat ADD COLUMN name_en VARCHAR(255);
ALTER TABLE service_cat ADD COLUMN name_jp VARCHAR(255);
ALTER TABLE service_cat ADD COLUMN name_kr VARCHAR(255);

ALTER TABLE faq ADD COLUMN language VARCHAR(5);
UPDATE faq SET language = 'tw';

ALTER TABLE news ADD COLUMN language VARCHAR(5);
UPDATE news SET language = 'tw';

ALTER TABLE attraction_post ADD COLUMN language VARCHAR(5);
UPDATE attraction_post SET language = 'tw';

ALTER TABLE photographer ADD COLUMN name_en VARCHAR(255);
ALTER TABLE photographer ADD COLUMN name_jp VARCHAR(255);
ALTER TABLE photographer ADD COLUMN name_kr VARCHAR(255);
ALTER TABLE photographer ADD COLUMN nick_name_en VARCHAR(255);
ALTER TABLE photographer ADD COLUMN nick_name_jp VARCHAR(255);
ALTER TABLE photographer ADD COLUMN nick_name_kr VARCHAR(255);
ALTER TABLE photographer ADD COLUMN intro_en VARCHAR(1500);
ALTER TABLE photographer ADD COLUMN intro_jp VARCHAR(1500);
ALTER TABLE photographer ADD COLUMN intro_kr VARCHAR(1500);

ALTER TABLE dict ADD COLUMN value_en VARCHAR(255);
ALTER TABLE dict ADD COLUMN value_jp VARCHAR(255);
ALTER TABLE dict ADD COLUMN value_kr VARCHAR(255);

ALTER TABLE photographer_feature ADD COLUMN language VARCHAR(5);
UPDATE photographer_feature SET language = 'tw';

ALTER TABLE area ADD COLUMN name_en VARCHAR(255);
ALTER TABLE area ADD COLUMN name_jp VARCHAR(255);
ALTER TABLE area ADD COLUMN name_kr VARCHAR(255);

ALTER TABLE banner ADD COLUMN language VARCHAR(5);
UPDATE banner SET language = 'tw';


