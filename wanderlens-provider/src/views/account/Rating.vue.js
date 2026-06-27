/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import api from '@/api';
import { useAuthStore } from '@/stores/auth';
const { t } = useI18n();
const authStore = useAuthStore();
const ratings = ref([]);
onMounted(async () => {
    try {
        const res = await api.getRating(authStore.userId);
        ratings.value = res.data || [];
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
const __VLS_5 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    data: (__VLS_ctx.ratings),
    border: true,
}));
const __VLS_7 = __VLS_6({
    data: (__VLS_ctx.ratings),
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
const __VLS_9 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    prop: "author",
    label: (__VLS_ctx.t('ratingPage.customer')),
    width: "120",
}));
const __VLS_11 = __VLS_10({
    prop: "author",
    label: (__VLS_ctx.t('ratingPage.customer')),
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
const __VLS_13 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    label: (__VLS_ctx.t('ratingPage.stars')),
    width: "100",
}));
const __VLS_15 = __VLS_14({
    label: (__VLS_ctx.t('ratingPage.stars')),
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_16.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_16.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    for (const [i] of __VLS_getVForSourceType((row.stars))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            key: (i),
            'aria-hidden': "true",
        });
    }
}
var __VLS_16;
const __VLS_17 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    prop: "comments",
    label: (__VLS_ctx.t('ratingPage.comments')),
}));
const __VLS_19 = __VLS_18({
    prop: "comments",
    label: (__VLS_ctx.t('ratingPage.comments')),
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
var __VLS_8;
var __VLS_3;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            t: t,
            ratings: ratings,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=Rating.vue.js.map