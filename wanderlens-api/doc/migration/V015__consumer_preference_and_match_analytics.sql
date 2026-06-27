-- S3-003 消費者偏好 + S3-010 媒合分析事件

CREATE TABLE IF NOT EXISTS consumer_preference (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    preferred_service_type_ids VARCHAR(255) NULL COMMENT '逗號分隔 serviceTypeId',
    preferred_cities VARCHAR(500) NULL COMMENT '逗號分隔城市',
    budget_min INT NULL,
    budget_max INT NULL,
    push_recall_enabled TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS match_event (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    request_id BIGINT NULL,
    event_type VARCHAR(50) NOT NULL COMMENT 'REQUEST_CREATED|BROADCAST|ACCEPT|DECLINE|TIMEOUT|FALLBACK|PAYMENT',
    consumer_id BIGINT NULL,
    provider_id BIGINT NULL,
    city VARCHAR(100) NULL,
    service_type_id BIGINT NULL,
    metadata JSON NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    KEY idx_event_type (event_type),
    KEY idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
