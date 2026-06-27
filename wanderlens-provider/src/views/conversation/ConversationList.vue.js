/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import api from '@/api';
const { t } = useI18n();
const conversations = ref([]);
const loading = ref(false);
const loadError = ref(false);
const loadConversations = async () => {
    loading.value = true;
    loadError.value = false;
    try {
        const res = await api.getConversations();
        conversations.value = res.data || [];
    }
    catch {
        loadError.value = true;
        conversations.value = [];
        ElMessage.error(t('conversation.loadFailed'));
    }
    finally {
        loading.value = false;
    }
};
onMounted(loadConversations);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
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
            onClick: (__VLS_ctx.loadConversations)
        };
        __VLS_12.slots.default;
        (__VLS_ctx.t('order.myOrder.refresh'));
        var __VLS_12;
    }
    var __VLS_8;
}
else if (!__VLS_ctx.loading && __VLS_ctx.conversations.length === 0) {
    const __VLS_17 = {}.ElEmpty;
    /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
        description: (__VLS_ctx.t('conversation.empty')),
    }));
    const __VLS_19 = __VLS_18({
        description: (__VLS_ctx.t('conversation.empty')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_18));
    __VLS_20.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-sm text-gray-400" },
    });
    (__VLS_ctx.t('conversation.emptyDesc'));
    var __VLS_20;
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "wl-table-scroll" },
    });
    const __VLS_21 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
        ...{ 'onRowClick': {} },
        data: (__VLS_ctx.conversations),
    }));
    const __VLS_23 = __VLS_22({
        ...{ 'onRowClick': {} },
        data: (__VLS_ctx.conversations),
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    let __VLS_25;
    let __VLS_26;
    let __VLS_27;
    const __VLS_28 = {
        onRowClick: ((row) => __VLS_ctx.$router.push(`/conversations/${row.id}`))
    };
    __VLS_24.slots.default;
    const __VLS_29 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
        label: (__VLS_ctx.t('conversation.peer')),
        minWidth: "140",
    }));
    const __VLS_31 = __VLS_30({
        label: (__VLS_ctx.t('conversation.peer')),
        minWidth: "140",
    }, ...__VLS_functionalComponentArgsRest(__VLS_30));
    __VLS_32.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_32.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        (row.peerName || (row.orderId ? __VLS_ctx.t('conversation.orderPrefix') + row.orderId : row.conversationType));
    }
    var __VLS_32;
    const __VLS_33 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
        label: (__VLS_ctx.t('conversation.lastMessage')),
        minWidth: "200",
    }));
    const __VLS_35 = __VLS_34({
        label: (__VLS_ctx.t('conversation.lastMessage')),
        minWidth: "200",
    }, ...__VLS_functionalComponentArgsRest(__VLS_34));
    __VLS_36.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_36.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-gray-500 text-sm" },
        });
        (row.lastMessage || __VLS_ctx.t('conversation.noMessage'));
    }
    var __VLS_36;
    const __VLS_37 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
        label: (__VLS_ctx.t('conversation.unread')),
        width: "80",
    }));
    const __VLS_39 = __VLS_38({
        label: (__VLS_ctx.t('conversation.unread')),
        width: "80",
    }, ...__VLS_functionalComponentArgsRest(__VLS_38));
    __VLS_40.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_40.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        if (row.unreadCount) {
            const __VLS_41 = {}.ElBadge;
            /** @type {[typeof __VLS_components.ElBadge, typeof __VLS_components.elBadge, ]} */ ;
            // @ts-ignore
            const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
                value: (row.unreadCount),
            }));
            const __VLS_43 = __VLS_42({
                value: (row.unreadCount),
            }, ...__VLS_functionalComponentArgsRest(__VLS_42));
        }
    }
    var __VLS_40;
    const __VLS_45 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
        prop: "status",
        label: (__VLS_ctx.t('conversation.status')),
        width: "100",
    }));
    const __VLS_47 = __VLS_46({
        prop: "status",
        label: (__VLS_ctx.t('conversation.status')),
        width: "100",
    }, ...__VLS_functionalComponentArgsRest(__VLS_46));
    var __VLS_24;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['wl-table-scroll']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            t: t,
            conversations: conversations,
            loading: loading,
            loadError: loadError,
            loadConversations: loadConversations,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=ConversationList.vue.js.map