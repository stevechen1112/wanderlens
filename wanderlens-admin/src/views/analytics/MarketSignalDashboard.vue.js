/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed, onMounted } from 'vue';
import { Loading } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart, PieChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import api from '@/api';
use([CanvasRenderer, BarChart, PieChart, GridComponent, TooltipComponent, LegendComponent]);
const COLORS = ['#F37A69', '#52B6CC', '#13CE66', '#FF9F40', '#9B59B6', '#3498DB'];
const loading = ref(true);
const days = ref(30);
const rows = ref([]);
const affiliates = ref([]);
const countryBarOption = ref({
    color: COLORS,
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    grid: { left: 48, right: 16, top: 24, bottom: 48 },
    xAxis: { type: 'category', data: [] },
    yAxis: { type: 'value' },
    series: [],
});
const typePieOption = ref({
    color: COLORS,
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [{ type: 'pie', radius: ['42%', '68%'], data: [] }],
});
const affiliateBarOption = ref({
    color: COLORS,
    tooltip: { trigger: 'axis' },
    grid: { left: 48, right: 16, top: 24, bottom: 32 },
    xAxis: { type: 'category', data: [], axisLabel: { rotate: 30 } },
    yAxis: { type: 'value' },
    series: [
        { name: '點擊', type: 'bar', data: [] },
        { name: '轉換', type: 'bar', data: [] },
    ],
});
const totalSignals = computed(() => rows.value.reduce((s, r) => s + (r.total || 0), 0));
const uniqueCountries = computed(() => new Set(rows.value.map(r => r.sourceCountry)).size);
const summaryCards = computed(() => [
    { key: 'signals', label: '訊號總量', value: totalSignals.value, color: '#F37A69' },
    { key: 'countries', label: '來源國數', value: uniqueCountries.value, color: '#52B6CC' },
    { key: 'affiliates', label: '推廣夥伴', value: affiliates.value.length, color: '#13CE66' },
    {
        key: 'clicks',
        label: '聯盟點擊',
        value: affiliates.value.reduce((s, a) => s + (a.clickCount || 0), 0),
        color: '#FF9F40',
    },
]);
function buildCharts(data) {
    rows.value = data;
    const countries = [...new Set(data.map(d => d.sourceCountry))].sort();
    const types = [...new Set(data.map(d => d.signalType))].sort();
    const matrix = {};
    const typeTotals = {};
    for (const row of data) {
        const c = row.sourceCountry || 'UNKNOWN';
        const t = row.signalType || 'UNKNOWN';
        matrix[c] = matrix[c] || {};
        matrix[c][t] = (matrix[c][t] || 0) + (row.total || 0);
        typeTotals[t] = (typeTotals[t] || 0) + (row.total || 0);
    }
    countryBarOption.value = {
        ...countryBarOption.value,
        xAxis: { type: 'category', data: countries },
        series: types.map(t => ({
            name: t,
            type: 'bar',
            stack: 'total',
            emphasis: { focus: 'series' },
            data: countries.map(c => matrix[c]?.[t] || 0),
        })),
    };
    typePieOption.value = {
        ...typePieOption.value,
        series: [{
                type: 'pie',
                radius: ['42%', '68%'],
                data: Object.entries(typeTotals).map(([name, value]) => ({ name, value })),
            }],
    };
}
function buildAffiliateChart(list) {
    const top = [...list]
        .sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0))
        .slice(0, 8);
    affiliateBarOption.value = {
        ...affiliateBarOption.value,
        xAxis: {
            type: 'category',
            data: top.map(a => a.name || a.referralCode),
            axisLabel: { rotate: 30, interval: 0 },
        },
        series: [
            { name: '點擊', type: 'bar', data: top.map(a => a.clickCount || 0) },
            { name: '轉換', type: 'bar', data: top.map(a => a.conversionCount || 0) },
        ],
    };
}
async function loadData() {
    loading.value = true;
    try {
        const [signalRes, affRes] = await Promise.all([
            api.getMarketSignalDashboard(days.value),
            api.getAffiliates(),
        ]);
        affiliates.value = affRes?.data || [];
        buildCharts(signalRes?.data || []);
        buildAffiliateChart(affiliates.value);
    }
    catch {
        ElMessage.error('載入市場訊號失敗');
        rows.value = [];
    }
    finally {
        loading.value = false;
    }
}
onMounted(loadData);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "market-dashboard" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "page-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "page-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "page-desc" },
});
const __VLS_0 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.days),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.days),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onChange: (__VLS_ctx.loadData)
};
__VLS_3.slots.default;
const __VLS_8 = {}.ElRadioButton;
/** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    value: (7),
}));
const __VLS_10 = __VLS_9({
    value: (7),
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
var __VLS_11;
const __VLS_12 = {}.ElRadioButton;
/** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    value: (30),
}));
const __VLS_14 = __VLS_13({
    value: (30),
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
var __VLS_15;
const __VLS_16 = {}.ElRadioButton;
/** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    value: (90),
}));
const __VLS_18 = __VLS_17({
    value: (90),
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
var __VLS_19;
var __VLS_3;
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "loading-wrap" },
    });
    const __VLS_20 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        ...{ class: "is-loading" },
        size: (32),
    }));
    const __VLS_22 = __VLS_21({
        ...{ class: "is-loading" },
        size: (32),
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    __VLS_23.slots.default;
    const __VLS_24 = {}.Loading;
    /** @type {[typeof __VLS_components.Loading, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({}));
    const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
    var __VLS_23;
}
else {
    const __VLS_28 = {}.ElRow;
    /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        gutter: (16),
        ...{ class: "mb-4" },
    }));
    const __VLS_30 = __VLS_29({
        gutter: (16),
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    __VLS_31.slots.default;
    for (const [card] of __VLS_getVForSourceType((__VLS_ctx.summaryCards))) {
        const __VLS_32 = {}.ElCol;
        /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
        // @ts-ignore
        const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
            span: (6),
            key: (card.key),
        }));
        const __VLS_34 = __VLS_33({
            span: (6),
            key: (card.key),
        }, ...__VLS_functionalComponentArgsRest(__VLS_33));
        __VLS_35.slots.default;
        const __VLS_36 = {}.ElCard;
        /** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
        // @ts-ignore
        const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
            shadow: "hover",
            ...{ class: "stat-card" },
        }));
        const __VLS_38 = __VLS_37({
            shadow: "hover",
            ...{ class: "stat-card" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_37));
        __VLS_39.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "stat-label" },
        });
        (card.label);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "stat-value" },
            ...{ style: ({ color: card.color }) },
        });
        (card.value);
        var __VLS_39;
        var __VLS_35;
    }
    var __VLS_31;
    const __VLS_40 = {}.ElRow;
    /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        gutter: (16),
        ...{ class: "mb-4" },
    }));
    const __VLS_42 = __VLS_41({
        gutter: (16),
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    __VLS_43.slots.default;
    const __VLS_44 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        span: (14),
    }));
    const __VLS_46 = __VLS_45({
        span: (14),
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    __VLS_47.slots.default;
    const __VLS_48 = {}.ElCard;
    /** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        shadow: "hover",
    }));
    const __VLS_50 = __VLS_49({
        shadow: "hover",
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    __VLS_51.slots.default;
    {
        const { header: __VLS_thisSlot } = __VLS_51.slots;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    }
    const __VLS_52 = {}.VChart;
    /** @type {[typeof __VLS_components.VChart, typeof __VLS_components.vChart, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        option: (__VLS_ctx.countryBarOption),
        ...{ style: {} },
        autoresize: true,
    }));
    const __VLS_54 = __VLS_53({
        option: (__VLS_ctx.countryBarOption),
        ...{ style: {} },
        autoresize: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    var __VLS_51;
    var __VLS_47;
    const __VLS_56 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        span: (10),
    }));
    const __VLS_58 = __VLS_57({
        span: (10),
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    __VLS_59.slots.default;
    const __VLS_60 = {}.ElCard;
    /** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        shadow: "hover",
    }));
    const __VLS_62 = __VLS_61({
        shadow: "hover",
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    __VLS_63.slots.default;
    {
        const { header: __VLS_thisSlot } = __VLS_63.slots;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    }
    const __VLS_64 = {}.VChart;
    /** @type {[typeof __VLS_components.VChart, typeof __VLS_components.vChart, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        option: (__VLS_ctx.typePieOption),
        ...{ style: {} },
        autoresize: true,
    }));
    const __VLS_66 = __VLS_65({
        option: (__VLS_ctx.typePieOption),
        ...{ style: {} },
        autoresize: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    var __VLS_63;
    var __VLS_59;
    var __VLS_43;
    const __VLS_68 = {}.ElRow;
    /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        gutter: (16),
    }));
    const __VLS_70 = __VLS_69({
        gutter: (16),
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    __VLS_71.slots.default;
    const __VLS_72 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        span: (12),
    }));
    const __VLS_74 = __VLS_73({
        span: (12),
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    __VLS_75.slots.default;
    const __VLS_76 = {}.ElCard;
    /** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        shadow: "hover",
    }));
    const __VLS_78 = __VLS_77({
        shadow: "hover",
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    __VLS_79.slots.default;
    {
        const { header: __VLS_thisSlot } = __VLS_79.slots;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    }
    const __VLS_80 = {}.VChart;
    /** @type {[typeof __VLS_components.VChart, typeof __VLS_components.vChart, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
        option: (__VLS_ctx.affiliateBarOption),
        ...{ style: {} },
        autoresize: true,
    }));
    const __VLS_82 = __VLS_81({
        option: (__VLS_ctx.affiliateBarOption),
        ...{ style: {} },
        autoresize: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    var __VLS_79;
    var __VLS_75;
    const __VLS_84 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        span: (12),
    }));
    const __VLS_86 = __VLS_85({
        span: (12),
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    __VLS_87.slots.default;
    const __VLS_88 = {}.ElCard;
    /** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
        shadow: "hover",
    }));
    const __VLS_90 = __VLS_89({
        shadow: "hover",
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    __VLS_91.slots.default;
    {
        const { header: __VLS_thisSlot } = __VLS_91.slots;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex justify-between items-center" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        const __VLS_92 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
            size: "small",
        }));
        const __VLS_94 = __VLS_93({
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_93));
        __VLS_95.slots.default;
        (__VLS_ctx.rows.length);
        var __VLS_95;
    }
    const __VLS_96 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        data: (__VLS_ctx.rows),
        border: true,
        stripe: true,
        maxHeight: "280",
        size: "small",
    }));
    const __VLS_98 = __VLS_97({
        data: (__VLS_ctx.rows),
        border: true,
        stripe: true,
        maxHeight: "280",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    __VLS_99.slots.default;
    const __VLS_100 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        prop: "sourceCountry",
        label: "來源國",
        width: "90",
    }));
    const __VLS_102 = __VLS_101({
        prop: "sourceCountry",
        label: "來源國",
        width: "90",
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    const __VLS_104 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
        prop: "signalType",
        label: "訊號類型",
        width: "140",
    }));
    const __VLS_106 = __VLS_105({
        prop: "signalType",
        label: "訊號類型",
        width: "140",
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    const __VLS_108 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        prop: "total",
        label: "累計",
        width: "80",
        align: "right",
    }));
    const __VLS_110 = __VLS_109({
        prop: "total",
        label: "累計",
        width: "80",
        align: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    var __VLS_99;
    var __VLS_91;
    var __VLS_87;
    var __VLS_71;
}
/** @type {__VLS_StyleScopedClasses['market-dashboard']} */ ;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['page-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Loading: Loading,
            VChart: VChart,
            loading: loading,
            days: days,
            rows: rows,
            countryBarOption: countryBarOption,
            typePieOption: typePieOption,
            affiliateBarOption: affiliateBarOption,
            summaryCards: summaryCards,
            loadData: loadData,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=MarketSignalDashboard.vue.js.map