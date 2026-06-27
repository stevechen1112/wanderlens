/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import api from '@/api';
import GenericCrud from '@/components/common/GenericCrud.vue';
const bannerColumns = [
    { prop: 'language', label: '語系', width: 80, type: 'select', required: true, options: [
            { label: '繁中', value: 'zh' },
            { label: '英文', value: 'en' },
            { label: '日文', value: 'jp' },
            { label: '韓文', value: 'ka' },
        ] },
    { prop: 'imageUsage', label: '用途', width: 150, type: 'select', required: true, options: [
            { label: '首頁主視覺', value: 'home_hero' },
            { label: '拍攝類型頁', value: 'service_banner' },
            { label: '地點靈感頁', value: 'location_banner' },
            { label: '促銷活動', value: 'campaign' },
        ] },
    { prop: 'imageUrl', label: '圖片 URL', type: 'text', required: true },
    { prop: 'linkUrl', label: '連結 URL', type: 'text' },
    { prop: 'sortOrder', label: '排序', width: 80, type: 'number', min: 0 },
    { prop: 'active', label: '啟用', width: 80, type: 'switch', activeValue: 'Y', inactiveValue: 'N' },
];
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {[typeof GenericCrud, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(GenericCrud, new GenericCrud({
    title: "Banner",
    load: (__VLS_ctx.api.getBanners),
    save: (__VLS_ctx.api.saveBanner),
    delete: (__VLS_ctx.api.deleteBanner),
    columns: (__VLS_ctx.bannerColumns),
    searchable: true,
}));
const __VLS_1 = __VLS_0({
    title: "Banner",
    load: (__VLS_ctx.api.getBanners),
    save: (__VLS_ctx.api.saveBanner),
    delete: (__VLS_ctx.api.deleteBanner),
    columns: (__VLS_ctx.bannerColumns),
    searchable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
var __VLS_3 = {};
var __VLS_2;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            api: api,
            GenericCrud: GenericCrud,
            bannerColumns: bannerColumns,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=BannerMaintain.vue.js.map