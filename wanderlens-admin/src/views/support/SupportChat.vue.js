/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import api from '@/api';
const conversations = ref([]);
const messages = ref([]);
const activeId = ref(null);
const activeTitle = ref('');
const activeStatus = ref('OPEN');
const inputText = ref('');
const msgBox = ref();
const activePeerId = ref(0);
let pollTimer;
const isStaffMsg = (msg) => msg.senderId !== activePeerId.value && msg.senderId !== 0;
const loadList = async () => {
    try {
        const res = await api.getSupportConversations();
        conversations.value = res.data || [];
    }
    catch {
        ElMessage.error('載入失敗');
    }
};
const selectConv = async (conv) => {
    activeId.value = conv.id;
    activeTitle.value = conv.peerName || conv.conversationType;
    activeStatus.value = conv.status;
    activePeerId.value = conv.participantBId;
    await loadMessages();
    await api.markConversationRead(conv.id);
};
const loadMessages = async () => {
    if (!activeId.value)
        return;
    try {
        const res = await api.getConversationMessages(activeId.value);
        messages.value = res.data || [];
        await nextTick();
        if (msgBox.value)
            msgBox.value.scrollTop = msgBox.value.scrollHeight;
    }
    catch { /* silent */ }
};
const send = async () => {
    if (!activeId.value || !inputText.value.trim())
        return;
    try {
        await api.sendConversationMessage(activeId.value, inputText.value.trim());
        inputText.value = '';
        await loadMessages();
        await loadList();
    }
    catch {
        ElMessage.error('發送失敗');
    }
};
onMounted(() => {
    loadList();
    pollTimer = setInterval(async () => {
        if (activeId.value) {
            await loadMessages();
            try {
                const res = await api.getConversation(activeId.value);
                activeStatus.value = res.data?.status || activeStatus.value;
            }
            catch { /* silent */ }
        }
        await loadList();
    }, 5000);
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex gap-4 h-[calc(100vh-120px)]" },
});
const __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "w-80 flex-shrink-0 overflow-auto" },
}));
const __VLS_2 = __VLS_1({
    ...{ class: "w-80 flex-shrink-0 overflow-auto" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "font-semibold mb-3" },
});
const __VLS_4 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    ...{ 'onClick': {} },
    type: "primary",
    size: "small",
    ...{ class: "mb-3 w-full" },
}));
const __VLS_6 = __VLS_5({
    ...{ 'onClick': {} },
    type: "primary",
    size: "small",
    ...{ class: "mb-3 w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
let __VLS_8;
let __VLS_9;
let __VLS_10;
const __VLS_11 = {
    onClick: (__VLS_ctx.loadList)
};
__VLS_7.slots.default;
var __VLS_7;
for (const [conv] of __VLS_getVForSourceType((__VLS_ctx.conversations))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.selectConv(conv);
            } },
        key: (conv.id),
        ...{ class: "p-3 rounded cursor-pointer mb-2 border" },
        ...{ class: (__VLS_ctx.activeId === conv.id ? 'border-primary bg-orange-50' : 'border-gray-100') },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "font-medium text-sm" },
    });
    (conv.peerName || conv.conversationType);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-xs text-gray-400 truncate" },
    });
    (conv.lastMessage || '尚無訊息');
    if (conv.unreadCount) {
        const __VLS_12 = {}.ElBadge;
        /** @type {[typeof __VLS_components.ElBadge, typeof __VLS_components.elBadge, ]} */ ;
        // @ts-ignore
        const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
            value: (conv.unreadCount),
            ...{ class: "mt-1" },
        }));
        const __VLS_14 = __VLS_13({
            value: (conv.unreadCount),
            ...{ class: "mt-1" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    }
}
if (!__VLS_ctx.conversations.length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-gray-400 text-sm text-center py-8" },
    });
}
var __VLS_3;
const __VLS_16 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    ...{ class: "flex-1 flex flex-col" },
}));
const __VLS_18 = __VLS_17({
    ...{ class: "flex-1 flex flex-col" },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
if (__VLS_ctx.activeId) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "font-semibold mb-2" },
    });
    (__VLS_ctx.activeTitle);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ref: "msgBox",
        ...{ class: "flex-1 overflow-y-auto space-y-2 mb-3 p-2 bg-gray-50 rounded min-h-[50vh]" },
    });
    /** @type {typeof __VLS_ctx.msgBox} */ ;
    for (const [msg] of __VLS_getVForSourceType((__VLS_ctx.messages))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (msg.id),
        });
        if (msg.messageType === 'SYSTEM') {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "text-center text-xs text-gray-400" },
            });
            (msg.content);
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: (['flex', __VLS_ctx.isStaffMsg(msg) ? 'justify-end' : 'justify-start']) },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: (['max-w-[70%] rounded-lg px-3 py-2 text-sm', __VLS_ctx.isStaffMsg(msg) ? 'bg-primary text-white' : 'bg-white border']) },
            });
            if (msg.messageType === 'TEXT') {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
                (msg.content);
            }
            else if (msg.messageType === 'IMAGE') {
                const __VLS_20 = {}.ElImage;
                /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
                // @ts-ignore
                const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
                    src: (msg.imageUrl),
                    ...{ class: "max-w-full rounded" },
                }));
                const __VLS_22 = __VLS_21({
                    src: (msg.imageUrl),
                    ...{ class: "max-w-full rounded" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_21));
            }
        }
    }
    if (__VLS_ctx.activeStatus === 'OPEN') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex gap-2" },
        });
        const __VLS_24 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
            ...{ 'onKeyup': {} },
            modelValue: (__VLS_ctx.inputText),
            placeholder: "回覆訊息...",
        }));
        const __VLS_26 = __VLS_25({
            ...{ 'onKeyup': {} },
            modelValue: (__VLS_ctx.inputText),
            placeholder: "回覆訊息...",
        }, ...__VLS_functionalComponentArgsRest(__VLS_25));
        let __VLS_28;
        let __VLS_29;
        let __VLS_30;
        const __VLS_31 = {
            onKeyup: (__VLS_ctx.send)
        };
        var __VLS_27;
        const __VLS_32 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
            ...{ 'onClick': {} },
            type: "primary",
        }));
        const __VLS_34 = __VLS_33({
            ...{ 'onClick': {} },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_33));
        let __VLS_36;
        let __VLS_37;
        let __VLS_38;
        const __VLS_39 = {
            onClick: (__VLS_ctx.send)
        };
        __VLS_35.slots.default;
        var __VLS_35;
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "text-center text-sm text-gray-400" },
        });
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex-1 flex items-center justify-center text-gray-400" },
    });
}
var __VLS_19;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[calc(100vh-120px)]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-80']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-8']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-[50vh]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            conversations: conversations,
            messages: messages,
            activeId: activeId,
            activeTitle: activeTitle,
            activeStatus: activeStatus,
            inputText: inputText,
            msgBox: msgBox,
            isStaffMsg: isStaffMsg,
            loadList: loadList,
            selectConv: selectConv,
            send: send,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=SupportChat.vue.js.map