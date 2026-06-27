/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { Search, Plus, Edit, Delete } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { reactive, ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
const props = defineProps();
const { t } = useI18n();
const data = ref([]);
const loading = ref(false);
const saving = ref(false);
const dialogVisible = ref(false);
const editing = ref(false);
const searchKeyword = ref('');
const currentPage = ref(1);
const formRef = ref();
const formData = reactive({});
const editingId = ref(null);
const pageSize = props.pageSize ?? 20;
const filteredData = computed(() => {
    if (!searchKeyword.value)
        return data.value;
    const kw = searchKeyword.value.toLowerCase();
    return data.value.filter(row => props.columns.some(col => String(row[col.prop] ?? '').toLowerCase().includes(kw)));
});
const pagedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return filteredData.value.slice(start, start + pageSize);
});
const formRules = computed(() => {
    const rules = {};
    for (const col of props.columns) {
        if (col.required) {
            rules[col.prop] = [{
                    required: true,
                    message: t('common.required', { field: col.label }),
                    trigger: 'blur',
                }];
        }
    }
    return rules;
});
const loadData = async () => {
    loading.value = true;
    try {
        const res = await props.load();
        data.value = res.data || res || [];
    }
    catch {
        ElMessage.error(t('common.loadFailed'));
        data.value = [];
    }
    finally {
        loading.value = false;
    }
};
const openCreate = () => {
    editing.value = false;
    editingId.value = null;
    for (const col of props.columns) {
        formData[col.prop] = col.type === 'switch' ? (col.inactiveValue ?? 'N') : (col.type === 'number' ? 0 : '');
    }
    dialogVisible.value = true;
};
const openEdit = (row) => {
    editing.value = true;
    editingId.value = row.id;
    for (const col of props.columns) {
        formData[col.prop] = row[col.prop] ?? '';
    }
    dialogVisible.value = true;
};
const resetForm = () => {
    for (const col of props.columns) {
        formData[col.prop] = '';
    }
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
            const submitData = { ...formData };
            if (editingId.value !== null) {
                submitData.id = editingId.value;
            }
            await props.save(submitData);
            ElMessage.success(editing.value ? t('common.updateSuccess') : t('common.createSuccess'));
            dialogVisible.value = false;
            await loadData();
        }
        catch {
            ElMessage.error(editing.value ? t('common.updateFailed') : t('common.createFailed'));
        }
        finally {
            saving.value = false;
        }
    });
};
const remove = async (id) => {
    try {
        await props.delete(id);
        ElMessage.success(t('common.deleteSuccess'));
        await loadData();
    }
    catch {
        ElMessage.error(t('common.deleteFailed'));
    }
};
onMounted(loadData);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['wl-crud-search']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "wl-crud-header flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center gap-3 min-w-0" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "font-semibold text-lg truncate" },
});
(__VLS_ctx.title);
if (__VLS_ctx.data.length > 0) {
    const __VLS_0 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        type: "info",
        size: "small",
    }));
    const __VLS_2 = __VLS_1({
        type: "info",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_3.slots.default;
    (__VLS_ctx.t('common.recordCount', { count: __VLS_ctx.data.length }));
    var __VLS_3;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-col xs:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto" },
});
if (__VLS_ctx.searchable) {
    const __VLS_4 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        modelValue: (__VLS_ctx.searchKeyword),
        placeholder: (__VLS_ctx.t('crud.searchPlaceholder')),
        prefixIcon: (__VLS_ctx.Search),
        ...{ class: "wl-crud-search" },
        clearable: true,
    }));
    const __VLS_6 = __VLS_5({
        modelValue: (__VLS_ctx.searchKeyword),
        placeholder: (__VLS_ctx.t('crud.searchPlaceholder')),
        prefixIcon: (__VLS_ctx.Search),
        ...{ class: "wl-crud-search" },
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
}
const __VLS_8 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Plus),
    ...{ class: "shrink-0" },
}));
const __VLS_10 = __VLS_9({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Plus),
    ...{ class: "shrink-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
let __VLS_12;
let __VLS_13;
let __VLS_14;
const __VLS_15 = {
    onClick: (__VLS_ctx.openCreate)
};
__VLS_11.slots.default;
(__VLS_ctx.t('crud.add'));
var __VLS_11;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "min-h-[120px]" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
if (!__VLS_ctx.loading && __VLS_ctx.filteredData.length === 0) {
    const __VLS_16 = {}.ElEmpty;
    /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        description: (__VLS_ctx.t('common.noData')),
    }));
    const __VLS_18 = __VLS_17({
        description: (__VLS_ctx.t('common.noData')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
}
else if (__VLS_ctx.filteredData.length > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "wl-table-scroll" },
    });
    const __VLS_20 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        data: (__VLS_ctx.pagedData),
        border: true,
        stripe: true,
        ...{ class: "mb-4" },
    }));
    const __VLS_22 = __VLS_21({
        data: (__VLS_ctx.pagedData),
        border: true,
        stripe: true,
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    __VLS_23.slots.default;
    const __VLS_24 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        type: "index",
        label: "#",
        width: "50",
        align: "center",
    }));
    const __VLS_26 = __VLS_25({
        type: "index",
        label: "#",
        width: "50",
        align: "center",
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    for (const [col] of __VLS_getVForSourceType((__VLS_ctx.columns))) {
        const __VLS_28 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
            key: (col.prop),
            prop: (col.prop),
            label: (col.label),
            width: (col.width),
            formatter: (col.formatter),
        }));
        const __VLS_30 = __VLS_29({
            key: (col.prop),
            prop: (col.prop),
            label: (col.label),
            width: (col.width),
            formatter: (col.formatter),
        }, ...__VLS_functionalComponentArgsRest(__VLS_29));
        __VLS_31.slots.default;
        if (col.slot) {
            {
                const { default: __VLS_thisSlot } = __VLS_31.slots;
                const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
                var __VLS_32 = {
                    row: (row),
                };
                var __VLS_33 = __VLS_tryAsConstant(col.slot);
            }
        }
        var __VLS_31;
    }
    const __VLS_36 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        label: (__VLS_ctx.t('common.actions')),
        width: "180",
        fixed: "right",
    }));
    const __VLS_38 = __VLS_37({
        label: (__VLS_ctx.t('common.actions')),
        width: "180",
        fixed: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    __VLS_39.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_39.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_40 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
            ...{ 'onClick': {} },
            text: true,
            type: "primary",
            icon: (__VLS_ctx.Edit),
        }));
        const __VLS_42 = __VLS_41({
            ...{ 'onClick': {} },
            text: true,
            type: "primary",
            icon: (__VLS_ctx.Edit),
        }, ...__VLS_functionalComponentArgsRest(__VLS_41));
        let __VLS_44;
        let __VLS_45;
        let __VLS_46;
        const __VLS_47 = {
            onClick: (...[$event]) => {
                if (!!(!__VLS_ctx.loading && __VLS_ctx.filteredData.length === 0))
                    return;
                if (!(__VLS_ctx.filteredData.length > 0))
                    return;
                __VLS_ctx.openEdit(row);
            }
        };
        __VLS_43.slots.default;
        (__VLS_ctx.t('common.edit'));
        var __VLS_43;
        const __VLS_48 = {}.ElPopconfirm;
        /** @type {[typeof __VLS_components.ElPopconfirm, typeof __VLS_components.elPopconfirm, typeof __VLS_components.ElPopconfirm, typeof __VLS_components.elPopconfirm, ]} */ ;
        // @ts-ignore
        const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
            ...{ 'onConfirm': {} },
            title: (__VLS_ctx.t('common.confirmDelete')),
            confirmButtonText: (__VLS_ctx.t('common.confirmDeleteBtn')),
            cancelButtonText: (__VLS_ctx.t('common.cancel')),
            confirmButtonType: "danger",
        }));
        const __VLS_50 = __VLS_49({
            ...{ 'onConfirm': {} },
            title: (__VLS_ctx.t('common.confirmDelete')),
            confirmButtonText: (__VLS_ctx.t('common.confirmDeleteBtn')),
            cancelButtonText: (__VLS_ctx.t('common.cancel')),
            confirmButtonType: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_49));
        let __VLS_52;
        let __VLS_53;
        let __VLS_54;
        const __VLS_55 = {
            onConfirm: (...[$event]) => {
                if (!!(!__VLS_ctx.loading && __VLS_ctx.filteredData.length === 0))
                    return;
                if (!(__VLS_ctx.filteredData.length > 0))
                    return;
                __VLS_ctx.remove(row.id);
            }
        };
        __VLS_51.slots.default;
        {
            const { reference: __VLS_thisSlot } = __VLS_51.slots;
            const __VLS_56 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
                text: true,
                type: "danger",
                icon: (__VLS_ctx.Delete),
            }));
            const __VLS_58 = __VLS_57({
                text: true,
                type: "danger",
                icon: (__VLS_ctx.Delete),
            }, ...__VLS_functionalComponentArgsRest(__VLS_57));
            __VLS_59.slots.default;
            (__VLS_ctx.t('common.delete'));
            var __VLS_59;
        }
        var __VLS_51;
    }
    var __VLS_39;
    var __VLS_23;
}
if (__VLS_ctx.filteredData.length > __VLS_ctx.pageSize) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-center" },
    });
    const __VLS_60 = {}.ElPagination;
    /** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        currentPage: (__VLS_ctx.currentPage),
        pageSize: (__VLS_ctx.pageSize),
        total: (__VLS_ctx.filteredData.length),
        layout: "prev, pager, next, total",
        background: true,
    }));
    const __VLS_62 = __VLS_61({
        currentPage: (__VLS_ctx.currentPage),
        pageSize: (__VLS_ctx.pageSize),
        total: (__VLS_ctx.filteredData.length),
        layout: "prev, pager, next, total",
        background: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
}
const __VLS_64 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.editing ? __VLS_ctx.t('common.editTitle', { title: __VLS_ctx.title }) : __VLS_ctx.t('common.createTitle', { title: __VLS_ctx.title })),
    width: "min(600px, 92vw)",
    closeOnClickModal: (false),
}));
const __VLS_66 = __VLS_65({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.editing ? __VLS_ctx.t('common.editTitle', { title: __VLS_ctx.title }) : __VLS_ctx.t('common.createTitle', { title: __VLS_ctx.title })),
    width: "min(600px, 92vw)",
    closeOnClickModal: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
let __VLS_68;
let __VLS_69;
let __VLS_70;
const __VLS_71 = {
    onClosed: (__VLS_ctx.resetForm)
};
__VLS_67.slots.default;
const __VLS_72 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    ref: "formRef",
    model: (__VLS_ctx.formData),
    rules: (__VLS_ctx.formRules),
    labelWidth: "100px",
}));
const __VLS_74 = __VLS_73({
    ref: "formRef",
    model: (__VLS_ctx.formData),
    rules: (__VLS_ctx.formRules),
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
/** @type {typeof __VLS_ctx.formRef} */ ;
var __VLS_76 = {};
__VLS_75.slots.default;
for (const [col] of __VLS_getVForSourceType((__VLS_ctx.columns))) {
    const __VLS_78 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({
        key: (col.prop),
        label: (col.label),
        prop: (col.prop),
    }));
    const __VLS_80 = __VLS_79({
        key: (col.prop),
        label: (col.label),
        prop: (col.prop),
    }, ...__VLS_functionalComponentArgsRest(__VLS_79));
    __VLS_81.slots.default;
    if (!col.type || col.type === 'text') {
        const __VLS_82 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_83 = __VLS_asFunctionalComponent(__VLS_82, new __VLS_82({
            modelValue: (__VLS_ctx.formData[col.prop]),
            placeholder: (__VLS_ctx.t('common.inputPlaceholder', { field: col.label })),
        }));
        const __VLS_84 = __VLS_83({
            modelValue: (__VLS_ctx.formData[col.prop]),
            placeholder: (__VLS_ctx.t('common.inputPlaceholder', { field: col.label })),
        }, ...__VLS_functionalComponentArgsRest(__VLS_83));
    }
    else if (col.type === 'number') {
        const __VLS_86 = {}.ElInputNumber;
        /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
        // @ts-ignore
        const __VLS_87 = __VLS_asFunctionalComponent(__VLS_86, new __VLS_86({
            modelValue: (__VLS_ctx.formData[col.prop]),
            min: (col.min ?? 0),
            max: (col.max),
            precision: (col.precision),
            step: (col.step ?? 1),
            ...{ class: "!w-full" },
        }));
        const __VLS_88 = __VLS_87({
            modelValue: (__VLS_ctx.formData[col.prop]),
            min: (col.min ?? 0),
            max: (col.max),
            precision: (col.precision),
            step: (col.step ?? 1),
            ...{ class: "!w-full" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_87));
    }
    else if (col.type === 'select') {
        const __VLS_90 = {}.ElSelect;
        /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
        // @ts-ignore
        const __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({
            modelValue: (__VLS_ctx.formData[col.prop]),
            placeholder: (__VLS_ctx.t('common.selectPlaceholder', { field: col.label })),
            ...{ class: "!w-full" },
        }));
        const __VLS_92 = __VLS_91({
            modelValue: (__VLS_ctx.formData[col.prop]),
            placeholder: (__VLS_ctx.t('common.selectPlaceholder', { field: col.label })),
            ...{ class: "!w-full" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_91));
        __VLS_93.slots.default;
        for (const [opt] of __VLS_getVForSourceType((col.options || []))) {
            const __VLS_94 = {}.ElOption;
            /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
            // @ts-ignore
            const __VLS_95 = __VLS_asFunctionalComponent(__VLS_94, new __VLS_94({
                key: (opt.value),
                label: (opt.label),
                value: (opt.value),
            }));
            const __VLS_96 = __VLS_95({
                key: (opt.value),
                label: (opt.label),
                value: (opt.value),
            }, ...__VLS_functionalComponentArgsRest(__VLS_95));
        }
        var __VLS_93;
    }
    else if (col.type === 'date') {
        const __VLS_98 = {}.ElDatePicker;
        /** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ ;
        // @ts-ignore
        const __VLS_99 = __VLS_asFunctionalComponent(__VLS_98, new __VLS_98({
            modelValue: (__VLS_ctx.formData[col.prop]),
            type: "date",
            valueFormat: "YYYY-MM-DD",
            placeholder: (__VLS_ctx.t('common.selectPlaceholder', { field: col.label })),
            ...{ class: "!w-full" },
        }));
        const __VLS_100 = __VLS_99({
            modelValue: (__VLS_ctx.formData[col.prop]),
            type: "date",
            valueFormat: "YYYY-MM-DD",
            placeholder: (__VLS_ctx.t('common.selectPlaceholder', { field: col.label })),
            ...{ class: "!w-full" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_99));
    }
    else if (col.type === 'datetime') {
        const __VLS_102 = {}.ElDatePicker;
        /** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ ;
        // @ts-ignore
        const __VLS_103 = __VLS_asFunctionalComponent(__VLS_102, new __VLS_102({
            modelValue: (__VLS_ctx.formData[col.prop]),
            type: "datetime",
            valueFormat: "YYYY-MM-DDTHH:mm:ss",
            placeholder: (__VLS_ctx.t('common.selectPlaceholder', { field: col.label })),
            ...{ class: "!w-full" },
        }));
        const __VLS_104 = __VLS_103({
            modelValue: (__VLS_ctx.formData[col.prop]),
            type: "datetime",
            valueFormat: "YYYY-MM-DDTHH:mm:ss",
            placeholder: (__VLS_ctx.t('common.selectPlaceholder', { field: col.label })),
            ...{ class: "!w-full" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_103));
    }
    else if (col.type === 'switch') {
        const __VLS_106 = {}.ElSwitch;
        /** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
        // @ts-ignore
        const __VLS_107 = __VLS_asFunctionalComponent(__VLS_106, new __VLS_106({
            modelValue: (__VLS_ctx.formData[col.prop]),
            activeValue: (col.activeValue ?? 'Y'),
            inactiveValue: (col.inactiveValue ?? 'N'),
        }));
        const __VLS_108 = __VLS_107({
            modelValue: (__VLS_ctx.formData[col.prop]),
            activeValue: (col.activeValue ?? 'Y'),
            inactiveValue: (col.inactiveValue ?? 'N'),
        }, ...__VLS_functionalComponentArgsRest(__VLS_107));
    }
    else if (col.type === 'textarea') {
        const __VLS_110 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_111 = __VLS_asFunctionalComponent(__VLS_110, new __VLS_110({
            modelValue: (__VLS_ctx.formData[col.prop]),
            type: "textarea",
            rows: (col.rows ?? 3),
            placeholder: (__VLS_ctx.t('common.inputPlaceholder', { field: col.label })),
        }));
        const __VLS_112 = __VLS_111({
            modelValue: (__VLS_ctx.formData[col.prop]),
            type: "textarea",
            rows: (col.rows ?? 3),
            placeholder: (__VLS_ctx.t('common.inputPlaceholder', { field: col.label })),
        }, ...__VLS_functionalComponentArgsRest(__VLS_111));
    }
    var __VLS_81;
}
var __VLS_75;
{
    const { footer: __VLS_thisSlot } = __VLS_67.slots;
    const __VLS_114 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_115 = __VLS_asFunctionalComponent(__VLS_114, new __VLS_114({
        ...{ 'onClick': {} },
    }));
    const __VLS_116 = __VLS_115({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_115));
    let __VLS_118;
    let __VLS_119;
    let __VLS_120;
    const __VLS_121 = {
        onClick: (...[$event]) => {
            __VLS_ctx.dialogVisible = false;
        }
    };
    __VLS_117.slots.default;
    (__VLS_ctx.t('common.cancel'));
    var __VLS_117;
    const __VLS_122 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_123 = __VLS_asFunctionalComponent(__VLS_122, new __VLS_122({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.saving),
    }));
    const __VLS_124 = __VLS_123({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.saving),
    }, ...__VLS_functionalComponentArgsRest(__VLS_123));
    let __VLS_126;
    let __VLS_127;
    let __VLS_128;
    const __VLS_129 = {
        onClick: (__VLS_ctx.submit)
    };
    __VLS_125.slots.default;
    (__VLS_ctx.t('common.confirm'));
    var __VLS_125;
}
var __VLS_67;
/** @type {__VLS_StyleScopedClasses['wl-crud-header']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-0']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['xs:flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['items-stretch']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:w-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['wl-crud-search']} */ ;
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-[120px]']} */ ;
/** @type {__VLS_StyleScopedClasses['wl-table-scroll']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['!w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['!w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['!w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['!w-full']} */ ;
// @ts-ignore
var __VLS_34 = __VLS_33, __VLS_35 = __VLS_32, __VLS_77 = __VLS_76;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Search: Search,
            Plus: Plus,
            Edit: Edit,
            Delete: Delete,
            t: t,
            data: data,
            loading: loading,
            saving: saving,
            dialogVisible: dialogVisible,
            editing: editing,
            searchKeyword: searchKeyword,
            currentPage: currentPage,
            formRef: formRef,
            formData: formData,
            pageSize: pageSize,
            filteredData: filteredData,
            pagedData: pagedData,
            formRules: formRules,
            openCreate: openCreate,
            openEdit: openEdit,
            resetForm: resetForm,
            submit: submit,
            remove: remove,
        };
    },
    __typeProps: {},
});
const __VLS_component = (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
});
export default {};
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=GenericCrud.vue.js.map