/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, computed, onMounted } from 'vue';
import { Search, Plus, Edit, Delete, Loading } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import api from '@/api';
import RichTextEditor from '@/components/common/RichTextEditor.vue';
const loading = ref(false);
const saving = ref(false);
const newsList = ref([]);
const searchKeyword = ref('');
const dialogVisible = ref(false);
const editing = ref(false);
const editingId = ref(null);
const formRef = ref();
const formData = reactive({
    language: 'zh',
    topic: '',
    content: '',
    status: 'on',
    sortOrder: 0,
});
const rules = {
    language: [{ required: true, message: '語系不可為空', trigger: 'change' }],
    topic: [{ required: true, message: '主題不可為空', trigger: 'blur' }],
    content: [{ required: true, message: '內容不可為空', trigger: 'blur' }],
};
const filteredNews = computed(() => {
    if (!searchKeyword.value)
        return newsList.value;
    const kw = searchKeyword.value.toLowerCase();
    return newsList.value.filter(n => n.topic?.toLowerCase().includes(kw) || n.language?.toLowerCase().includes(kw));
});
const loadData = async () => {
    loading.value = true;
    try {
        const res = await api.getNews();
        newsList.value = res.data || [];
    }
    catch {
        ElMessage.error('載入失敗');
        newsList.value = [];
    }
    finally {
        loading.value = false;
    }
};
const openCreate = () => {
    editing.value = false;
    editingId.value = null;
    Object.assign(formData, { language: 'zh', topic: '', content: '', status: 'on', sortOrder: 0 });
    dialogVisible.value = true;
};
const openEdit = (row) => {
    editing.value = true;
    editingId.value = row.id;
    Object.assign(formData, {
        language: row.language || 'zh',
        topic: row.topic || '',
        content: row.content || '',
        status: row.status || 'on',
        sortOrder: row.sortOrder || 0,
    });
    dialogVisible.value = true;
};
const resetForm = () => {
    Object.assign(formData, { language: 'zh', topic: '', content: '', status: 'on', sortOrder: 0 });
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
            await api.saveNews(data);
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
        await api.deleteNews(id);
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center gap-3" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "font-semibold text-lg" },
});
if (__VLS_ctx.newsList.length > 0) {
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
    (__VLS_ctx.newsList.length);
    var __VLS_3;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center gap-2" },
});
const __VLS_4 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    modelValue: (__VLS_ctx.searchKeyword),
    placeholder: "搜尋公告",
    prefixIcon: (__VLS_ctx.Search),
    ...{ style: {} },
    clearable: true,
}));
const __VLS_6 = __VLS_5({
    modelValue: (__VLS_ctx.searchKeyword),
    placeholder: "搜尋公告",
    prefixIcon: (__VLS_ctx.Search),
    ...{ style: {} },
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
const __VLS_8 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Plus),
}));
const __VLS_10 = __VLS_9({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Plus),
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
let __VLS_12;
let __VLS_13;
let __VLS_14;
const __VLS_15 = {
    onClick: (__VLS_ctx.openCreate)
};
__VLS_11.slots.default;
var __VLS_11;
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-center py-12" },
    });
    const __VLS_16 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        ...{ class: "is-loading" },
        size: (32),
    }));
    const __VLS_18 = __VLS_17({
        ...{ class: "is-loading" },
        size: (32),
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    __VLS_19.slots.default;
    const __VLS_20 = {}.Loading;
    /** @type {[typeof __VLS_components.Loading, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({}));
    const __VLS_22 = __VLS_21({}, ...__VLS_functionalComponentArgsRest(__VLS_21));
    var __VLS_19;
}
else {
    const __VLS_24 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        data: (__VLS_ctx.filteredNews),
        border: true,
        stripe: true,
    }));
    const __VLS_26 = __VLS_25({
        data: (__VLS_ctx.filteredNews),
        border: true,
        stripe: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    __VLS_27.slots.default;
    const __VLS_28 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        prop: "language",
        label: "語系",
        width: "80",
    }));
    const __VLS_30 = __VLS_29({
        prop: "language",
        label: "語系",
        width: "80",
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    const __VLS_32 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        prop: "topic",
        label: "主題",
        minWidth: "150",
    }));
    const __VLS_34 = __VLS_33({
        prop: "topic",
        label: "主題",
        minWidth: "150",
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    const __VLS_36 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        prop: "status",
        label: "狀態",
        width: "80",
    }));
    const __VLS_38 = __VLS_37({
        prop: "status",
        label: "狀態",
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
            type: (row.status === 'on' ? 'success' : 'info'),
        }));
        const __VLS_42 = __VLS_41({
            type: (row.status === 'on' ? 'success' : 'info'),
        }, ...__VLS_functionalComponentArgsRest(__VLS_41));
        __VLS_43.slots.default;
        (row.status === 'on' ? '上架' : '下架');
        var __VLS_43;
    }
    var __VLS_39;
    const __VLS_44 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        prop: "sortOrder",
        label: "排序",
        width: "80",
    }));
    const __VLS_46 = __VLS_45({
        prop: "sortOrder",
        label: "排序",
        width: "80",
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
            confirmButtonText: "確認",
            cancelButtonText: "取消",
        }));
        const __VLS_62 = __VLS_61({
            ...{ 'onConfirm': {} },
            title: "確認刪除？",
            confirmButtonText: "確認",
            cancelButtonText: "取消",
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
    var __VLS_27;
}
const __VLS_72 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.editing ? '編輯公告' : '新增公告'),
    width: "700px",
}));
const __VLS_74 = __VLS_73({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.editing ? '編輯公告' : '新增公告'),
    width: "700px",
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
    label: "語系",
    prop: "language",
}));
const __VLS_88 = __VLS_87({
    label: "語系",
    prop: "language",
}, ...__VLS_functionalComponentArgsRest(__VLS_87));
__VLS_89.slots.default;
const __VLS_90 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({
    modelValue: (__VLS_ctx.formData.language),
    ...{ class: "!w-full" },
}));
const __VLS_92 = __VLS_91({
    modelValue: (__VLS_ctx.formData.language),
    ...{ class: "!w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_91));
__VLS_93.slots.default;
const __VLS_94 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_95 = __VLS_asFunctionalComponent(__VLS_94, new __VLS_94({
    label: "繁中",
    value: "zh",
}));
const __VLS_96 = __VLS_95({
    label: "繁中",
    value: "zh",
}, ...__VLS_functionalComponentArgsRest(__VLS_95));
const __VLS_98 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_99 = __VLS_asFunctionalComponent(__VLS_98, new __VLS_98({
    label: "英文",
    value: "en",
}));
const __VLS_100 = __VLS_99({
    label: "英文",
    value: "en",
}, ...__VLS_functionalComponentArgsRest(__VLS_99));
const __VLS_102 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_103 = __VLS_asFunctionalComponent(__VLS_102, new __VLS_102({
    label: "日文",
    value: "jp",
}));
const __VLS_104 = __VLS_103({
    label: "日文",
    value: "jp",
}, ...__VLS_functionalComponentArgsRest(__VLS_103));
const __VLS_106 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_107 = __VLS_asFunctionalComponent(__VLS_106, new __VLS_106({
    label: "韓文",
    value: "ka",
}));
const __VLS_108 = __VLS_107({
    label: "韓文",
    value: "ka",
}, ...__VLS_functionalComponentArgsRest(__VLS_107));
var __VLS_93;
var __VLS_89;
const __VLS_110 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_111 = __VLS_asFunctionalComponent(__VLS_110, new __VLS_110({
    label: "主題",
    prop: "topic",
}));
const __VLS_112 = __VLS_111({
    label: "主題",
    prop: "topic",
}, ...__VLS_functionalComponentArgsRest(__VLS_111));
__VLS_113.slots.default;
const __VLS_114 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_115 = __VLS_asFunctionalComponent(__VLS_114, new __VLS_114({
    modelValue: (__VLS_ctx.formData.topic),
    placeholder: "請輸入主題",
}));
const __VLS_116 = __VLS_115({
    modelValue: (__VLS_ctx.formData.topic),
    placeholder: "請輸入主題",
}, ...__VLS_functionalComponentArgsRest(__VLS_115));
var __VLS_113;
const __VLS_118 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_119 = __VLS_asFunctionalComponent(__VLS_118, new __VLS_118({
    label: "內容",
    prop: "content",
}));
const __VLS_120 = __VLS_119({
    label: "內容",
    prop: "content",
}, ...__VLS_functionalComponentArgsRest(__VLS_119));
__VLS_121.slots.default;
/** @type {[typeof RichTextEditor, ]} */ ;
// @ts-ignore
const __VLS_122 = __VLS_asFunctionalComponent(RichTextEditor, new RichTextEditor({
    modelValue: (__VLS_ctx.formData.content),
}));
const __VLS_123 = __VLS_122({
    modelValue: (__VLS_ctx.formData.content),
}, ...__VLS_functionalComponentArgsRest(__VLS_122));
var __VLS_121;
const __VLS_125 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_126 = __VLS_asFunctionalComponent(__VLS_125, new __VLS_125({
    label: "狀態",
    prop: "status",
}));
const __VLS_127 = __VLS_126({
    label: "狀態",
    prop: "status",
}, ...__VLS_functionalComponentArgsRest(__VLS_126));
__VLS_128.slots.default;
const __VLS_129 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_130 = __VLS_asFunctionalComponent(__VLS_129, new __VLS_129({
    modelValue: (__VLS_ctx.formData.status),
    ...{ class: "!w-full" },
}));
const __VLS_131 = __VLS_130({
    modelValue: (__VLS_ctx.formData.status),
    ...{ class: "!w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_130));
__VLS_132.slots.default;
const __VLS_133 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_134 = __VLS_asFunctionalComponent(__VLS_133, new __VLS_133({
    label: "上架",
    value: "on",
}));
const __VLS_135 = __VLS_134({
    label: "上架",
    value: "on",
}, ...__VLS_functionalComponentArgsRest(__VLS_134));
const __VLS_137 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_138 = __VLS_asFunctionalComponent(__VLS_137, new __VLS_137({
    label: "下架",
    value: "off",
}));
const __VLS_139 = __VLS_138({
    label: "下架",
    value: "off",
}, ...__VLS_functionalComponentArgsRest(__VLS_138));
var __VLS_132;
var __VLS_128;
const __VLS_141 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_142 = __VLS_asFunctionalComponent(__VLS_141, new __VLS_141({
    label: "排序",
    prop: "sortOrder",
}));
const __VLS_143 = __VLS_142({
    label: "排序",
    prop: "sortOrder",
}, ...__VLS_functionalComponentArgsRest(__VLS_142));
__VLS_144.slots.default;
const __VLS_145 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_146 = __VLS_asFunctionalComponent(__VLS_145, new __VLS_145({
    modelValue: (__VLS_ctx.formData.sortOrder),
    min: (0),
    ...{ class: "!w-full" },
}));
const __VLS_147 = __VLS_146({
    modelValue: (__VLS_ctx.formData.sortOrder),
    min: (0),
    ...{ class: "!w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_146));
var __VLS_144;
var __VLS_83;
{
    const { footer: __VLS_thisSlot } = __VLS_75.slots;
    const __VLS_149 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_150 = __VLS_asFunctionalComponent(__VLS_149, new __VLS_149({
        ...{ 'onClick': {} },
    }));
    const __VLS_151 = __VLS_150({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_150));
    let __VLS_153;
    let __VLS_154;
    let __VLS_155;
    const __VLS_156 = {
        onClick: (...[$event]) => {
            __VLS_ctx.dialogVisible = false;
        }
    };
    __VLS_152.slots.default;
    var __VLS_152;
    const __VLS_157 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_158 = __VLS_asFunctionalComponent(__VLS_157, new __VLS_157({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.saving),
    }));
    const __VLS_159 = __VLS_158({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.saving),
    }, ...__VLS_functionalComponentArgsRest(__VLS_158));
    let __VLS_161;
    let __VLS_162;
    let __VLS_163;
    const __VLS_164 = {
        onClick: (__VLS_ctx.submit)
    };
    __VLS_160.slots.default;
    var __VLS_160;
}
var __VLS_75;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
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
/** @type {__VLS_StyleScopedClasses['!w-full']} */ ;
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
            RichTextEditor: RichTextEditor,
            loading: loading,
            saving: saving,
            newsList: newsList,
            searchKeyword: searchKeyword,
            dialogVisible: dialogVisible,
            editing: editing,
            formRef: formRef,
            formData: formData,
            rules: rules,
            filteredNews: filteredNews,
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
//# sourceMappingURL=NewsMaintain.vue.js.map