/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed, onMounted } from 'vue';
import { Search, Loading } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import api from '@/api';
const loading = ref(false);
const orders = ref([]);
const searchKeyword = ref('');
const refundDialogVisible = ref(false);
const refundTarget = ref(null);
const refundReason = ref('');
const refunding = ref(false);
const filteredOrders = computed(() => {
    if (!searchKeyword.value)
        return orders.value;
    const kw = searchKeyword.value.toLowerCase();
    return orders.value.filter(o => o.orderNo?.toLowerCase().includes(kw));
});
const statusLabel = (status) => {
    const map = {
        Paid: '已付款', Confirmed: '已確認', ReadyToShoot: '待拍攝',
        ShootingStarted: '拍攝中', ShootingEnded: '拍攝結束',
        UploadingRaw: '上傳中', AiProcessing: 'AI處理中', Delivered: '已交付',
        Cancelled: '已取消', Refunded: '已退款', Disputed: '爭議中',
    };
    return map[status] || status;
};
const statusTagType = (status) => {
    if (status === 'Refunded')
        return 'info';
    if (status === 'Disputed')
        return 'danger';
    if (status === 'Cancelled')
        return 'warning';
    return 'success';
};
const canRefund = (status) => {
    return ['Paid', 'Confirmed', 'ReadyToShoot', 'ShootingStarted', 'Disputed'].includes(status);
};
const loadData = async () => {
    loading.value = true;
    try {
        // 載入可退款的訂單（已付款但未交付）
        const res = await api.getOrders();
        orders.value = (res.data || []).filter((o) => canRefund(o.status) || o.status === 'Refunded');
    }
    catch {
        ElMessage.error('載入退款列表失敗');
        orders.value = [];
    }
    finally {
        loading.value = false;
    }
};
const handleRefund = (row) => {
    refundTarget.value = row;
    refundReason.value = row.cancelReason || '';
    refundDialogVisible.value = true;
};
const confirmRefund = async () => {
    if (!refundReason.value.trim()) {
        ElMessage.warning('請輸入退款原因');
        return;
    }
    refunding.value = true;
    try {
        await api.refund(refundTarget.value.id, refundReason.value);
        ElMessage.success('退款成功');
        refundDialogVisible.value = false;
        await loadData();
    }
    catch {
        ElMessage.error('退款失敗');
    }
    finally {
        refunding.value = false;
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
const __VLS_0 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.searchKeyword),
    placeholder: "搜尋訂單號",
    prefixIcon: (__VLS_ctx.Search),
    ...{ style: {} },
    clearable: true,
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.searchKeyword),
    placeholder: "搜尋訂單號",
    prefixIcon: (__VLS_ctx.Search),
    ...{ style: {} },
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-center py-12" },
    });
    const __VLS_4 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        ...{ class: "is-loading" },
        size: (32),
    }));
    const __VLS_6 = __VLS_5({
        ...{ class: "is-loading" },
        size: (32),
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_7.slots.default;
    const __VLS_8 = {}.Loading;
    /** @type {[typeof __VLS_components.Loading, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({}));
    const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
    var __VLS_7;
}
else if (__VLS_ctx.filteredOrders.length === 0) {
    const __VLS_12 = {}.ElEmpty;
    /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        description: "無退款申請",
    }));
    const __VLS_14 = __VLS_13({
        description: "無退款申請",
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
}
else {
    const __VLS_16 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        data: (__VLS_ctx.filteredOrders),
        border: true,
        stripe: true,
    }));
    const __VLS_18 = __VLS_17({
        data: (__VLS_ctx.filteredOrders),
        border: true,
        stripe: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    __VLS_19.slots.default;
    const __VLS_20 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        prop: "orderNo",
        label: "訂單號",
        width: "160",
    }));
    const __VLS_22 = __VLS_21({
        prop: "orderNo",
        label: "訂單號",
        width: "160",
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    const __VLS_24 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        prop: "consumerName",
        label: "客戶",
        width: "100",
    }));
    const __VLS_26 = __VLS_25({
        prop: "consumerName",
        label: "客戶",
        width: "100",
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    const __VLS_28 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        prop: "photographerName",
        label: "攝影師",
        width: "100",
    }));
    const __VLS_30 = __VLS_29({
        prop: "photographerName",
        label: "攝影師",
        width: "100",
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    const __VLS_32 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        prop: "shootingDate",
        label: "拍攝日期",
        width: "120",
    }));
    const __VLS_34 = __VLS_33({
        prop: "shootingDate",
        label: "拍攝日期",
        width: "120",
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    const __VLS_36 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        prop: "totalFee",
        label: "訂單金額",
        width: "100",
        align: "right",
    }));
    const __VLS_38 = __VLS_37({
        prop: "totalFee",
        label: "訂單金額",
        width: "100",
        align: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    __VLS_39.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_39.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        (row.totalFee?.toLocaleString());
    }
    var __VLS_39;
    const __VLS_40 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        prop: "status",
        label: "狀態",
        width: "100",
    }));
    const __VLS_42 = __VLS_41({
        prop: "status",
        label: "狀態",
        width: "100",
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    __VLS_43.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_43.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_44 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
            type: (__VLS_ctx.statusTagType(row.status)),
        }));
        const __VLS_46 = __VLS_45({
            type: (__VLS_ctx.statusTagType(row.status)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_45));
        __VLS_47.slots.default;
        (__VLS_ctx.statusLabel(row.status));
        var __VLS_47;
    }
    var __VLS_43;
    const __VLS_48 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        prop: "cancelReason",
        label: "取消原因",
        minWidth: "150",
        showOverflowTooltip: true,
    }));
    const __VLS_50 = __VLS_49({
        prop: "cancelReason",
        label: "取消原因",
        minWidth: "150",
        showOverflowTooltip: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    const __VLS_52 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        label: "操作",
        width: "160",
        fixed: "right",
    }));
    const __VLS_54 = __VLS_53({
        label: "操作",
        width: "160",
        fixed: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    __VLS_55.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_55.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        if (__VLS_ctx.canRefund(row.status)) {
            const __VLS_56 = {}.ElPopconfirm;
            /** @type {[typeof __VLS_components.ElPopconfirm, typeof __VLS_components.elPopconfirm, typeof __VLS_components.ElPopconfirm, typeof __VLS_components.elPopconfirm, ]} */ ;
            // @ts-ignore
            const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
                ...{ 'onConfirm': {} },
                title: "確認退款？退款後訂單狀態將變更為已退款。",
                confirmButtonText: "確認退款",
                cancelButtonText: "取消",
                confirmButtonType: "danger",
            }));
            const __VLS_58 = __VLS_57({
                ...{ 'onConfirm': {} },
                title: "確認退款？退款後訂單狀態將變更為已退款。",
                confirmButtonText: "確認退款",
                cancelButtonText: "取消",
                confirmButtonType: "danger",
            }, ...__VLS_functionalComponentArgsRest(__VLS_57));
            let __VLS_60;
            let __VLS_61;
            let __VLS_62;
            const __VLS_63 = {
                onConfirm: (...[$event]) => {
                    if (!!(__VLS_ctx.loading))
                        return;
                    if (!!(__VLS_ctx.filteredOrders.length === 0))
                        return;
                    if (!(__VLS_ctx.canRefund(row.status)))
                        return;
                    __VLS_ctx.handleRefund(row);
                }
            };
            __VLS_59.slots.default;
            {
                const { reference: __VLS_thisSlot } = __VLS_59.slots;
                const __VLS_64 = {}.ElButton;
                /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
                // @ts-ignore
                const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
                    type: "danger",
                    size: "small",
                }));
                const __VLS_66 = __VLS_65({
                    type: "danger",
                    size: "small",
                }, ...__VLS_functionalComponentArgsRest(__VLS_65));
                __VLS_67.slots.default;
                var __VLS_67;
            }
            var __VLS_59;
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "text-gray-400 text-sm" },
            });
        }
    }
    var __VLS_55;
    var __VLS_19;
}
const __VLS_68 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    modelValue: (__VLS_ctx.refundDialogVisible),
    title: "退款",
    width: "500px",
}));
const __VLS_70 = __VLS_69({
    modelValue: (__VLS_ctx.refundDialogVisible),
    title: "退款",
    width: "500px",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
const __VLS_72 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    labelWidth: "100px",
}));
const __VLS_74 = __VLS_73({
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
const __VLS_76 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    label: "訂單號",
}));
const __VLS_78 = __VLS_77({
    label: "訂單號",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.refundTarget?.orderNo);
var __VLS_79;
const __VLS_80 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    label: "訂單金額",
}));
const __VLS_82 = __VLS_81({
    label: "訂單金額",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.refundTarget?.totalFee?.toLocaleString());
var __VLS_83;
const __VLS_84 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    label: "退款原因",
    required: true,
}));
const __VLS_86 = __VLS_85({
    label: "退款原因",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
__VLS_87.slots.default;
const __VLS_88 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    modelValue: (__VLS_ctx.refundReason),
    type: "textarea",
    rows: (3),
    placeholder: "請輸入退款原因",
}));
const __VLS_90 = __VLS_89({
    modelValue: (__VLS_ctx.refundReason),
    type: "textarea",
    rows: (3),
    placeholder: "請輸入退款原因",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
var __VLS_87;
var __VLS_75;
{
    const { footer: __VLS_thisSlot } = __VLS_71.slots;
    const __VLS_92 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        ...{ 'onClick': {} },
    }));
    const __VLS_94 = __VLS_93({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    let __VLS_96;
    let __VLS_97;
    let __VLS_98;
    const __VLS_99 = {
        onClick: (...[$event]) => {
            __VLS_ctx.refundDialogVisible = false;
        }
    };
    __VLS_95.slots.default;
    var __VLS_95;
    const __VLS_100 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        ...{ 'onClick': {} },
        type: "danger",
        loading: (__VLS_ctx.refunding),
    }));
    const __VLS_102 = __VLS_101({
        ...{ 'onClick': {} },
        type: "danger",
        loading: (__VLS_ctx.refunding),
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    let __VLS_104;
    let __VLS_105;
    let __VLS_106;
    const __VLS_107 = {
        onClick: (__VLS_ctx.confirmRefund)
    };
    __VLS_103.slots.default;
    var __VLS_103;
}
var __VLS_71;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-12']} */ ;
/** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Search: Search,
            Loading: Loading,
            loading: loading,
            searchKeyword: searchKeyword,
            refundDialogVisible: refundDialogVisible,
            refundTarget: refundTarget,
            refundReason: refundReason,
            refunding: refunding,
            filteredOrders: filteredOrders,
            statusLabel: statusLabel,
            statusTagType: statusTagType,
            canRefund: canRefund,
            handleRefund: handleRefund,
            confirmRefund: confirmRefund,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=Refund.vue.js.map