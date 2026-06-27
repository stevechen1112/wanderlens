/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import api from '@/api';
const { t } = useI18n();
const notifications = ref([]);
const markRead = async (id) => {
    try {
        await api.markNotifyRead(id);
        notifications.value = notifications.value.map(n => n.id === id ? { ...n, isRead: true } : n);
    }
    catch {
        // 靜默
    }
};
onMounted(async () => {
    try {
        const res = await api.getNotifications();
        notifications.value = res.data || [];
    }
    catch {
        // 靜默
    }
});
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
    data: (__VLS_ctx.notifications),
    border: true,
}));
const __VLS_7 = __VLS_6({
    data: (__VLS_ctx.notifications),
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
const __VLS_9 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    prop: "message",
    label: (__VLS_ctx.t('notify.message')),
}));
const __VLS_11 = __VLS_10({
    prop: "message",
    label: (__VLS_ctx.t('notify.message')),
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
const __VLS_13 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    prop: "createdAt",
    label: (__VLS_ctx.t('notify.time')),
    width: "180",
}));
const __VLS_15 = __VLS_14({
    prop: "createdAt",
    label: (__VLS_ctx.t('notify.time')),
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
const __VLS_17 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    label: (__VLS_ctx.t('notify.actions')),
    width: "100",
}));
const __VLS_19 = __VLS_18({
    label: (__VLS_ctx.t('notify.actions')),
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
__VLS_20.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_20.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (!row.isRead) {
        const __VLS_21 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
            ...{ 'onClick': {} },
            text: true,
            type: "primary",
        }));
        const __VLS_23 = __VLS_22({
            ...{ 'onClick': {} },
            text: true,
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_22));
        let __VLS_25;
        let __VLS_26;
        let __VLS_27;
        const __VLS_28 = {
            onClick: (...[$event]) => {
                if (!(!row.isRead))
                    return;
                __VLS_ctx.markRead(row.id);
            }
        };
        __VLS_24.slots.default;
        (__VLS_ctx.t('notify.markRead'));
        var __VLS_24;
    }
}
var __VLS_20;
var __VLS_8;
var __VLS_3;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            t: t,
            notifications: notifications,
            markRead: markRead,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=Notifications.vue.js.map