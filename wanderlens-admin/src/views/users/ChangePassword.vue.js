/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import api from '@/api';
const formRef = ref();
const saving = ref(false);
const form = reactive({ oldPassword: '', newPassword: '', confirmPassword: '' });
const rules = {
    oldPassword: [{ required: true, message: '請輸入舊密碼', trigger: 'blur' }],
    newPassword: [{ required: true, message: '請輸入新密碼', trigger: 'blur' }, { min: 6, message: '密碼至少 6 碼', trigger: 'blur' }],
    confirmPassword: [{ required: true, message: '請確認新密碼', trigger: 'blur' }, {
            validator: (_rule, value, callback) => {
                if (value !== form.newPassword)
                    callback(new Error('兩次密碼不一致'));
                else
                    callback();
            }, trigger: 'blur'
        }],
};
const save = async () => {
    if (!formRef.value)
        return;
    await formRef.value.validate(async (valid) => {
        if (!valid)
            return;
        saving.value = true;
        try {
            await api.changePassword(form.oldPassword, form.newPassword);
            ElMessage.success('密碼已變更');
            form.oldPassword = '';
            form.newPassword = '';
            form.confirmPassword = '';
        }
        catch {
            ElMessage.error('變更失敗');
        }
        finally {
            saving.value = false;
        }
    });
};
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
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelWidth: "120px",
    ref: "formRef",
}));
const __VLS_7 = __VLS_6({
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelWidth: "120px",
    ref: "formRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
/** @type {typeof __VLS_ctx.formRef} */ ;
var __VLS_9 = {};
__VLS_8.slots.default;
const __VLS_11 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({
    label: "舊密碼",
    prop: "oldPassword",
}));
const __VLS_13 = __VLS_12({
    label: "舊密碼",
    prop: "oldPassword",
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
__VLS_14.slots.default;
const __VLS_15 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
    modelValue: (__VLS_ctx.form.oldPassword),
    type: "password",
    showPassword: true,
}));
const __VLS_17 = __VLS_16({
    modelValue: (__VLS_ctx.form.oldPassword),
    type: "password",
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
var __VLS_14;
const __VLS_19 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
    label: "新密碼",
    prop: "newPassword",
}));
const __VLS_21 = __VLS_20({
    label: "新密碼",
    prop: "newPassword",
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
__VLS_22.slots.default;
const __VLS_23 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
    modelValue: (__VLS_ctx.form.newPassword),
    type: "password",
    showPassword: true,
}));
const __VLS_25 = __VLS_24({
    modelValue: (__VLS_ctx.form.newPassword),
    type: "password",
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
var __VLS_22;
const __VLS_27 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({
    label: "確認新密碼",
    prop: "confirmPassword",
}));
const __VLS_29 = __VLS_28({
    label: "確認新密碼",
    prop: "confirmPassword",
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
__VLS_30.slots.default;
const __VLS_31 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
    modelValue: (__VLS_ctx.form.confirmPassword),
    type: "password",
    showPassword: true,
}));
const __VLS_33 = __VLS_32({
    modelValue: (__VLS_ctx.form.confirmPassword),
    type: "password",
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
var __VLS_30;
const __VLS_35 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({}));
const __VLS_37 = __VLS_36({}, ...__VLS_functionalComponentArgsRest(__VLS_36));
__VLS_38.slots.default;
const __VLS_39 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.saving),
}));
const __VLS_41 = __VLS_40({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.saving),
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
let __VLS_43;
let __VLS_44;
let __VLS_45;
const __VLS_46 = {
    onClick: (__VLS_ctx.save)
};
__VLS_42.slots.default;
var __VLS_42;
var __VLS_38;
var __VLS_8;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['max-w-xl']} */ ;
// @ts-ignore
var __VLS_10 = __VLS_9;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
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
//# sourceMappingURL=ChangePassword.vue.js.map