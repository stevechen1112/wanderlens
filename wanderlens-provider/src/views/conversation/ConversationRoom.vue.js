/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import api from '@/api';
const { t } = useI18n();
const route = useRoute();
const userId = ref(Number(localStorage.getItem('wl_user_id') || 0));
const conversation = ref(null);
const messages = ref([]);
const inputText = ref('');
const sending = ref(false);
const loading = ref(false);
const loadError = ref(false);
const msgContainer = ref();
let pollTimer;
const loadAll = async () => {
    const id = Number(route.params.id);
    loading.value = true;
    loadError.value = false;
    try {
        const [convRes, msgRes] = await Promise.all([
            api.getConversation(id),
            api.getMessages(id),
        ]);
        conversation.value = convRes.data;
        messages.value = msgRes.data || [];
        await api.markAsRead(id);
        await nextTick();
        if (msgContainer.value)
            msgContainer.value.scrollTop = msgContainer.value.scrollHeight;
    }
    catch {
        loadError.value = true;
        ElMessage.error(t('conversation.loadFailed'));
    }
    finally {
        loading.value = false;
    }
};
const send = async () => {
    if (!inputText.value.trim())
        return;
    sending.value = true;
    try {
        await api.sendMessage(Number(route.params.id), inputText.value);
        inputText.value = '';
        await loadAll();
    }
    catch {
        ElMessage.error(t('conversation.sendFailed'));
    }
    finally {
        sending.value = false;
    }
};
const onImagePick = async (e) => {
    const file = e.target.files?.[0];
    if (!file)
        return;
    sending.value = true;
    try {
        const formData = new FormData();
        formData.append('file', file);
        await api.uploadConversationImage(Number(route.params.id), formData);
        await loadAll();
    }
    catch {
        ElMessage.error(t('conversation.imageSendFailed'));
    }
    finally {
        sending.value = false;
    }
};
onMounted(() => {
    loadAll();
    pollTimer = setInterval(loadAll, 5000);
});
onUnmounted(() => {
    if (pollTimer)
        clearInterval(pollTimer);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "max-w-3xl mx-auto" },
}));
const __VLS_2 = __VLS_1({
    ...{ class: "max-w-3xl mx-auto" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
var __VLS_4 = {};
__VLS_3.slots.default;
if (__VLS_ctx.loadError) {
    const __VLS_5 = {}.ElResult;
    /** @type {[typeof __VLS_components.ElResult, typeof __VLS_components.elResult, typeof __VLS_components.ElResult, typeof __VLS_components.elResult, ]} */ ;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
        icon: "error",
        title: (__VLS_ctx.t('conversation.loadFailed')),
    }));
    const __VLS_7 = __VLS_6({
        icon: "error",
        title: (__VLS_ctx.t('conversation.loadFailed')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    __VLS_8.slots.default;
    {
        const { extra: __VLS_thisSlot } = __VLS_8.slots;
        const __VLS_9 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
            ...{ 'onClick': {} },
            type: "primary",
        }));
        const __VLS_11 = __VLS_10({
            ...{ 'onClick': {} },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_10));
        let __VLS_13;
        let __VLS_14;
        let __VLS_15;
        const __VLS_16 = {
            onClick: (__VLS_ctx.loadAll)
        };
        __VLS_12.slots.default;
        (__VLS_ctx.t('order.myOrder.refresh'));
        var __VLS_12;
    }
    var __VLS_8;
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ref: "msgContainer",
        ...{ class: "h-[55vh] overflow-y-auto space-y-3 p-2" },
    });
    /** @type {typeof __VLS_ctx.msgContainer} */ ;
    for (const [msg] of __VLS_getVForSourceType((__VLS_ctx.messages))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (msg.id),
        });
        if (msg.messageType === 'SYSTEM') {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "text-center" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full" },
            });
            (msg.content);
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: (['flex', msg.senderId === __VLS_ctx.userId ? 'justify-end' : 'justify-start']) },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: ([
                        'max-w-[70%] rounded-lg px-4 py-2 text-sm overflow-hidden',
                        msg.senderId === __VLS_ctx.userId ? 'text-white' : 'bg-gray-100'
                    ]) },
                ...{ style: (msg.senderId === __VLS_ctx.userId ? { background: 'var(--wl-primary)' } : {}) },
            });
            if (msg.messageType === 'TEXT') {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
                (msg.content);
            }
            else if (msg.messageType === 'IMAGE') {
                const __VLS_17 = {}.ElImage;
                /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
                // @ts-ignore
                const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
                    src: (msg.imageUrl),
                    ...{ class: "rounded max-w-full" },
                }));
                const __VLS_19 = __VLS_18({
                    src: (msg.imageUrl),
                    ...{ class: "rounded max-w-full" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_18));
            }
        }
    }
    if (__VLS_ctx.conversation?.status === 'OPEN') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex gap-2 mt-4 items-end" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            ...{ class: "cursor-pointer text-xl px-2" },
            title: (__VLS_ctx.t('conversation.sendImage')),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
            ...{ onChange: (__VLS_ctx.onImagePick) },
            type: "file",
            accept: "image/*",
            ...{ class: "hidden" },
        });
        const __VLS_21 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
            ...{ 'onKeyup': {} },
            modelValue: (__VLS_ctx.inputText),
            placeholder: (__VLS_ctx.t('conversation.inputPlaceholder')),
            ...{ class: "flex-1" },
        }));
        const __VLS_23 = __VLS_22({
            ...{ 'onKeyup': {} },
            modelValue: (__VLS_ctx.inputText),
            placeholder: (__VLS_ctx.t('conversation.inputPlaceholder')),
            ...{ class: "flex-1" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_22));
        let __VLS_25;
        let __VLS_26;
        let __VLS_27;
        const __VLS_28 = {
            onKeyup: (__VLS_ctx.send)
        };
        var __VLS_24;
        const __VLS_29 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
            ...{ 'onClick': {} },
            type: "primary",
            loading: (__VLS_ctx.sending),
        }));
        const __VLS_31 = __VLS_30({
            ...{ 'onClick': {} },
            type: "primary",
            loading: (__VLS_ctx.sending),
        }, ...__VLS_functionalComponentArgsRest(__VLS_30));
        let __VLS_33;
        let __VLS_34;
        let __VLS_35;
        const __VLS_36 = {
            onClick: (__VLS_ctx.send)
        };
        __VLS_32.slots.default;
        (__VLS_ctx.t('conversation.send'));
        var __VLS_32;
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "text-center text-sm text-gray-400 mt-4" },
        });
        (__VLS_ctx.t('conversation.readonly'));
    }
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['max-w-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[55vh]']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-3']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['items-end']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            t: t,
            userId: userId,
            conversation: conversation,
            messages: messages,
            inputText: inputText,
            sending: sending,
            loading: loading,
            loadError: loadError,
            msgContainer: msgContainer,
            loadAll: loadAll,
            send: send,
            onImagePick: onImagePick,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=ConversationRoom.vue.js.map