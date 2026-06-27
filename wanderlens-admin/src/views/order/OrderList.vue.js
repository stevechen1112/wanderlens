/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, watch, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import { Search, Plus, ArrowRight } from '@element-plus/icons-vue';
import api from '@/api';
import { useOrderStatus } from '@/composables/useOrderStatus';
const { t } = useI18n();
const { statusLabel, statusTagType } = useOrderStatus();
const activeTab = ref('all');
const orders = ref([]);
const searchKeyword = ref('');
const showAddDialog = ref(false);
const adding = ref(false);
const searchingProvider = ref(false);
const serviceTypes = ref([]);
const photographerOptions = ref([]);
const addForm = reactive({
    serviceTypeId: '', providerId: '', customerName: '', customerPhone: '',
    shootingDate: '', timeStart: '10:00', timeEnd: '12:00',
    adultNum: 1, childNum: 0, totalFee: 1600, remark: '',
});
const filteredOrders = computed(() => {
    if (!searchKeyword.value)
        return orders.value;
    const kw = searchKeyword.value.toLowerCase();
    return orders.value.filter(o => o.orderNo?.toLowerCase().includes(kw) || o.customerName?.toLowerCase().includes(kw));
});
const normalizeOrders = (res) => {
    const data = res?.data;
    if (Array.isArray(data))
        return data;
    if (data?.records)
        return data.records;
    return [];
};
watch(activeTab, async (val) => {
    try {
        const res = val === 'all'
            ? await api.getOrders({ page: 1, size: 100 })
            : await api.getOrdersByStatus(val);
        orders.value = normalizeOrders(res);
    }
    catch {
        orders.value = [];
    }
});
const searchPhotographer = async (query) => {
    if (!query) {
        photographerOptions.value = [];
        return;
    }
    searchingProvider.value = true;
    try {
        const res = await api.getProviders({ keyword: query });
        photographerOptions.value = (res.data || []).filter((p) => p.providerType === 'PHOTOGRAPHER' || p.providerType === 'photographer');
    }
    catch {
        photographerOptions.value = [];
    }
    finally {
        searchingProvider.value = false;
    }
};
const createOrder = async () => {
    if (!addForm.serviceTypeId || !addForm.providerId || !addForm.customerName || !addForm.customerPhone || !addForm.shootingDate) {
        ElMessage.warning(t('order.list.requiredFields'));
        return;
    }
    adding.value = true;
    try {
        await api.manualOrder(addForm);
        ElMessage.success(t('order.list.createSuccess'));
        showAddDialog.value = false;
        Object.assign(addForm, { serviceTypeId: '', providerId: '', customerName: '', customerPhone: '', shootingDate: '', timeStart: '10:00', timeEnd: '12:00', adultNum: 1, childNum: 0, totalFee: 1600, remark: '' });
        await reload();
    }
    catch {
        ElMessage.error(t('order.list.createFailed'));
    }
    finally {
        adding.value = false;
    }
};
const reload = async () => {
    try {
        const res = activeTab.value === 'all'
            ? await api.getOrders({ page: 1, size: 100 })
            : await api.getOrdersByStatus(activeTab.value);
        orders.value = normalizeOrders(res);
    }
    catch {
        orders.value = [];
    }
};
onMounted(async () => {
    await reload();
    try {
        const stRes = await api.getServiceTypes();
        serviceTypes.value = stRes.data || [];
    }
    catch { /* 靜默 */ }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
const __VLS_0 = {}.ElBreadcrumb;
/** @type {[typeof __VLS_components.ElBreadcrumb, typeof __VLS_components.elBreadcrumb, typeof __VLS_components.ElBreadcrumb, typeof __VLS_components.elBreadcrumb, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    separatorIcon: (__VLS_ctx.ArrowRight),
    ...{ class: "mb-4" },
}));
const __VLS_2 = __VLS_1({
    separatorIcon: (__VLS_ctx.ArrowRight),
    ...{ class: "mb-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.ElBreadcrumbItem;
/** @type {[typeof __VLS_components.ElBreadcrumbItem, typeof __VLS_components.elBreadcrumbItem, typeof __VLS_components.ElBreadcrumbItem, typeof __VLS_components.elBreadcrumbItem, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({}));
const __VLS_6 = __VLS_5({}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
(__VLS_ctx.t('order.list.breadcrumbGroup'));
var __VLS_7;
const __VLS_8 = {}.ElBreadcrumbItem;
/** @type {[typeof __VLS_components.ElBreadcrumbItem, typeof __VLS_components.elBreadcrumbItem, typeof __VLS_components.ElBreadcrumbItem, typeof __VLS_components.elBreadcrumbItem, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({}));
const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
(__VLS_ctx.t('order.list.breadcrumb'));
var __VLS_11;
var __VLS_3;
const __VLS_12 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    ...{ class: "mb-4" },
}));
const __VLS_14 = __VLS_13({
    ...{ class: "mb-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
const __VLS_16 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    span: (16),
}));
const __VLS_18 = __VLS_17({
    span: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
const __VLS_20 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    modelValue: (__VLS_ctx.searchKeyword),
    placeholder: (__VLS_ctx.t('order.list.searchPlaceholder')),
    ...{ style: {} },
    clearable: true,
    prefixIcon: (__VLS_ctx.Search),
    ...{ class: "mr-2" },
}));
const __VLS_22 = __VLS_21({
    modelValue: (__VLS_ctx.searchKeyword),
    placeholder: (__VLS_ctx.t('order.list.searchPlaceholder')),
    ...{ style: {} },
    clearable: true,
    prefixIcon: (__VLS_ctx.Search),
    ...{ class: "mr-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const __VLS_24 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_26 = __VLS_25({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
let __VLS_28;
let __VLS_29;
let __VLS_30;
const __VLS_31 = {
    onClick: (__VLS_ctx.reload)
};
__VLS_27.slots.default;
(__VLS_ctx.t('order.list.search'));
var __VLS_27;
var __VLS_19;
const __VLS_32 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    span: (8),
    ...{ style: {} },
}));
const __VLS_34 = __VLS_33({
    span: (8),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
const __VLS_36 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Plus),
}));
const __VLS_38 = __VLS_37({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Plus),
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
let __VLS_40;
let __VLS_41;
let __VLS_42;
const __VLS_43 = {
    onClick: (...[$event]) => {
        __VLS_ctx.showAddDialog = true;
    }
};
__VLS_39.slots.default;
(__VLS_ctx.t('order.list.createOrder'));
var __VLS_39;
var __VLS_35;
var __VLS_15;
const __VLS_44 = {}.ElTabs;
/** @type {[typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    modelValue: (__VLS_ctx.activeTab),
}));
const __VLS_46 = __VLS_45({
    modelValue: (__VLS_ctx.activeTab),
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
const __VLS_48 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    label: (__VLS_ctx.t('order.list.tabAll')),
    name: "all",
}));
const __VLS_50 = __VLS_49({
    label: (__VLS_ctx.t('order.list.tabAll')),
    name: "all",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
const __VLS_52 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    label: (__VLS_ctx.t('order.list.tabPending')),
    name: "PendingPayment",
}));
const __VLS_54 = __VLS_53({
    label: (__VLS_ctx.t('order.list.tabPending')),
    name: "PendingPayment",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
const __VLS_56 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    label: (__VLS_ctx.t('order.list.tabPaid')),
    name: "Paid",
}));
const __VLS_58 = __VLS_57({
    label: (__VLS_ctx.t('order.list.tabPaid')),
    name: "Paid",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
const __VLS_60 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    label: (__VLS_ctx.t('order.list.tabUploading')),
    name: "UploadingRaw",
}));
const __VLS_62 = __VLS_61({
    label: (__VLS_ctx.t('order.list.tabUploading')),
    name: "UploadingRaw",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
const __VLS_64 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    label: (__VLS_ctx.t('order.list.tabClosed')),
    name: "Closed",
}));
const __VLS_66 = __VLS_65({
    label: (__VLS_ctx.t('order.list.tabClosed')),
    name: "Closed",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
var __VLS_47;
const __VLS_68 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    ...{ 'onRowClick': {} },
    data: (__VLS_ctx.filteredOrders),
    border: true,
}));
const __VLS_70 = __VLS_69({
    ...{ 'onRowClick': {} },
    data: (__VLS_ctx.filteredOrders),
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
let __VLS_72;
let __VLS_73;
let __VLS_74;
const __VLS_75 = {
    onRowClick: ((row) => __VLS_ctx.$router.push(`/orders/${row.id}`))
};
__VLS_71.slots.default;
const __VLS_76 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    prop: "orderNo",
    label: (__VLS_ctx.t('order.list.orderNo')),
    width: "180",
}));
const __VLS_78 = __VLS_77({
    prop: "orderNo",
    label: (__VLS_ctx.t('order.list.orderNo')),
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
const __VLS_80 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    prop: "customerName",
    label: (__VLS_ctx.t('order.list.customer')),
    width: "100",
}));
const __VLS_82 = __VLS_81({
    prop: "customerName",
    label: (__VLS_ctx.t('order.list.customer')),
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
const __VLS_84 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    prop: "shootingDate",
    label: (__VLS_ctx.t('order.list.shootDate')),
    width: "120",
}));
const __VLS_86 = __VLS_85({
    prop: "shootingDate",
    label: (__VLS_ctx.t('order.list.shootDate')),
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
const __VLS_88 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    label: (__VLS_ctx.t('order.list.status')),
    width: "120",
}));
const __VLS_90 = __VLS_89({
    label: (__VLS_ctx.t('order.list.status')),
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_91.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_91.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_92 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        size: "small",
        type: (__VLS_ctx.statusTagType(row.status)),
    }));
    const __VLS_94 = __VLS_93({
        size: "small",
        type: (__VLS_ctx.statusTagType(row.status)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    __VLS_95.slots.default;
    (__VLS_ctx.statusLabel(row.status));
    var __VLS_95;
}
var __VLS_91;
const __VLS_96 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    label: (__VLS_ctx.t('order.list.amount')),
    width: "100",
}));
const __VLS_98 = __VLS_97({
    label: (__VLS_ctx.t('order.list.amount')),
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
__VLS_99.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_99.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.totalFee?.toLocaleString() || 0);
}
var __VLS_99;
var __VLS_71;
const __VLS_100 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    modelValue: (__VLS_ctx.showAddDialog),
    title: (__VLS_ctx.t('order.list.dialogTitle')),
    width: "650px",
}));
const __VLS_102 = __VLS_101({
    modelValue: (__VLS_ctx.showAddDialog),
    title: (__VLS_ctx.t('order.list.dialogTitle')),
    width: "650px",
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
__VLS_103.slots.default;
const __VLS_104 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    model: (__VLS_ctx.addForm),
    labelPosition: "top",
}));
const __VLS_106 = __VLS_105({
    model: (__VLS_ctx.addForm),
    labelPosition: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
__VLS_107.slots.default;
const __VLS_108 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    gutter: (16),
}));
const __VLS_110 = __VLS_109({
    gutter: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
__VLS_111.slots.default;
const __VLS_112 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    span: (12),
}));
const __VLS_114 = __VLS_113({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
__VLS_115.slots.default;
const __VLS_116 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    label: (__VLS_ctx.t('order.list.serviceType')),
    required: true,
}));
const __VLS_118 = __VLS_117({
    label: (__VLS_ctx.t('order.list.serviceType')),
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
__VLS_119.slots.default;
const __VLS_120 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    modelValue: (__VLS_ctx.addForm.serviceTypeId),
    placeholder: (__VLS_ctx.t('order.list.selectServiceType')),
    filterable: true,
}));
const __VLS_122 = __VLS_121({
    modelValue: (__VLS_ctx.addForm.serviceTypeId),
    placeholder: (__VLS_ctx.t('order.list.selectServiceType')),
    filterable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
__VLS_123.slots.default;
for (const [st] of __VLS_getVForSourceType((__VLS_ctx.serviceTypes))) {
    const __VLS_124 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
        key: (st.id),
        label: (st.name),
        value: (st.id),
    }));
    const __VLS_126 = __VLS_125({
        key: (st.id),
        label: (st.name),
        value: (st.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
}
var __VLS_123;
var __VLS_119;
var __VLS_115;
const __VLS_128 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
    span: (12),
}));
const __VLS_130 = __VLS_129({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
__VLS_131.slots.default;
const __VLS_132 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
    label: (__VLS_ctx.t('order.list.photographer')),
    required: true,
}));
const __VLS_134 = __VLS_133({
    label: (__VLS_ctx.t('order.list.photographer')),
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
__VLS_135.slots.default;
const __VLS_136 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
    modelValue: (__VLS_ctx.addForm.providerId),
    placeholder: (__VLS_ctx.t('order.list.searchPhotographer')),
    filterable: true,
    remote: true,
    remoteMethod: (__VLS_ctx.searchPhotographer),
    loading: (__VLS_ctx.searchingProvider),
}));
const __VLS_138 = __VLS_137({
    modelValue: (__VLS_ctx.addForm.providerId),
    placeholder: (__VLS_ctx.t('order.list.searchPhotographer')),
    filterable: true,
    remote: true,
    remoteMethod: (__VLS_ctx.searchPhotographer),
    loading: (__VLS_ctx.searchingProvider),
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
__VLS_139.slots.default;
for (const [p] of __VLS_getVForSourceType((__VLS_ctx.photographerOptions))) {
    const __VLS_140 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
        key: (p.id),
        label: (`${p.name} (${p.nickName || ''})`),
        value: (p.id),
    }));
    const __VLS_142 = __VLS_141({
        key: (p.id),
        label: (`${p.name} (${p.nickName || ''})`),
        value: (p.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_141));
}
var __VLS_139;
var __VLS_135;
var __VLS_131;
var __VLS_111;
const __VLS_144 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
    gutter: (16),
}));
const __VLS_146 = __VLS_145({
    gutter: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_145));
__VLS_147.slots.default;
const __VLS_148 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
    span: (12),
}));
const __VLS_150 = __VLS_149({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
__VLS_151.slots.default;
const __VLS_152 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
    label: (__VLS_ctx.t('order.list.customerName')),
    required: true,
}));
const __VLS_154 = __VLS_153({
    label: (__VLS_ctx.t('order.list.customerName')),
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
__VLS_155.slots.default;
const __VLS_156 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
    modelValue: (__VLS_ctx.addForm.customerName),
}));
const __VLS_158 = __VLS_157({
    modelValue: (__VLS_ctx.addForm.customerName),
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
var __VLS_155;
var __VLS_151;
const __VLS_160 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
    span: (12),
}));
const __VLS_162 = __VLS_161({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
__VLS_163.slots.default;
const __VLS_164 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
    label: (__VLS_ctx.t('order.list.customerPhone')),
    required: true,
}));
const __VLS_166 = __VLS_165({
    label: (__VLS_ctx.t('order.list.customerPhone')),
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
__VLS_167.slots.default;
const __VLS_168 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
    modelValue: (__VLS_ctx.addForm.customerPhone),
}));
const __VLS_170 = __VLS_169({
    modelValue: (__VLS_ctx.addForm.customerPhone),
}, ...__VLS_functionalComponentArgsRest(__VLS_169));
var __VLS_167;
var __VLS_163;
var __VLS_147;
const __VLS_172 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
    gutter: (16),
}));
const __VLS_174 = __VLS_173({
    gutter: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_173));
__VLS_175.slots.default;
const __VLS_176 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
    span: (8),
}));
const __VLS_178 = __VLS_177({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
__VLS_179.slots.default;
const __VLS_180 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
    label: (__VLS_ctx.t('order.list.shootingDate')),
    required: true,
}));
const __VLS_182 = __VLS_181({
    label: (__VLS_ctx.t('order.list.shootingDate')),
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_181));
__VLS_183.slots.default;
const __VLS_184 = {}.ElDatePicker;
/** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ ;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
    modelValue: (__VLS_ctx.addForm.shootingDate),
    type: "date",
    valueFormat: "YYYY-MM-DD",
    ...{ style: {} },
}));
const __VLS_186 = __VLS_185({
    modelValue: (__VLS_ctx.addForm.shootingDate),
    type: "date",
    valueFormat: "YYYY-MM-DD",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
var __VLS_183;
var __VLS_179;
const __VLS_188 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
    span: (8),
}));
const __VLS_190 = __VLS_189({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_189));
__VLS_191.slots.default;
const __VLS_192 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
    label: (__VLS_ctx.t('order.list.timeStart')),
}));
const __VLS_194 = __VLS_193({
    label: (__VLS_ctx.t('order.list.timeStart')),
}, ...__VLS_functionalComponentArgsRest(__VLS_193));
__VLS_195.slots.default;
const __VLS_196 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
    modelValue: (__VLS_ctx.addForm.timeStart),
    placeholder: "10:00",
}));
const __VLS_198 = __VLS_197({
    modelValue: (__VLS_ctx.addForm.timeStart),
    placeholder: "10:00",
}, ...__VLS_functionalComponentArgsRest(__VLS_197));
var __VLS_195;
var __VLS_191;
const __VLS_200 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
    span: (8),
}));
const __VLS_202 = __VLS_201({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_201));
__VLS_203.slots.default;
const __VLS_204 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
    label: "結束時間",
}));
const __VLS_206 = __VLS_205({
    label: "結束時間",
}, ...__VLS_functionalComponentArgsRest(__VLS_205));
__VLS_207.slots.default;
const __VLS_208 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
    modelValue: (__VLS_ctx.addForm.timeEnd),
    placeholder: "12:00",
}));
const __VLS_210 = __VLS_209({
    modelValue: (__VLS_ctx.addForm.timeEnd),
    placeholder: "12:00",
}, ...__VLS_functionalComponentArgsRest(__VLS_209));
var __VLS_207;
var __VLS_203;
var __VLS_175;
const __VLS_212 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
    gutter: (16),
}));
const __VLS_214 = __VLS_213({
    gutter: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_213));
__VLS_215.slots.default;
const __VLS_216 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
    span: (8),
}));
const __VLS_218 = __VLS_217({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_217));
__VLS_219.slots.default;
const __VLS_220 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
    label: "大人人數",
}));
const __VLS_222 = __VLS_221({
    label: "大人人數",
}, ...__VLS_functionalComponentArgsRest(__VLS_221));
__VLS_223.slots.default;
const __VLS_224 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
    modelValue: (__VLS_ctx.addForm.adultNum),
    min: (1),
}));
const __VLS_226 = __VLS_225({
    modelValue: (__VLS_ctx.addForm.adultNum),
    min: (1),
}, ...__VLS_functionalComponentArgsRest(__VLS_225));
var __VLS_223;
var __VLS_219;
const __VLS_228 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
    span: (8),
}));
const __VLS_230 = __VLS_229({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_229));
__VLS_231.slots.default;
const __VLS_232 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
    label: "小孩人數",
}));
const __VLS_234 = __VLS_233({
    label: "小孩人數",
}, ...__VLS_functionalComponentArgsRest(__VLS_233));
__VLS_235.slots.default;
const __VLS_236 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
    modelValue: (__VLS_ctx.addForm.childNum),
    min: (0),
}));
const __VLS_238 = __VLS_237({
    modelValue: (__VLS_ctx.addForm.childNum),
    min: (0),
}, ...__VLS_functionalComponentArgsRest(__VLS_237));
var __VLS_235;
var __VLS_231;
const __VLS_240 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({
    span: (8),
}));
const __VLS_242 = __VLS_241({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_241));
__VLS_243.slots.default;
const __VLS_244 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
    label: "金額",
}));
const __VLS_246 = __VLS_245({
    label: "金額",
}, ...__VLS_functionalComponentArgsRest(__VLS_245));
__VLS_247.slots.default;
const __VLS_248 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_249 = __VLS_asFunctionalComponent(__VLS_248, new __VLS_248({
    modelValue: (__VLS_ctx.addForm.totalFee),
    min: (0),
    step: (100),
}));
const __VLS_250 = __VLS_249({
    modelValue: (__VLS_ctx.addForm.totalFee),
    min: (0),
    step: (100),
}, ...__VLS_functionalComponentArgsRest(__VLS_249));
var __VLS_247;
var __VLS_243;
var __VLS_215;
const __VLS_252 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({
    label: "備註",
}));
const __VLS_254 = __VLS_253({
    label: "備註",
}, ...__VLS_functionalComponentArgsRest(__VLS_253));
__VLS_255.slots.default;
const __VLS_256 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_257 = __VLS_asFunctionalComponent(__VLS_256, new __VLS_256({
    modelValue: (__VLS_ctx.addForm.remark),
    type: "textarea",
    rows: (2),
}));
const __VLS_258 = __VLS_257({
    modelValue: (__VLS_ctx.addForm.remark),
    type: "textarea",
    rows: (2),
}, ...__VLS_functionalComponentArgsRest(__VLS_257));
var __VLS_255;
var __VLS_107;
{
    const { footer: __VLS_thisSlot } = __VLS_103.slots;
    const __VLS_260 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_261 = __VLS_asFunctionalComponent(__VLS_260, new __VLS_260({
        ...{ 'onClick': {} },
    }));
    const __VLS_262 = __VLS_261({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_261));
    let __VLS_264;
    let __VLS_265;
    let __VLS_266;
    const __VLS_267 = {
        onClick: (...[$event]) => {
            __VLS_ctx.showAddDialog = false;
        }
    };
    __VLS_263.slots.default;
    var __VLS_263;
    const __VLS_268 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_269 = __VLS_asFunctionalComponent(__VLS_268, new __VLS_268({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.adding),
    }));
    const __VLS_270 = __VLS_269({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.adding),
    }, ...__VLS_functionalComponentArgsRest(__VLS_269));
    let __VLS_272;
    let __VLS_273;
    let __VLS_274;
    const __VLS_275 = {
        onClick: (__VLS_ctx.createOrder)
    };
    __VLS_271.slots.default;
    var __VLS_271;
}
var __VLS_103;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Search: Search,
            Plus: Plus,
            ArrowRight: ArrowRight,
            t: t,
            statusLabel: statusLabel,
            statusTagType: statusTagType,
            activeTab: activeTab,
            searchKeyword: searchKeyword,
            showAddDialog: showAddDialog,
            adding: adding,
            searchingProvider: searchingProvider,
            serviceTypes: serviceTypes,
            photographerOptions: photographerOptions,
            addForm: addForm,
            filteredOrders: filteredOrders,
            searchPhotographer: searchPhotographer,
            createOrder: createOrder,
            reload: reload,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=OrderList.vue.js.map