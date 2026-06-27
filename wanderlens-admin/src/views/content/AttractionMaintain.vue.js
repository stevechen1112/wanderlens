/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import api from '@/api';
import GenericCrud from '@/components/common/GenericCrud.vue';
const columns = [
    { prop: 'name', label: '景點名稱', type: 'text', required: true },
    { prop: 'area', label: '區域', width: 100, type: 'text', required: true },
    { prop: 'language', label: '語系', width: 80, type: 'select', required: true, options: [
            { label: '繁中', value: 'zh' },
            { label: '英文', value: 'en' },
            { label: '日文', value: 'jp' },
            { label: '韓文', value: 'ka' },
        ] },
    { prop: 'description', label: '描述', type: 'textarea', rows: 4 },
    { prop: 'imageUrl', label: '圖片 URL', type: 'text' },
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
    title: "景點文章",
    load: (__VLS_ctx.api.getAttractions),
    save: (__VLS_ctx.api.saveAttraction),
    delete: (__VLS_ctx.api.deleteAttraction),
    columns: (__VLS_ctx.columns),
    searchable: true,
}));
const __VLS_1 = __VLS_0({
    title: "景點文章",
    load: (__VLS_ctx.api.getAttractions),
    save: (__VLS_ctx.api.saveAttraction),
    delete: (__VLS_ctx.api.deleteAttraction),
    columns: (__VLS_ctx.columns),
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
            columns: columns,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=AttractionMaintain.vue.js.map