/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useI18n } from 'vue-i18n';
import api from '@/api';
import { useAuthStore } from '@/stores/auth';
const { t } = useI18n();
const authStore = useAuthStore();
const features = ref([]);
const showDialog = ref(false);
const editing = ref(false);
const form = reactive({ language: 'tw', featureType: '', featureContent: '' });
const openAdd = () => {
    Object.assign(form, { language: 'tw', featureType: '', featureContent: '', id: undefined });
    editing.value = false;
    showDialog.value = true;
};
const edit = (row) => {
    Object.assign(form, row);
    editing.value = true;
    showDialog.value = true;
};
const remove = async (id) => {
    try {
        await ElMessageBox.confirm(t('featuresPage.confirmDelete'), t('featuresPage.confirmTitle'), {
            type: 'warning',
            confirmButtonText: t('common.confirm'),
            cancelButtonText: t('common.cancel'),
        });
        await api.setFeature({ id, providerId: authStore.userId, active: 'N' });
        features.value = features.value.filter((f) => f.id !== id);
        ElMessage.success(t('featuresPage.deleteSuccess'));
    }
    catch (err) {
        if (err !== 'cancel')
            ElMessage.error(t('featuresPage.deleteFailed'));
    }
};
const save = async () => {
    try {
        await api.setFeature({ ...form, providerId: authStore.userId });
        ElMessage.success(t('featuresPage.saveSuccess'));
        showDialog.value = false;
        loadFeatures();
    }
    catch {
        ElMessage.error(t('featuresPage.saveFailed'));
    }
};
const loadFeatures = async () => {
    try {
        const res = await api.getFeature(authStore.userId);
        features.value = res.data || [];
    }
    catch {
        // silent
    }
};
onMounted(loadFeatures);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    data: (__VLS_ctx.features),
    border: true,
}));
const __VLS_7 = __VLS_6({
    data: (__VLS_ctx.features),
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
const __VLS_9 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    prop: "language",
    label: (__VLS_ctx.t('featuresPage.language')),
    width: "80",
}));
const __VLS_11 = __VLS_10({
    prop: "language",
    label: (__VLS_ctx.t('featuresPage.language')),
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
const __VLS_13 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    prop: "featureType",
    label: (__VLS_ctx.t('featuresPage.featureType')),
    width: "120",
}));
const __VLS_15 = __VLS_14({
    prop: "featureType",
    label: (__VLS_ctx.t('featuresPage.featureType')),
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
const __VLS_17 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    prop: "featureContent",
    label: (__VLS_ctx.t('featuresPage.content')),
}));
const __VLS_19 = __VLS_18({
    prop: "featureContent",
    label: (__VLS_ctx.t('featuresPage.content')),
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
const __VLS_21 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
    label: (__VLS_ctx.t('featuresPage.actions')),
    width: "100",
}));
const __VLS_23 = __VLS_22({
    label: (__VLS_ctx.t('featuresPage.actions')),
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
__VLS_24.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_24.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_25 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
        ...{ 'onClick': {} },
        text: true,
        type: "primary",
    }));
    const __VLS_27 = __VLS_26({
        ...{ 'onClick': {} },
        text: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    let __VLS_29;
    let __VLS_30;
    let __VLS_31;
    const __VLS_32 = {
        onClick: (...[$event]) => {
            __VLS_ctx.edit(row);
        }
    };
    __VLS_28.slots.default;
    (__VLS_ctx.t('featuresPage.edit'));
    var __VLS_28;
    const __VLS_33 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
        ...{ 'onClick': {} },
        text: true,
        type: "danger",
    }));
    const __VLS_35 = __VLS_34({
        ...{ 'onClick': {} },
        text: true,
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_34));
    let __VLS_37;
    let __VLS_38;
    let __VLS_39;
    const __VLS_40 = {
        onClick: (...[$event]) => {
            __VLS_ctx.remove(row.id);
        }
    };
    __VLS_36.slots.default;
    (__VLS_ctx.t('featuresPage.delete'));
    var __VLS_36;
}
var __VLS_24;
var __VLS_8;
const __VLS_41 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
    ...{ 'onClick': {} },
    type: "primary",
    ...{ class: "mt-4" },
}));
const __VLS_43 = __VLS_42({
    ...{ 'onClick': {} },
    type: "primary",
    ...{ class: "mt-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
let __VLS_45;
let __VLS_46;
let __VLS_47;
const __VLS_48 = {
    onClick: (__VLS_ctx.openAdd)
};
__VLS_44.slots.default;
(__VLS_ctx.t('featuresPage.add'));
var __VLS_44;
const __VLS_49 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
    modelValue: (__VLS_ctx.showDialog),
    title: (__VLS_ctx.editing ? __VLS_ctx.t('featuresPage.editTitle') : __VLS_ctx.t('featuresPage.addTitle')),
    width: "500px",
}));
const __VLS_51 = __VLS_50({
    modelValue: (__VLS_ctx.showDialog),
    title: (__VLS_ctx.editing ? __VLS_ctx.t('featuresPage.editTitle') : __VLS_ctx.t('featuresPage.addTitle')),
    width: "500px",
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
__VLS_52.slots.default;
const __VLS_53 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
    labelWidth: "80px",
}));
const __VLS_55 = __VLS_54({
    labelWidth: "80px",
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
__VLS_56.slots.default;
const __VLS_57 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
    label: (__VLS_ctx.t('featuresPage.language')),
}));
const __VLS_59 = __VLS_58({
    label: (__VLS_ctx.t('featuresPage.language')),
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
__VLS_60.slots.default;
const __VLS_61 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
    modelValue: (__VLS_ctx.form.language),
}));
const __VLS_63 = __VLS_62({
    modelValue: (__VLS_ctx.form.language),
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
__VLS_64.slots.default;
const __VLS_65 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({
    label: "tw",
}));
const __VLS_67 = __VLS_66({
    label: "tw",
}, ...__VLS_functionalComponentArgsRest(__VLS_66));
__VLS_68.slots.default;
(__VLS_ctx.t('featuresPage.langTw'));
var __VLS_68;
const __VLS_69 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({
    label: "en",
}));
const __VLS_71 = __VLS_70({
    label: "en",
}, ...__VLS_functionalComponentArgsRest(__VLS_70));
__VLS_72.slots.default;
(__VLS_ctx.t('featuresPage.langEn'));
var __VLS_72;
const __VLS_73 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({
    label: "jp",
}));
const __VLS_75 = __VLS_74({
    label: "jp",
}, ...__VLS_functionalComponentArgsRest(__VLS_74));
__VLS_76.slots.default;
(__VLS_ctx.t('featuresPage.langJp'));
var __VLS_76;
const __VLS_77 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
    label: "kr",
}));
const __VLS_79 = __VLS_78({
    label: "kr",
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
__VLS_80.slots.default;
(__VLS_ctx.t('featuresPage.langKr'));
var __VLS_80;
var __VLS_64;
var __VLS_60;
const __VLS_81 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
    label: (__VLS_ctx.t('featuresPage.featureType')),
}));
const __VLS_83 = __VLS_82({
    label: (__VLS_ctx.t('featuresPage.featureType')),
}, ...__VLS_functionalComponentArgsRest(__VLS_82));
__VLS_84.slots.default;
const __VLS_85 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({
    modelValue: (__VLS_ctx.form.featureType),
    placeholder: (__VLS_ctx.t('featuresPage.selectType')),
}));
const __VLS_87 = __VLS_86({
    modelValue: (__VLS_ctx.form.featureType),
    placeholder: (__VLS_ctx.t('featuresPage.selectType')),
}, ...__VLS_functionalComponentArgsRest(__VLS_86));
__VLS_88.slots.default;
const __VLS_89 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({
    label: (__VLS_ctx.t('featuresPage.typeStyle')),
    value: "style",
}));
const __VLS_91 = __VLS_90({
    label: (__VLS_ctx.t('featuresPage.typeStyle')),
    value: "style",
}, ...__VLS_functionalComponentArgsRest(__VLS_90));
const __VLS_93 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({
    label: (__VLS_ctx.t('featuresPage.typeService')),
    value: "service",
}));
const __VLS_95 = __VLS_94({
    label: (__VLS_ctx.t('featuresPage.typeService')),
    value: "service",
}, ...__VLS_functionalComponentArgsRest(__VLS_94));
const __VLS_97 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, new __VLS_97({
    label: (__VLS_ctx.t('featuresPage.typeEquipment')),
    value: "equipment",
}));
const __VLS_99 = __VLS_98({
    label: (__VLS_ctx.t('featuresPage.typeEquipment')),
    value: "equipment",
}, ...__VLS_functionalComponentArgsRest(__VLS_98));
var __VLS_88;
var __VLS_84;
const __VLS_101 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_102 = __VLS_asFunctionalComponent(__VLS_101, new __VLS_101({
    label: (__VLS_ctx.t('featuresPage.description')),
}));
const __VLS_103 = __VLS_102({
    label: (__VLS_ctx.t('featuresPage.description')),
}, ...__VLS_functionalComponentArgsRest(__VLS_102));
__VLS_104.slots.default;
const __VLS_105 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_106 = __VLS_asFunctionalComponent(__VLS_105, new __VLS_105({
    modelValue: (__VLS_ctx.form.featureContent),
    type: "textarea",
    rows: (3),
}));
const __VLS_107 = __VLS_106({
    modelValue: (__VLS_ctx.form.featureContent),
    type: "textarea",
    rows: (3),
}, ...__VLS_functionalComponentArgsRest(__VLS_106));
var __VLS_104;
var __VLS_56;
{
    const { footer: __VLS_thisSlot } = __VLS_52.slots;
    const __VLS_109 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({
        ...{ 'onClick': {} },
    }));
    const __VLS_111 = __VLS_110({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_110));
    let __VLS_113;
    let __VLS_114;
    let __VLS_115;
    const __VLS_116 = {
        onClick: (...[$event]) => {
            __VLS_ctx.showDialog = false;
        }
    };
    __VLS_112.slots.default;
    (__VLS_ctx.t('common.cancel'));
    var __VLS_112;
    const __VLS_117 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_118 = __VLS_asFunctionalComponent(__VLS_117, new __VLS_117({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_119 = __VLS_118({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_118));
    let __VLS_121;
    let __VLS_122;
    let __VLS_123;
    const __VLS_124 = {
        onClick: (__VLS_ctx.save)
    };
    __VLS_120.slots.default;
    (__VLS_ctx.t('common.save'));
    var __VLS_120;
}
var __VLS_52;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            t: t,
            features: features,
            showDialog: showDialog,
            editing: editing,
            form: form,
            openAdd: openAdd,
            edit: edit,
            remove: remove,
            save: save,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=Features.vue.js.map