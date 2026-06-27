/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import api from '@/api';
import GenericCrud from '@/components/common/GenericCrud.vue';
const columns = [
    { prop: 'name', label: '類型名稱', type: 'text', required: true },
    { prop: 'nameEn', label: '英文名稱', width: 120, type: 'text' },
    { prop: 'description', label: '描述', type: 'textarea', rows: 3 },
    { prop: 'basePrice', label: '基礎價格', width: 120, type: 'number', min: 0, required: true },
    { prop: 'duration', label: '預設時數', width: 100, type: 'number', min: 1, max: 24 },
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
    title: "服務類型",
    load: (() => __VLS_ctx.api.getServiceTypes()),
    save: (__VLS_ctx.api.saveServiceType),
    delete: (__VLS_ctx.api.deleteServiceType),
    columns: (__VLS_ctx.columns),
    searchable: true,
}));
const __VLS_1 = __VLS_0({
    title: "服務類型",
    load: (() => __VLS_ctx.api.getServiceTypes()),
    save: (__VLS_ctx.api.saveServiceType),
    delete: (__VLS_ctx.api.deleteServiceType),
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
//# sourceMappingURL=ServiceTypeMaintain.vue.js.map