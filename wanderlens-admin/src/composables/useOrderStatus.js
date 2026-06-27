import { useI18n } from 'vue-i18n';
const TAG_TYPE_MAP = {
    PendingPayment: 'warning',
    Paid: 'success',
    WaitingProviderContact: 'warning',
    UploadingRaw: 'info',
    AiProcessing: 'info',
    Delivered: 'success',
    Closed: 'success',
    Cancelled: 'danger',
    Disputed: 'danger',
    Refunded: 'info',
};
export function useOrderStatus() {
    const { t } = useI18n();
    const statusLabel = (status) => t(`order.status.${status}`, status);
    const statusTagType = (status) => TAG_TYPE_MAP[status] || 'info';
    return { statusLabel, statusTagType };
}
//# sourceMappingURL=useOrderStatus.js.map