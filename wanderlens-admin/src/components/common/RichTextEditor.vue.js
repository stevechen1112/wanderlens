/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, watch, onMounted, computed } from 'vue';
const props = defineProps();
const emit = defineEmits();
const editorRef = ref();
const initialContent = ref(props.modelValue || '');
const sanitizedInitialContent = computed(() => sanitizeHTML(initialContent.value));
// 當外部 modelValue 變化時更新（例如 dialog 開啟時）
watch(() => props.modelValue, (val) => {
    if (editorRef.value && val !== editorRef.value.innerHTML) {
        editorRef.value.innerHTML = sanitizeHTML(val || '');
    }
});
const exec = (command, value) => {
    document.execCommand(command, false, value);
    handleInput();
};
/**
 * 簡易 HTML 淨化：移除 <script> 標籤與 on* 事件屬性，防止 XSS
 */
const sanitizeHTML = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    // 移除 <script> 元素
    tmp.querySelectorAll('script').forEach(el => el.remove());
    // 移除所有 on* 事件屬性
    tmp.querySelectorAll('*').forEach(el => {
        Array.from(el.attributes).forEach(attr => {
            if (/^on/i.test(attr.name))
                el.removeAttribute(attr.name);
        });
    });
    // 移除 javascript: href
    tmp.querySelectorAll('a[href]').forEach(el => {
        const href = el.getAttribute('href') || '';
        if (/^javascript:/i.test(href))
            el.removeAttribute('href');
    });
    return tmp.innerHTML;
};
const insertLink = () => {
    const url = window.prompt('請輸入連結 URL');
    if (url) {
        // 只允許 http:// 與 https:// 協定，阻擋 javascript: 等危險協定
        if (!/^https?:\/\//i.test(url)) {
            alert('僅允許 http:// 或 https:// 開頭的連結');
            return;
        }
        exec('createLink', url);
    }
};
const handleInput = () => {
    if (editorRef.value) {
        emit('update:modelValue', editorRef.value.innerHTML);
    }
};
const handleBlur = () => {
    emit('blur');
};
onMounted(() => {
    if (editorRef.value) {
        editorRef.value.innerHTML = sanitizeHTML(props.modelValue || '');
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['editor-area']} */ ;
/** @type {__VLS_StyleScopedClasses['editor-area']} */ ;
/** @type {__VLS_StyleScopedClasses['editor-area']} */ ;
/** @type {__VLS_StyleScopedClasses['editor-area']} */ ;
/** @type {__VLS_StyleScopedClasses['editor-area']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "rich-text-editor" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.exec('bold');
        } },
    type: "button",
    title: "粗體",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.b, __VLS_intrinsicElements.b)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.exec('italic');
        } },
    type: "button",
    title: "斜體",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.exec('underline');
        } },
    type: "button",
    title: "底線",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.u, __VLS_intrinsicElements.u)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span)({
    ...{ class: "divider" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.exec('insertUnorderedList');
        } },
    type: "button",
    title: "無序列表",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.exec('insertOrderedList');
        } },
    type: "button",
    title: "有序列表",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span)({
    ...{ class: "divider" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.insertLink) },
    type: "button",
    title: "插入連結",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.exec('formatBlock', '<h3>');
        } },
    type: "button",
    title: "標題",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.exec('formatBlock', '<p>');
        } },
    type: "button",
    title: "段落",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span)({
    ...{ class: "divider" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.exec('undo');
        } },
    type: "button",
    title: "復原",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.exec('redo');
        } },
    type: "button",
    title: "重做",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div)({
    ...{ onInput: (__VLS_ctx.handleInput) },
    ...{ onBlur: (__VLS_ctx.handleBlur) },
    ref: "editorRef",
    ...{ class: "editor-area" },
    contenteditable: "true",
});
__VLS_asFunctionalDirective(__VLS_directives.vHtml)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.sanitizedInitialContent) }, null, null);
/** @type {typeof __VLS_ctx.editorRef} */ ;
/** @type {__VLS_StyleScopedClasses['rich-text-editor']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['divider']} */ ;
/** @type {__VLS_StyleScopedClasses['divider']} */ ;
/** @type {__VLS_StyleScopedClasses['divider']} */ ;
/** @type {__VLS_StyleScopedClasses['editor-area']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            editorRef: editorRef,
            sanitizedInitialContent: sanitizedInitialContent,
            exec: exec,
            insertLink: insertLink,
            handleInput: handleInput,
            handleBlur: handleBlur,
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
//# sourceMappingURL=RichTextEditor.vue.js.map