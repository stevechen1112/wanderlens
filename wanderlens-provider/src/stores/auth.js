import { defineStore } from 'pinia';
export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: '',
        userId: null,
        empno: '',
        username: '',
        role: '',
        avatar: '',
        providerId: null,
        providerType: 'PHOTOGRAPHER',
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
        isStylist: (state) => state.providerType === 'STYLIST',
        isPhotographer: (state) => state.providerType === 'PHOTOGRAPHER' || !state.providerType,
    },
    actions: {
        setAuth(token, userId, empno, username, role, avatar) {
            this.token = token;
            this.userId = userId;
            this.empno = empno;
            this.username = username;
            this.role = role;
            this.avatar = avatar;
            localStorage.setItem('wl_provider_token', token);
            localStorage.setItem('wl_user_id', String(userId));
        },
        setUsername(username) {
            this.username = username;
        },
        setAvatar(avatar) {
            this.avatar = avatar;
        },
        setProviderType(providerType) {
            this.providerType = providerType || 'PHOTOGRAPHER';
            localStorage.setItem('wl_provider_type', this.providerType);
        },
        clearAuth() {
            this.token = '';
            this.userId = null;
            this.empno = '';
            this.username = '';
            this.role = '';
            this.avatar = '';
            this.providerId = null;
            localStorage.removeItem('wl_provider_token');
            localStorage.removeItem('wl_user_id');
            localStorage.removeItem('wl_provider_type');
        },
    },
});
//# sourceMappingURL=auth.js.map