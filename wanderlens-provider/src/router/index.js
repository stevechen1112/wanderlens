import { createRouter, createWebHistory } from 'vue-router';
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: () => import('@/views/auth/Login.vue'),
        },
        {
            path: '/',
            component: () => import('@/layouts/DefaultLayout.vue'),
            redirect: '/account',
            children: [
                {
                    path: 'account',
                    name: 'AccountDetail',
                    component: () => import('@/views/account/AccountDetail.vue'),
                },
                {
                    path: 'my-order',
                    name: 'MyOrder',
                    component: () => import('@/views/order/MyOrder.vue'),
                },
                {
                    path: 'my-order/:id',
                    name: 'OrderDetail',
                    component: () => import('@/views/order/OrderDetail.vue'),
                },
                {
                    path: 'conversations',
                    name: 'ConversationList',
                    component: () => import('@/views/conversation/ConversationList.vue'),
                },
                {
                    path: 'conversations/:id',
                    name: 'ConversationRoom',
                    component: () => import('@/views/conversation/ConversationRoom.vue'),
                },
                {
                    path: 'profile',
                    name: 'Profile',
                    component: () => import('@/views/profile/Profile.vue'),
                },
                {
                    path: 'change-password',
                    name: 'ChangePassword',
                    component: () => import('@/views/profile/ChangePassword.vue'),
                },
                {
                    path: 'notifications',
                    name: 'Notifications',
                    component: () => import('@/views/profile/Notifications.vue'),
                },
                {
                    path: 'terms',
                    name: 'Terms',
                    component: () => import('@/views/profile/Terms.vue'),
                },
                {
                    path: 'raw-upload',
                    name: 'RawUpload',
                    component: () => import('@/views/upload/RawUpload.vue'),
                },
                {
                    path: 'stylist-schedule',
                    name: 'StylistSchedule',
                    component: () => import('@/views/stylist/StylistDashboard.vue'),
                },
                {
                    path: 'earnings',
                    name: 'Earnings',
                    component: () => import('@/views/finance/Earnings.vue'),
                },
            ],
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: '/login',
        },
    ],
});
// 路由守衛
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('wl_provider_token');
    if (to.path === '/login') {
        if (token) {
            next('/account');
        }
        else {
            next();
        }
    }
    else {
        if (!token) {
            next('/login?redirect=' + to.path);
        }
        else {
            next();
        }
    }
});
export default router;
//# sourceMappingURL=index.js.map