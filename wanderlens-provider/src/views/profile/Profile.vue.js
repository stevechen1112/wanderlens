/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import api from '@/api';
import { useAuthStore } from '@/stores/auth';
const { t } = useI18n();
const authStore = useAuthStore();
const avatar = ref(authStore.avatar);
const username = ref(authStore.username);
const uploadAvatar = async (options) => {
    try {
        const res = await api.uploadFile('user_profile', options.file);
        avatar.value = res.data?.url;
    }
    catch {
        ElMessage.error(t('profilePage.uploadFailed'));
    }
};
const save = async () => {
    try {
        await api.updateProvider({
            id: authStore.userId,
            nickName: username.value,
            avatar: avatar.value,
        });
        authStore.setUsername(username.value);
        authStore.setAvatar(avatar.value);
        ElMessage.success(t('profilePage.saveSuccess'));
    }
    catch {
        ElMessage.error(t('profilePage.saveFailed'));
    }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "max-w-xl" },
}));
const __VLS_2 = __VLS_1({
    ...{ class: "max-w-xl" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    labelWidth: "100px",
}));
const __VLS_7 = __VLS_6({
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
const __VLS_9 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    label: (__VLS_ctx.t('profilePage.avatar')),
}));
const __VLS_11 = __VLS_10({
    label: (__VLS_ctx.t('profilePage.avatar')),
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
const __VLS_13 = {}.ElUpload;
/** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    showFileList: (false),
    httpRequest: (__VLS_ctx.uploadAvatar),
    accept: "image/*",
}));
const __VLS_15 = __VLS_14({
    showFileList: (false),
    httpRequest: (__VLS_ctx.uploadAvatar),
    accept: "image/*",
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_16.slots.default;
const __VLS_17 = {}.ElAvatar;
/** @type {[typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    size: (64),
    src: (__VLS_ctx.avatar),
}));
const __VLS_19 = __VLS_18({
    size: (64),
    src: (__VLS_ctx.avatar),
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "ml-2 text-sm text-blue-500" },
});
(__VLS_ctx.t('profilePage.uploadHint'));
var __VLS_16;
var __VLS_12;
const __VLS_21 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
    label: (__VLS_ctx.t('profilePage.name')),
}));
const __VLS_23 = __VLS_22({
    label: (__VLS_ctx.t('profilePage.name')),
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
__VLS_24.slots.default;
const __VLS_25 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
    modelValue: (__VLS_ctx.username),
}));
const __VLS_27 = __VLS_26({
    modelValue: (__VLS_ctx.username),
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
var __VLS_24;
const __VLS_29 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({}));
const __VLS_31 = __VLS_30({}, ...__VLS_functionalComponentArgsRest(__VLS_30));
__VLS_32.slots.default;
const __VLS_33 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_35 = __VLS_34({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
let __VLS_37;
let __VLS_38;
let __VLS_39;
const __VLS_40 = {
    onClick: (__VLS_ctx.save)
};
__VLS_36.slots.default;
(__VLS_ctx.t('profilePage.save'));
var __VLS_36;
var __VLS_32;
var __VLS_8;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['max-w-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-500']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            t: t,
            avatar: avatar,
            username: username,
            uploadAvatar: uploadAvatar,
            save: save,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=Profile.vue.js.map