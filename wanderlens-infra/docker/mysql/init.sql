-- WanderLens 資料庫初始化
-- 建立資料庫與基礎權限

CREATE DATABASE IF NOT EXISTS wanderlens_db
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

-- wanderlens 用戶權限由 docker-compose 環境變數自動處理
-- 這裡僅確保資料庫存在且字符集正確

USE wanderlens_db;