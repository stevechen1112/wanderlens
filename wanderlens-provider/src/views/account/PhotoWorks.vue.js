/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted } from 'vue';
import { UploadFilled, Delete } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import api from '@/api';
import { useAuthStore } from '@/stores/auth';
const { t } = useI18n();
const authStore = useAuthStore();
const works = ref([]);
const publicAlbums = ref([]);
const loadPublicAlbums = async () => {
    try {
        const res = await api.getPublicAlbums(authStore.userId);
        publicAlbums.value = res.data || [];
    }
    catch {
        publicAlbums.value = [];
    }
};
const requestConsent = async (albumId) => {
    try {
        await api.requestPortfolioConsent(albumId);
        ElMessage.success(t('photoWorksPage.consentSent'));
    }
    catch {
        ElMessage.error(t('photoWorksPage.consentFailed'));
    }
};
const uploadWork = async (options) => {
    if (works.value.length >= 50) {
        ElMessage.warning(t('photoWorksPage.maxWorks'));
        return;
    }
    if (options.file.size > 2 * 1024 * 1024) {
        ElMessage.error(t('photoWorksPage.fileTooLarge'));
        return;
    }
    try {
        const res = await api.uploadFile('provider_works', options.file);
        await api.setFeature({
            providerId: authStore.userId,
            type: 'WORK',
            imageUrl: res.data?.url,
            active: 'Y',
        });
        const worksRes = await api.getWorks(authStore.userId);
        works.value = worksRes.data || [];
        ElMessage.success(t('photoWorksPage.uploadSuccess'));
    }
    catch {
        ElMessage.error(t('photoWorksPage.uploadFailed'));
    }
};
const remove = async (id) => {
    try {
        await api.deleteWork(id);
        works.value = works.value.filter((w) => w.id !== id);
    }
    catch {
        // silent
    }
};
onMounted(async () => {
    try {
        const res = await api.getWorks(authStore.userId);
        works.value = res.data || [];
    }
    catch {
        // silent
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.ElUpload;
/** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    drag: true,
    multiple: true,
    accept: "image/jpeg,image/png",
    httpRequest: (__VLS_ctx.uploadWork),
    showFileList: (false),
}));
const __VLS_7 = __VLS_6({
    drag: true,
    multiple: true,
    accept: "image/jpeg,image/png",
    httpRequest: (__VLS_ctx.uploadWork),
    showFileList: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
const __VLS_9 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    ...{ class: "text-4xl text-gray-400" },
}));
const __VLS_11 = __VLS_10({
    ...{ class: "text-4xl text-gray-400" },
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
const __VLS_13 = {}.UploadFilled;
/** @type {[typeof __VLS_components.UploadFilled, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({}));
const __VLS_15 = __VLS_14({}, ...__VLS_functionalComponentArgsRest(__VLS_14));
var __VLS_12;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-sm text-gray-500" },
});
(__VLS_ctx.t('photoWorksPage.uploadHint'));
var __VLS_8;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid grid-cols-4 md:grid-cols-6 gap-3 mt-4" },
});
for (const [work] of __VLS_getVForSourceType((__VLS_ctx.works))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (work.id),
        ...{ class: "relative group" },
    });
    const __VLS_17 = {}.ElImage;
    /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
        src: (work.imageUrl),
        ...{ class: "w-full aspect-square rounded-lg" },
        fit: "cover",
    }));
    const __VLS_19 = __VLS_18({
        src: (work.imageUrl),
        ...{ class: "w-full aspect-square rounded-lg" },
        fit: "cover",
    }, ...__VLS_functionalComponentArgsRest(__VLS_18));
    const __VLS_21 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
        ...{ 'onClick': {} },
        ...{ class: "absolute top-1 right-1 opacity-0 group-hover:opacity-100" },
        type: "danger",
        icon: (__VLS_ctx.Delete),
        circle: true,
        size: "small",
        'aria-label': (__VLS_ctx.t('common.delete')),
    }));
    const __VLS_23 = __VLS_22({
        ...{ 'onClick': {} },
        ...{ class: "absolute top-1 right-1 opacity-0 group-hover:opacity-100" },
        type: "danger",
        icon: (__VLS_ctx.Delete),
        circle: true,
        size: "small",
        'aria-label': (__VLS_ctx.t('common.delete')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    let __VLS_25;
    let __VLS_26;
    let __VLS_27;
    const __VLS_28 = {
        onClick: (...[$event]) => {
            __VLS_ctx.remove(work.id);
        }
    };
    var __VLS_24;
}
const __VLS_29 = {}.ElDivider;
/** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({}));
const __VLS_31 = __VLS_30({}, ...__VLS_functionalComponentArgsRest(__VLS_30));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center justify-between" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "font-semibold text-sm" },
});
(__VLS_ctx.t('photoWorksPage.consentTitle'));
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-xs text-gray-500 mt-1" },
});
(__VLS_ctx.t('photoWorksPage.consentDesc'));
const __VLS_33 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
    ...{ 'onClick': {} },
    type: "primary",
    size: "small",
}));
const __VLS_35 = __VLS_34({
    ...{ 'onClick': {} },
    type: "primary",
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
let __VLS_37;
let __VLS_38;
let __VLS_39;
const __VLS_40 = {
    onClick: (__VLS_ctx.loadPublicAlbums)
};
__VLS_36.slots.default;
(__VLS_ctx.t('photoWorksPage.viewPublic'));
var __VLS_36;
if (__VLS_ctx.publicAlbums.length > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid grid-cols-4 md:grid-cols-6 gap-3 mt-4" },
    });
    for (const [album] of __VLS_getVForSourceType((__VLS_ctx.publicAlbums))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (album.id),
            ...{ class: "relative" },
        });
        const __VLS_41 = {}.ElImage;
        /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
        // @ts-ignore
        const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
            src: (album.coverUrl || ''),
            ...{ class: "w-full aspect-square rounded-lg" },
            fit: "cover",
            alt: (album.title),
        }));
        const __VLS_43 = __VLS_42({
            src: (album.coverUrl || ''),
            ...{ class: "w-full aspect-square rounded-lg" },
            fit: "cover",
            alt: (album.title),
        }, ...__VLS_functionalComponentArgsRest(__VLS_42));
        __VLS_44.slots.default;
        {
            const { error: __VLS_thisSlot } = __VLS_44.slots;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "w-full aspect-square bg-gray-100 flex items-center justify-center text-gray-400 text-xs" },
            });
            (__VLS_ctx.t('photoWorksPage.noImage'));
        }
        var __VLS_44;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-xs text-gray-500 mt-1 truncate" },
        });
        (album.title);
        const __VLS_45 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
            ...{ 'onClick': {} },
            text: true,
            type: "primary",
            size: "small",
        }));
        const __VLS_47 = __VLS_46({
            ...{ 'onClick': {} },
            text: true,
            type: "primary",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_46));
        let __VLS_49;
        let __VLS_50;
        let __VLS_51;
        const __VLS_52 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.publicAlbums.length > 0))
                    return;
                __VLS_ctx.requestConsent(album.id);
            }
        };
        __VLS_48.slots.default;
        (__VLS_ctx.t('photoWorksPage.requestConsent'));
        var __VLS_48;
    }
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['text-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-4']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-6']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['aspect-square']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-1']} */ ;
/** @type {__VLS_StyleScopedClasses['right-1']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-0']} */ ;
/** @type {__VLS_StyleScopedClasses['group-hover:opacity-100']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-4']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-6']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['aspect-square']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['aspect-square']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            UploadFilled: UploadFilled,
            Delete: Delete,
            t: t,
            works: works,
            publicAlbums: publicAlbums,
            loadPublicAlbums: loadPublicAlbums,
            requestConsent: requestConsent,
            uploadWork: uploadWork,
            remove: remove,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=PhotoWorks.vue.js.map