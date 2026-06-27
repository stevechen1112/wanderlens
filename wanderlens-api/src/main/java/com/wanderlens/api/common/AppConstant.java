package com.wanderlens.api.common;

/**
 * 應用常數
 */
public final class AppConstant {

    private AppConstant() {}

    /** 平台/system 參與者 ID（客服/管理通道 participantA） */
    public static final long PLATFORM_USER_ID = 0L;

    // ── 角色 ──
    public static final String ROLE_CONSUMER = "CONSUMER";
    public static final String ROLE_PHOTOGRAPHER = "PHOTOGRAPHER";
    public static final String ROLE_STYLIST = "STYLIST";
    public static final String ROLE_STUDIO_MANAGER = "STUDIO_MANAGER";
    public static final String ROLE_ADMIN = "ADMIN";
    public static final String ROLE_SUPPORT = "SUPPORT";
    public static final String ROLE_FINANCE = "FINANCE";
    public static final String ROLE_RETOUCH_COMPANY = "RETOUCH_COMPANY";

    // ── 供給方類型 ──
    public static final String PROVIDER_TYPE_PHOTOGRAPHER = "PHOTOGRAPHER";
    public static final String PROVIDER_TYPE_STYLIST = "STYLIST";
    public static final String PROVIDER_TYPE_STUDIO = "STUDIO";

    // ── 訂單狀態 ──
    public static final String ORDER_DRAFT = "Draft";
    public static final String ORDER_PENDING_PAYMENT = "PendingPayment";
    public static final String ORDER_PAID = "Paid";
    public static final String ORDER_WAITING_PROVIDER_CONTACT = "WaitingProviderContact";
    public static final String ORDER_CONFIRMED = "Confirmed";
    public static final String ORDER_READY_TO_SHOOT = "ReadyToShoot";
    public static final String ORDER_SHOOTING_STARTED = "ShootingStarted";
    public static final String ORDER_SHOOTING_ENDED = "ShootingEnded";
    public static final String ORDER_UPLOADING_RAW = "UploadingRaw";
    public static final String ORDER_AI_PROCESSING = "AiProcessing";
    public static final String ORDER_DELIVERED = "Delivered";
    public static final String ORDER_RETOUCH_REQUESTED = "RetouchRequested";
    public static final String ORDER_RETOUCHING = "Retouching";
    public static final String ORDER_RETOUCH_DELIVERED = "RetouchDelivered";
    public static final String ORDER_CLOSED = "Closed";
    public static final String ORDER_REMATCHING = "Rematching";
    public static final String ORDER_RESCHEDULED = "Rescheduled";
    public static final String ORDER_DISPUTED = "Disputed";
    public static final String ORDER_REFUNDED = "Refunded";
    public static final String ORDER_CANCELLED = "Cancelled";

    // ── 溝通室類型 ──
    public static final String CONVERSATION_TYPE_ADMIN = "ADMIN";
    public static final String CONVERSATION_TYPE_CUSTOMER_SERVICE = "CUSTOMER_SERVICE";
    public static final String CONVERSATION_TYPE_ORDER = "ORDER";

    // ── 溝通室狀態 ──
    public static final String CONVERSATION_STATUS_OPEN = "OPEN";
    public static final String CONVERSATION_STATUS_READONLY = "READONLY";
    public static final String CONVERSATION_STATUS_CLOSED = "CLOSED";

    // ── 訊息類型 ──
    public static final String MESSAGE_TYPE_TEXT = "TEXT";
    public static final String MESSAGE_TYPE_IMAGE = "IMAGE";
    public static final String MESSAGE_TYPE_SYSTEM = "SYSTEM";
    public static final String MESSAGE_TYPE_TEMPLATE = "TEMPLATE";

    // ── 媒體資產類型 ──
    public static final String ASSET_TYPE_RAW = "RAW";
    public static final String ASSET_TYPE_JPEG = "JPEG";
    public static final String ASSET_TYPE_AI_BASIC = "AI_BASIC";
    public static final String ASSET_TYPE_RETOUCH = "RETOUCH";

    // ── Redis Key 前綴 ──
    public static final String REDIS_LOCK_PREFIX = "lock:availability:";
    public static final String REDIS_ORDER_PREFIX = "order:pending:";
    public static final String REDIS_CACHE_PREFIX = "cache:";
    public static final String REDIS_SCHEDULER_LOCK_PREFIX = "lock:scheduler:";

    // ── 時段 ──
    public static final int SLOT_LOCK_TTL_SECONDS = 600; // 時段鎖定 TTL：10 分鐘
    public static final int CONTACT_DEADLINE_HOURS = 24; // 攝影師聯繫期限
    public static final int RAW_UPLOAD_DEADLINE_HOURS = 24; // RAW 上傳期限
    public static final int AI_DELIVERY_SLA_HOURS = 48; // AI 交付 SLA
}