/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/api';
import request from '@/api/request';
const route = useRoute();
const providerId = Number(route.params.id);
const provider = ref(null);
const activeTab = ref('basic');
const schedule = ref([]);
const serviceAreas = ref([]);
const bank = ref(null);
const features = ref([]);
const works = ref([]);
const ratings = ref([]);
const tabLoading = reactive({ schedule: false, area: false, bank: false, feature: false, works: false, rating: false });
const loaded = reactive({});
const workUrl = (uuid) => uuid ? `/api/files/serve/works/${uuid}` : '';
const loadTab = async (tab) => {
    if (loaded[tab])
        return;
    loaded[tab] = true;
    try {
        if (tab === 'schedule') {
            tabLoading.schedule = true;
            const res = await api.getProviderSchedule(providerId);
            schedule.value = res.data || [];
        }
        else if (tab === 'area') {
            tabLoading.area = true;
            const res = await request.get(`/providers/service-area/${providerId}`);
            serviceAreas.value = res.data || [];
        }
        else if (tab === 'bank') {
            tabLoading.bank = true;
            const res = await request.get('/providers/bank', { params: { providerId } });
            bank.value = res.data;
        }
        else if (tab === 'feature') {
            tabLoading.feature = true;
            const res = await request.get(`/providers/feature/${providerId}`);
            features.value = res.data || [];
        }
        else if (tab === 'works') {
            tabLoading.works = true;
            const res = await request.get(`/providers/works/${providerId}`);
            works.value = res.data || [];
        }
        else if (tab === 'rating') {
            tabLoading.rating = true;
            const res = await request.get(`/providers/rating/${providerId}`);
            ratings.value = res.data || [];
        }
    }
    catch { /* tab error */ }
    finally {
        tabLoading[tab] = false;
    }
};
watch(activeTab, (tab) => { if (tab !== 'basic')
    loadTab(tab); });
onMounted(async () => {
    try {
        const res = await api.getProvider(providerId);
        provider.value = res.data;
    }
    catch { /* silent */ }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
if (__VLS_ctx.provider) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    const __VLS_0 = {}.ElPageHeader;
    /** @type {[typeof __VLS_components.ElPageHeader, typeof __VLS_components.elPageHeader, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ 'onBack': {} },
        content: (__VLS_ctx.provider.name || '攝影師詳情'),
        ...{ class: "mb-4" },
    }));
    const __VLS_2 = __VLS_1({
        ...{ 'onBack': {} },
        content: (__VLS_ctx.provider.name || '攝影師詳情'),
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    let __VLS_4;
    let __VLS_5;
    let __VLS_6;
    const __VLS_7 = {
        onBack: (...[$event]) => {
            if (!(__VLS_ctx.provider))
                return;
            __VLS_ctx.$router.back();
        }
    };
    var __VLS_3;
    const __VLS_8 = {}.ElTabs;
    /** @type {[typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        modelValue: (__VLS_ctx.activeTab),
    }));
    const __VLS_10 = __VLS_9({
        modelValue: (__VLS_ctx.activeTab),
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    __VLS_11.slots.default;
    const __VLS_12 = {}.ElTabPane;
    /** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        label: "基本資料",
        name: "basic",
    }));
    const __VLS_14 = __VLS_13({
        label: "基本資料",
        name: "basic",
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_15.slots.default;
    const __VLS_16 = {}.ElDescriptions;
    /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        column: (2),
        border: true,
    }));
    const __VLS_18 = __VLS_17({
        column: (2),
        border: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    __VLS_19.slots.default;
    const __VLS_20 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        label: "姓名",
    }));
    const __VLS_22 = __VLS_21({
        label: "姓名",
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    __VLS_23.slots.default;
    (__VLS_ctx.provider.name);
    var __VLS_23;
    const __VLS_24 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        label: "暱稱",
    }));
    const __VLS_26 = __VLS_25({
        label: "暱稱",
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    __VLS_27.slots.default;
    (__VLS_ctx.provider.nickName);
    var __VLS_27;
    const __VLS_28 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        label: "電話",
    }));
    const __VLS_30 = __VLS_29({
        label: "電話",
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    __VLS_31.slots.default;
    (__VLS_ctx.provider.phone);
    var __VLS_31;
    const __VLS_32 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        label: "Email",
    }));
    const __VLS_34 = __VLS_33({
        label: "Email",
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    __VLS_35.slots.default;
    (__VLS_ctx.provider.email);
    var __VLS_35;
    const __VLS_36 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        label: "縣市",
    }));
    const __VLS_38 = __VLS_37({
        label: "縣市",
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    __VLS_39.slots.default;
    (__VLS_ctx.provider.city);
    var __VLS_39;
    const __VLS_40 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        label: "上架",
    }));
    const __VLS_42 = __VLS_41({
        label: "上架",
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    __VLS_43.slots.default;
    (__VLS_ctx.provider.goLive === 'Y' ? '是' : '否');
    var __VLS_43;
    const __VLS_44 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        label: "評價",
    }));
    const __VLS_46 = __VLS_45({
        label: "評價",
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    __VLS_47.slots.default;
    (__VLS_ctx.provider.rating);
    var __VLS_47;
    const __VLS_48 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        label: "違規",
    }));
    const __VLS_50 = __VLS_49({
        label: "違規",
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    __VLS_51.slots.default;
    (__VLS_ctx.provider.violationCount);
    (__VLS_ctx.provider.violationLevel);
    var __VLS_51;
    const __VLS_52 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        label: "介紹",
        span: (2),
    }));
    const __VLS_54 = __VLS_53({
        label: "介紹",
        span: (2),
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    __VLS_55.slots.default;
    (__VLS_ctx.provider.intro || '—');
    var __VLS_55;
    var __VLS_19;
    var __VLS_15;
    const __VLS_56 = {}.ElTabPane;
    /** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        label: "接案時段",
        name: "schedule",
        lazy: true,
    }));
    const __VLS_58 = __VLS_57({
        label: "接案時段",
        name: "schedule",
        lazy: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    __VLS_59.slots.default;
    const __VLS_60 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        data: (__VLS_ctx.schedule),
        border: true,
        emptyText: "尚無時段資料",
    }));
    const __VLS_62 = __VLS_61({
        data: (__VLS_ctx.schedule),
        border: true,
        emptyText: "尚無時段資料",
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    __VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.tabLoading.schedule) }, null, null);
    __VLS_63.slots.default;
    const __VLS_64 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        prop: "scheduleDate",
        label: "日期",
        width: "120",
    }));
    const __VLS_66 = __VLS_65({
        prop: "scheduleDate",
        label: "日期",
        width: "120",
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    const __VLS_68 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        label: "時段",
    }));
    const __VLS_70 = __VLS_69({
        label: "時段",
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    __VLS_71.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_71.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        (row.slotStart);
        (row.slotEnd);
    }
    var __VLS_71;
    const __VLS_72 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        prop: "maxValue",
        label: "可預約數",
        width: "100",
    }));
    const __VLS_74 = __VLS_73({
        prop: "maxValue",
        label: "可預約數",
        width: "100",
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    const __VLS_76 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        prop: "active",
        label: "啟用",
        width: "80",
    }));
    const __VLS_78 = __VLS_77({
        prop: "active",
        label: "啟用",
        width: "80",
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    const __VLS_80 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
        label: "鎖定",
    }));
    const __VLS_82 = __VLS_81({
        label: "鎖定",
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    __VLS_83.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_83.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        (row.lockedByOrderId || '—');
    }
    var __VLS_83;
    var __VLS_63;
    var __VLS_59;
    const __VLS_84 = {}.ElTabPane;
    /** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        label: "服務地區",
        name: "area",
        lazy: true,
    }));
    const __VLS_86 = __VLS_85({
        label: "服務地區",
        name: "area",
        lazy: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    __VLS_87.slots.default;
    const __VLS_88 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
        data: (__VLS_ctx.serviceAreas),
        border: true,
        emptyText: "尚無服務地區",
    }));
    const __VLS_90 = __VLS_89({
        data: (__VLS_ctx.serviceAreas),
        border: true,
        emptyText: "尚無服務地區",
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    __VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.tabLoading.area) }, null, null);
    __VLS_91.slots.default;
    const __VLS_92 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        prop: "areaId",
        label: "區域 ID",
        width: "100",
    }));
    const __VLS_94 = __VLS_93({
        prop: "areaId",
        label: "區域 ID",
        width: "100",
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    const __VLS_96 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        prop: "zipCode",
        label: "郵遞區號",
        width: "120",
    }));
    const __VLS_98 = __VLS_97({
        prop: "zipCode",
        label: "郵遞區號",
        width: "120",
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    const __VLS_100 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        prop: "areaParentId",
        label: "上層區域",
    }));
    const __VLS_102 = __VLS_101({
        prop: "areaParentId",
        label: "上層區域",
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    var __VLS_91;
    var __VLS_87;
    const __VLS_104 = {}.ElTabPane;
    /** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
        label: "匯款資料",
        name: "bank",
        lazy: true,
    }));
    const __VLS_106 = __VLS_105({
        label: "匯款資料",
        name: "bank",
        lazy: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    __VLS_107.slots.default;
    if (__VLS_ctx.bank) {
        const __VLS_108 = {}.ElDescriptions;
        /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
        // @ts-ignore
        const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
            column: (2),
            border: true,
        }));
        const __VLS_110 = __VLS_109({
            column: (2),
            border: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_109));
        __VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.tabLoading.bank) }, null, null);
        __VLS_111.slots.default;
        const __VLS_112 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
            label: "銀行",
        }));
        const __VLS_114 = __VLS_113({
            label: "銀行",
        }, ...__VLS_functionalComponentArgsRest(__VLS_113));
        __VLS_115.slots.default;
        (__VLS_ctx.bank.bankName);
        var __VLS_115;
        const __VLS_116 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
            label: "代碼",
        }));
        const __VLS_118 = __VLS_117({
            label: "代碼",
        }, ...__VLS_functionalComponentArgsRest(__VLS_117));
        __VLS_119.slots.default;
        (__VLS_ctx.bank.bankCode);
        var __VLS_119;
        const __VLS_120 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
            label: "分行",
        }));
        const __VLS_122 = __VLS_121({
            label: "分行",
        }, ...__VLS_functionalComponentArgsRest(__VLS_121));
        __VLS_123.slots.default;
        (__VLS_ctx.bank.bankBranch);
        var __VLS_123;
        const __VLS_124 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
            label: "戶名",
        }));
        const __VLS_126 = __VLS_125({
            label: "戶名",
        }, ...__VLS_functionalComponentArgsRest(__VLS_125));
        __VLS_127.slots.default;
        (__VLS_ctx.bank.accountName);
        var __VLS_127;
        const __VLS_128 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
            label: "帳號",
        }));
        const __VLS_130 = __VLS_129({
            label: "帳號",
        }, ...__VLS_functionalComponentArgsRest(__VLS_129));
        __VLS_131.slots.default;
        (__VLS_ctx.bank.accountNo);
        var __VLS_131;
        const __VLS_132 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
            label: "備註",
        }));
        const __VLS_134 = __VLS_133({
            label: "備註",
        }, ...__VLS_functionalComponentArgsRest(__VLS_133));
        __VLS_135.slots.default;
        (__VLS_ctx.bank.note || '—');
        var __VLS_135;
        var __VLS_111;
    }
    else {
        const __VLS_136 = {}.ElEmpty;
        /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
        // @ts-ignore
        const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
            description: "尚未填寫匯款資料",
        }));
        const __VLS_138 = __VLS_137({
            description: "尚未填寫匯款資料",
        }, ...__VLS_functionalComponentArgsRest(__VLS_137));
    }
    var __VLS_107;
    const __VLS_140 = {}.ElTabPane;
    /** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
    // @ts-ignore
    const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
        label: "特色資料",
        name: "feature",
        lazy: true,
    }));
    const __VLS_142 = __VLS_141({
        label: "特色資料",
        name: "feature",
        lazy: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_141));
    __VLS_143.slots.default;
    const __VLS_144 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
        data: (__VLS_ctx.features),
        border: true,
        emptyText: "尚無特色資料",
    }));
    const __VLS_146 = __VLS_145({
        data: (__VLS_ctx.features),
        border: true,
        emptyText: "尚無特色資料",
    }, ...__VLS_functionalComponentArgsRest(__VLS_145));
    __VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.tabLoading.feature) }, null, null);
    __VLS_147.slots.default;
    const __VLS_148 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
        prop: "language",
        label: "語系",
        width: "80",
    }));
    const __VLS_150 = __VLS_149({
        prop: "language",
        label: "語系",
        width: "80",
    }, ...__VLS_functionalComponentArgsRest(__VLS_149));
    const __VLS_152 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
        prop: "featureType",
        label: "類型",
        width: "120",
    }));
    const __VLS_154 = __VLS_153({
        prop: "featureType",
        label: "類型",
        width: "120",
    }, ...__VLS_functionalComponentArgsRest(__VLS_153));
    const __VLS_156 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
        prop: "featureTitle",
        label: "標題",
    }));
    const __VLS_158 = __VLS_157({
        prop: "featureTitle",
        label: "標題",
    }, ...__VLS_functionalComponentArgsRest(__VLS_157));
    const __VLS_160 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
        prop: "enable",
        label: "啟用",
        width: "80",
    }));
    const __VLS_162 = __VLS_161({
        prop: "enable",
        label: "啟用",
        width: "80",
    }, ...__VLS_functionalComponentArgsRest(__VLS_161));
    var __VLS_147;
    var __VLS_143;
    const __VLS_164 = {}.ElTabPane;
    /** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
    // @ts-ignore
    const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
        label: "作品集",
        name: "works",
        lazy: true,
    }));
    const __VLS_166 = __VLS_165({
        label: "作品集",
        name: "works",
        lazy: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_165));
    __VLS_167.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid grid-cols-2 md:grid-cols-4 gap-3" },
    });
    __VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.tabLoading.works) }, null, null);
    for (const [w] of __VLS_getVForSourceType((__VLS_ctx.works))) {
        const __VLS_168 = {}.ElImage;
        /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
        // @ts-ignore
        const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
            key: (w.id),
            src: (__VLS_ctx.workUrl(w.fileUuid)),
            fit: "cover",
            ...{ class: "w-full aspect-square rounded-lg" },
        }));
        const __VLS_170 = __VLS_169({
            key: (w.id),
            src: (__VLS_ctx.workUrl(w.fileUuid)),
            fit: "cover",
            ...{ class: "w-full aspect-square rounded-lg" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_169));
    }
    if (!__VLS_ctx.tabLoading.works && __VLS_ctx.works.length === 0) {
        const __VLS_172 = {}.ElEmpty;
        /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
        // @ts-ignore
        const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
            description: "尚無作品",
            ...{ class: "col-span-full" },
        }));
        const __VLS_174 = __VLS_173({
            description: "尚無作品",
            ...{ class: "col-span-full" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_173));
    }
    var __VLS_167;
    const __VLS_176 = {}.ElTabPane;
    /** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
    // @ts-ignore
    const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
        label: "評價",
        name: "rating",
        lazy: true,
    }));
    const __VLS_178 = __VLS_177({
        label: "評價",
        name: "rating",
        lazy: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_177));
    __VLS_179.slots.default;
    const __VLS_180 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
        data: (__VLS_ctx.ratings),
        border: true,
        emptyText: "尚無評價",
    }));
    const __VLS_182 = __VLS_181({
        data: (__VLS_ctx.ratings),
        border: true,
        emptyText: "尚無評價",
    }, ...__VLS_functionalComponentArgsRest(__VLS_181));
    __VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.tabLoading.rating) }, null, null);
    __VLS_183.slots.default;
    const __VLS_184 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
        prop: "author",
        label: "評價者",
        width: "120",
    }));
    const __VLS_186 = __VLS_185({
        prop: "author",
        label: "評價者",
        width: "120",
    }, ...__VLS_functionalComponentArgsRest(__VLS_185));
    const __VLS_188 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
        prop: "stars",
        label: "星等",
        width: "80",
    }));
    const __VLS_190 = __VLS_189({
        prop: "stars",
        label: "星等",
        width: "80",
    }, ...__VLS_functionalComponentArgsRest(__VLS_189));
    const __VLS_192 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
        prop: "comments",
        label: "評語",
    }));
    const __VLS_194 = __VLS_193({
        prop: "comments",
        label: "評語",
    }, ...__VLS_functionalComponentArgsRest(__VLS_193));
    const __VLS_196 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
        prop: "createdAt",
        label: "時間",
        width: "180",
    }));
    const __VLS_198 = __VLS_197({
        prop: "createdAt",
        label: "時間",
        width: "180",
    }, ...__VLS_functionalComponentArgsRest(__VLS_197));
    var __VLS_183;
    var __VLS_179;
    var __VLS_11;
}
else {
    const __VLS_200 = {}.ElEmpty;
    /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
    // @ts-ignore
    const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
        description: "載入中或找不到攝影師",
    }));
    const __VLS_202 = __VLS_201({
        description: "載入中或找不到攝影師",
    }, ...__VLS_functionalComponentArgsRest(__VLS_201));
    var __VLS_204 = {};
    var __VLS_203;
}
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-4']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['aspect-square']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['col-span-full']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            provider: provider,
            activeTab: activeTab,
            schedule: schedule,
            serviceAreas: serviceAreas,
            bank: bank,
            features: features,
            works: works,
            ratings: ratings,
            tabLoading: tabLoading,
            workUrl: workUrl,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=PhotographerDetail.vue.js.map