/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import BasicInfo from './BasicInfo.vue';
import Schedule from './Schedule.vue';
import ServiceArea from './ServiceArea.vue';
import BankInfo from './BankInfo.vue';
import Features from './Features.vue';
import PhotoWorks from './PhotoWorks.vue';
import Rating from './Rating.vue';
const { t } = useI18n();
const activeTab = ref('basic');
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
const __VLS_0 = {}.ElTabs;
/** @type {[typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.activeTab),
    type: "card",
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.activeTab),
    type: "card",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    label: (__VLS_ctx.t('accountDetail.tabBasic')),
    name: "basic",
}));
const __VLS_6 = __VLS_5({
    label: (__VLS_ctx.t('accountDetail.tabBasic')),
    name: "basic",
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
if (__VLS_ctx.activeTab === 'basic') {
    /** @type {[typeof BasicInfo, ]} */ ;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent(BasicInfo, new BasicInfo({}));
    const __VLS_9 = __VLS_8({}, ...__VLS_functionalComponentArgsRest(__VLS_8));
}
var __VLS_7;
const __VLS_11 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({
    label: (__VLS_ctx.t('accountDetail.tabSchedule')),
    name: "schedule",
    lazy: true,
}));
const __VLS_13 = __VLS_12({
    label: (__VLS_ctx.t('accountDetail.tabSchedule')),
    name: "schedule",
    lazy: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
__VLS_14.slots.default;
if (__VLS_ctx.activeTab === 'schedule') {
    /** @type {[typeof Schedule, ]} */ ;
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent(Schedule, new Schedule({}));
    const __VLS_16 = __VLS_15({}, ...__VLS_functionalComponentArgsRest(__VLS_15));
}
var __VLS_14;
const __VLS_18 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({
    label: (__VLS_ctx.t('accountDetail.tabArea')),
    name: "area",
    lazy: true,
}));
const __VLS_20 = __VLS_19({
    label: (__VLS_ctx.t('accountDetail.tabArea')),
    name: "area",
    lazy: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
__VLS_21.slots.default;
if (__VLS_ctx.activeTab === 'area') {
    /** @type {[typeof ServiceArea, ]} */ ;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(ServiceArea, new ServiceArea({}));
    const __VLS_23 = __VLS_22({}, ...__VLS_functionalComponentArgsRest(__VLS_22));
}
var __VLS_21;
const __VLS_25 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
    label: (__VLS_ctx.t('accountDetail.tabBank')),
    name: "bank",
    lazy: true,
}));
const __VLS_27 = __VLS_26({
    label: (__VLS_ctx.t('accountDetail.tabBank')),
    name: "bank",
    lazy: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
__VLS_28.slots.default;
if (__VLS_ctx.activeTab === 'bank') {
    /** @type {[typeof BankInfo, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(BankInfo, new BankInfo({}));
    const __VLS_30 = __VLS_29({}, ...__VLS_functionalComponentArgsRest(__VLS_29));
}
var __VLS_28;
const __VLS_32 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    label: (__VLS_ctx.t('accountDetail.tabFeature')),
    name: "feature",
    lazy: true,
}));
const __VLS_34 = __VLS_33({
    label: (__VLS_ctx.t('accountDetail.tabFeature')),
    name: "feature",
    lazy: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
if (__VLS_ctx.activeTab === 'feature') {
    /** @type {[typeof Features, ]} */ ;
    // @ts-ignore
    const __VLS_36 = __VLS_asFunctionalComponent(Features, new Features({}));
    const __VLS_37 = __VLS_36({}, ...__VLS_functionalComponentArgsRest(__VLS_36));
}
var __VLS_35;
const __VLS_39 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
    label: (__VLS_ctx.t('accountDetail.tabWorks')),
    name: "works",
    lazy: true,
}));
const __VLS_41 = __VLS_40({
    label: (__VLS_ctx.t('accountDetail.tabWorks')),
    name: "works",
    lazy: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
__VLS_42.slots.default;
if (__VLS_ctx.activeTab === 'works') {
    /** @type {[typeof PhotoWorks, ]} */ ;
    // @ts-ignore
    const __VLS_43 = __VLS_asFunctionalComponent(PhotoWorks, new PhotoWorks({}));
    const __VLS_44 = __VLS_43({}, ...__VLS_functionalComponentArgsRest(__VLS_43));
}
var __VLS_42;
const __VLS_46 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent(__VLS_46, new __VLS_46({
    label: (__VLS_ctx.t('accountDetail.tabRating')),
    name: "rating",
    lazy: true,
}));
const __VLS_48 = __VLS_47({
    label: (__VLS_ctx.t('accountDetail.tabRating')),
    name: "rating",
    lazy: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_47));
__VLS_49.slots.default;
if (__VLS_ctx.activeTab === 'rating') {
    /** @type {[typeof Rating, ]} */ ;
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent(Rating, new Rating({}));
    const __VLS_51 = __VLS_50({}, ...__VLS_functionalComponentArgsRest(__VLS_50));
}
var __VLS_49;
var __VLS_3;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            BasicInfo: BasicInfo,
            Schedule: Schedule,
            ServiceArea: ServiceArea,
            BankInfo: BankInfo,
            Features: Features,
            PhotoWorks: PhotoWorks,
            Rating: Rating,
            t: t,
            activeTab: activeTab,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=AccountDetail.vue.js.map