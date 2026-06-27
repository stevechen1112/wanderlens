/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed, onMounted } from 'vue';
import { Search, Loading } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import api from '@/api';
const loading = ref(false);
const orders = ref([]);
const searchKeyword = ref('');
const statusFilter = ref('Delivered');
const currentPage = ref(1);
const pageSize = 20;
const filteredOrders = computed(() => {
    let result = orders.value;
    if (statusFilter.value) {
        result = result.filter(o => o.status === statusFilter.value);
    }
    if (searchKeyword.value) {
        const kw = searchKeyword.value.toLowerCase();
        result = result.filter(o => o.orderNo?.toLowerCase().includes(kw));
    }
    return result;
});
const loadData = async () => {
    loading.value = true;
    try {
        const res = await api.getOrders({ status: 'Delivered' });
        const delivered = res.data || [];
        // 也載入已撥款（Closed）的訂單
        const res2 = await api.getOrders({ status: 'Closed' });
        const closed = res2.data || [];
        orders.value = [...delivered, ...closed];
    }
    catch {
        ElMessage.error('載入撥款列表失敗');
        orders.value = [];
    }
    finally {
        loading.value = false;
    }
};
const handlePayout = async (row) => {
    try {
        await api.payout(row.id, row.photographerId);
        ElMessage.success(`訂單 ${row.orderNo} 撥款成功`);
        await loadData();
    }
    catch {
        ElMessage.error('撥款失敗');
    }
};
onMounted(loadData);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center justify-between mb-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "font-semibold text-lg" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center gap-3" },
});
const __VLS_0 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.statusFilter),
    placeholder: "篩選狀態",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_2 = __VLS_1({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.statusFilter),
    placeholder: "篩選狀態",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onChange: (__VLS_ctx.loadData)
};
__VLS_3.slots.default;
const __VLS_8 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    label: "待撥款",
    value: "Delivered",
}));
const __VLS_10 = __VLS_9({
    label: "待撥款",
    value: "Delivered",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
const __VLS_12 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    label: "已撥款",
    value: "Closed",
}));
const __VLS_14 = __VLS_13({
    label: "已撥款",
    value: "Closed",
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
var __VLS_3;
const __VLS_16 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    modelValue: (__VLS_ctx.searchKeyword),
    placeholder: "搜尋訂單號",
    prefixIcon: (__VLS_ctx.Search),
    ...{ style: {} },
    clearable: true,
}));
const __VLS_18 = __VLS_17({
    modelValue: (__VLS_ctx.searchKeyword),
    placeholder: "搜尋訂單號",
    prefixIcon: (__VLS_ctx.Search),
    ...{ style: {} },
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-center py-12" },
    });
    const __VLS_20 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        ...{ class: "is-loading" },
        size: (32),
    }));
    const __VLS_22 = __VLS_21({
        ...{ class: "is-loading" },
        size: (32),
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    __VLS_23.slots.default;
    const __VLS_24 = {}.Loading;
    /** @type {[typeof __VLS_components.Loading, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({}));
    const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
    var __VLS_23;
}
else if (__VLS_ctx.filteredOrders.length === 0) {
    const __VLS_28 = {}.ElEmpty;
    /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        description: "無待撥款訂單",
    }));
    const __VLS_30 = __VLS_29({
        description: "無待撥款訂單",
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
}
else {
    const __VLS_32 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        data: (__VLS_ctx.filteredOrders),
        border: true,
        stripe: true,
    }));
    const __VLS_34 = __VLS_33({
        data: (__VLS_ctx.filteredOrders),
        border: true,
        stripe: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    __VLS_35.slots.default;
    const __VLS_36 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        prop: "orderNo",
        label: "訂單號",
        width: "160",
    }));
    const __VLS_38 = __VLS_37({
        prop: "orderNo",
        label: "訂單號",
        width: "160",
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    const __VLS_40 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        prop: "consumerName",
        label: "客戶",
        width: "100",
    }));
    const __VLS_42 = __VLS_41({
        prop: "consumerName",
        label: "客戶",
        width: "100",
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    const __VLS_44 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        prop: "photographerName",
        label: "攝影師",
        width: "100",
    }));
    const __VLS_46 = __VLS_45({
        prop: "photographerName",
        label: "攝影師",
        width: "100",
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    const __VLS_48 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        prop: "shootingDate",
        label: "拍攝日期",
        width: "120",
    }));
    const __VLS_50 = __VLS_49({
        prop: "shootingDate",
        label: "拍攝日期",
        width: "120",
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    const __VLS_52 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        prop: "totalFee",
        label: "訂單金額",
        width: "100",
        align: "right",
    }));
    const __VLS_54 = __VLS_53({
        prop: "totalFee",
        label: "訂單金額",
        width: "100",
        align: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    __VLS_55.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_55.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        (row.totalFee?.toLocaleString());
    }
    var __VLS_55;
    const __VLS_56 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        prop: "photographerProfit",
        label: "攝影師應得",
        width: "120",
        align: "right",
    }));
    const __VLS_58 = __VLS_57({
        prop: "photographerProfit",
        label: "攝影師應得",
        width: "120",
        align: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    __VLS_59.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_59.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-green-600 font-semibold" },
        });
        (row.photographerProfit?.toLocaleString());
    }
    var __VLS_59;
    const __VLS_60 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        prop: "platformFee",
        label: "平台抽成",
        width: "100",
        align: "right",
    }));
    const __VLS_62 = __VLS_61({
        prop: "platformFee",
        label: "平台抽成",
        width: "100",
        align: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    __VLS_63.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_63.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        ((row.totalFee - row.photographerProfit)?.toLocaleString());
    }
    var __VLS_63;
    const __VLS_64 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        prop: "status",
        label: "狀態",
        width: "100",
    }));
    const __VLS_66 = __VLS_65({
        prop: "status",
        label: "狀態",
        width: "100",
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    __VLS_67.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_67.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_68 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
            type: (row.status === 'Delivered' ? 'warning' : 'success'),
        }));
        const __VLS_70 = __VLS_69({
            type: (row.status === 'Delivered' ? 'warning' : 'success'),
        }, ...__VLS_functionalComponentArgsRest(__VLS_69));
        __VLS_71.slots.default;
        (row.status === 'Delivered' ? '待撥款' : '已撥款');
        var __VLS_71;
    }
    var __VLS_67;
    const __VLS_72 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        label: "操作",
        width: "120",
        fixed: "right",
    }));
    const __VLS_74 = __VLS_73({
        label: "操作",
        width: "120",
        fixed: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    __VLS_75.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_75.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        if (row.status === 'Delivered') {
            const __VLS_76 = {}.ElPopconfirm;
            /** @type {[typeof __VLS_components.ElPopconfirm, typeof __VLS_components.elPopconfirm, typeof __VLS_components.ElPopconfirm, typeof __VLS_components.elPopconfirm, ]} */ ;
            // @ts-ignore
            const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
                ...{ 'onConfirm': {} },
                title: "確認撥款？此操作將通知攝影師。",
                confirmButtonText: "確認撥款",
                cancelButtonText: "取消",
            }));
            const __VLS_78 = __VLS_77({
                ...{ 'onConfirm': {} },
                title: "確認撥款？此操作將通知攝影師。",
                confirmButtonText: "確認撥款",
                cancelButtonText: "取消",
            }, ...__VLS_functionalComponentArgsRest(__VLS_77));
            let __VLS_80;
            let __VLS_81;
            let __VLS_82;
            const __VLS_83 = {
                onConfirm: (...[$event]) => {
                    if (!!(__VLS_ctx.loading))
                        return;
                    if (!!(__VLS_ctx.filteredOrders.length === 0))
                        return;
                    if (!(row.status === 'Delivered'))
                        return;
                    __VLS_ctx.handlePayout(row);
                }
            };
            __VLS_79.slots.default;
            {
                const { reference: __VLS_thisSlot } = __VLS_79.slots;
                const __VLS_84 = {}.ElButton;
                /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
                // @ts-ignore
                const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
                    type: "primary",
                    size: "small",
                }));
                const __VLS_86 = __VLS_85({
                    type: "primary",
                    size: "small",
                }, ...__VLS_functionalComponentArgsRest(__VLS_85));
                __VLS_87.slots.default;
                var __VLS_87;
            }
            var __VLS_79;
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "text-gray-400 text-sm" },
            });
        }
    }
    var __VLS_75;
    var __VLS_35;
}
if (__VLS_ctx.filteredOrders.length > __VLS_ctx.pageSize) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-center mt-4" },
    });
    const __VLS_88 = {}.ElPagination;
    /** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
        currentPage: (__VLS_ctx.currentPage),
        pageSize: (__VLS_ctx.pageSize),
        total: (__VLS_ctx.filteredOrders.length),
        layout: "prev, pager, next, total",
        background: true,
    }));
    const __VLS_90 = __VLS_89({
        currentPage: (__VLS_ctx.currentPage),
        pageSize: (__VLS_ctx.pageSize),
        total: (__VLS_ctx.filteredOrders.length),
        layout: "prev, pager, next, total",
        background: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
}
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-12']} */ ;
/** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-600']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Search: Search,
            Loading: Loading,
            loading: loading,
            searchKeyword: searchKeyword,
            statusFilter: statusFilter,
            currentPage: currentPage,
            pageSize: pageSize,
            filteredOrders: filteredOrders,
            loadData: loadData,
            handlePayout: handlePayout,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=Payout.vue.js.map