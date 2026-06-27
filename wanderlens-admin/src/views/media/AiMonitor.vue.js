/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import api from '@/api';
const orders = ref([]);
const mediaStatus = reactive({});
const interveneVisible = ref(false);
const interveneReason = ref('');
const interveneLoading = ref(false);
const selectedOrder = ref(null);
const statusType = (status) => {
    if (status === 'AiProcessing')
        return 'warning';
    if (status === 'Delivered')
        return 'success';
    return 'info';
};
const checkSla = async (orderId) => {
    try {
        const res = await api.getMediaStatus(orderId);
        mediaStatus[orderId] = res.data;
        ElMessage.info(`媒體狀態: ${res.data}`);
    }
    catch {
        ElMessage.error('無法取得媒體狀態');
    }
};
const openIntervene = (row) => {
    selectedOrder.value = row;
    interveneReason.value = '';
    interveneVisible.value = true;
};
const confirmIntervene = async () => {
    if (!selectedOrder.value || !interveneReason.value.trim()) {
        ElMessage.warning('請填寫介入原因');
        return;
    }
    interveneLoading.value = true;
    try {
        await api.interveneMedia(selectedOrder.value.id, interveneReason.value.trim());
        ElMessage.success('已介入並通知相關人員');
        interveneVisible.value = false;
    }
    catch {
        ElMessage.error('介入失敗');
    }
    finally {
        interveneLoading.value = false;
    }
};
onMounted(async () => {
    try {
        const res = await api.getOrdersByStatus('AiProcessing');
        orders.value = res.data?.records || res.data || [];
        for (const o of orders.value) {
            try {
                const st = await api.getMediaStatus(o.id);
                mediaStatus[o.id] = st.data;
            }
            catch { /* 靜默 */ }
        }
    }
    catch {
        ElMessage.error('無法載入 AI 處理中訂單');
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "font-semibold mb-4" },
});
const __VLS_0 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    data: (__VLS_ctx.orders),
    border: true,
    stripe: true,
}));
const __VLS_2 = __VLS_1({
    data: (__VLS_ctx.orders),
    border: true,
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    prop: "orderNo",
    label: "訂單編號",
    width: "180",
}));
const __VLS_6 = __VLS_5({
    prop: "orderNo",
    label: "訂單編號",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
const __VLS_8 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    label: "狀態",
    width: "140",
}));
const __VLS_10 = __VLS_9({
    label: "狀態",
    width: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_11.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_12 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        type: (__VLS_ctx.statusType(row.status)),
        size: "small",
    }));
    const __VLS_14 = __VLS_13({
        type: (__VLS_ctx.statusType(row.status)),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_15.slots.default;
    (row.status);
    var __VLS_15;
}
var __VLS_11;
const __VLS_16 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    label: "媒體狀態",
    width: "140",
}));
const __VLS_18 = __VLS_17({
    label: "媒體狀態",
    width: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_19.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-sm text-gray-600" },
    });
    (__VLS_ctx.mediaStatus[row.id] || '—');
}
var __VLS_19;
const __VLS_20 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    label: "操作",
    width: "200",
}));
const __VLS_22 = __VLS_21({
    label: "操作",
    width: "200",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_23.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_24 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        ...{ 'onClick': {} },
        text: true,
        type: "primary",
    }));
    const __VLS_26 = __VLS_25({
        ...{ 'onClick': {} },
        text: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    let __VLS_28;
    let __VLS_29;
    let __VLS_30;
    const __VLS_31 = {
        onClick: (...[$event]) => {
            __VLS_ctx.checkSla(row.id);
        }
    };
    __VLS_27.slots.default;
    var __VLS_27;
    const __VLS_32 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        ...{ 'onClick': {} },
        text: true,
        type: "warning",
    }));
    const __VLS_34 = __VLS_33({
        ...{ 'onClick': {} },
        text: true,
        type: "warning",
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    let __VLS_36;
    let __VLS_37;
    let __VLS_38;
    const __VLS_39 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openIntervene(row);
        }
    };
    __VLS_35.slots.default;
    var __VLS_35;
}
var __VLS_23;
var __VLS_3;
const __VLS_40 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    modelValue: (__VLS_ctx.interveneVisible),
    title: "營運介入",
    width: "480px",
}));
const __VLS_42 = __VLS_41({
    modelValue: (__VLS_ctx.interveneVisible),
    title: "營運介入",
    width: "480px",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-sm text-gray-600 mb-3" },
});
(__VLS_ctx.selectedOrder?.orderNo);
const __VLS_44 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    modelValue: (__VLS_ctx.interveneReason),
    type: "textarea",
    rows: (3),
    placeholder: "介入原因（將通知攝影師與消費者）",
}));
const __VLS_46 = __VLS_45({
    modelValue: (__VLS_ctx.interveneReason),
    type: "textarea",
    rows: (3),
    placeholder: "介入原因（將通知攝影師與消費者）",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
{
    const { footer: __VLS_thisSlot } = __VLS_43.slots;
    const __VLS_48 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        ...{ 'onClick': {} },
    }));
    const __VLS_50 = __VLS_49({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    let __VLS_52;
    let __VLS_53;
    let __VLS_54;
    const __VLS_55 = {
        onClick: (...[$event]) => {
            __VLS_ctx.interveneVisible = false;
        }
    };
    __VLS_51.slots.default;
    var __VLS_51;
    const __VLS_56 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        ...{ 'onClick': {} },
        type: "warning",
        loading: (__VLS_ctx.interveneLoading),
    }));
    const __VLS_58 = __VLS_57({
        ...{ 'onClick': {} },
        type: "warning",
        loading: (__VLS_ctx.interveneLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    let __VLS_60;
    let __VLS_61;
    let __VLS_62;
    const __VLS_63 = {
        onClick: (__VLS_ctx.confirmIntervene)
    };
    __VLS_59.slots.default;
    var __VLS_59;
}
var __VLS_43;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            orders: orders,
            mediaStatus: mediaStatus,
            interveneVisible: interveneVisible,
            interveneReason: interveneReason,
            interveneLoading: interveneLoading,
            selectedOrder: selectedOrder,
            statusType: statusType,
            checkSla: checkSla,
            openIntervene: openIntervene,
            confirmIntervene: confirmIntervene,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=AiMonitor.vue.js.map