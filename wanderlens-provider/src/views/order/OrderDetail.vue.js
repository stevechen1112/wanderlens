/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import api from '@/api';
import RawUploader from '@/components/upload/RawUploader.vue';
const route = useRoute();
const order = ref(null);
const showExtraDialog = ref(false);
const extraMinutes = ref(30);
const extraFee = ref(400);
const shootStartTime = ref('');
const contactCustomer = async () => {
    try {
        await api.contactCustomer(order.value.id);
        ElMessage.success('已通報聯繫');
        loadOrder();
    }
    catch {
        ElMessage.error('操作失敗');
    }
};
const confirmReadyToShoot = async () => {
    try {
        await api.confirmReadyToShoot(order.value.id);
        ElMessage.success('已確認待拍攝');
        loadOrder();
    }
    catch {
        ElMessage.error('操作失敗');
    }
};
const startShoot = async () => {
    try {
        const res = await api.startShoot(order.value.id);
        shootStartTime.value = res.data?.eventTime || '';
        ElMessage.success('拍攝開始');
        loadOrder();
    }
    catch {
        ElMessage.error('操作失敗');
    }
};
const endShoot = async () => {
    try {
        await ElMessageBox.confirm('確認結束拍攝？此操作不可復原。', '提示', { type: 'warning', confirmButtonText: '確認', cancelButtonText: '取消' });
        await api.endShoot(order.value.id);
        ElMessage.success('拍攝已結束');
        await loadOrder();
    }
    catch (err) {
        if (err !== 'cancel')
            ElMessage.error('操作失敗');
    }
};
const requestExtraTime = async () => {
    try {
        await api.requestExtraTime(order.value.id, extraMinutes.value, extraFee.value);
        ElMessage.success('加時申請已送出');
        showExtraDialog.value = false;
    }
    catch {
        ElMessage.error('申請失敗');
    }
};
const onUploadComplete = () => {
    ElMessage.success('RAW 上傳完成');
    loadOrder();
};
const loadOrder = async () => {
    try {
        const res = await api.getMyOrders();
        const orders = res.data || [];
        order.value = orders.find((o) => o.id === Number(route.params.id));
    }
    catch {
        // 靜默
    }
};
onMounted(loadOrder);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
if (__VLS_ctx.order) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    const __VLS_0 = {}.ElCard;
    /** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ class: "mb-4" },
    }));
    const __VLS_2 = __VLS_1({
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_3.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
        ...{ class: "text-lg font-bold mb-3" },
    });
    (__VLS_ctx.order.orderNo);
    const __VLS_4 = {}.ElDescriptions;
    /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        column: (2),
        border: true,
    }));
    const __VLS_6 = __VLS_5({
        column: (2),
        border: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_7.slots.default;
    const __VLS_8 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        label: "客戶",
    }));
    const __VLS_10 = __VLS_9({
        label: "客戶",
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    __VLS_11.slots.default;
    (__VLS_ctx.order.customerName);
    var __VLS_11;
    const __VLS_12 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        label: "電話",
    }));
    const __VLS_14 = __VLS_13({
        label: "電話",
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_15.slots.default;
    (__VLS_ctx.order.customerPhone);
    var __VLS_15;
    const __VLS_16 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        label: "拍攝日期",
    }));
    const __VLS_18 = __VLS_17({
        label: "拍攝日期",
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    __VLS_19.slots.default;
    (__VLS_ctx.order.shootingDate);
    var __VLS_19;
    const __VLS_20 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        label: "拍攝時間",
    }));
    const __VLS_22 = __VLS_21({
        label: "拍攝時間",
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    __VLS_23.slots.default;
    (__VLS_ctx.order.shootingTime);
    var __VLS_23;
    const __VLS_24 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        label: "時數",
    }));
    const __VLS_26 = __VLS_25({
        label: "時數",
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    __VLS_27.slots.default;
    (__VLS_ctx.order.shootingDuration);
    var __VLS_27;
    const __VLS_28 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        label: "地點",
    }));
    const __VLS_30 = __VLS_29({
        label: "地點",
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    __VLS_31.slots.default;
    (__VLS_ctx.order.shootingLocation);
    var __VLS_31;
    const __VLS_32 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        label: "狀態",
    }));
    const __VLS_34 = __VLS_33({
        label: "狀態",
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    __VLS_35.slots.default;
    const __VLS_36 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({}));
    const __VLS_38 = __VLS_37({}, ...__VLS_functionalComponentArgsRest(__VLS_37));
    __VLS_39.slots.default;
    (__VLS_ctx.order.status);
    var __VLS_39;
    var __VLS_35;
    const __VLS_40 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        label: "酬勞",
    }));
    const __VLS_42 = __VLS_41({
        label: "酬勞",
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    __VLS_43.slots.default;
    (__VLS_ctx.order.photographerProfit);
    var __VLS_43;
    if (__VLS_ctx.order.secondPhotographerId) {
        const __VLS_44 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
            label: "雙機搭檔",
        }));
        const __VLS_46 = __VLS_45({
            label: "雙機搭檔",
        }, ...__VLS_functionalComponentArgsRest(__VLS_45));
        __VLS_47.slots.default;
        (__VLS_ctx.order.secondPhotographerId);
        var __VLS_47;
    }
    if (__VLS_ctx.order.stylistId) {
        const __VLS_48 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
            label: "造型師",
        }));
        const __VLS_50 = __VLS_49({
            label: "造型師",
        }, ...__VLS_functionalComponentArgsRest(__VLS_49));
        __VLS_51.slots.default;
        (__VLS_ctx.order.stylistId);
        var __VLS_51;
    }
    if (__VLS_ctx.order.studioId) {
        const __VLS_52 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
            label: "攝影棚",
        }));
        const __VLS_54 = __VLS_53({
            label: "攝影棚",
        }, ...__VLS_functionalComponentArgsRest(__VLS_53));
        __VLS_55.slots.default;
        (__VLS_ctx.order.studioId);
        var __VLS_55;
    }
    var __VLS_7;
    var __VLS_3;
    const __VLS_56 = {}.ElCard;
    /** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        ...{ class: "mb-4" },
    }));
    const __VLS_58 = __VLS_57({
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    __VLS_59.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "font-semibold mb-3" },
    });
    if (__VLS_ctx.order.status === 'WaitingProviderContact') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "mb-4" },
        });
        const __VLS_60 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
            ...{ 'onClick': {} },
            type: "primary",
        }));
        const __VLS_62 = __VLS_61({
            ...{ 'onClick': {} },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_61));
        let __VLS_64;
        let __VLS_65;
        let __VLS_66;
        const __VLS_67 = {
            onClick: (__VLS_ctx.contactCustomer)
        };
        __VLS_63.slots.default;
        var __VLS_63;
    }
    if (__VLS_ctx.order.status === 'Confirmed') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "mb-4" },
        });
        const __VLS_68 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
            ...{ 'onClick': {} },
            type: "primary",
        }));
        const __VLS_70 = __VLS_69({
            ...{ 'onClick': {} },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_69));
        let __VLS_72;
        let __VLS_73;
        let __VLS_74;
        const __VLS_75 = {
            onClick: (__VLS_ctx.confirmReadyToShoot)
        };
        __VLS_71.slots.default;
        var __VLS_71;
    }
    if (__VLS_ctx.order.status === 'ReadyToShoot') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "mb-4" },
        });
        const __VLS_76 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
            ...{ 'onClick': {} },
            type: "success",
            size: "large",
        }));
        const __VLS_78 = __VLS_77({
            ...{ 'onClick': {} },
            type: "success",
            size: "large",
        }, ...__VLS_functionalComponentArgsRest(__VLS_77));
        let __VLS_80;
        let __VLS_81;
        let __VLS_82;
        const __VLS_83 = {
            onClick: (__VLS_ctx.startShoot)
        };
        __VLS_79.slots.default;
        var __VLS_79;
    }
    if (__VLS_ctx.order.status === 'ShootingStarted') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "space-y-3" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-sm text-gray-500" },
        });
        (__VLS_ctx.shootStartTime);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex gap-3" },
        });
        const __VLS_84 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
            ...{ 'onClick': {} },
            type: "warning",
        }));
        const __VLS_86 = __VLS_85({
            ...{ 'onClick': {} },
            type: "warning",
        }, ...__VLS_functionalComponentArgsRest(__VLS_85));
        let __VLS_88;
        let __VLS_89;
        let __VLS_90;
        const __VLS_91 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.order))
                    return;
                if (!(__VLS_ctx.order.status === 'ShootingStarted'))
                    return;
                __VLS_ctx.showExtraDialog = true;
            }
        };
        __VLS_87.slots.default;
        var __VLS_87;
        const __VLS_92 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
            ...{ 'onClick': {} },
            type: "danger",
            size: "large",
        }));
        const __VLS_94 = __VLS_93({
            ...{ 'onClick': {} },
            type: "danger",
            size: "large",
        }, ...__VLS_functionalComponentArgsRest(__VLS_93));
        let __VLS_96;
        let __VLS_97;
        let __VLS_98;
        const __VLS_99 = {
            onClick: (__VLS_ctx.endShoot)
        };
        __VLS_95.slots.default;
        var __VLS_95;
    }
    var __VLS_59;
    if (__VLS_ctx.order.status === 'ShootingEnded' || __VLS_ctx.order.status === 'UploadingRaw') {
        const __VLS_100 = {}.ElCard;
        /** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
        // @ts-ignore
        const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
            ...{ class: "mb-4" },
        }));
        const __VLS_102 = __VLS_101({
            ...{ class: "mb-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_101));
        __VLS_103.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
            ...{ class: "font-semibold mb-3" },
        });
        /** @type {[typeof RawUploader, ]} */ ;
        // @ts-ignore
        const __VLS_104 = __VLS_asFunctionalComponent(RawUploader, new RawUploader({
            ...{ 'onComplete': {} },
            orderId: (__VLS_ctx.order.id),
        }));
        const __VLS_105 = __VLS_104({
            ...{ 'onComplete': {} },
            orderId: (__VLS_ctx.order.id),
        }, ...__VLS_functionalComponentArgsRest(__VLS_104));
        let __VLS_107;
        let __VLS_108;
        let __VLS_109;
        const __VLS_110 = {
            onComplete: (__VLS_ctx.onUploadComplete)
        };
        var __VLS_106;
        var __VLS_103;
    }
    const __VLS_111 = {}.ElDialog;
    /** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
    // @ts-ignore
    const __VLS_112 = __VLS_asFunctionalComponent(__VLS_111, new __VLS_111({
        modelValue: (__VLS_ctx.showExtraDialog),
        title: "加時申請",
        width: "400px",
    }));
    const __VLS_113 = __VLS_112({
        modelValue: (__VLS_ctx.showExtraDialog),
        title: "加時申請",
        width: "400px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_112));
    __VLS_114.slots.default;
    const __VLS_115 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_116 = __VLS_asFunctionalComponent(__VLS_115, new __VLS_115({
        labelWidth: "80px",
    }));
    const __VLS_117 = __VLS_116({
        labelWidth: "80px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_116));
    __VLS_118.slots.default;
    const __VLS_119 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_120 = __VLS_asFunctionalComponent(__VLS_119, new __VLS_119({
        label: "分鐘",
    }));
    const __VLS_121 = __VLS_120({
        label: "分鐘",
    }, ...__VLS_functionalComponentArgsRest(__VLS_120));
    __VLS_122.slots.default;
    const __VLS_123 = {}.ElInputNumber;
    /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
    // @ts-ignore
    const __VLS_124 = __VLS_asFunctionalComponent(__VLS_123, new __VLS_123({
        modelValue: (__VLS_ctx.extraMinutes),
        min: (30),
        step: (30),
    }));
    const __VLS_125 = __VLS_124({
        modelValue: (__VLS_ctx.extraMinutes),
        min: (30),
        step: (30),
    }, ...__VLS_functionalComponentArgsRest(__VLS_124));
    var __VLS_122;
    const __VLS_127 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_128 = __VLS_asFunctionalComponent(__VLS_127, new __VLS_127({
        label: "費用",
    }));
    const __VLS_129 = __VLS_128({
        label: "費用",
    }, ...__VLS_functionalComponentArgsRest(__VLS_128));
    __VLS_130.slots.default;
    const __VLS_131 = {}.ElInputNumber;
    /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
    // @ts-ignore
    const __VLS_132 = __VLS_asFunctionalComponent(__VLS_131, new __VLS_131({
        modelValue: (__VLS_ctx.extraFee),
        min: (0),
        step: (100),
    }));
    const __VLS_133 = __VLS_132({
        modelValue: (__VLS_ctx.extraFee),
        min: (0),
        step: (100),
    }, ...__VLS_functionalComponentArgsRest(__VLS_132));
    var __VLS_130;
    var __VLS_118;
    {
        const { footer: __VLS_thisSlot } = __VLS_114.slots;
        const __VLS_135 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_136 = __VLS_asFunctionalComponent(__VLS_135, new __VLS_135({
            ...{ 'onClick': {} },
        }));
        const __VLS_137 = __VLS_136({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_136));
        let __VLS_139;
        let __VLS_140;
        let __VLS_141;
        const __VLS_142 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.order))
                    return;
                __VLS_ctx.showExtraDialog = false;
            }
        };
        __VLS_138.slots.default;
        var __VLS_138;
        const __VLS_143 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_144 = __VLS_asFunctionalComponent(__VLS_143, new __VLS_143({
            ...{ 'onClick': {} },
            type: "primary",
        }));
        const __VLS_145 = __VLS_144({
            ...{ 'onClick': {} },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_144));
        let __VLS_147;
        let __VLS_148;
        let __VLS_149;
        const __VLS_150 = {
            onClick: (__VLS_ctx.requestExtraTime)
        };
        __VLS_146.slots.default;
        var __VLS_146;
    }
    var __VLS_114;
}
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            RawUploader: RawUploader,
            order: order,
            showExtraDialog: showExtraDialog,
            extraMinutes: extraMinutes,
            extraFee: extraFee,
            shootStartTime: shootStartTime,
            contactCustomer: contactCustomer,
            confirmReadyToShoot: confirmReadyToShoot,
            startShoot: startShoot,
            endShoot: endShoot,
            requestExtraTime: requestExtraTime,
            onUploadComplete: onUploadComplete,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=OrderDetail.vue.js.map