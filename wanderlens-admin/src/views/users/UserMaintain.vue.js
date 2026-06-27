/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, computed, onMounted } from 'vue';
import { Search, Plus, Edit, Delete, Loading } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import api from '@/api';
const search = ref('');
const loading = ref(false);
const saving = ref(false);
const users = ref([]);
const dialogVisible = ref(false);
const editing = ref(false);
const editingId = ref(null);
const formRef = ref();
const formData = reactive({
    username: '', empno: '', password: '', role: 'CONSUMER', phone: '', email: '',
});
const rules = {
    username: [{ required: true, message: '姓名不可為空', trigger: 'blur' }],
    empno: [{ required: true, message: '帳號不可為空', trigger: 'blur' }],
    password: [{ required: true, message: '密碼不可為空', trigger: 'blur' }],
    role: [{ required: true, message: '角色不可為空', trigger: 'change' }],
};
const roleLabel = (role) => {
    const map = {
        ADMIN: '管理員', SUPPORT: '客服', FINANCE: '財務', EDITOR: '編輯',
        CONSUMER: '消費者', PHOTOGRAPHER: '攝影師', RETOUCH: '修圖',
    };
    return map[role] || role;
};
const filteredUsers = computed(() => users.value.filter(u => !search.value ||
    u.username?.includes(search.value) ||
    u.empno?.includes(search.value)));
const openCreate = () => {
    editing.value = false;
    editingId.value = null;
    Object.assign(formData, { username: '', empno: '', password: '', role: 'CONSUMER', phone: '', email: '' });
    dialogVisible.value = true;
};
const openEdit = (row) => {
    editing.value = true;
    editingId.value = row.id;
    Object.assign(formData, { username: row.username, empno: row.empno, password: '', role: row.role, phone: row.phone || '', email: row.email || '' });
    dialogVisible.value = true;
};
const resetForm = () => {
    Object.assign(formData, { username: '', empno: '', password: '', role: 'CONSUMER', phone: '', email: '' });
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
            if (editingId.value !== null) {
                data.id = editingId.value;
                delete data.password; // 編輯時不更新密碼
            }
            await api.saveUser(data);
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
        await api.deleteUser(id);
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
        const res = await api.getUsers();
        users.value = res.data || [];
    }
    catch {
        ElMessage.error('載入失敗');
        users.value = [];
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
    placeholder: "搜尋使用者",
    prefixIcon: (__VLS_ctx.Search),
    ...{ style: {} },
    clearable: true,
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.search),
    placeholder: "搜尋使用者",
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
        data: (__VLS_ctx.filteredUsers),
        border: true,
        stripe: true,
    }));
    const __VLS_22 = __VLS_21({
        data: (__VLS_ctx.filteredUsers),
        border: true,
        stripe: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    __VLS_23.slots.default;
    const __VLS_24 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        prop: "username",
        label: "姓名",
    }));
    const __VLS_26 = __VLS_25({
        prop: "username",
        label: "姓名",
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    const __VLS_28 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        prop: "empno",
        label: "帳號",
        width: "120",
    }));
    const __VLS_30 = __VLS_29({
        prop: "empno",
        label: "帳號",
        width: "120",
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    const __VLS_32 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        prop: "role",
        label: "角色",
        width: "120",
    }));
    const __VLS_34 = __VLS_33({
        prop: "role",
        label: "角色",
        width: "120",
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    __VLS_35.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_35.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_36 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({}));
        const __VLS_38 = __VLS_37({}, ...__VLS_functionalComponentArgsRest(__VLS_37));
        __VLS_39.slots.default;
        (__VLS_ctx.roleLabel(row.role));
        var __VLS_39;
    }
    var __VLS_35;
    const __VLS_40 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        prop: "phone",
        label: "電話",
        width: "150",
    }));
    const __VLS_42 = __VLS_41({
        prop: "phone",
        label: "電話",
        width: "150",
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    const __VLS_44 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        prop: "email",
        label: "Email",
        minWidth: "180",
        showOverflowTooltip: true,
    }));
    const __VLS_46 = __VLS_45({
        prop: "email",
        label: "Email",
        minWidth: "180",
        showOverflowTooltip: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    const __VLS_48 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        label: "操作",
        width: "180",
        fixed: "right",
    }));
    const __VLS_50 = __VLS_49({
        label: "操作",
        width: "180",
        fixed: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    __VLS_51.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_51.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_52 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
            ...{ 'onClick': {} },
            text: true,
            type: "primary",
            icon: (__VLS_ctx.Edit),
        }));
        const __VLS_54 = __VLS_53({
            ...{ 'onClick': {} },
            text: true,
            type: "primary",
            icon: (__VLS_ctx.Edit),
        }, ...__VLS_functionalComponentArgsRest(__VLS_53));
        let __VLS_56;
        let __VLS_57;
        let __VLS_58;
        const __VLS_59 = {
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.loading))
                    return;
                __VLS_ctx.openEdit(row);
            }
        };
        __VLS_55.slots.default;
        var __VLS_55;
        const __VLS_60 = {}.ElPopconfirm;
        /** @type {[typeof __VLS_components.ElPopconfirm, typeof __VLS_components.elPopconfirm, typeof __VLS_components.ElPopconfirm, typeof __VLS_components.elPopconfirm, ]} */ ;
        // @ts-ignore
        const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
            ...{ 'onConfirm': {} },
            title: "確認刪除？",
        }));
        const __VLS_62 = __VLS_61({
            ...{ 'onConfirm': {} },
            title: "確認刪除？",
        }, ...__VLS_functionalComponentArgsRest(__VLS_61));
        let __VLS_64;
        let __VLS_65;
        let __VLS_66;
        const __VLS_67 = {
            onConfirm: (...[$event]) => {
                if (!!(__VLS_ctx.loading))
                    return;
                __VLS_ctx.remove(row.id);
            }
        };
        __VLS_63.slots.default;
        {
            const { reference: __VLS_thisSlot } = __VLS_63.slots;
            const __VLS_68 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
                text: true,
                type: "danger",
                icon: (__VLS_ctx.Delete),
            }));
            const __VLS_70 = __VLS_69({
                text: true,
                type: "danger",
                icon: (__VLS_ctx.Delete),
            }, ...__VLS_functionalComponentArgsRest(__VLS_69));
            __VLS_71.slots.default;
            var __VLS_71;
        }
        var __VLS_63;
    }
    var __VLS_51;
    var __VLS_23;
}
const __VLS_72 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.editing ? '編輯使用者' : '新增使用者'),
    width: "500px",
}));
const __VLS_74 = __VLS_73({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.editing ? '編輯使用者' : '新增使用者'),
    width: "500px",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
let __VLS_76;
let __VLS_77;
let __VLS_78;
const __VLS_79 = {
    onClosed: (__VLS_ctx.resetForm)
};
__VLS_75.slots.default;
const __VLS_80 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    ref: "formRef",
    model: (__VLS_ctx.formData),
    rules: (__VLS_ctx.rules),
    labelWidth: "80px",
}));
const __VLS_82 = __VLS_81({
    ref: "formRef",
    model: (__VLS_ctx.formData),
    rules: (__VLS_ctx.rules),
    labelWidth: "80px",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
/** @type {typeof __VLS_ctx.formRef} */ ;
var __VLS_84 = {};
__VLS_83.slots.default;
const __VLS_86 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_87 = __VLS_asFunctionalComponent(__VLS_86, new __VLS_86({
    label: "姓名",
    prop: "username",
}));
const __VLS_88 = __VLS_87({
    label: "姓名",
    prop: "username",
}, ...__VLS_functionalComponentArgsRest(__VLS_87));
__VLS_89.slots.default;
const __VLS_90 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({
    modelValue: (__VLS_ctx.formData.username),
    placeholder: "請輸入姓名",
}));
const __VLS_92 = __VLS_91({
    modelValue: (__VLS_ctx.formData.username),
    placeholder: "請輸入姓名",
}, ...__VLS_functionalComponentArgsRest(__VLS_91));
var __VLS_89;
const __VLS_94 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_95 = __VLS_asFunctionalComponent(__VLS_94, new __VLS_94({
    label: "帳號",
    prop: "empno",
}));
const __VLS_96 = __VLS_95({
    label: "帳號",
    prop: "empno",
}, ...__VLS_functionalComponentArgsRest(__VLS_95));
__VLS_97.slots.default;
const __VLS_98 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_99 = __VLS_asFunctionalComponent(__VLS_98, new __VLS_98({
    modelValue: (__VLS_ctx.formData.empno),
    placeholder: "請輸入帳號",
    disabled: (__VLS_ctx.editing),
}));
const __VLS_100 = __VLS_99({
    modelValue: (__VLS_ctx.formData.empno),
    placeholder: "請輸入帳號",
    disabled: (__VLS_ctx.editing),
}, ...__VLS_functionalComponentArgsRest(__VLS_99));
var __VLS_97;
if (!__VLS_ctx.editing) {
    const __VLS_102 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_103 = __VLS_asFunctionalComponent(__VLS_102, new __VLS_102({
        label: "密碼",
        prop: "password",
    }));
    const __VLS_104 = __VLS_103({
        label: "密碼",
        prop: "password",
    }, ...__VLS_functionalComponentArgsRest(__VLS_103));
    __VLS_105.slots.default;
    const __VLS_106 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_107 = __VLS_asFunctionalComponent(__VLS_106, new __VLS_106({
        modelValue: (__VLS_ctx.formData.password),
        type: "password",
        placeholder: "請輸入密碼",
        showPassword: true,
    }));
    const __VLS_108 = __VLS_107({
        modelValue: (__VLS_ctx.formData.password),
        type: "password",
        placeholder: "請輸入密碼",
        showPassword: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_107));
    var __VLS_105;
}
const __VLS_110 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_111 = __VLS_asFunctionalComponent(__VLS_110, new __VLS_110({
    label: "角色",
    prop: "role",
}));
const __VLS_112 = __VLS_111({
    label: "角色",
    prop: "role",
}, ...__VLS_functionalComponentArgsRest(__VLS_111));
__VLS_113.slots.default;
const __VLS_114 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_115 = __VLS_asFunctionalComponent(__VLS_114, new __VLS_114({
    modelValue: (__VLS_ctx.formData.role),
    ...{ class: "!w-full" },
}));
const __VLS_116 = __VLS_115({
    modelValue: (__VLS_ctx.formData.role),
    ...{ class: "!w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_115));
__VLS_117.slots.default;
const __VLS_118 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_119 = __VLS_asFunctionalComponent(__VLS_118, new __VLS_118({
    label: "系統管理員",
    value: "ADMIN",
}));
const __VLS_120 = __VLS_119({
    label: "系統管理員",
    value: "ADMIN",
}, ...__VLS_functionalComponentArgsRest(__VLS_119));
const __VLS_122 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_123 = __VLS_asFunctionalComponent(__VLS_122, new __VLS_122({
    label: "客服",
    value: "SUPPORT",
}));
const __VLS_124 = __VLS_123({
    label: "客服",
    value: "SUPPORT",
}, ...__VLS_functionalComponentArgsRest(__VLS_123));
const __VLS_126 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_127 = __VLS_asFunctionalComponent(__VLS_126, new __VLS_126({
    label: "財務",
    value: "FINANCE",
}));
const __VLS_128 = __VLS_127({
    label: "財務",
    value: "FINANCE",
}, ...__VLS_functionalComponentArgsRest(__VLS_127));
const __VLS_130 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_131 = __VLS_asFunctionalComponent(__VLS_130, new __VLS_130({
    label: "編輯",
    value: "EDITOR",
}));
const __VLS_132 = __VLS_131({
    label: "編輯",
    value: "EDITOR",
}, ...__VLS_functionalComponentArgsRest(__VLS_131));
const __VLS_134 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_135 = __VLS_asFunctionalComponent(__VLS_134, new __VLS_134({
    label: "消費者",
    value: "CONSUMER",
}));
const __VLS_136 = __VLS_135({
    label: "消費者",
    value: "CONSUMER",
}, ...__VLS_functionalComponentArgsRest(__VLS_135));
const __VLS_138 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_139 = __VLS_asFunctionalComponent(__VLS_138, new __VLS_138({
    label: "攝影師",
    value: "PHOTOGRAPHER",
}));
const __VLS_140 = __VLS_139({
    label: "攝影師",
    value: "PHOTOGRAPHER",
}, ...__VLS_functionalComponentArgsRest(__VLS_139));
var __VLS_117;
var __VLS_113;
const __VLS_142 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_143 = __VLS_asFunctionalComponent(__VLS_142, new __VLS_142({
    label: "電話",
    prop: "phone",
}));
const __VLS_144 = __VLS_143({
    label: "電話",
    prop: "phone",
}, ...__VLS_functionalComponentArgsRest(__VLS_143));
__VLS_145.slots.default;
const __VLS_146 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_147 = __VLS_asFunctionalComponent(__VLS_146, new __VLS_146({
    modelValue: (__VLS_ctx.formData.phone),
    placeholder: "請輸入電話",
}));
const __VLS_148 = __VLS_147({
    modelValue: (__VLS_ctx.formData.phone),
    placeholder: "請輸入電話",
}, ...__VLS_functionalComponentArgsRest(__VLS_147));
var __VLS_145;
const __VLS_150 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_151 = __VLS_asFunctionalComponent(__VLS_150, new __VLS_150({
    label: "Email",
    prop: "email",
}));
const __VLS_152 = __VLS_151({
    label: "Email",
    prop: "email",
}, ...__VLS_functionalComponentArgsRest(__VLS_151));
__VLS_153.slots.default;
const __VLS_154 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_155 = __VLS_asFunctionalComponent(__VLS_154, new __VLS_154({
    modelValue: (__VLS_ctx.formData.email),
    placeholder: "請輸入 Email",
}));
const __VLS_156 = __VLS_155({
    modelValue: (__VLS_ctx.formData.email),
    placeholder: "請輸入 Email",
}, ...__VLS_functionalComponentArgsRest(__VLS_155));
var __VLS_153;
var __VLS_83;
{
    const { footer: __VLS_thisSlot } = __VLS_75.slots;
    const __VLS_158 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_159 = __VLS_asFunctionalComponent(__VLS_158, new __VLS_158({
        ...{ 'onClick': {} },
    }));
    const __VLS_160 = __VLS_159({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_159));
    let __VLS_162;
    let __VLS_163;
    let __VLS_164;
    const __VLS_165 = {
        onClick: (...[$event]) => {
            __VLS_ctx.dialogVisible = false;
        }
    };
    __VLS_161.slots.default;
    var __VLS_161;
    const __VLS_166 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_167 = __VLS_asFunctionalComponent(__VLS_166, new __VLS_166({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.saving),
    }));
    const __VLS_168 = __VLS_167({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.saving),
    }, ...__VLS_functionalComponentArgsRest(__VLS_167));
    let __VLS_170;
    let __VLS_171;
    let __VLS_172;
    const __VLS_173 = {
        onClick: (__VLS_ctx.submit)
    };
    __VLS_169.slots.default;
    var __VLS_169;
}
var __VLS_75;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-12']} */ ;
/** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['!w-full']} */ ;
// @ts-ignore
var __VLS_85 = __VLS_84;
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
            roleLabel: roleLabel,
            filteredUsers: filteredUsers,
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
//# sourceMappingURL=UserMaintain.vue.js.map