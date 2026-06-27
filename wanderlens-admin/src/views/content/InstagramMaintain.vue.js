/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import api from '@/api';
import GenericCrud from '@/components/common/GenericCrud.vue';
const columns = [
    { prop: 'title', label: '標題', type: 'text', required: true },
    { prop: 'igUrl', label: 'IG 連結', type: 'text', required: true },
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
    title: "IG 貼文",
    load: (__VLS_ctx.api.getInstagram),
    save: (__VLS_ctx.api.saveInstagram),
    delete: (__VLS_ctx.api.deleteInstagram),
    columns: (__VLS_ctx.columns),
    searchable: true,
}));
const __VLS_1 = __VLS_0({
    title: "IG 貼文",
    load: (__VLS_ctx.api.getInstagram),
    save: (__VLS_ctx.api.saveInstagram),
    delete: (__VLS_ctx.api.deleteInstagram),
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
//# sourceMappingURL=InstagramMaintain.vue.js.map