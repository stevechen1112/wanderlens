/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import api from '@/api';
const { t } = useI18n();
const formRef = ref();
const saving = ref(false);
const form = reactive({});
const rules = computed(() => ({
    bankCode: [{ required: true, message: t('bankPage.bankCodeRequired'), trigger: 'blur' }],
    bankName: [{ required: true, message: t('bankPage.bankNameRequired'), trigger: 'blur' }],
    accountName: [{ required: true, message: t('bankPage.accountNameRequired'), trigger: 'blur' }],
    accountNo: [{ required: true, message: t('bankPage.accountNoRequired'), trigger: 'blur' }],
}));
const save = async () => {
    if (!formRef.value)
        return;
    await formRef.value.validate(async (valid) => {
        if (!valid)
            return;
        saving.value = true;
        try {
            await api.setBank(form);
            ElMessage.success(t('bankPage.saveSuccess'));
        }
        catch {
            ElMessage.error(t('bankPage.saveFailed'));
        }
        finally {
            saving.value = false;
        }
    });
};
onMounted(async () => {
    try {
        const res = await api.getBank();
        Object.assign(form, res.data);
    }
    catch {
        // silent
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "max-w-xl" },
}));
const __VLS_2 = __VLS_1({
    ...{ class: "max-w-xl" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelWidth: "100px",
}));
const __VLS_7 = __VLS_6({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
/** @type {typeof __VLS_ctx.formRef} */ ;
var __VLS_9 = {};
__VLS_8.slots.default;
const __VLS_11 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({
    label: (__VLS_ctx.t('bankPage.bankCode')),
    prop: "bankCode",
}));
const __VLS_13 = __VLS_12({
    label: (__VLS_ctx.t('bankPage.bankCode')),
    prop: "bankCode",
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
__VLS_14.slots.default;
const __VLS_15 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
    modelValue: (__VLS_ctx.form.bankCode),
    placeholder: (__VLS_ctx.t('bankPage.bankCodePlaceholder')),
    maxlength: "3",
}));
const __VLS_17 = __VLS_16({
    modelValue: (__VLS_ctx.form.bankCode),
    placeholder: (__VLS_ctx.t('bankPage.bankCodePlaceholder')),
    maxlength: "3",
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
var __VLS_14;
const __VLS_19 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
    label: (__VLS_ctx.t('bankPage.bankName')),
    prop: "bankName",
}));
const __VLS_21 = __VLS_20({
    label: (__VLS_ctx.t('bankPage.bankName')),
    prop: "bankName",
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
__VLS_22.slots.default;
const __VLS_23 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
    modelValue: (__VLS_ctx.form.bankName),
    placeholder: (__VLS_ctx.t('bankPage.bankNamePlaceholder')),
}));
const __VLS_25 = __VLS_24({
    modelValue: (__VLS_ctx.form.bankName),
    placeholder: (__VLS_ctx.t('bankPage.bankNamePlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
var __VLS_22;
const __VLS_27 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({
    label: (__VLS_ctx.t('bankPage.bankBranch')),
    prop: "bankBranch",
}));
const __VLS_29 = __VLS_28({
    label: (__VLS_ctx.t('bankPage.bankBranch')),
    prop: "bankBranch",
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
__VLS_30.slots.default;
const __VLS_31 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
    modelValue: (__VLS_ctx.form.bankBranch),
    placeholder: (__VLS_ctx.t('bankPage.bankBranchPlaceholder')),
}));
const __VLS_33 = __VLS_32({
    modelValue: (__VLS_ctx.form.bankBranch),
    placeholder: (__VLS_ctx.t('bankPage.bankBranchPlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
var __VLS_30;
const __VLS_35 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({
    label: (__VLS_ctx.t('bankPage.accountName')),
    prop: "accountName",
}));
const __VLS_37 = __VLS_36({
    label: (__VLS_ctx.t('bankPage.accountName')),
    prop: "accountName",
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
__VLS_38.slots.default;
const __VLS_39 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
    modelValue: (__VLS_ctx.form.accountName),
    placeholder: (__VLS_ctx.t('bankPage.accountNamePlaceholder')),
}));
const __VLS_41 = __VLS_40({
    modelValue: (__VLS_ctx.form.accountName),
    placeholder: (__VLS_ctx.t('bankPage.accountNamePlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
var __VLS_38;
const __VLS_43 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
    label: (__VLS_ctx.t('bankPage.accountNo')),
    prop: "accountNo",
}));
const __VLS_45 = __VLS_44({
    label: (__VLS_ctx.t('bankPage.accountNo')),
    prop: "accountNo",
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
__VLS_46.slots.default;
const __VLS_47 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent(__VLS_47, new __VLS_47({
    modelValue: (__VLS_ctx.form.accountNo),
    placeholder: (__VLS_ctx.t('bankPage.accountNoPlaceholder')),
}));
const __VLS_49 = __VLS_48({
    modelValue: (__VLS_ctx.form.accountNo),
    placeholder: (__VLS_ctx.t('bankPage.accountNoPlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
var __VLS_46;
const __VLS_51 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
    label: (__VLS_ctx.t('bankPage.note')),
}));
const __VLS_53 = __VLS_52({
    label: (__VLS_ctx.t('bankPage.note')),
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
__VLS_54.slots.default;
const __VLS_55 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({
    modelValue: (__VLS_ctx.form.note),
    type: "textarea",
    rows: (2),
}));
const __VLS_57 = __VLS_56({
    modelValue: (__VLS_ctx.form.note),
    type: "textarea",
    rows: (2),
}, ...__VLS_functionalComponentArgsRest(__VLS_56));
var __VLS_54;
const __VLS_59 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({}));
const __VLS_61 = __VLS_60({}, ...__VLS_functionalComponentArgsRest(__VLS_60));
__VLS_62.slots.default;
const __VLS_63 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.saving),
}));
const __VLS_65 = __VLS_64({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.saving),
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
let __VLS_67;
let __VLS_68;
let __VLS_69;
const __VLS_70 = {
    onClick: (__VLS_ctx.save)
};
__VLS_66.slots.default;
(__VLS_ctx.t('bankPage.save'));
var __VLS_66;
var __VLS_62;
var __VLS_8;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['max-w-xl']} */ ;
// @ts-ignore
var __VLS_10 = __VLS_9;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            t: t,
            formRef: formRef,
            saving: saving,
            form: form,
            rules: rules,
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
//# sourceMappingURL=BankInfo.vue.js.map