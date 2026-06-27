import { useI18n } from 'vue-i18n';
const TAG_TYPE_MAP = {
    WaitingProviderContact: 'warning',
    Confirmed: 'success',
    ReadyToShoot: 'primary',
    ShootingStarted: 'primary',
    ShootingEnded: 'info',
    UploadingRaw: 'info',
    AiProcessing: 'info',
    Delivered: 'success',
    Closed: 'success',
    Cancelled: 'danger',
    Disputed: 'danger',
};
export function useOrderStatus() {
    const { t } = useI18n();
    const statusLabel = (status) => t(`order.status.${status}`, status);
    const statusTagType = (status) => TAG_TYPE_MAP[status] || 'info';
    return { statusLabel, statusTagType };
}
//# sourceMappingURL=useOrderStatus.js.map