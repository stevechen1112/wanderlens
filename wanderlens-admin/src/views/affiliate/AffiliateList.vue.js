/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, computed, onMounted } from 'vue';
import { Search, Plus, Edit, Delete, Loading } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import api from '@/api';
const loading = ref(false);
const saving = ref(false);
const affiliates = ref([]);
const searchKeyword = ref('');
const dialogVisible = ref(false);
const editing = ref(false);
const editingId = ref(null);
const formRef = ref();
const formData = reactive({
    name: '', empno: '', phone: '', referralCode: '', bankAccount: '', status: 'active',
});
const rules = {
    name: [{ required: true, message: '姓名不可為空', trigger: 'blur' }],
    empno: [{ required: true, message: '帳號不可為空', trigger: 'blur' }],
    phone: [{ required: true, message: '電話不可為空', trigger: 'blur' }],
};
const filteredAffiliates = computed(() => {
    if (!searchKeyword.value)
        return affiliates.value;
    const kw = searchKeyword.value.toLowerCase();
    return affiliates.value.filter(a => a.name?.toLowerCase().includes(kw) || a.empno?.toLowerCase().includes(kw) || a.referralCode?.toLowerCase().includes(kw));
});
const loadData = async () => {
    loading.value = true;
    try {
        const res = await api.getAffiliates();
        affiliates.value = res.data || [];
    }
    catch {
        affiliates.value = [];
    }
    finally {
        loading.value = false;
    }
};
const openCreate = () => {
    editing.value = false;
    editingId.value = null;
    Object.assign(formData, { name: '', empno: '', phone: '', referralCode: '', bankAccount: '', status: 'active' });
    dialogVisible.value = true;
};
const openEdit = (row) => {
    editing.value = true;
    editingId.value = row.id;
    Object.assign(formData, { name: row.name, empno: row.empno, phone: row.phone, referralCode: row.referralCode, bankAccount: row.bankAccount, status: row.status });
    dialogVisible.value = true;
};
const resetForm = () => {
    Object.assign(formData, { name: '', empno: '', phone: '', referralCode: '', bankAccount: '', status: 'active' });
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
            await api.saveAffiliate(data);
            ElMessage.success(editing.value ? '更新成功' : '新增成功');
            dialogVisible.value = false;
            await loadData();
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
        await api.deleteAffiliate(id);
        ElMessage.success('已刪除');
        await loadData();
    }
    catch {
        ElMessage.error('刪除失敗');
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
    ...{ class: "flex items-center gap-2" },
});
const __VLS_0 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.searchKeyword),
    placeholder: "搜尋推廣員",
    prefixIcon: (__VLS_ctx.Search),
    ...{ style: {} },
    clearable: true,
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.searchKeyword),
    placeholder: "搜尋推廣員",
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
else if (__VLS_ctx.filteredAffiliates.length === 0) {
    const __VLS_20 = {}.ElEmpty;
    /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        description: "無推廣員",
    }));
    const __VLS_22 = __VLS_21({
        description: "無推廣員",
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
}
else {
    const __VLS_24 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        data: (__VLS_ctx.filteredAffiliates),
        border: true,
        stripe: true,
    }));
    const __VLS_26 = __VLS_25({
        data: (__VLS_ctx.filteredAffiliates),
        border: true,
        stripe: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    __VLS_27.slots.default;
    const __VLS_28 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        prop: "name",
        label: "姓名",
        width: "100",
    }));
    const __VLS_30 = __VLS_29({
        prop: "name",
        label: "姓名",
        width: "100",
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    const __VLS_32 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        prop: "empno",
        label: "帳號",
        width: "120",
    }));
    const __VLS_34 = __VLS_33({
        prop: "empno",
        label: "帳號",
        width: "120",
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    const __VLS_36 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        prop: "phone",
        label: "電話",
        width: "130",
    }));
    const __VLS_38 = __VLS_37({
        prop: "phone",
        label: "電話",
        width: "130",
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    const __VLS_40 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        prop: "referralCode",
        label: "推薦碼",
        width: "120",
    }));
    const __VLS_42 = __VLS_41({
        prop: "referralCode",
        label: "推薦碼",
        width: "120",
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    const __VLS_44 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        prop: "clickCount",
        label: "點擊數",
        width: "80",
        align: "center",
    }));
    const __VLS_46 = __VLS_45({
        prop: "clickCount",
        label: "點擊數",
        width: "80",
        align: "center",
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    const __VLS_48 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        prop: "orderCount",
        label: "成交數",
        width: "80",
        align: "center",
    }));
    const __VLS_50 = __VLS_49({
        prop: "orderCount",
        label: "成交數",
        width: "80",
        align: "center",
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    const __VLS_52 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        prop: "totalCommission",
        label: "總佣金",
        width: "100",
        align: "right",
    }));
    const __VLS_54 = __VLS_53({
        prop: "totalCommission",
        label: "總佣金",
        width: "100",
        align: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    __VLS_55.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_55.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        (row.totalCommission?.toLocaleString() || 0);
    }
    var __VLS_55;
    const __VLS_56 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        prop: "bankAccount",
        label: "銀行帳號",
        width: "150",
        showOverflowTooltip: true,
    }));
    const __VLS_58 = __VLS_57({
        prop: "bankAccount",
        label: "銀行帳號",
        width: "150",
        showOverflowTooltip: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    const __VLS_60 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        prop: "status",
        label: "狀態",
        width: "80",
    }));
    const __VLS_62 = __VLS_61({
        prop: "status",
        label: "狀態",
        width: "80",
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    __VLS_63.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_63.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_64 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
            type: (row.status === 'active' ? 'success' : 'info'),
        }));
        const __VLS_66 = __VLS_65({
            type: (row.status === 'active' ? 'success' : 'info'),
        }, ...__VLS_functionalComponentArgsRest(__VLS_65));
        __VLS_67.slots.default;
        (row.status === 'active' ? '活躍' : '停用');
        var __VLS_67;
    }
    var __VLS_63;
    const __VLS_68 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        label: "操作",
        width: "150",
        fixed: "right",
    }));
    const __VLS_70 = __VLS_69({
        label: "操作",
        width: "150",
        fixed: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    __VLS_71.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_71.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_72 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
            ...{ 'onClick': {} },
            text: true,
            type: "primary",
            icon: (__VLS_ctx.Edit),
        }));
        const __VLS_74 = __VLS_73({
            ...{ 'onClick': {} },
            text: true,
            type: "primary",
            icon: (__VLS_ctx.Edit),
        }, ...__VLS_functionalComponentArgsRest(__VLS_73));
        let __VLS_76;
        let __VLS_77;
        let __VLS_78;
        const __VLS_79 = {
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.loading))
                    return;
                if (!!(__VLS_ctx.filteredAffiliates.length === 0))
                    return;
                __VLS_ctx.openEdit(row);
            }
        };
        __VLS_75.slots.default;
        var __VLS_75;
        const __VLS_80 = {}.ElPopconfirm;
        /** @type {[typeof __VLS_components.ElPopconfirm, typeof __VLS_components.elPopconfirm, typeof __VLS_components.ElPopconfirm, typeof __VLS_components.elPopconfirm, ]} */ ;
        // @ts-ignore
        const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
            ...{ 'onConfirm': {} },
            title: "確認刪除？",
            confirmButtonText: "確認",
            cancelButtonText: "取消",
        }));
        const __VLS_82 = __VLS_81({
            ...{ 'onConfirm': {} },
            title: "確認刪除？",
            confirmButtonText: "確認",
            cancelButtonText: "取消",
        }, ...__VLS_functionalComponentArgsRest(__VLS_81));
        let __VLS_84;
        let __VLS_85;
        let __VLS_86;
        const __VLS_87 = {
            onConfirm: (...[$event]) => {
                if (!!(__VLS_ctx.loading))
                    return;
                if (!!(__VLS_ctx.filteredAffiliates.length === 0))
                    return;
                __VLS_ctx.remove(row.id);
            }
        };
        __VLS_83.slots.default;
        {
            const { reference: __VLS_thisSlot } = __VLS_83.slots;
            const __VLS_88 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
                text: true,
                type: "danger",
                icon: (__VLS_ctx.Delete),
            }));
            const __VLS_90 = __VLS_89({
                text: true,
                type: "danger",
                icon: (__VLS_ctx.Delete),
            }, ...__VLS_functionalComponentArgsRest(__VLS_89));
            __VLS_91.slots.default;
            var __VLS_91;
        }
        var __VLS_83;
    }
    var __VLS_71;
    var __VLS_27;
}
const __VLS_92 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.editing ? '編輯推廣員' : '新增推廣員'),
    width: "500px",
}));
const __VLS_94 = __VLS_93({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.editing ? '編輯推廣員' : '新增推廣員'),
    width: "500px",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
let __VLS_96;
let __VLS_97;
let __VLS_98;
const __VLS_99 = {
    onClosed: (__VLS_ctx.resetForm)
};
__VLS_95.slots.default;
const __VLS_100 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    ref: "formRef",
    model: (__VLS_ctx.formData),
    rules: (__VLS_ctx.rules),
    labelWidth: "100px",
}));
const __VLS_102 = __VLS_101({
    ref: "formRef",
    model: (__VLS_ctx.formData),
    rules: (__VLS_ctx.rules),
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
/** @type {typeof __VLS_ctx.formRef} */ ;
var __VLS_104 = {};
__VLS_103.slots.default;
const __VLS_106 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_107 = __VLS_asFunctionalComponent(__VLS_106, new __VLS_106({
    label: "姓名",
    prop: "name",
}));
const __VLS_108 = __VLS_107({
    label: "姓名",
    prop: "name",
}, ...__VLS_functionalComponentArgsRest(__VLS_107));
__VLS_109.slots.default;
const __VLS_110 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_111 = __VLS_asFunctionalComponent(__VLS_110, new __VLS_110({
    modelValue: (__VLS_ctx.formData.name),
    placeholder: "請輸入姓名",
}));
const __VLS_112 = __VLS_111({
    modelValue: (__VLS_ctx.formData.name),
    placeholder: "請輸入姓名",
}, ...__VLS_functionalComponentArgsRest(__VLS_111));
var __VLS_109;
const __VLS_114 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_115 = __VLS_asFunctionalComponent(__VLS_114, new __VLS_114({
    label: "帳號",
    prop: "empno",
}));
const __VLS_116 = __VLS_115({
    label: "帳號",
    prop: "empno",
}, ...__VLS_functionalComponentArgsRest(__VLS_115));
__VLS_117.slots.default;
const __VLS_118 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_119 = __VLS_asFunctionalComponent(__VLS_118, new __VLS_118({
    modelValue: (__VLS_ctx.formData.empno),
    placeholder: "請輸入帳號",
    disabled: (__VLS_ctx.editing),
}));
const __VLS_120 = __VLS_119({
    modelValue: (__VLS_ctx.formData.empno),
    placeholder: "請輸入帳號",
    disabled: (__VLS_ctx.editing),
}, ...__VLS_functionalComponentArgsRest(__VLS_119));
var __VLS_117;
const __VLS_122 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_123 = __VLS_asFunctionalComponent(__VLS_122, new __VLS_122({
    label: "電話",
    prop: "phone",
}));
const __VLS_124 = __VLS_123({
    label: "電話",
    prop: "phone",
}, ...__VLS_functionalComponentArgsRest(__VLS_123));
__VLS_125.slots.default;
const __VLS_126 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_127 = __VLS_asFunctionalComponent(__VLS_126, new __VLS_126({
    modelValue: (__VLS_ctx.formData.phone),
    placeholder: "請輸入電話",
}));
const __VLS_128 = __VLS_127({
    modelValue: (__VLS_ctx.formData.phone),
    placeholder: "請輸入電話",
}, ...__VLS_functionalComponentArgsRest(__VLS_127));
var __VLS_125;
const __VLS_130 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_131 = __VLS_asFunctionalComponent(__VLS_130, new __VLS_130({
    label: "推薦碼",
    prop: "referralCode",
}));
const __VLS_132 = __VLS_131({
    label: "推薦碼",
    prop: "referralCode",
}, ...__VLS_functionalComponentArgsRest(__VLS_131));
__VLS_133.slots.default;
const __VLS_134 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_135 = __VLS_asFunctionalComponent(__VLS_134, new __VLS_134({
    modelValue: (__VLS_ctx.formData.referralCode),
    placeholder: "自動產生或手動輸入",
}));
const __VLS_136 = __VLS_135({
    modelValue: (__VLS_ctx.formData.referralCode),
    placeholder: "自動產生或手動輸入",
}, ...__VLS_functionalComponentArgsRest(__VLS_135));
var __VLS_133;
const __VLS_138 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_139 = __VLS_asFunctionalComponent(__VLS_138, new __VLS_138({
    label: "銀行帳號",
    prop: "bankAccount",
}));
const __VLS_140 = __VLS_139({
    label: "銀行帳號",
    prop: "bankAccount",
}, ...__VLS_functionalComponentArgsRest(__VLS_139));
__VLS_141.slots.default;
const __VLS_142 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_143 = __VLS_asFunctionalComponent(__VLS_142, new __VLS_142({
    modelValue: (__VLS_ctx.formData.bankAccount),
    placeholder: "銀行代碼-帳號",
}));
const __VLS_144 = __VLS_143({
    modelValue: (__VLS_ctx.formData.bankAccount),
    placeholder: "銀行代碼-帳號",
}, ...__VLS_functionalComponentArgsRest(__VLS_143));
var __VLS_141;
const __VLS_146 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_147 = __VLS_asFunctionalComponent(__VLS_146, new __VLS_146({
    label: "狀態",
    prop: "status",
}));
const __VLS_148 = __VLS_147({
    label: "狀態",
    prop: "status",
}, ...__VLS_functionalComponentArgsRest(__VLS_147));
__VLS_149.slots.default;
const __VLS_150 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_151 = __VLS_asFunctionalComponent(__VLS_150, new __VLS_150({
    modelValue: (__VLS_ctx.formData.status),
    ...{ class: "!w-full" },
}));
const __VLS_152 = __VLS_151({
    modelValue: (__VLS_ctx.formData.status),
    ...{ class: "!w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_151));
__VLS_153.slots.default;
const __VLS_154 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_155 = __VLS_asFunctionalComponent(__VLS_154, new __VLS_154({
    label: "活躍",
    value: "active",
}));
const __VLS_156 = __VLS_155({
    label: "活躍",
    value: "active",
}, ...__VLS_functionalComponentArgsRest(__VLS_155));
const __VLS_158 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_159 = __VLS_asFunctionalComponent(__VLS_158, new __VLS_158({
    label: "停用",
    value: "inactive",
}));
const __VLS_160 = __VLS_159({
    label: "停用",
    value: "inactive",
}, ...__VLS_functionalComponentArgsRest(__VLS_159));
var __VLS_153;
var __VLS_149;
var __VLS_103;
{
    const { footer: __VLS_thisSlot } = __VLS_95.slots;
    const __VLS_162 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_163 = __VLS_asFunctionalComponent(__VLS_162, new __VLS_162({
        ...{ 'onClick': {} },
    }));
    const __VLS_164 = __VLS_163({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_163));
    let __VLS_166;
    let __VLS_167;
    let __VLS_168;
    const __VLS_169 = {
        onClick: (...[$event]) => {
            __VLS_ctx.dialogVisible = false;
        }
    };
    __VLS_165.slots.default;
    var __VLS_165;
    const __VLS_170 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_171 = __VLS_asFunctionalComponent(__VLS_170, new __VLS_170({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.saving),
    }));
    const __VLS_172 = __VLS_171({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.saving),
    }, ...__VLS_functionalComponentArgsRest(__VLS_171));
    let __VLS_174;
    let __VLS_175;
    let __VLS_176;
    const __VLS_177 = {
        onClick: (__VLS_ctx.submit)
    };
    __VLS_173.slots.default;
    var __VLS_173;
}
var __VLS_95;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-12']} */ ;
/** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['!w-full']} */ ;
// @ts-ignore
var __VLS_105 = __VLS_104;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Search: Search,
            Plus: Plus,
            Edit: Edit,
            Delete: Delete,
            Loading: Loading,
            loading: loading,
            saving: saving,
            searchKeyword: searchKeyword,
            dialogVisible: dialogVisible,
            editing: editing,
            formRef: formRef,
            formData: formData,
            rules: rules,
            filteredAffiliates: filteredAffiliates,
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
//# sourceMappingURL=AffiliateList.vue.js.map