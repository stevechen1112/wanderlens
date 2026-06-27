/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import api from '@/api';
import { useOrderStatus } from '@/composables/useOrderStatus';
const { t } = useI18n();
const { statusLabel, statusTagType } = useOrderStatus();
const orders = ref([]);
const loading = ref(false);
const acting = ref(null);
const rejectVisible = ref(false);
const rejectReason = ref('');
const rejectTarget = ref(null);
const fetchOrders = async () => {
    loading.value = true;
    try {
        const res = await api.getOrdersByStatus('UploadingRaw');
        orders.value = res.data?.records || res.data || [];
    }
    catch {
        ElMessage.error(t('media.rawVerify.loadFailed'));
    }
    finally {
        loading.value = false;
    }
};
const approve = async (row) => {
    acting.value = row.id;
    try {
        await api.approveRawVerify(row.id, row.picNum || 0, 0);
        ElMessage.success(t('media.rawVerify.approveSuccess'));
        await fetchOrders();
    }
    catch {
        ElMessage.error(t('media.rawVerify.actionFailed'));
    }
    finally {
        acting.value = null;
    }
};
const openReject = (row) => {
    rejectTarget.value = row;
    rejectReason.value = '';
    rejectVisible.value = true;
};
const confirmReject = async () => {
    if (!rejectReason.value.trim()) {
        ElMessage.warning(t('media.rawVerify.rejectReasonRequired'));
        return;
    }
    acting.value = rejectTarget.value.id;
    try {
        await api.rejectRawVerify(rejectTarget.value.id, rejectReason.value);
        ElMessage.success(t('media.rawVerify.rejectSuccess'));
        rejectVisible.value = false;
        await fetchOrders();
    }
    catch {
        ElMessage.error(t('media.rawVerify.actionFailed'));
    }
    finally {
        acting.value = null;
    }
};
onMounted(fetchOrders);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "font-semibold mb-4" },
});
(__VLS_ctx.t('media.rawVerify.title'));
const __VLS_0 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    data: (__VLS_ctx.orders),
    border: true,
    emptyText: (__VLS_ctx.t('media.rawVerify.empty')),
}));
const __VLS_2 = __VLS_1({
    data: (__VLS_ctx.orders),
    border: true,
    emptyText: (__VLS_ctx.t('media.rawVerify.empty')),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
__VLS_3.slots.default;
const __VLS_4 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    prop: "orderNo",
    label: (__VLS_ctx.t('media.rawVerify.orderNo')),
    width: "180",
}));
const __VLS_6 = __VLS_5({
    prop: "orderNo",
    label: (__VLS_ctx.t('media.rawVerify.orderNo')),
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
const __VLS_8 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    prop: "photographerId",
    label: (__VLS_ctx.t('media.rawVerify.photographerId')),
    width: "100",
}));
const __VLS_10 = __VLS_9({
    prop: "photographerId",
    label: (__VLS_ctx.t('media.rawVerify.photographerId')),
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
const __VLS_12 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    label: (__VLS_ctx.t('media.rawVerify.fileCount')),
    width: "80",
}));
const __VLS_14 = __VLS_13({
    label: (__VLS_ctx.t('media.rawVerify.fileCount')),
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_15.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.picNum || '—');
}
var __VLS_15;
const __VLS_16 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    label: (__VLS_ctx.t('media.rawVerify.status')),
    width: "140",
}));
const __VLS_18 = __VLS_17({
    label: (__VLS_ctx.t('media.rawVerify.status')),
    width: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_19.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_20 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        type: (__VLS_ctx.statusTagType(row.status)),
        size: "small",
    }));
    const __VLS_22 = __VLS_21({
        type: (__VLS_ctx.statusTagType(row.status)),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    __VLS_23.slots.default;
    (__VLS_ctx.statusLabel(row.status));
    var __VLS_23;
}
var __VLS_19;
const __VLS_24 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    label: (__VLS_ctx.t('media.rawVerify.actions')),
    width: "220",
    fixed: "right",
}));
const __VLS_26 = __VLS_25({
    label: (__VLS_ctx.t('media.rawVerify.actions')),
    width: "220",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_27.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_28 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        ...{ 'onClick': {} },
        type: "success",
        size: "small",
        loading: (__VLS_ctx.acting === row.id),
    }));
    const __VLS_30 = __VLS_29({
        ...{ 'onClick': {} },
        type: "success",
        size: "small",
        loading: (__VLS_ctx.acting === row.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    let __VLS_32;
    let __VLS_33;
    let __VLS_34;
    const __VLS_35 = {
        onClick: (...[$event]) => {
            __VLS_ctx.approve(row);
        }
    };
    __VLS_31.slots.default;
    (__VLS_ctx.t('media.rawVerify.approve'));
    var __VLS_31;
    const __VLS_36 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
        plain: true,
    }));
    const __VLS_38 = __VLS_37({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
        plain: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    let __VLS_40;
    let __VLS_41;
    let __VLS_42;
    const __VLS_43 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openReject(row);
        }
    };
    __VLS_39.slots.default;
    (__VLS_ctx.t('media.rawVerify.reject'));
    var __VLS_39;
}
var __VLS_27;
var __VLS_3;
const __VLS_44 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    modelValue: (__VLS_ctx.rejectVisible),
    title: (__VLS_ctx.t('media.rawVerify.rejectTitle')),
    width: "420px",
}));
const __VLS_46 = __VLS_45({
    modelValue: (__VLS_ctx.rejectVisible),
    title: (__VLS_ctx.t('media.rawVerify.rejectTitle')),
    width: "420px",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
const __VLS_48 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    modelValue: (__VLS_ctx.rejectReason),
    type: "textarea",
    rows: (3),
    placeholder: (__VLS_ctx.t('media.rawVerify.rejectPlaceholder')),
}));
const __VLS_50 = __VLS_49({
    modelValue: (__VLS_ctx.rejectReason),
    type: "textarea",
    rows: (3),
    placeholder: (__VLS_ctx.t('media.rawVerify.rejectPlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
{
    const { footer: __VLS_thisSlot } = __VLS_47.slots;
    const __VLS_52 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        ...{ 'onClick': {} },
    }));
    const __VLS_54 = __VLS_53({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    let __VLS_56;
    let __VLS_57;
    let __VLS_58;
    const __VLS_59 = {
        onClick: (...[$event]) => {
            __VLS_ctx.rejectVisible = false;
        }
    };
    __VLS_55.slots.default;
    (__VLS_ctx.t('common.cancel'));
    var __VLS_55;
    const __VLS_60 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        ...{ 'onClick': {} },
        type: "danger",
        loading: (!!__VLS_ctx.acting),
    }));
    const __VLS_62 = __VLS_61({
        ...{ 'onClick': {} },
        type: "danger",
        loading: (!!__VLS_ctx.acting),
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    let __VLS_64;
    let __VLS_65;
    let __VLS_66;
    const __VLS_67 = {
        onClick: (__VLS_ctx.confirmReject)
    };
    __VLS_63.slots.default;
    (__VLS_ctx.t('common.confirm'));
    var __VLS_63;
}
var __VLS_47;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            t: t,
            statusLabel: statusLabel,
            statusTagType: statusTagType,
            orders: orders,
            loading: loading,
            acting: acting,
            rejectVisible: rejectVisible,
            rejectReason: rejectReason,
            approve: approve,
            openReject: openReject,
            confirmReject: confirmReject,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=RawVerify.vue.js.map