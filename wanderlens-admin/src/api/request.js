import axios from 'axios';
const request = axios.create({
    baseURL: '/api',
    timeout: 10000,
});
request.interceptors.request.use((config) => {
    const token = localStorage.getItem('wl_admin_token');
    if (token)
        config.headers.Authorization = `Bearer ${token}`;
    config.headers['Accept-Language'] = localStorage.getItem('wl_lang') || 'zh';
    return config;
}, (error) => Promise.reject(error));
request.interceptors.response.use((response) => {
    const body = response.data;
    if (body && typeof body === 'object' && 'code' in body && body.code !== '200') {
        const err = new Error(body.message || '請求失敗');
        err.code = body.code;
        err.data = body.data;
        return Promise.reject(err);
    }
    return body;
}, (error) => {
    if (error.response?.status === 401) {
        localStorage.removeItem('wl_admin_token');
        window.location.href = '/login';
    }
    return Promise.reject(error);
});
export default request;
//# sourceMappingURL=request.js.map