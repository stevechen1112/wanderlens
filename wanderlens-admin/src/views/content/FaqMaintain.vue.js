/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import api from '@/api';
import GenericCrud from '@/components/common/GenericCrud.vue';
const faqColumns = [
    { prop: 'language', label: '語系', width: 80, type: 'select', required: true, options: [
            { label: '繁中', value: 'zh' },
            { label: '英文', value: 'en' },
            { label: '日文', value: 'jp' },
            { label: '韓文', value: 'ka' },
        ] },
    { prop: 'question', label: '問題', type: 'text', required: true },
    { prop: 'answer', label: '答案', type: 'textarea', rows: 4, required: true },
    { prop: 'sortOrder', label: '排序', width: 80, type: 'number', min: 0 },
];
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {[typeof GenericCrud, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(GenericCrud, new GenericCrud({
    title: "FAQ",
    load: (__VLS_ctx.api.getFaqs),
    save: (__VLS_ctx.api.saveFaq),
    delete: (__VLS_ctx.api.deleteFaq),
    columns: (__VLS_ctx.faqColumns),
    searchable: true,
}));
const __VLS_1 = __VLS_0({
    title: "FAQ",
    load: (__VLS_ctx.api.getFaqs),
    save: (__VLS_ctx.api.saveFaq),
    delete: (__VLS_ctx.api.deleteFaq),
    columns: (__VLS_ctx.faqColumns),
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
            faqColumns: faqColumns,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=FaqMaintain.vue.js.map