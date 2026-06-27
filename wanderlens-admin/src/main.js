import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/auth';
import { i18n } from './i18n';
import './assets/css/main.css';
const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.use(i18n);
app.use(ElementPlus);
const authStore = useAuthStore(pinia);
authStore.restoreAuth();
app.mount('#app');
//# sourceMappingURL=main.js.map