import { ref, reactive } from 'vue';
import { UploadFilled, CircleCheck, Loading } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import api from '@/api';
const props = defineProps();
const emit = defineEmits();
const rawFiles = ref([]);
const jpegFiles = ref([]);
// 允許的副檔名
const ALLOWED_RAW = ['.cr2', '.nef', '.arw', '.raf', '.dng'];
const ALLOWED_JPEG = ['.jpg', '.jpeg'];
// 單檔大小限制：RAW 200MB, JPEG 50MB
const MAX_RAW_SIZE = 200 * 1024 * 1024;
const MAX_JPEG_SIZE = 50 * 1024 * 1024;
// 最大重試次數
const MAX_RETRIES = 3;
/**
 * 取得 media 服務上傳 URL（從 api 服務核發的 token 換取實際上傳端點）
 */
const getMediaUploadUrl = () => {
    // media 服務的上傳端點，由環境變數配置
    return import.meta.env.VITE_MEDIA_UPLOAD_URL || 'http://localhost:8001/upload';
};
/**
 * 上傳單一檔案到 media 服務（含進度追蹤與重試）
 */
const uploadToMedia = async (token, file, assetType, onProgress) => {
    const uploadUrl = getMediaUploadUrl();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('token', token);
    formData.append('asset_type', assetType);
    formData.append('order_id', String(props.orderId));
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', uploadUrl);
        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                onProgress(Math.round((e.loaded / e.total) * 100));
            }
        };
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve();
            }
            else {
                reject(new Error(`HTTP ${xhr.status}: ${xhr.responseText}`));
            }
        };
        xhr.onerror = () => reject(new Error('網路錯誤'));
        xhr.send(formData);
    });
};
/**
 * 帶重試的上傳
 */
const uploadWithRetry = async (token, file, assetType, onProgress) => {
    let lastError = null;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            await uploadToMedia(token, file, assetType, onProgress);
            return;
        }
        catch (err) {
            lastError = err;
            if (attempt < MAX_RETRIES) {
                ElMessage.warning(`${file.name} 上傳失敗，正在重試 (${attempt}/${MAX_RETRIES})...`);
                await new Promise(r => setTimeout(r, 1000 * attempt)); // 指數退避
            }
        }
    }
    throw lastError;
};
const handleUpload = async (options) => {
    const file = options.file;
    const lowerName = file.name.toLowerCase();
    // 判斷檔案類型
    const isJpeg = ALLOWED_JPEG.some(ext => lowerName.endsWith(ext));
    const isRaw = ALLOWED_RAW.some(ext => lowerName.endsWith(ext));
    if (!isJpeg && !isRaw) {
        ElMessage.error(`${file.name} 不支援的檔案格式`);
        return;
    }
    // 檔案大小驗證
    const maxSize = isJpeg ? MAX_JPEG_SIZE : MAX_RAW_SIZE;
    if (file.size > maxSize) {
        ElMessage.error(`${file.name} 超過大小限制 (${isJpeg ? '50MB' : '200MB'})`);
        return;
    }
    const assetType = isJpeg ? 'JPEG' : 'RAW';
    if (isJpeg) {
        // JPEG 快路徑：優先上傳
        const entry = reactive({ name: file.name, status: 'uploading', progress: 0 });
        jpegFiles.value.push(entry);
        try {
            // 取得上傳 token
            const tokenRes = await api.getUploadToken(props.orderId, assetType);
            const token = tokenRes.data;
            // 實際上傳到 media 服務
            await uploadWithRetry(token, file, assetType, (pct) => { entry.progress = pct; });
            entry.status = 'done';
            entry.progress = 100;
        }
        catch {
            entry.status = 'failed';
            ElMessage.error(`${file.name} 上傳失敗`);
        }
    }
    else {
        // RAW：背景上傳
        const entry = reactive({ name: file.name, status: 'uploading', progress: 0 });
        rawFiles.value.push(entry);
        try {
            const tokenRes = await api.getUploadToken(props.orderId, assetType);
            const token = tokenRes.data;
            // 分段上傳到 media 服務（大檔案使用 FormData，瀏覽器會自動處理）
            await uploadWithRetry(token, file, assetType, (pct) => { entry.progress = pct; });
            entry.status = 'done';
            entry.progress = 100;
        }
        catch {
            entry.status = 'failed';
            ElMessage.error(`${file.name} 上傳失敗`);
        }
    }
    // 檢查是否全部完成
    const allDone = [...rawFiles.value, ...jpegFiles.value].every(f => f.status === 'done' || f.status === 'failed');
    if (allDone && rawFiles.value.length > 0) {
        emit('complete');
    }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
const __VLS_0 = {}.ElUpload;
/** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    drag: true,
    multiple: true,
    showFileList: (false),
    httpRequest: (__VLS_ctx.handleUpload),
    accept: ".cr2,.nef,.arw,.raf,.dng,.jpg,.jpeg",
}));
const __VLS_2 = __VLS_1({
    drag: true,
    multiple: true,
    showFileList: (false),
    httpRequest: (__VLS_ctx.handleUpload),
    accept: ".cr2,.nef,.arw,.raf,.dng,.jpg,.jpeg",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    ...{ class: "text-4xl text-gray-400" },
}));
const __VLS_6 = __VLS_5({
    ...{ class: "text-4xl text-gray-400" },
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
const __VLS_8 = {}.UploadFilled;
/** @type {[typeof __VLS_components.UploadFilled, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({}));
const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
var __VLS_7;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-sm text-gray-500" },
});
var __VLS_3;
if (__VLS_ctx.jpegFiles.length > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mt-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
        ...{ class: "text-sm font-semibold mb-2" },
    });
    for (const [f] of __VLS_getVForSourceType((__VLS_ctx.jpegFiles))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (f.name),
            ...{ class: "flex items-center gap-2 text-sm mb-1" },
        });
        if (f.status === 'done') {
            const __VLS_12 = {}.ElIcon;
            /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
            // @ts-ignore
            const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
                ...{ class: "text-green-500" },
            }));
            const __VLS_14 = __VLS_13({
                ...{ class: "text-green-500" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_13));
            __VLS_15.slots.default;
            const __VLS_16 = {}.CircleCheck;
            /** @type {[typeof __VLS_components.CircleCheck, ]} */ ;
            // @ts-ignore
            const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({}));
            const __VLS_18 = __VLS_17({}, ...__VLS_functionalComponentArgsRest(__VLS_17));
            var __VLS_15;
        }
        else if (f.status === 'uploading') {
            const __VLS_20 = {}.ElIcon;
            /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
            // @ts-ignore
            const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
                ...{ class: "text-blue-500 loading" },
            }));
            const __VLS_22 = __VLS_21({
                ...{ class: "text-blue-500 loading" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_21));
            __VLS_23.slots.default;
            const __VLS_24 = {}.Loading;
            /** @type {[typeof __VLS_components.Loading, ]} */ ;
            // @ts-ignore
            const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({}));
            const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
            var __VLS_23;
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (f.name);
        if (f.status === 'done') {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "text-green-500" },
            });
        }
    }
}
if (__VLS_ctx.rawFiles.length > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mt-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
        ...{ class: "text-sm font-semibold mb-2" },
    });
    for (const [f] of __VLS_getVForSourceType((__VLS_ctx.rawFiles))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (f.name),
            ...{ class: "mb-2" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex items-center justify-between text-sm mb-1" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (f.name);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: (f.status === 'done' ? 'text-green-500' : f.status === 'failed' ? 'text-red-500' : 'text-gray-500') },
        });
        (f.status === 'done' ? '✅' : f.status === 'failed' ? '❌' : `${f.progress}%`);
        const __VLS_28 = {}.ElProgress;
        /** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
        // @ts-ignore
        const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
            percentage: (f.progress),
            status: (f.status === 'done' ? 'success' : f.status === 'failed' ? 'exception' : ''),
            strokeWidth: (4),
        }));
        const __VLS_30 = __VLS_29({
            percentage: (f.progress),
            status: (f.status === 'done' ? 'success' : f.status === 'failed' ? 'exception' : ''),
            strokeWidth: (4),
        }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    }
}
if (__VLS_ctx.rawFiles.length > 0 || __VLS_ctx.jpegFiles.length > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mt-4 text-sm text-gray-500" },
    });
    (__VLS_ctx.rawFiles.length + __VLS_ctx.jpegFiles.length);
    (__VLS_ctx.jpegFiles.filter(f => f.status === 'done').length);
    (__VLS_ctx.rawFiles.filter(f => f.status === 'done').length);
}
/** @type {__VLS_StyleScopedClasses['text-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['loading']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            UploadFilled: UploadFilled,
            CircleCheck: CircleCheck,
            Loading: Loading,
            rawFiles: rawFiles,
            jpegFiles: jpegFiles,
            handleUpload: handleUpload,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=RawUploader.vue.js.map