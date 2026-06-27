/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import api from '@/api';
import GenericCrud from '@/components/common/GenericCrud.vue';
const columns = [
    { prop: 'name', label: '區域名稱', type: 'text', required: true },
    { prop: 'nameEn', label: '英文名稱', width: 120, type: 'text' },
    { prop: 'city', label: '城市', width: 100, type: 'text', required: true },
    { prop: 'minHour', label: '最低時數', width: 100, type: 'number', min: 1, max: 24 },
    { prop: 'zipCode', label: '郵遞區號', width: 100, type: 'text' },
    { prop: 'active', label: '啟用', width: 80, type: 'switch', activeValue: 'Y', inactiveValue: 'N' },
];
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {[typeof GenericCrud, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(GenericCrud, new GenericCrud({
    title: "行政區域",
    load: (__VLS_ctx.api.getAreas),
    save: (__VLS_ctx.api.saveArea),
    delete: (__VLS_ctx.api.deleteArea),
    columns: (__VLS_ctx.columns),
    searchable: true,
}));
const __VLS_1 = __VLS_0({
    title: "行政區域",
    load: (__VLS_ctx.api.getAreas),
    save: (__VLS_ctx.api.saveArea),
    delete: (__VLS_ctx.api.deleteArea),
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
//# sourceMappingURL=AreaMaintain.vue.js.map