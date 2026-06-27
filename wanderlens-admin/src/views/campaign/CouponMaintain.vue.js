/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, computed, onMounted } from 'vue';
import { Search, Plus, Edit, Delete, Loading } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import api from '@/api';
const search = ref('');
const loading = ref(false);
const saving = ref(false);
const coupons = ref([]);
const dialogVisible = ref(false);
const editing = ref(false);
const editingId = ref(null);
const formRef = ref();
const formData = reactive({
    couponName: '', couponCode: '', discountType: 'FIXED', discount: 0,
    usageCount: 0, startDate: '', endDate: '', active: 'Y',
});
const rules = {
    couponName: [{ required: true, message: '名稱不可為空', trigger: 'blur' }],
    couponCode: [{ required: true, message: '折扣碼不可為空', trigger: 'blur' }],
    discount: [{ required: true, message: '折扣值不可為空', trigger: 'blur' }],
};
const filteredCoupons = computed(() => {
    if (!search.value)
        return coupons.value;
    const kw = search.value.toLowerCase();
    return coupons.value.filter(c => c.couponName?.toLowerCase().includes(kw) || c.couponCode?.toLowerCase().includes(kw));
});
const openCreate = () => {
    editing.value = false;
    editingId.value = null;
    Object.assign(formData, { couponName: '', couponCode: '', discountType: 'FIXED', discount: 0, usageCount: 0, startDate: '', endDate: '', active: 'Y' });
    dialogVisible.value = true;
};
const openEdit = (row) => {
    editing.value = true;
    editingId.value = row.id;
    Object.assign(formData, {
        couponName: row.couponName, couponCode: row.couponCode,
        discountType: row.discountType || 'FIXED', discount: row.discount || 0,
        usageCount: row.usageCount || 0, startDate: row.startDate || '', endDate: row.endDate || '',
        active: row.active || 'Y',
    });
    dialogVisible.value = true;
};
const resetForm = () => {
    Object.assign(formData, { couponName: '', couponCode: '', discountType: 'FIXED', discount: 0, usageCount: 0, startDate: '', endDate: '', active: 'Y' });
    editingId.value = null;
    formRef.value?.resetFields();
};
const submit = async () => {
    if (!formRef.value)
        return;
    await formRef.value.validate(async (valid) => {
        if (!valid)
            return;
        saving.value = true;
        try {
            const data = { ...formData };
            if (editingId.value !== null)
                data.id = editingId.value;
            await api.saveCoupon(data);
            ElMessage.success(editing.value ? '更新成功' : '新增成功');
            dialogVisible.value = false;
            await load();
        }
        catch {
            ElMessage.error(editing.value ? '更新失敗' : '新增失敗');
        }
        finally {
            saving.value = false;
        }
    });
};
const remove = async (id) => {
    try {
        await api.deleteCoupon(id);
        ElMessage.success('已刪除');
        load();
    }
    catch {
        ElMessage.error('刪除失敗');
    }
};
const load = async () => {
    loading.value = true;
    try {
        const res = await api.getCoupons();
        coupons.value = res.data || [];
    }
    catch {
        ElMessage.error('載入失敗');
        coupons.value = [];
    }
    finally {
        loading.value = false;
    }
};
onMounted(load);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center justify-between mb-4" },
});
const __VLS_0 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.search),
    placeholder: "搜尋折扣碼",
    prefixIcon: (__VLS_ctx.Search),
    ...{ style: {} },
    clearable: true,
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.search),
    placeholder: "搜尋折扣碼",
    prefixIcon: (__VLS_ctx.Search),
    ...{ style: {} },
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const __VLS_4 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Plus),
}));
const __VLS_6 = __VLS_5({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Plus),
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
let __VLS_8;
let __VLS_9;
let __VLS_10;
const __VLS_11 = {
    onClick: (__VLS_ctx.openCreate)
};
__VLS_7.slots.default;
var __VLS_7;
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-center py-12" },
    });
    const __VLS_12 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        ...{ class: "is-loading" },
        size: (32),
    }));
    const __VLS_14 = __VLS_13({
        ...{ class: "is-loading" },
        size: (32),
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_15.slots.default;
    const __VLS_16 = {}.Loading;
    /** @type {[typeof __VLS_components.Loading, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({}));
    const __VLS_18 = __VLS_17({}, ...__VLS_functionalComponentArgsRest(__VLS_17));
    var __VLS_15;
}
else {
    const __VLS_20 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        data: (__VLS_ctx.filteredCoupons),
        border: true,
        stripe: true,
    }));
    const __VLS_22 = __VLS_21({
        data: (__VLS_ctx.filteredCoupons),
        border: true,
        stripe: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    __VLS_23.slots.default;
    const __VLS_24 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        prop: "couponName",
        label: "名稱",
        minWidth: "120",
    }));
    const __VLS_26 = __VLS_25({
        prop: "couponName",
        label: "名稱",
        minWidth: "120",
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    const __VLS_28 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        prop: "couponCode",
        label: "折扣碼",
        width: "120",
    }));
    const __VLS_30 = __VLS_29({
        prop: "couponCode",
        label: "折扣碼",
        width: "120",
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    const __VLS_32 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        prop: "discount",
        label: "折扣",
        width: "80",
        align: "right",
    }));
    const __VLS_34 = __VLS_33({
        prop: "discount",
        label: "折扣",
        width: "80",
        align: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    const __VLS_36 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        prop: "discountType",
        label: "類型",
        width: "80",
    }));
    const __VLS_38 = __VLS_37({
        prop: "discountType",
        label: "類型",
        width: "80",
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    __VLS_39.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_39.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_40 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
            size: "small",
        }));
        const __VLS_42 = __VLS_41({
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_41));
        __VLS_43.slots.default;
        (row.discountType === 'PERCENT' ? '百分比' : '固定金額');
        var __VLS_43;
    }
    var __VLS_39;
    const __VLS_44 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        label: "使用次數",
        width: "100",
    }));
    const __VLS_46 = __VLS_45({
        label: "使用次數",
        width: "100",
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    __VLS_47.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_47.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        (row.usageCountCurrent || 0);
        (row.usageCount || '∞');
    }
    var __VLS_47;
    const __VLS_48 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        prop: "startDate",
        label: "開始日期",
        width: "120",
    }));
    const __VLS_50 = __VLS_49({
        prop: "startDate",
        label: "開始日期",
        width: "120",
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    const __VLS_52 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        prop: "endDate",
        label: "結束日期",
        width: "120",
    }));
    const __VLS_54 = __VLS_53({
        prop: "endDate",
        label: "結束日期",
        width: "120",
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    const __VLS_56 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        prop: "active",
        label: "狀態",
        width: "80",
    }));
    const __VLS_58 = __VLS_57({
        prop: "active",
        label: "狀態",
        width: "80",
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    __VLS_59.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_59.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_60 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
            type: (row.active === 'Y' ? 'success' : 'info'),
        }));
        const __VLS_62 = __VLS_61({
            type: (row.active === 'Y' ? 'success' : 'info'),
        }, ...__VLS_functionalComponentArgsRest(__VLS_61));
        __VLS_63.slots.default;
        (row.active === 'Y' ? '啟用' : '停用');
        var __VLS_63;
    }
    var __VLS_59;
    const __VLS_64 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        label: "操作",
        width: "180",
        fixed: "right",
    }));
    const __VLS_66 = __VLS_65({
        label: "操作",
        width: "180",
        fixed: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    __VLS_67.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_67.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_68 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
            ...{ 'onClick': {} },
            text: true,
            type: "primary",
            icon: (__VLS_ctx.Edit),
        }));
        const __VLS_70 = __VLS_69({
            ...{ 'onClick': {} },
            text: true,
            type: "primary",
            icon: (__VLS_ctx.Edit),
        }, ...__VLS_functionalComponentArgsRest(__VLS_69));
        let __VLS_72;
        let __VLS_73;
        let __VLS_74;
        const __VLS_75 = {
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.loading))
                    return;
                __VLS_ctx.openEdit(row);
            }
        };
        __VLS_71.slots.default;
        var __VLS_71;
        const __VLS_76 = {}.ElPopconfirm;
        /** @type {[typeof __VLS_components.ElPopconfirm, typeof __VLS_components.elPopconfirm, typeof __VLS_components.ElPopconfirm, typeof __VLS_components.elPopconfirm, ]} */ ;
        // @ts-ignore
        const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
            ...{ 'onConfirm': {} },
            title: "確認刪除？",
        }));
        const __VLS_78 = __VLS_77({
            ...{ 'onConfirm': {} },
            title: "確認刪除？",
        }, ...__VLS_functionalComponentArgsRest(__VLS_77));
        let __VLS_80;
        let __VLS_81;
        let __VLS_82;
        const __VLS_83 = {
            onConfirm: (...[$event]) => {
                if (!!(__VLS_ctx.loading))
                    return;
                __VLS_ctx.remove(row.id);
            }
        };
        __VLS_79.slots.default;
        {
            const { reference: __VLS_thisSlot } = __VLS_79.slots;
            const __VLS_84 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
                text: true,
                type: "danger",
                icon: (__VLS_ctx.Delete),
            }));
            const __VLS_86 = __VLS_85({
                text: true,
                type: "danger",
                icon: (__VLS_ctx.Delete),
            }, ...__VLS_functionalComponentArgsRest(__VLS_85));
            __VLS_87.slots.default;
            var __VLS_87;
        }
        var __VLS_79;
    }
    var __VLS_67;
    var __VLS_23;
}
const __VLS_88 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.editing ? '編輯折扣碼' : '新增折扣碼'),
    width: "500px",
}));
const __VLS_90 = __VLS_89({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.editing ? '編輯折扣碼' : '新增折扣碼'),
    width: "500px",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
let __VLS_92;
let __VLS_93;
let __VLS_94;
const __VLS_95 = {
    onClosed: (__VLS_ctx.resetForm)
};
__VLS_91.slots.default;
const __VLS_96 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    ref: "formRef",
    model: (__VLS_ctx.formData),
    rules: (__VLS_ctx.rules),
    labelWidth: "100px",
}));
const __VLS_98 = __VLS_97({
    ref: "formRef",
    model: (__VLS_ctx.formData),
    rules: (__VLS_ctx.rules),
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
/** @type {typeof __VLS_ctx.formRef} */ ;
var __VLS_100 = {};
__VLS_99.slots.default;
const __VLS_102 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_103 = __VLS_asFunctionalComponent(__VLS_102, new __VLS_102({
    label: "名稱",
    prop: "couponName",
}));
const __VLS_104 = __VLS_103({
    label: "名稱",
    prop: "couponName",
}, ...__VLS_functionalComponentArgsRest(__VLS_103));
__VLS_105.slots.default;
const __VLS_106 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_107 = __VLS_asFunctionalComponent(__VLS_106, new __VLS_106({
    modelValue: (__VLS_ctx.formData.couponName),
    placeholder: "請輸入名稱",
}));
const __VLS_108 = __VLS_107({
    modelValue: (__VLS_ctx.formData.couponName),
    placeholder: "請輸入名稱",
}, ...__VLS_functionalComponentArgsRest(__VLS_107));
var __VLS_105;
const __VLS_110 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_111 = __VLS_asFunctionalComponent(__VLS_110, new __VLS_110({
    label: "折扣碼",
    prop: "couponCode",
}));
const __VLS_112 = __VLS_111({
    label: "折扣碼",
    prop: "couponCode",
}, ...__VLS_functionalComponentArgsRest(__VLS_111));
__VLS_113.slots.default;
const __VLS_114 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_115 = __VLS_asFunctionalComponent(__VLS_114, new __VLS_114({
    modelValue: (__VLS_ctx.formData.couponCode),
    placeholder: "請輸入折扣碼",
}));
const __VLS_116 = __VLS_115({
    modelValue: (__VLS_ctx.formData.couponCode),
    placeholder: "請輸入折扣碼",
}, ...__VLS_functionalComponentArgsRest(__VLS_115));
var __VLS_113;
const __VLS_118 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_119 = __VLS_asFunctionalComponent(__VLS_118, new __VLS_118({
    label: "折扣類型",
    prop: "discountType",
}));
const __VLS_120 = __VLS_119({
    label: "折扣類型",
    prop: "discountType",
}, ...__VLS_functionalComponentArgsRest(__VLS_119));
__VLS_121.slots.default;
const __VLS_122 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_123 = __VLS_asFunctionalComponent(__VLS_122, new __VLS_122({
    modelValue: (__VLS_ctx.formData.discountType),
    ...{ class: "!w-full" },
}));
const __VLS_124 = __VLS_123({
    modelValue: (__VLS_ctx.formData.discountType),
    ...{ class: "!w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_123));
__VLS_125.slots.default;
const __VLS_126 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_127 = __VLS_asFunctionalComponent(__VLS_126, new __VLS_126({
    label: "固定金額",
    value: "FIXED",
}));
const __VLS_128 = __VLS_127({
    label: "固定金額",
    value: "FIXED",
}, ...__VLS_functionalComponentArgsRest(__VLS_127));
const __VLS_130 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_131 = __VLS_asFunctionalComponent(__VLS_130, new __VLS_130({
    label: "百分比",
    value: "PERCENT",
}));
const __VLS_132 = __VLS_131({
    label: "百分比",
    value: "PERCENT",
}, ...__VLS_functionalComponentArgsRest(__VLS_131));
var __VLS_125;
var __VLS_121;
const __VLS_134 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_135 = __VLS_asFunctionalComponent(__VLS_134, new __VLS_134({
    label: "折扣值",
    prop: "discount",
}));
const __VLS_136 = __VLS_135({
    label: "折扣值",
    prop: "discount",
}, ...__VLS_functionalComponentArgsRest(__VLS_135));
__VLS_137.slots.default;
const __VLS_138 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_139 = __VLS_asFunctionalComponent(__VLS_138, new __VLS_138({
    modelValue: (__VLS_ctx.formData.discount),
    min: (0),
    max: (__VLS_ctx.formData.discountType === 'PERCENT' ? 100 : 10000),
    ...{ class: "!w-full" },
}));
const __VLS_140 = __VLS_139({
    modelValue: (__VLS_ctx.formData.discount),
    min: (0),
    max: (__VLS_ctx.formData.discountType === 'PERCENT' ? 100 : 10000),
    ...{ class: "!w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_139));
var __VLS_137;
const __VLS_142 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_143 = __VLS_asFunctionalComponent(__VLS_142, new __VLS_142({
    label: "使用次數",
    prop: "usageCount",
}));
const __VLS_144 = __VLS_143({
    label: "使用次數",
    prop: "usageCount",
}, ...__VLS_functionalComponentArgsRest(__VLS_143));
__VLS_145.slots.default;
const __VLS_146 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_147 = __VLS_asFunctionalComponent(__VLS_146, new __VLS_146({
    modelValue: (__VLS_ctx.formData.usageCount),
    min: (0),
    max: (9999),
    ...{ class: "!w-full" },
}));
const __VLS_148 = __VLS_147({
    modelValue: (__VLS_ctx.formData.usageCount),
    min: (0),
    max: (9999),
    ...{ class: "!w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_147));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-xs text-gray-400 ml-2" },
});
var __VLS_145;
const __VLS_150 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_151 = __VLS_asFunctionalComponent(__VLS_150, new __VLS_150({
    label: "開始日期",
    prop: "startDate",
}));
const __VLS_152 = __VLS_151({
    label: "開始日期",
    prop: "startDate",
}, ...__VLS_functionalComponentArgsRest(__VLS_151));
__VLS_153.slots.default;
const __VLS_154 = {}.ElDatePicker;
/** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ ;
// @ts-ignore
const __VLS_155 = __VLS_asFunctionalComponent(__VLS_154, new __VLS_154({
    modelValue: (__VLS_ctx.formData.startDate),
    type: "date",
    valueFormat: "YYYY-MM-DD",
    ...{ class: "!w-full" },
}));
const __VLS_156 = __VLS_155({
    modelValue: (__VLS_ctx.formData.startDate),
    type: "date",
    valueFormat: "YYYY-MM-DD",
    ...{ class: "!w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_155));
var __VLS_153;
const __VLS_158 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_159 = __VLS_asFunctionalComponent(__VLS_158, new __VLS_158({
    label: "結束日期",
    prop: "endDate",
}));
const __VLS_160 = __VLS_159({
    label: "結束日期",
    prop: "endDate",
}, ...__VLS_functionalComponentArgsRest(__VLS_159));
__VLS_161.slots.default;
const __VLS_162 = {}.ElDatePicker;
/** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ ;
// @ts-ignore
const __VLS_163 = __VLS_asFunctionalComponent(__VLS_162, new __VLS_162({
    modelValue: (__VLS_ctx.formData.endDate),
    type: "date",
    valueFormat: "YYYY-MM-DD",
    ...{ class: "!w-full" },
}));
const __VLS_164 = __VLS_163({
    modelValue: (__VLS_ctx.formData.endDate),
    type: "date",
    valueFormat: "YYYY-MM-DD",
    ...{ class: "!w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_163));
var __VLS_161;
const __VLS_166 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_167 = __VLS_asFunctionalComponent(__VLS_166, new __VLS_166({
    label: "啟用",
    prop: "active",
}));
const __VLS_168 = __VLS_167({
    label: "啟用",
    prop: "active",
}, ...__VLS_functionalComponentArgsRest(__VLS_167));
__VLS_169.slots.default;
const __VLS_170 = {}.ElSwitch;
/** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
// @ts-ignore
const __VLS_171 = __VLS_asFunctionalComponent(__VLS_170, new __VLS_170({
    modelValue: (__VLS_ctx.formData.active),
    activeValue: "Y",
    inactiveValue: "N",
}));
const __VLS_172 = __VLS_171({
    modelValue: (__VLS_ctx.formData.active),
    activeValue: "Y",
    inactiveValue: "N",
}, ...__VLS_functionalComponentArgsRest(__VLS_171));
var __VLS_169;
var __VLS_99;
{
    const { footer: __VLS_thisSlot } = __VLS_91.slots;
    const __VLS_174 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_175 = __VLS_asFunctionalComponent(__VLS_174, new __VLS_174({
        ...{ 'onClick': {} },
    }));
    const __VLS_176 = __VLS_175({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_175));
    let __VLS_178;
    let __VLS_179;
    let __VLS_180;
    const __VLS_181 = {
        onClick: (...[$event]) => {
            __VLS_ctx.dialogVisible = false;
        }
    };
    __VLS_177.slots.default;
    var __VLS_177;
    const __VLS_182 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_183 = __VLS_asFunctionalComponent(__VLS_182, new __VLS_182({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.saving),
    }));
    const __VLS_184 = __VLS_183({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.saving),
    }, ...__VLS_functionalComponentArgsRest(__VLS_183));
    let __VLS_186;
    let __VLS_187;
    let __VLS_188;
    const __VLS_189 = {
        onClick: (__VLS_ctx.submit)
    };
    __VLS_185.slots.default;
    var __VLS_185;
}
var __VLS_91;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-12']} */ ;
/** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['!w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['!w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['!w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['!w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['!w-full']} */ ;
// @ts-ignore
var __VLS_101 = __VLS_100;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Search: Search,
            Plus: Plus,
            Edit: Edit,
            Delete: Delete,
            Loading: Loading,
            search: search,
            loading: loading,
            saving: saving,
            dialogVisible: dialogVisible,
            editing: editing,
            formRef: formRef,
            formData: formData,
            rules: rules,
            filteredCoupons: filteredCoupons,
            openCreate: openCreate,
            openEdit: openEdit,
            resetForm: resetForm,
            submit: submit,
            remove: remove,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=CouponMaintain.vue.js.map