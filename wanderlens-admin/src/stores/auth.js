import { defineStore } from 'pinia';
export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: '',
        userId: null,
        username: '',
        role: '',
        avatar: '',
        menus: [],
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
    },
    actions: {
        setAuth(token, userId, username, role, avatar) {
            this.token = token;
            this.userId = userId;
            this.username = username;
            this.role = role;
            this.avatar = avatar;
            localStorage.setItem('wl_admin_token', token);
            localStorage.setItem('wl_admin_role', role);
            localStorage.setItem('wl_admin_user_id', String(userId));
            localStorage.setItem('wl_admin_username', username);
        },
        setMenus(menus) {
            this.menus = menus;
            localStorage.setItem('wl_admin_menus', JSON.stringify(menus));
        },
        // 從 localStorage 還原認證狀態（頁面重整時呼叫）
        restoreAuth() {
            const token = localStorage.getItem('wl_admin_token');
            const role = localStorage.getItem('wl_admin_role') || '';
            const userId = localStorage.getItem('wl_admin_user_id');
            const username = localStorage.getItem('wl_admin_username') || '';
            const menusStr = localStorage.getItem('wl_admin_menus');
            if (token) {
                this.token = token;
                this.role = role;
                this.userId = userId ? Number(userId) : null;
                this.username = username;
                if (menusStr) {
                    try {
                        this.menus = JSON.parse(menusStr);
                    }
                    catch {
                        this.menus = [];
                    }
                }
            }
        },
        clearAuth() {
            this.token = '';
            this.userId = null;
            this.username = '';
            this.role = '';
            this.menus = [];
            localStorage.removeItem('wl_admin_token');
            localStorage.removeItem('wl_admin_role');
            localStorage.removeItem('wl_admin_user_id');
            localStorage.removeItem('wl_admin_username');
            localStorage.removeItem('wl_admin_menus');
        },
    },
});
//# sourceMappingURL=auth.js.map