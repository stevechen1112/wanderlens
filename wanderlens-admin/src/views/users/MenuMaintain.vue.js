/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import api from '@/api';
const menus = ref([]);
const dialogVisible = ref(false);
const editing = ref(false);
const editingId = ref(null);
const saving = ref(false);
const formRef = ref();
const formData = reactive({ name: '', path: '', icon: '', sortOrder: 0 });
const rules = {
    name: [{ required: true, message: '名稱不可為空', trigger: 'blur' }],
    path: [{ required: true, message: '路徑不可為空', trigger: 'blur' }],
};
const openCreate = () => {
    editing.value = false;
    editingId.value = null;
    Object.assign(formData, { name: '', path: '', icon: '', sortOrder: 0 });
    dialogVisible.value = true;
};
const openEdit = (row) => {
    editing.value = true;
    editingId.value = row.id;
    Object.assign(formData, { name: row.name, path: row.path, icon: row.icon || '', sortOrder: row.sortOrder || 0 });
    dialogVisible.value = true;
};
const resetForm = () => {
    Object.assign(formData, { name: '', path: '', icon: '', sortOrder: 0 });
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
            await api.saveMenu(data);
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
        await api.deleteMenu(id);
        ElMessage.success('已刪除');
        load();
    }
    catch {
        ElMessage.error('刪除失敗');
    }
};
const load = async () => {
    try {
        const res = await api.getMenus();
        menus.value = res.data || [];
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
    data: (__VLS_ctx.menus),
    border: true,
}));
const __VLS_10 = __VLS_9({
    data: (__VLS_ctx.menus),
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
const __VLS_12 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    prop: "name",
    label: "選單名稱",
}));
const __VLS_14 = __VLS_13({
    prop: "name",
    label: "選單名稱",
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
const __VLS_16 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    prop: "path",
    label: "路徑",
}));
const __VLS_18 = __VLS_17({
    prop: "path",
    label: "路徑",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
const __VLS_20 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    prop: "icon",
    label: "圖示",
    width: "80",
}));
const __VLS_22 = __VLS_21({
    prop: "icon",
    label: "圖示",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const __VLS_24 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    prop: "sortOrder",
    label: "排序",
    width: "80",
}));
const __VLS_26 = __VLS_25({
    prop: "sortOrder",
    label: "排序",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
const __VLS_28 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    label: "操作",
    width: "150",
}));
const __VLS_30 = __VLS_29({
    label: "操作",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_31.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_31.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_32 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        ...{ 'onClick': {} },
        text: true,
        type: "primary",
    }));
    const __VLS_34 = __VLS_33({
        ...{ 'onClick': {} },
        text: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    let __VLS_36;
    let __VLS_37;
    let __VLS_38;
    const __VLS_39 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openEdit(row);
        }
    };
    __VLS_35.slots.default;
    var __VLS_35;
    const __VLS_40 = {}.ElPopconfirm;
    /** @type {[typeof __VLS_components.ElPopconfirm, typeof __VLS_components.elPopconfirm, typeof __VLS_components.ElPopconfirm, typeof __VLS_components.elPopconfirm, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        ...{ 'onConfirm': {} },
        title: "確認刪除此選單？",
        confirmButtonText: "確認刪除",
        cancelButtonText: "取消",
        confirmButtonType: "danger",
    }));
    const __VLS_42 = __VLS_41({
        ...{ 'onConfirm': {} },
        title: "確認刪除此選單？",
        confirmButtonText: "確認刪除",
        cancelButtonText: "取消",
        confirmButtonType: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    let __VLS_44;
    let __VLS_45;
    let __VLS_46;
    const __VLS_47 = {
        onConfirm: (...[$event]) => {
            __VLS_ctx.remove(row.id);
        }
    };
    __VLS_43.slots.default;
    {
        const { reference: __VLS_thisSlot } = __VLS_43.slots;
        const __VLS_48 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
            text: true,
            type: "danger",
        }));
        const __VLS_50 = __VLS_49({
            text: true,
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_49));
        __VLS_51.slots.default;
        var __VLS_51;
    }
    var __VLS_43;
}
var __VLS_31;
var __VLS_11;
const __VLS_52 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.editing ? '編輯選單' : '新增選單'),
    width: "500px",
}));
const __VLS_54 = __VLS_53({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.editing ? '編輯選單' : '新增選單'),
    width: "500px",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
let __VLS_56;
let __VLS_57;
let __VLS_58;
const __VLS_59 = {
    onClosed: (__VLS_ctx.resetForm)
};
__VLS_55.slots.default;
const __VLS_60 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    ref: "formRef",
    model: (__VLS_ctx.formData),
    rules: (__VLS_ctx.rules),
    labelWidth: "80px",
}));
const __VLS_62 = __VLS_61({
    ref: "formRef",
    model: (__VLS_ctx.formData),
    rules: (__VLS_ctx.rules),
    labelWidth: "80px",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
/** @type {typeof __VLS_ctx.formRef} */ ;
var __VLS_64 = {};
__VLS_63.slots.default;
const __VLS_66 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_67 = __VLS_asFunctionalComponent(__VLS_66, new __VLS_66({
    label: "名稱",
    prop: "name",
}));
const __VLS_68 = __VLS_67({
    label: "名稱",
    prop: "name",
}, ...__VLS_functionalComponentArgsRest(__VLS_67));
__VLS_69.slots.default;
const __VLS_70 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_71 = __VLS_asFunctionalComponent(__VLS_70, new __VLS_70({
    modelValue: (__VLS_ctx.formData.name),
    placeholder: "請輸入選單名稱",
}));
const __VLS_72 = __VLS_71({
    modelValue: (__VLS_ctx.formData.name),
    placeholder: "請輸入選單名稱",
}, ...__VLS_functionalComponentArgsRest(__VLS_71));
var __VLS_69;
const __VLS_74 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_75 = __VLS_asFunctionalComponent(__VLS_74, new __VLS_74({
    label: "路徑",
    prop: "path",
}));
const __VLS_76 = __VLS_75({
    label: "路徑",
    prop: "path",
}, ...__VLS_functionalComponentArgsRest(__VLS_75));
__VLS_77.slots.default;
const __VLS_78 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({
    modelValue: (__VLS_ctx.formData.path),
    placeholder: "請輸入路徑",
}));
const __VLS_80 = __VLS_79({
    modelValue: (__VLS_ctx.formData.path),
    placeholder: "請輸入路徑",
}, ...__VLS_functionalComponentArgsRest(__VLS_79));
var __VLS_77;
const __VLS_82 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_83 = __VLS_asFunctionalComponent(__VLS_82, new __VLS_82({
    label: "圖示",
    prop: "icon",
}));
const __VLS_84 = __VLS_83({
    label: "圖示",
    prop: "icon",
}, ...__VLS_functionalComponentArgsRest(__VLS_83));
__VLS_85.slots.default;
const __VLS_86 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_87 = __VLS_asFunctionalComponent(__VLS_86, new __VLS_86({
    modelValue: (__VLS_ctx.formData.icon),
    placeholder: "請輸入圖示名稱",
}));
const __VLS_88 = __VLS_87({
    modelValue: (__VLS_ctx.formData.icon),
    placeholder: "請輸入圖示名稱",
}, ...__VLS_functionalComponentArgsRest(__VLS_87));
var __VLS_85;
const __VLS_90 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({
    label: "排序",
    prop: "sortOrder",
}));
const __VLS_92 = __VLS_91({
    label: "排序",
    prop: "sortOrder",
}, ...__VLS_functionalComponentArgsRest(__VLS_91));
__VLS_93.slots.default;
const __VLS_94 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_95 = __VLS_asFunctionalComponent(__VLS_94, new __VLS_94({
    modelValue: (__VLS_ctx.formData.sortOrder),
    min: (0),
    ...{ class: "!w-full" },
}));
const __VLS_96 = __VLS_95({
    modelValue: (__VLS_ctx.formData.sortOrder),
    min: (0),
    ...{ class: "!w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_95));
var __VLS_93;
var __VLS_63;
{
    const { footer: __VLS_thisSlot } = __VLS_55.slots;
    const __VLS_98 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_99 = __VLS_asFunctionalComponent(__VLS_98, new __VLS_98({
        ...{ 'onClick': {} },
    }));
    const __VLS_100 = __VLS_99({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_99));
    let __VLS_102;
    let __VLS_103;
    let __VLS_104;
    const __VLS_105 = {
        onClick: (...[$event]) => {
            __VLS_ctx.dialogVisible = false;
        }
    };
    __VLS_101.slots.default;
    var __VLS_101;
    const __VLS_106 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_107 = __VLS_asFunctionalComponent(__VLS_106, new __VLS_106({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.saving),
    }));
    const __VLS_108 = __VLS_107({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.saving),
    }, ...__VLS_functionalComponentArgsRest(__VLS_107));
    let __VLS_110;
    let __VLS_111;
    let __VLS_112;
    const __VLS_113 = {
        onClick: (__VLS_ctx.submit)
    };
    __VLS_109.slots.default;
    var __VLS_109;
}
var __VLS_55;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['!w-full']} */ ;
// @ts-ignore
var __VLS_65 = __VLS_64;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            menus: menus,
            dialogVisible: dialogVisible,
            editing: editing,
            saving: saving,
            formRef: formRef,
            formData: formData,
            rules: rules,
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
//# sourceMappingURL=MenuMaintain.vue.js.map