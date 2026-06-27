/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, onMounted, computed } from 'vue';
import { UploadFilled } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import request from '@/api/request';
const { t } = useI18n();
const form = reactive({ orderId: '' });
const fileList = ref([]);
const uploading = ref(false);
const uploadProgress = ref(0);
const uploadResult = ref(null);
const orders = ref([]);
const pendingOrders = computed(() => orders.value.filter((o) => o.status === 'PAID' || o.status === 'SHOOTING' || o.status === 'SHOT'));
const orderLabel = (o) => `#${o.id} — ${o.customerName || t('rawUploadPage.customerFallback')} (${o.shootingDate || t('rawUploadPage.dateTbd')})`;
const onOrderChange = () => {
    fileList.value = [];
    uploadResult.value = null;
};
const onFileChange = (file) => {
    fileList.value.push(file);
};
const onFileRemove = (file) => {
    fileList.value = fileList.value.filter((f) => f.uid !== file.uid);
};
const startUpload = async () => {
    if (fileList.value.length === 0)
        return;
    uploading.value = true;
    uploadProgress.value = 0;
    uploadResult.value = null;
    try {
        for (let i = 0; i < fileList.value.length; i++) {
            const file = fileList.value[i].raw;
            const formData = new FormData();
            formData.append('file', file);
            formData.append('orderId', form.orderId);
            await request.post('/media/upload/raw', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (e) => {
                    uploadProgress.value = Math.round(((i + e.loaded / e.total) / fileList.value.length) * 100);
                },
            });
        }
        uploadProgress.value = 100;
        uploadResult.value = {
            success: true,
            message: t('rawUploadPage.uploadSuccessCount', { count: fileList.value.length }),
        };
        ElMessage.success(t('rawUploadPage.uploadComplete'));
        fileList.value = [];
    }
    catch (err) {
        uploadResult.value = {
            success: false,
            message: err?.response?.data?.message || t('rawUploadPage.uploadFailedRetry'),
        };
        ElMessage.error(t('rawUploadPage.uploadFailed'));
    }
    finally {
        uploading.value = false;
    }
};
onMounted(async () => {
    try {
        const res = await request.get('/orders/provider');
        orders.value = res?.data || [];
    }
    catch {
        orders.value = [];
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "text-xl font-bold mb-4" },
});
(__VLS_ctx.t('rawUploadPage.title'));
const __VLS_0 = {}.ElAlert;
/** @type {[typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    type: "info",
    closable: (false),
    ...{ class: "mb-4" },
}));
const __VLS_2 = __VLS_1({
    type: "info",
    closable: (false),
    ...{ class: "mb-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
{
    const { title: __VLS_thisSlot } = __VLS_3.slots;
    (__VLS_ctx.t('rawUploadPage.alert'));
}
var __VLS_3;
const __VLS_4 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    model: (__VLS_ctx.form),
    labelWidth: "100px",
    ...{ class: "mb-6" },
}));
const __VLS_6 = __VLS_5({
    model: (__VLS_ctx.form),
    labelWidth: "100px",
    ...{ class: "mb-6" },
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
const __VLS_8 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    label: (__VLS_ctx.t('rawUploadPage.selectOrder')),
}));
const __VLS_10 = __VLS_9({
    label: (__VLS_ctx.t('rawUploadPage.selectOrder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
const __VLS_12 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.form.orderId),
    placeholder: (__VLS_ctx.t('rawUploadPage.orderPlaceholder')),
    ...{ style: {} },
}));
const __VLS_14 = __VLS_13({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.form.orderId),
    placeholder: (__VLS_ctx.t('rawUploadPage.orderPlaceholder')),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
let __VLS_16;
let __VLS_17;
let __VLS_18;
const __VLS_19 = {
    onChange: (__VLS_ctx.onOrderChange)
};
__VLS_15.slots.default;
for (const [o] of __VLS_getVForSourceType((__VLS_ctx.pendingOrders))) {
    const __VLS_20 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        key: (o.id),
        label: (__VLS_ctx.orderLabel(o)),
        value: (o.id),
    }));
    const __VLS_22 = __VLS_21({
        key: (o.id),
        label: (__VLS_ctx.orderLabel(o)),
        value: (o.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
}
var __VLS_15;
var __VLS_11;
var __VLS_7;
if (__VLS_ctx.form.orderId) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "upload-area" },
    });
    const __VLS_24 = {}.ElUpload;
    /** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        drag: true,
        multiple: true,
        autoUpload: (false),
        fileList: (__VLS_ctx.fileList),
        accept: ".raw,.cr2,.nef,.arw,.dng,.jpg,.jpeg",
        onChange: (__VLS_ctx.onFileChange),
        onRemove: (__VLS_ctx.onFileRemove),
    }));
    const __VLS_26 = __VLS_25({
        drag: true,
        multiple: true,
        autoUpload: (false),
        fileList: (__VLS_ctx.fileList),
        accept: ".raw,.cr2,.nef,.arw,.dng,.jpg,.jpeg",
        onChange: (__VLS_ctx.onFileChange),
        onRemove: (__VLS_ctx.onFileRemove),
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    __VLS_27.slots.default;
    const __VLS_28 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        ...{ class: "el-icon--upload" },
    }));
    const __VLS_30 = __VLS_29({
        ...{ class: "el-icon--upload" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    __VLS_31.slots.default;
    const __VLS_32 = {}.UploadFilled;
    /** @type {[typeof __VLS_components.UploadFilled, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({}));
    const __VLS_34 = __VLS_33({}, ...__VLS_functionalComponentArgsRest(__VLS_33));
    var __VLS_31;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "el-upload__text" },
    });
    (__VLS_ctx.t('rawUploadPage.dragText'));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.em, __VLS_intrinsicElements.em)({});
    (__VLS_ctx.t('rawUploadPage.dragEm'));
    {
        const { tip: __VLS_thisSlot } = __VLS_27.slots;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "el-upload__tip text-gray-400" },
        });
        (__VLS_ctx.t('rawUploadPage.tip'));
    }
    var __VLS_27;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mt-4 flex items-center justify-between" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-sm text-gray-500" },
    });
    (__VLS_ctx.t('rawUploadPage.selectedCount', { count: __VLS_ctx.fileList.length }));
    const __VLS_36 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.uploading),
        disabled: (__VLS_ctx.fileList.length === 0),
    }));
    const __VLS_38 = __VLS_37({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.uploading),
        disabled: (__VLS_ctx.fileList.length === 0),
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    let __VLS_40;
    let __VLS_41;
    let __VLS_42;
    const __VLS_43 = {
        onClick: (__VLS_ctx.startUpload)
    };
    __VLS_39.slots.default;
    (__VLS_ctx.t('rawUploadPage.startUpload'));
    var __VLS_39;
    if (__VLS_ctx.uploading) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "mt-4" },
        });
        const __VLS_44 = {}.ElProgress;
        /** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
        // @ts-ignore
        const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
            percentage: (__VLS_ctx.uploadProgress),
            status: (__VLS_ctx.uploadProgress === 100 ? 'success' : ''),
        }));
        const __VLS_46 = __VLS_45({
            percentage: (__VLS_ctx.uploadProgress),
            status: (__VLS_ctx.uploadProgress === 100 ? 'success' : ''),
        }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    }
    if (__VLS_ctx.uploadResult) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "mt-4" },
        });
        const __VLS_48 = {}.ElAlert;
        /** @type {[typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, ]} */ ;
        // @ts-ignore
        const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
            type: (__VLS_ctx.uploadResult.success ? 'success' : 'error'),
            title: (__VLS_ctx.uploadResult.message),
            closable: (false),
        }));
        const __VLS_50 = __VLS_49({
            type: (__VLS_ctx.uploadResult.success ? 'success' : 'error'),
            title: (__VLS_ctx.uploadResult.message),
            closable: (false),
        }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    }
}
else if (__VLS_ctx.pendingOrders.length === 0) {
    const __VLS_52 = {}.ElEmpty;
    /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        description: (__VLS_ctx.t('rawUploadPage.emptyOrders')),
    }));
    const __VLS_54 = __VLS_53({
        description: (__VLS_ctx.t('rawUploadPage.emptyOrders')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
}
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-area']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon--upload']} */ ;
/** @type {__VLS_StyleScopedClasses['el-upload__text']} */ ;
/** @type {__VLS_StyleScopedClasses['el-upload__tip']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            UploadFilled: UploadFilled,
            t: t,
            form: form,
            fileList: fileList,
            uploading: uploading,
            uploadProgress: uploadProgress,
            uploadResult: uploadResult,
            pendingOrders: pendingOrders,
            orderLabel: orderLabel,
            onOrderChange: onOrderChange,
            onFileChange: onFileChange,
            onFileRemove: onFileRemove,
            startUpload: startUpload,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=RawUpload.vue.js.map