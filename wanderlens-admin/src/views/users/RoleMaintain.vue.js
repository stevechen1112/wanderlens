/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import api from '@/api';
const roles = ref([]);
const dialogVisible = ref(false);
const saving = ref(false);
const formRef = ref();
const formData = reactive({ name: '', engName: '', description: '' });
const rules = {
    name: [{ required: true, message: '角色名稱不可為空', trigger: 'blur' }],
    engName: [{ required: true, message: '英文名稱不可為空', trigger: 'blur' }],
};
const openCreate = () => {
    Object.assign(formData, { name: '', engName: '', description: '' });
    dialogVisible.value = true;
};
const resetForm = () => {
    Object.assign(formData, { name: '', engName: '', description: '' });
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
            await api.saveRole(formData);
            ElMessage.success('新增成功');
            dialogVisible.value = false;
            await load();
        }
        catch {
            ElMessage.error('新增失敗');
        }
        finally {
            saving.value = false;
        }
    });
};
const editPermissions = (row) => {
    ElMessage.info(`權限設定功能開發中：${row.name}`);
};
const remove = async (id) => {
    try {
        await api.deleteRole(id);
        ElMessage.success('已刪除');
        load();
    }
    catch {
        ElMessage.error('刪除失敗');
    }
};
const load = async () => {
    try {
        const res = await api.getRoles();
        roles.value = res.data || [];
    }
    catch { /* 靜默 */ }
};
onMounted(load);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
const __VLS_0 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    type: "primary",
    ...{ class: "mb-4" },
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    type: "primary",
    ...{ class: "mb-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onClick: (__VLS_ctx.openCreate)
};
__VLS_3.slots.default;
var __VLS_3;
const __VLS_8 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    data: (__VLS_ctx.roles),
    border: true,
}));
const __VLS_10 = __VLS_9({
    data: (__VLS_ctx.roles),
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
const __VLS_12 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    prop: "name",
    label: "角色名稱",
}));
const __VLS_14 = __VLS_13({
    prop: "name",
    label: "角色名稱",
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
const __VLS_16 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    prop: "engName",
    label: "英文名稱",
}));
const __VLS_18 = __VLS_17({
    prop: "engName",
    label: "英文名稱",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
const __VLS_20 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    prop: "description",
    label: "說明",
}));
const __VLS_22 = __VLS_21({
    prop: "description",
    label: "說明",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const __VLS_24 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    label: "操作",
    width: "200",
}));
const __VLS_26 = __VLS_25({
    label: "操作",
    width: "200",
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
        text: true,
        type: "primary",
    }));
    const __VLS_30 = __VLS_29({
        ...{ 'onClick': {} },
        text: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    let __VLS_32;
    let __VLS_33;
    let __VLS_34;
    const __VLS_35 = {
        onClick: (...[$event]) => {
            __VLS_ctx.editPermissions(row);
        }
    };
    __VLS_31.slots.default;
    var __VLS_31;
    const __VLS_36 = {}.ElPopconfirm;
    /** @type {[typeof __VLS_components.ElPopconfirm, typeof __VLS_components.elPopconfirm, typeof __VLS_components.ElPopconfirm, typeof __VLS_components.elPopconfirm, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        ...{ 'onConfirm': {} },
        title: "確認刪除此角色？",
        confirmButtonText: "確認刪除",
        cancelButtonText: "取消",
        confirmButtonType: "danger",
    }));
    const __VLS_38 = __VLS_37({
        ...{ 'onConfirm': {} },
        title: "確認刪除此角色？",
        confirmButtonText: "確認刪除",
        cancelButtonText: "取消",
        confirmButtonType: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    let __VLS_40;
    let __VLS_41;
    let __VLS_42;
    const __VLS_43 = {
        onConfirm: (...[$event]) => {
            __VLS_ctx.remove(row.id);
        }
    };
    __VLS_39.slots.default;
    {
        const { reference: __VLS_thisSlot } = __VLS_39.slots;
        const __VLS_44 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
            text: true,
            type: "danger",
        }));
        const __VLS_46 = __VLS_45({
            text: true,
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_45));
        __VLS_47.slots.default;
        var __VLS_47;
    }
    var __VLS_39;
}
var __VLS_27;
var __VLS_11;
const __VLS_48 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: "新增角色",
    width: "500px",
}));
const __VLS_50 = __VLS_49({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: "新增角色",
    width: "500px",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
let __VLS_52;
let __VLS_53;
let __VLS_54;
const __VLS_55 = {
    onClosed: (__VLS_ctx.resetForm)
};
__VLS_51.slots.default;
const __VLS_56 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    ref: "formRef",
    model: (__VLS_ctx.formData),
    rules: (__VLS_ctx.rules),
    labelWidth: "100px",
}));
const __VLS_58 = __VLS_57({
    ref: "formRef",
    model: (__VLS_ctx.formData),
    rules: (__VLS_ctx.rules),
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
/** @type {typeof __VLS_ctx.formRef} */ ;
var __VLS_60 = {};
__VLS_59.slots.default;
const __VLS_62 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent(__VLS_62, new __VLS_62({
    label: "角色名稱",
    prop: "name",
}));
const __VLS_64 = __VLS_63({
    label: "角色名稱",
    prop: "name",
}, ...__VLS_functionalComponentArgsRest(__VLS_63));
__VLS_65.slots.default;
const __VLS_66 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_67 = __VLS_asFunctionalComponent(__VLS_66, new __VLS_66({
    modelValue: (__VLS_ctx.formData.name),
    placeholder: "請輸入角色名稱",
}));
const __VLS_68 = __VLS_67({
    modelValue: (__VLS_ctx.formData.name),
    placeholder: "請輸入角色名稱",
}, ...__VLS_functionalComponentArgsRest(__VLS_67));
var __VLS_65;
const __VLS_70 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_71 = __VLS_asFunctionalComponent(__VLS_70, new __VLS_70({
    label: "英文名稱",
    prop: "engName",
}));
const __VLS_72 = __VLS_71({
    label: "英文名稱",
    prop: "engName",
}, ...__VLS_functionalComponentArgsRest(__VLS_71));
__VLS_73.slots.default;
const __VLS_74 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_75 = __VLS_asFunctionalComponent(__VLS_74, new __VLS_74({
    modelValue: (__VLS_ctx.formData.engName),
    placeholder: "請輸入英文名稱",
}));
const __VLS_76 = __VLS_75({
    modelValue: (__VLS_ctx.formData.engName),
    placeholder: "請輸入英文名稱",
}, ...__VLS_functionalComponentArgsRest(__VLS_75));
var __VLS_73;
const __VLS_78 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({
    label: "說明",
    prop: "description",
}));
const __VLS_80 = __VLS_79({
    label: "說明",
    prop: "description",
}, ...__VLS_functionalComponentArgsRest(__VLS_79));
__VLS_81.slots.default;
const __VLS_82 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_83 = __VLS_asFunctionalComponent(__VLS_82, new __VLS_82({
    modelValue: (__VLS_ctx.formData.description),
    type: "textarea",
    rows: (3),
    placeholder: "請輸入角色說明",
}));
const __VLS_84 = __VLS_83({
    modelValue: (__VLS_ctx.formData.description),
    type: "textarea",
    rows: (3),
    placeholder: "請輸入角色說明",
}, ...__VLS_functionalComponentArgsRest(__VLS_83));
var __VLS_81;
var __VLS_59;
{
    const { footer: __VLS_thisSlot } = __VLS_51.slots;
    const __VLS_86 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_87 = __VLS_asFunctionalComponent(__VLS_86, new __VLS_86({
        ...{ 'onClick': {} },
    }));
    const __VLS_88 = __VLS_87({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_87));
    let __VLS_90;
    let __VLS_91;
    let __VLS_92;
    const __VLS_93 = {
        onClick: (...[$event]) => {
            __VLS_ctx.dialogVisible = false;
        }
    };
    __VLS_89.slots.default;
    var __VLS_89;
    const __VLS_94 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_95 = __VLS_asFunctionalComponent(__VLS_94, new __VLS_94({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.saving),
    }));
    const __VLS_96 = __VLS_95({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.saving),
    }, ...__VLS_functionalComponentArgsRest(__VLS_95));
    let __VLS_98;
    let __VLS_99;
    let __VLS_100;
    const __VLS_101 = {
        onClick: (__VLS_ctx.submit)
    };
    __VLS_97.slots.default;
    var __VLS_97;
}
var __VLS_51;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
// @ts-ignore
var __VLS_61 = __VLS_60;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            roles: roles,
            dialogVisible: dialogVisible,
            saving: saving,
            formRef: formRef,
            formData: formData,
            rules: rules,
            openCreate: openCreate,
            resetForm: resetForm,
            submit: submit,
            editPermissions: editPermissions,
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
//# sourceMappingURL=RoleMaintain.vue.js.map