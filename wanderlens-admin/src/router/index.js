import { createRouter, createWebHistory } from 'vue-router';
// 角色權限對照表
const ROLE_PERMISSIONS = {
    ADMIN: ['*'], // 全部權限
    SUPPORT: ['Dashboard', 'OrderList', 'OrderDetail', 'PhotographerList', 'PhotographerDetail',
        'CustomerMaintain', 'DisputeList', 'ConversationAccess', 'SupportChat', 'RawVerify', 'AiMonitor', 'MatchMonitor',
        'ScheduleDashboard', 'Broadcast', 'FaqMaintain', 'NewsMaintain', 'BannerMaintain',
        'MarketSignalDashboard'],
    FINANCE: ['Dashboard', 'OrderList', 'OrderDetail', 'Ledger', 'Payout', 'Refund', 'CouponMaintain'],
    EDITOR: ['Dashboard', 'BannerMaintain', 'NewsMaintain', 'FaqMaintain',
        'AttractionMaintain', 'InstagramMaintain', 'PublicConsentReview',
        'AreaMaintain', 'ServiceTypeMaintain'],
};
function hasPermission(role, routeName) {
    const permissions = ROLE_PERMISSIONS[role] || [];
    if (permissions.includes('*'))
        return true;
    return permissions.includes(routeName);
}
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/login', name: 'Login', component: () => import('@/views/auth/Login.vue') },
        {
            path: '/',
            component: () => import('@/layouts/DefaultLayout.vue'),
            redirect: '/dashboard',
            children: [
                { path: 'dashboard', name: 'Dashboard', component: () => import('@/views/dashboard/Dashboard.vue') },
                { path: 'users', name: 'UserMaintain', component: () => import('@/views/users/UserMaintain.vue'), meta: { roles: ['ADMIN'] } },
                { path: 'roles', name: 'RoleMaintain', component: () => import('@/views/users/RoleMaintain.vue'), meta: { roles: ['ADMIN'] } },
                { path: 'menus', name: 'MenuMaintain', component: () => import('@/views/users/MenuMaintain.vue'), meta: { roles: ['ADMIN'] } },
                { path: 'photographers', name: 'PhotographerList', component: () => import('@/views/photographer/PhotographerList.vue') },
                { path: 'photographers/:id', name: 'PhotographerDetail', component: () => import('@/views/photographer/PhotographerDetail.vue') },
                { path: 'photographers/dashboard', name: 'ScheduleDashboard', component: () => import('@/views/photographer/ScheduleDashboard.vue') },
                { path: 'photographers/broadcast', name: 'Broadcast', component: () => import('@/views/photographer/Broadcast.vue') },
                { path: 'customers', name: 'CustomerMaintain', component: () => import('@/views/customer/CustomerMaintain.vue') },
                { path: 'orders', name: 'OrderList', component: () => import('@/views/order/OrderList.vue') },
                { path: 'orders/:id', name: 'OrderDetail', component: () => import('@/views/order/OrderDetail.vue') },
                { path: 'media/verify', name: 'RawVerify', component: () => import('@/views/media/RawVerify.vue') },
                { path: 'media/ai-monitor', name: 'AiMonitor', component: () => import('@/views/media/AiMonitor.vue') },
                { path: 'match/monitor', name: 'MatchMonitor', component: () => import('@/views/match/MatchMonitor.vue'), meta: { roles: ['ADMIN', 'SUPPORT'] } },
                { path: 'finance/ledger', name: 'Ledger', component: () => import('@/views/finance/Ledger.vue'), meta: { roles: ['ADMIN', 'FINANCE'] } },
                { path: 'finance/payout', name: 'Payout', component: () => import('@/views/finance/Payout.vue'), meta: { roles: ['ADMIN', 'FINANCE'] } },
                { path: 'finance/refund', name: 'Refund', component: () => import('@/views/finance/Refund.vue'), meta: { roles: ['ADMIN', 'FINANCE'] } },
                { path: 'support/dispute', name: 'DisputeList', component: () => import('@/views/support/DisputeList.vue'), meta: { roles: ['ADMIN', 'SUPPORT'] } },
                { path: 'support/conversation', name: 'ConversationAccess', component: () => import('@/views/support/ConversationAccess.vue'), meta: { roles: ['ADMIN', 'SUPPORT'] } },
                { path: 'support/chat', name: 'SupportChat', component: () => import('@/views/support/SupportChat.vue'), meta: { roles: ['ADMIN', 'SUPPORT'] } },
                { path: 'campaign/coupons', name: 'CouponMaintain', component: () => import('@/views/campaign/CouponMaintain.vue'), meta: { roles: ['ADMIN', 'FINANCE'] } },
                { path: 'affiliate', name: 'AffiliateList', component: () => import('@/views/affiliate/AffiliateList.vue'), meta: { roles: ['ADMIN'] } },
                { path: 'affiliate/report', name: 'AffiliateReport', component: () => import('@/views/affiliate/AffiliateReport.vue'), meta: { roles: ['ADMIN'] } },
                { path: 'analytics/market-signals', name: 'MarketSignalDashboard', component: () => import('@/views/analytics/MarketSignalDashboard.vue'), meta: { roles: ['ADMIN', 'SUPPORT'] } },
                { path: 'notifications', name: 'NotificationList', component: () => import('@/views/notify/NotificationList.vue') },
                { path: 'profile', name: 'AdminProfile', component: () => import('@/views/users/Profile.vue') },
                { path: 'change-password', name: 'AdminChangePassword', component: () => import('@/views/users/ChangePassword.vue') },
                { path: 'dic', name: 'DicMaintain', component: () => import('@/views/dic/DicMaintain.vue'), meta: { roles: ['ADMIN'] } },
                { path: 'flows', name: 'AppFlowMaintain', component: () => import('@/views/flows/AppFlowMaintain.vue'), meta: { roles: ['ADMIN'] } },
                { path: 'content/banners', name: 'BannerMaintain', component: () => import('@/views/content/BannerMaintain.vue'), meta: { roles: ['ADMIN', 'SUPPORT', 'EDITOR'] } },
                { path: 'content/news', name: 'NewsMaintain', component: () => import('@/views/content/NewsMaintain.vue'), meta: { roles: ['ADMIN', 'SUPPORT', 'EDITOR'] } },
                { path: 'content/faqs', name: 'FaqMaintain', component: () => import('@/views/content/FaqMaintain.vue'), meta: { roles: ['ADMIN', 'SUPPORT', 'EDITOR'] } },
                { path: 'content/attractions', name: 'AttractionMaintain', component: () => import('@/views/content/AttractionMaintain.vue'), meta: { roles: ['ADMIN', 'EDITOR'] } },
                { path: 'content/instagram', name: 'InstagramMaintain', component: () => import('@/views/content/InstagramMaintain.vue'), meta: { roles: ['ADMIN', 'EDITOR'] } },
                { path: 'content/public-consent', name: 'PublicConsentReview', component: () => import('@/views/content/PublicConsentReview.vue'), meta: { roles: ['ADMIN', 'SUPPORT'] } },
                { path: 'settings/areas', name: 'AreaMaintain', component: () => import('@/views/settings/AreaMaintain.vue'), meta: { roles: ['ADMIN', 'EDITOR'] } },
                { path: 'settings/services', name: 'ServiceTypeMaintain', component: () => import('@/views/settings/ServiceTypeMaintain.vue'), meta: { roles: ['ADMIN', 'EDITOR'] } },
            ],
        },
        { path: '/:pathMatch(.*)*', redirect: '/login' },
    ],
});
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('wl_admin_token');
    const role = localStorage.getItem('wl_admin_role') || '';
    if (to.path === '/login') {
        token ? next('/dashboard') : next();
    }
    else {
        if (!token) {
            next('/login?redirect=' + to.path);
            return;
        }
        // 檢查角色權限
        if (to.meta?.roles && Array.isArray(to.meta.roles)) {
            if (!to.meta.roles.includes(role)) {
                next('/dashboard'); // 無權限則導向儀表板
                return;
            }
            // meta.roles 通過即可，不再額外檢查 hasPermission
            next();
            return;
        }
        else if (to.name && !hasPermission(role, String(to.name))) {
            next('/dashboard');
            return;
        }
        next();
    }
});
export default router;
//# sourceMappingURL=index.js.map