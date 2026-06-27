/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import api from '@/api';
import { useAuthStore } from '@/stores/auth';
const { t } = useI18n();
const authStore = useAuthStore();
const treeRef = ref();
const areaTree = ref([]);
const selectedKeys = ref([]);
const save = async () => {
    const checked = treeRef.value?.getCheckedKeys() || [];
    const halfChecked = treeRef.value?.getHalfCheckedKeys() || [];
    try {
        await api.setServiceArea(authStore.userId, {
            rootNodes: halfChecked,
            selectedNodes: checked,
        });
        ElMessage.success(t('serviceAreaPage.saveSuccess'));
    }
    catch {
        ElMessage.error(t('serviceAreaPage.saveFailed'));
    }
};
onMounted(async () => {
    try {
        const res = await api.getServiceArea(authStore.userId);
        const raw = res.data?.rootNodes || [];
        const buildTreeName = (nodes) => {
            nodes.forEach((n) => {
                n.treeName = n.minHours
                    ? `${n.name}（${t('serviceAreaPage.minHours', { hours: n.minHours })}）`
                    : n.name;
                if (n.children)
                    buildTreeName(n.children);
            });
        };
        buildTreeName(raw);
        areaTree.value = raw;
        selectedKeys.value = res.data?.selectedNodes || [];
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
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_3.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center justify-between" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "font-semibold" },
    });
    (__VLS_ctx.t('serviceAreaPage.title'));
    const __VLS_5 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_7 = __VLS_6({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    let __VLS_9;
    let __VLS_10;
    let __VLS_11;
    const __VLS_12 = {
        onClick: (__VLS_ctx.save)
    };
    __VLS_8.slots.default;
    (__VLS_ctx.t('serviceAreaPage.save'));
    var __VLS_8;
}
const __VLS_13 = {}.ElTree;
/** @type {[typeof __VLS_components.ElTree, typeof __VLS_components.elTree, typeof __VLS_components.ElTree, typeof __VLS_components.elTree, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    ref: "treeRef",
    data: (__VLS_ctx.areaTree),
    showCheckbox: true,
    nodeKey: "id",
    defaultCheckedKeys: (__VLS_ctx.selectedKeys),
    props: ({ label: 'treeName', children: 'children' }),
}));
const __VLS_15 = __VLS_14({
    ref: "treeRef",
    data: (__VLS_ctx.areaTree),
    showCheckbox: true,
    nodeKey: "id",
    defaultCheckedKeys: (__VLS_ctx.selectedKeys),
    props: ({ label: 'treeName', children: 'children' }),
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
/** @type {typeof __VLS_ctx.treeRef} */ ;
var __VLS_17 = {};
__VLS_16.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_16.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (data.name);
    if (data.minHours) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "ml-2 text-xs text-gray-400" },
        });
        (__VLS_ctx.t('serviceAreaPage.minHours', { hours: data.minHours }));
    }
}
var __VLS_16;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
// @ts-ignore
var __VLS_18 = __VLS_17;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            t: t,
            treeRef: treeRef,
            areaTree: areaTree,
            selectedKeys: selectedKeys,
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
//# sourceMappingURL=ServiceArea.vue.js.map