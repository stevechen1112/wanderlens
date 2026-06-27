/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import api from '@/api';
import { useOrderStatus } from '@/composables/useOrderStatus';
const { t } = useI18n();
const { statusLabel, statusTagType } = useOrderStatus();
const STATUS_FILTER_CODES = [
    'WaitingProviderContact', 'Confirmed', 'ReadyToShoot', 'ShootingStarted',
    'ShootingEnded', 'UploadingRaw', 'AiProcessing', 'Delivered', 'Closed',
];
const orders = ref([]);
const tableLoading = ref(false);
const statusFilter = ref('');
const currentPage = ref(1);
const pageSize = 10;
const filteredOrders = computed(() => {
    if (!statusFilter.value)
        return orders.value;
    return orders.value.filter(o => o.status === statusFilter.value);
});
const pagedOrders = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return filteredOrders.value.slice(start, start + pageSize);
});
const pendingContact = computed(() => orders.value.filter(o => o.status === 'WaitingProviderContact').length);
const shootingCount = computed(() => orders.value.filter(o => o.status === 'ShootingStarted').length);
const pendingUpload = computed(() => orders.value.filter(o => o.status === 'ShootingEnded' || o.status === 'UploadingRaw').length);
const quickContact = async (orderId) => {
    try {
        await api.contactCustomer(orderId);
        ElMessage.success(t('order.myOrder.contactSuccess'));
        await loadOrders();
    }
    catch {
        ElMessage.error(t('common.failed', '失敗'));
    }
};
const quickConfirmReady = async (orderId) => {
    try {
        await api.confirmReadyToShoot(orderId);
        ElMessage.success(t('order.myOrder.confirmReadySuccess'));
        await loadOrders();
    }
    catch {
        ElMessage.error(t('common.failed', '失敗'));
    }
};
const loadOrders = async () => {
    tableLoading.value = true;
    try {
        const res = await api.getMyOrders();
        orders.value = res.data || [];
    }
    catch {
        orders.value = [];
        ElMessage.error(t('order.myOrder.loadFailed'));
    }
    finally {
        tableLoading.value = false;
    }
};
onMounted(loadOrders);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
const __VLS_0 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    gutter: (16),
    ...{ class: "mb-4" },
}));
const __VLS_2 = __VLS_1({
    gutter: (16),
    ...{ class: "mb-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    xs: (12),
    sm: (12),
    md: (6),
}));
const __VLS_6 = __VLS_5({
    xs: (12),
    sm: (12),
    md: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
const __VLS_8 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    shadow: "hover",
    ...{ class: "stat-card" },
}));
const __VLS_10 = __VLS_9({
    shadow: "hover",
    ...{ class: "stat-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-sm text-gray-500 mb-1" },
});
(__VLS_ctx.t('order.myOrder.totalOrders'));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-2xl font-bold" },
    ...{ style: {} },
});
(__VLS_ctx.orders.length);
var __VLS_11;
var __VLS_7;
const __VLS_12 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    xs: (12),
    sm: (12),
    md: (6),
}));
const __VLS_14 = __VLS_13({
    xs: (12),
    sm: (12),
    md: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
const __VLS_16 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    shadow: "hover",
    ...{ class: "stat-card" },
}));
const __VLS_18 = __VLS_17({
    shadow: "hover",
    ...{ class: "stat-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-sm text-gray-500 mb-1" },
});
(__VLS_ctx.t('order.myOrder.pendingContact'));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-2xl font-bold" },
    ...{ style: {} },
});
(__VLS_ctx.pendingContact);
var __VLS_19;
var __VLS_15;
const __VLS_20 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    xs: (12),
    sm: (12),
    md: (6),
}));
const __VLS_22 = __VLS_21({
    xs: (12),
    sm: (12),
    md: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
const __VLS_24 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    shadow: "hover",
    ...{ class: "stat-card" },
}));
const __VLS_26 = __VLS_25({
    shadow: "hover",
    ...{ class: "stat-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-sm text-gray-500 mb-1" },
});
(__VLS_ctx.t('order.myOrder.shooting'));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-2xl font-bold" },
    ...{ style: {} },
});
(__VLS_ctx.shootingCount);
var __VLS_27;
var __VLS_23;
const __VLS_28 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    xs: (12),
    sm: (12),
    md: (6),
}));
const __VLS_30 = __VLS_29({
    xs: (12),
    sm: (12),
    md: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_31.slots.default;
const __VLS_32 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    shadow: "hover",
    ...{ class: "stat-card" },
}));
const __VLS_34 = __VLS_33({
    shadow: "hover",
    ...{ class: "stat-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-sm text-gray-500 mb-1" },
});
(__VLS_ctx.t('order.myOrder.pendingUpload'));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-2xl font-bold" },
    ...{ style: {} },
});
(__VLS_ctx.pendingUpload);
var __VLS_35;
var __VLS_31;
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center gap-3 mb-4" },
});
const __VLS_36 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    modelValue: (__VLS_ctx.statusFilter),
    placeholder: (__VLS_ctx.t('order.myOrder.allStatus')),
    clearable: true,
    ...{ style: {} },
}));
const __VLS_38 = __VLS_37({
    modelValue: (__VLS_ctx.statusFilter),
    placeholder: (__VLS_ctx.t('order.myOrder.allStatus')),
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
for (const [code] of __VLS_getVForSourceType((__VLS_ctx.STATUS_FILTER_CODES))) {
    const __VLS_40 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        key: (code),
        label: (__VLS_ctx.statusLabel(code)),
        value: (code),
    }));
    const __VLS_42 = __VLS_41({
        key: (code),
        label: (__VLS_ctx.statusLabel(code)),
        value: (code),
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
}
var __VLS_39;
const __VLS_44 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    ...{ 'onClick': {} },
}));
const __VLS_46 = __VLS_45({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
let __VLS_48;
let __VLS_49;
let __VLS_50;
const __VLS_51 = {
    onClick: (__VLS_ctx.loadOrders)
};
__VLS_47.slots.default;
(__VLS_ctx.t('order.myOrder.refresh'));
var __VLS_47;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "wl-table-scroll" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.tableLoading) }, null, null);
const __VLS_52 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    data: (__VLS_ctx.pagedOrders),
    border: true,
    stripe: true,
}));
const __VLS_54 = __VLS_53({
    data: (__VLS_ctx.pagedOrders),
    border: true,
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
const __VLS_56 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    prop: "orderNo",
    label: (__VLS_ctx.t('order.myOrder.orderNo')),
    width: "170",
}));
const __VLS_58 = __VLS_57({
    prop: "orderNo",
    label: (__VLS_ctx.t('order.myOrder.orderNo')),
    width: "170",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
const __VLS_60 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    label: (__VLS_ctx.t('order.myOrder.customer')),
    width: "160",
}));
const __VLS_62 = __VLS_61({
    label: (__VLS_ctx.t('order.myOrder.customer')),
    width: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_63.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    (row.customerName);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-xs text-gray-400" },
    });
    (row.customerPhone);
}
var __VLS_63;
const __VLS_64 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    label: (__VLS_ctx.t('order.myOrder.shootTime')),
    width: "180",
}));
const __VLS_66 = __VLS_65({
    label: (__VLS_ctx.t('order.myOrder.shootTime')),
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
__VLS_67.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_67.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    (row.shootingDate);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-xs text-gray-400" },
    });
    (row.shootingTime);
    (row.shootingDuration);
}
var __VLS_67;
const __VLS_68 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    label: (__VLS_ctx.t('order.myOrder.status')),
    width: "120",
}));
const __VLS_70 = __VLS_69({
    label: (__VLS_ctx.t('order.myOrder.status')),
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_71.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_72 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        type: (__VLS_ctx.statusTagType(row.status)),
        size: "small",
    }));
    const __VLS_74 = __VLS_73({
        type: (__VLS_ctx.statusTagType(row.status)),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    __VLS_75.slots.default;
    (__VLS_ctx.statusLabel(row.status));
    var __VLS_75;
}
var __VLS_71;
const __VLS_76 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    label: (__VLS_ctx.t('order.myOrder.contacted')),
    width: "80",
}));
const __VLS_78 = __VLS_77({
    label: (__VLS_ctx.t('order.myOrder.contacted')),
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_79.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (row.status !== 'WaitingProviderContact') {
        const __VLS_80 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
            type: "success",
            size: "small",
        }));
        const __VLS_82 = __VLS_81({
            type: "success",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_81));
        __VLS_83.slots.default;
        (__VLS_ctx.t('order.myOrder.yes'));
        var __VLS_83;
    }
    else {
        const __VLS_84 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
            type: "warning",
            size: "small",
        }));
        const __VLS_86 = __VLS_85({
            type: "warning",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_85));
        __VLS_87.slots.default;
        (__VLS_ctx.t('order.myOrder.no'));
        var __VLS_87;
    }
}
var __VLS_79;
const __VLS_88 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    label: (__VLS_ctx.t('order.myOrder.photoCount')),
    width: "80",
}));
const __VLS_90 = __VLS_89({
    label: (__VLS_ctx.t('order.myOrder.photoCount')),
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_91.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_91.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (row.picNum > 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-green-600 font-semibold" },
        });
        (row.picNum);
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-gray-400" },
        });
    }
}
var __VLS_91;
const __VLS_92 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    label: (__VLS_ctx.t('order.myOrder.profit')),
    width: "100",
}));
const __VLS_94 = __VLS_93({
    label: (__VLS_ctx.t('order.myOrder.profit')),
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
__VLS_95.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_95.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.photographerProfit?.toLocaleString() || 0);
}
var __VLS_95;
const __VLS_96 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    label: (__VLS_ctx.t('order.myOrder.payDate')),
    width: "120",
}));
const __VLS_98 = __VLS_97({
    label: (__VLS_ctx.t('order.myOrder.payDate')),
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
__VLS_99.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_99.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (row.payDate) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-xs" },
        });
        (row.payDate);
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-gray-400" },
        });
    }
}
var __VLS_99;
const __VLS_100 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    label: (__VLS_ctx.t('order.myOrder.actions')),
    width: "240",
    fixed: "right",
}));
const __VLS_102 = __VLS_101({
    label: (__VLS_ctx.t('order.myOrder.actions')),
    width: "240",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
__VLS_103.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_103.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_104 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
        ...{ 'onClick': {} },
        text: true,
        type: "primary",
    }));
    const __VLS_106 = __VLS_105({
        ...{ 'onClick': {} },
        text: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    let __VLS_108;
    let __VLS_109;
    let __VLS_110;
    const __VLS_111 = {
        onClick: (...[$event]) => {
            __VLS_ctx.$router.push(`/my-order/${row.id}`);
        }
    };
    __VLS_107.slots.default;
    (__VLS_ctx.t('order.myOrder.detail'));
    var __VLS_107;
    if (row.status === 'WaitingProviderContact') {
        const __VLS_112 = {}.ElPopconfirm;
        /** @type {[typeof __VLS_components.ElPopconfirm, typeof __VLS_components.elPopconfirm, typeof __VLS_components.ElPopconfirm, typeof __VLS_components.elPopconfirm, ]} */ ;
        // @ts-ignore
        const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
            ...{ 'onConfirm': {} },
            title: (__VLS_ctx.t('order.myOrder.confirmContact')),
            confirmButtonText: (__VLS_ctx.t('common.confirm', '確認')),
            cancelButtonText: (__VLS_ctx.t('common.cancel')),
        }));
        const __VLS_114 = __VLS_113({
            ...{ 'onConfirm': {} },
            title: (__VLS_ctx.t('order.myOrder.confirmContact')),
            confirmButtonText: (__VLS_ctx.t('common.confirm', '確認')),
            cancelButtonText: (__VLS_ctx.t('common.cancel')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_113));
        let __VLS_116;
        let __VLS_117;
        let __VLS_118;
        const __VLS_119 = {
            onConfirm: (...[$event]) => {
                if (!(row.status === 'WaitingProviderContact'))
                    return;
                __VLS_ctx.quickContact(row.id);
            }
        };
        __VLS_115.slots.default;
        {
            const { reference: __VLS_thisSlot } = __VLS_115.slots;
            const __VLS_120 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
                text: true,
                type: "warning",
                size: "small",
            }));
            const __VLS_122 = __VLS_121({
                text: true,
                type: "warning",
                size: "small",
            }, ...__VLS_functionalComponentArgsRest(__VLS_121));
            __VLS_123.slots.default;
            (__VLS_ctx.t('order.myOrder.reportContacted'));
            var __VLS_123;
        }
        var __VLS_115;
    }
    if (row.status === 'Confirmed') {
        const __VLS_124 = {}.ElPopconfirm;
        /** @type {[typeof __VLS_components.ElPopconfirm, typeof __VLS_components.elPopconfirm, typeof __VLS_components.ElPopconfirm, typeof __VLS_components.elPopconfirm, ]} */ ;
        // @ts-ignore
        const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
            ...{ 'onConfirm': {} },
            title: (__VLS_ctx.t('order.myOrder.confirmReadyPrompt')),
            confirmButtonText: (__VLS_ctx.t('common.confirm', '確認')),
            cancelButtonText: (__VLS_ctx.t('common.cancel')),
        }));
        const __VLS_126 = __VLS_125({
            ...{ 'onConfirm': {} },
            title: (__VLS_ctx.t('order.myOrder.confirmReadyPrompt')),
            confirmButtonText: (__VLS_ctx.t('common.confirm', '確認')),
            cancelButtonText: (__VLS_ctx.t('common.cancel')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_125));
        let __VLS_128;
        let __VLS_129;
        let __VLS_130;
        const __VLS_131 = {
            onConfirm: (...[$event]) => {
                if (!(row.status === 'Confirmed'))
                    return;
                __VLS_ctx.quickConfirmReady(row.id);
            }
        };
        __VLS_127.slots.default;
        {
            const { reference: __VLS_thisSlot } = __VLS_127.slots;
            const __VLS_132 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
                text: true,
                type: "primary",
                size: "small",
            }));
            const __VLS_134 = __VLS_133({
                text: true,
                type: "primary",
                size: "small",
            }, ...__VLS_functionalComponentArgsRest(__VLS_133));
            __VLS_135.slots.default;
            (__VLS_ctx.t('order.myOrder.confirmReady'));
            var __VLS_135;
        }
        var __VLS_127;
    }
    if (row.status === 'ShootingEnded' || row.status === 'UploadingRaw') {
        const __VLS_136 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
            ...{ 'onClick': {} },
            text: true,
            type: "success",
            size: "small",
        }));
        const __VLS_138 = __VLS_137({
            ...{ 'onClick': {} },
            text: true,
            type: "success",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_137));
        let __VLS_140;
        let __VLS_141;
        let __VLS_142;
        const __VLS_143 = {
            onClick: (...[$event]) => {
                if (!(row.status === 'ShootingEnded' || row.status === 'UploadingRaw'))
                    return;
                __VLS_ctx.$router.push(`/my-order/${row.id}`);
            }
        };
        __VLS_139.slots.default;
        (__VLS_ctx.t('order.myOrder.uploadRaw'));
        var __VLS_139;
    }
}
var __VLS_103;
var __VLS_55;
if (__VLS_ctx.filteredOrders.length > __VLS_ctx.pageSize) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-center mt-4" },
    });
    const __VLS_144 = {}.ElPagination;
    /** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
    // @ts-ignore
    const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
        currentPage: (__VLS_ctx.currentPage),
        pageSize: (__VLS_ctx.pageSize),
        total: (__VLS_ctx.filteredOrders.length),
        layout: "prev, pager, next, total",
        background: true,
    }));
    const __VLS_146 = __VLS_145({
        currentPage: (__VLS_ctx.currentPage),
        pageSize: (__VLS_ctx.pageSize),
        total: (__VLS_ctx.filteredOrders.length),
        layout: "prev, pager, next, total",
        background: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_145));
}
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['wl-table-scroll']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-600']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            t: t,
            statusLabel: statusLabel,
            statusTagType: statusTagType,
            STATUS_FILTER_CODES: STATUS_FILTER_CODES,
            orders: orders,
            tableLoading: tableLoading,
            statusFilter: statusFilter,
            currentPage: currentPage,
            pageSize: pageSize,
            filteredOrders: filteredOrders,
            pagedOrders: pagedOrders,
            pendingContact: pendingContact,
            shootingCount: shootingCount,
            pendingUpload: pendingUpload,
            quickContact: quickContact,
            quickConfirmReady: quickConfirmReady,
            loadOrders: loadOrders,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=MyOrder.vue.js.map