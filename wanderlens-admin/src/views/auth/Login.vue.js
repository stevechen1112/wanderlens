/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, computed } from 'vue';
import { User, Lock } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import WlLangSwitcher from '@/components/WlLangSwitcher.vue';
import api from '@/api';
const { t } = useI18n();
const authStore = useAuthStore();
const router = useRouter();
const formRef = ref();
const loading = ref(false);
const form = reactive({ empno: '', password: '' });
const rules = computed(() => ({
    empno: [{ required: true, message: t('auth.accountRequired'), trigger: 'blur' }],
    password: [{ required: true, message: t('auth.passwordRequired'), trigger: 'blur' }],
}));
const handleLogin = async () => {
    if (!formRef.value)
        return;
    await formRef.value.validate(async (valid) => {
        if (!valid)
            return;
        loading.value = true;
        try {
            const res = await api.login(form.empno, form.password);
            if (res.data?.token) {
                authStore.setAuth(res.data.token, res.data.userId, res.data.username, res.data.role, res.data.avatar);
                ElMessage.success(t('auth.loginSuccess'));
                router.push('/dashboard');
            }
        }
        catch (err) {
            const ax = err;
            const msg = ax.response?.data?.message;
            ElMessage.error(msg || (ax.response ? t('auth.loginFailed') : t('auth.networkError')));
        }
        finally {
            loading.value = false;
        }
    });
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-primary-light/20 relative" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "absolute top-4 right-4" },
});
/** @type {[typeof WlLangSwitcher, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(WlLangSwitcher, new WlLangSwitcher({}));
const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "w-[380px]" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-center mb-8" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "text-4xl font-extrabold" },
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-gray-500 mt-2 text-sm" },
});
(__VLS_ctx.t('auth.adminSubtitle'));
const __VLS_3 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_4 = __VLS_asFunctionalComponent(__VLS_3, new __VLS_3({
    shadow: "always",
    bodyStyle: ({ padding: '36px' }),
}));
const __VLS_5 = __VLS_4({
    shadow: "always",
    bodyStyle: ({ padding: '36px' }),
}, ...__VLS_functionalComponentArgsRest(__VLS_4));
__VLS_6.slots.default;
const __VLS_7 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({
    ...{ 'onSubmit': {} },
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    size: "large",
}));
const __VLS_9 = __VLS_8({
    ...{ 'onSubmit': {} },
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    size: "large",
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_11;
let __VLS_12;
let __VLS_13;
const __VLS_14 = {
    onSubmit: (__VLS_ctx.handleLogin)
};
/** @type {typeof __VLS_ctx.formRef} */ ;
var __VLS_15 = {};
__VLS_10.slots.default;
const __VLS_17 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    prop: "empno",
}));
const __VLS_19 = __VLS_18({
    prop: "empno",
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
__VLS_20.slots.default;
const __VLS_21 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
    modelValue: (__VLS_ctx.form.empno),
    placeholder: (__VLS_ctx.t('auth.account')),
    prefixIcon: (__VLS_ctx.User),
    'aria-label': (__VLS_ctx.t('auth.account')),
    autocomplete: "username",
}));
const __VLS_23 = __VLS_22({
    modelValue: (__VLS_ctx.form.empno),
    placeholder: (__VLS_ctx.t('auth.account')),
    prefixIcon: (__VLS_ctx.User),
    'aria-label': (__VLS_ctx.t('auth.account')),
    autocomplete: "username",
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
var __VLS_20;
const __VLS_25 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
    prop: "password",
}));
const __VLS_27 = __VLS_26({
    prop: "password",
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
__VLS_28.slots.default;
const __VLS_29 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.form.password),
    type: "password",
    placeholder: (__VLS_ctx.t('auth.password')),
    prefixIcon: (__VLS_ctx.Lock),
    showPassword: true,
    'aria-label': (__VLS_ctx.t('auth.password')),
    autocomplete: "current-password",
}));
const __VLS_31 = __VLS_30({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.form.password),
    type: "password",
    placeholder: (__VLS_ctx.t('auth.password')),
    prefixIcon: (__VLS_ctx.Lock),
    showPassword: true,
    'aria-label': (__VLS_ctx.t('auth.password')),
    autocomplete: "current-password",
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
let __VLS_33;
let __VLS_34;
let __VLS_35;
const __VLS_36 = {
    onKeyup: (__VLS_ctx.handleLogin)
};
var __VLS_32;
var __VLS_28;
const __VLS_37 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({}));
const __VLS_39 = __VLS_38({}, ...__VLS_functionalComponentArgsRest(__VLS_38));
__VLS_40.slots.default;
const __VLS_41 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
    type: "primary",
    ...{ class: "w-full !h-11 !text-base" },
    loading: (__VLS_ctx.loading),
    nativeType: "submit",
}));
const __VLS_43 = __VLS_42({
    type: "primary",
    ...{ class: "w-full !h-11 !text-base" },
    loading: (__VLS_ctx.loading),
    nativeType: "submit",
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
__VLS_44.slots.default;
(__VLS_ctx.loading ? __VLS_ctx.t('auth.loggingIn') : __VLS_ctx.t('auth.login'));
var __VLS_44;
var __VLS_40;
var __VLS_10;
var __VLS_6;
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-center text-xs text-gray-400 mt-6" },
});
(__VLS_ctx.t('auth.footer'));
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-br']} */ ;
/** @type {__VLS_StyleScopedClasses['from-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['to-primary-light/20']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-4']} */ ;
/** @type {__VLS_StyleScopedClasses['right-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-[380px]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-extrabold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['!h-11']} */ ;
/** @type {__VLS_StyleScopedClasses['!text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
// @ts-ignore
var __VLS_16 = __VLS_15;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            User: User,
            Lock: Lock,
            WlLangSwitcher: WlLangSwitcher,
            t: t,
            formRef: formRef,
            loading: loading,
            form: form,
            rules: rules,
            handleLogin: handleLogin,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=Login.vue.js.map