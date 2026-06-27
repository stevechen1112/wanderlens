/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Document, User, Money, Camera, Loading } from '@element-plus/icons-vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart, PieChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import { ElMessage } from 'element-plus';
import api from '@/api';
const { t } = useI18n();
use([CanvasRenderer, LineChart, PieChart, GridComponent, TooltipComponent, LegendComponent]);
const loading = ref(true);
const actionLogs = ref([]);
const stats = ref([
    { key: 'orders', label: '訂單數', value: 0, trend: 0, icon: Document, color: '#F37A69' },
    { key: 'customers', label: '客戶數', value: 0, trend: 0, icon: User, color: '#52B6CC' },
    { key: 'revenue', label: '總金額', value: 0, trend: 0, icon: Money, color: '#13CE66' },
    { key: 'photographers', label: '攝影師數', value: 0, trend: 0, icon: Camera, color: '#FF9F40' },
]);
const orderChartOption = ref({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: [] },
    yAxis: { type: 'value' },
    series: [{ data: [], type: 'line', smooth: true, areaStyle: {} }],
});
const areaChartOption = ref({
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [{
            type: 'pie',
            radius: ['40%', '70%'],
            data: [],
        }],
});
const loadDashboard = async () => {
    loading.value = true;
    try {
        // 載入訂單統計
        const ordersRes = await api.getOrders();
        const orders = ordersRes.data || [];
        stats.value[0].value = orders.length;
        // 計算總金額
        const totalRevenue = orders.reduce((sum, o) => sum + (o.totalFee || 0), 0);
        stats.value[2].value = totalRevenue.toLocaleString();
        // 載入客戶數
        const customersRes = await api.getCustomers();
        stats.value[1].value = (customersRes.data || []).length;
        // 載入攝影師數
        const provRes = await api.getProviders();
        const photographers = (provRes.data || []).filter((p) => p.providerType === 'PHOTOGRAPHER' || p.providerType === 'photographer');
        stats.value[3].value = photographers.length;
        // 訂單趨勢圖（依月份分組）
        const monthlyData = {};
        orders.forEach((o) => {
            const month = o.shootingDate?.substring(0, 7) || o.createdAt?.substring(0, 7) || '未知';
            monthlyData[month] = (monthlyData[month] || 0) + 1;
        });
        const sortedMonths = Object.keys(monthlyData).sort();
        orderChartOption.value.xAxis.data = sortedMonths;
        orderChartOption.value.series[0].data = sortedMonths.map(m => monthlyData[m]);
        // 地區分布圖
        const areaData = {};
        orders.forEach((o) => {
            const city = o.city || '未知';
            areaData[city] = (areaData[city] || 0) + 1;
        });
        areaChartOption.value.series[0].data = Object.entries(areaData).map(([name, value]) => ({ name, value }));
        // 載入最近通知作為操作日誌
        try {
            const notifyRes = await api.getNotifications(1, 10);
            actionLogs.value = (notifyRes.data?.records || notifyRes.data || []).map((n) => ({
                createdAt: n.createdAt,
                username: n.targetName || '系統',
                action: n.message || n.title || '',
            }));
        }
        catch {
            actionLogs.value = [];
        }
    }
    catch {
        ElMessage.error(t('dashboard.loadFailed'));
    }
    finally {
        loading.value = false;
    }
};
onMounted(loadDashboard);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-center py-12" },
    });
    const __VLS_0 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ class: "is-loading" },
        size: (32),
    }));
    const __VLS_2 = __VLS_1({
        ...{ class: "is-loading" },
        size: (32),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_3.slots.default;
    const __VLS_4 = {}.Loading;
    /** @type {[typeof __VLS_components.Loading, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({}));
    const __VLS_6 = __VLS_5({}, ...__VLS_functionalComponentArgsRest(__VLS_5));
    var __VLS_3;
}
else {
    const __VLS_8 = {}.ElRow;
    /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        gutter: (16),
        ...{ class: "mb-6" },
    }));
    const __VLS_10 = __VLS_9({
        gutter: (16),
        ...{ class: "mb-6" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    __VLS_11.slots.default;
    for (const [stat] of __VLS_getVForSourceType((__VLS_ctx.stats))) {
        const __VLS_12 = {}.ElCol;
        /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
        // @ts-ignore
        const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
            xs: (12),
            sm: (12),
            md: (6),
            lg: (6),
            key: (stat.key),
        }));
        const __VLS_14 = __VLS_13({
            xs: (12),
            sm: (12),
            md: (6),
            lg: (6),
            key: (stat.key),
        }, ...__VLS_functionalComponentArgsRest(__VLS_13));
        __VLS_15.slots.default;
        const __VLS_16 = {}.ElCard;
        /** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
        // @ts-ignore
        const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
            shadow: "hover",
            ...{ class: "stat-card cursor-pointer" },
        }));
        const __VLS_18 = __VLS_17({
            shadow: "hover",
            ...{ class: "stat-card cursor-pointer" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_17));
        __VLS_19.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex items-center justify-between" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-sm text-gray-500 mb-1" },
        });
        (stat.label);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-3xl font-extrabold" },
            ...{ style: ({ color: stat.color }) },
        });
        (stat.value);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-xs text-gray-400 mt-1" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: (stat.trend > 0 ? 'text-success' : stat.trend < 0 ? 'text-danger' : 'text-gray-400') },
        });
        (stat.trend > 0 ? '↑' : stat.trend < 0 ? '↓' : '—');
        (stat.trend !== 0 ? Math.abs(stat.trend) + '%' : '');
        (__VLS_ctx.t('dashboard.vsLastWeek'));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "w-12 h-12 rounded-xl flex items-center justify-center" },
            ...{ style: ({ background: stat.color + '15' }) },
        });
        const __VLS_20 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
            size: (24),
            ...{ style: ({ color: stat.color }) },
        }));
        const __VLS_22 = __VLS_21({
            size: (24),
            ...{ style: ({ color: stat.color }) },
        }, ...__VLS_functionalComponentArgsRest(__VLS_21));
        __VLS_23.slots.default;
        const __VLS_24 = ((stat.icon));
        // @ts-ignore
        const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({}));
        const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
        var __VLS_23;
        var __VLS_19;
        var __VLS_15;
    }
    var __VLS_11;
    const __VLS_28 = {}.ElRow;
    /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        gutter: (16),
    }));
    const __VLS_30 = __VLS_29({
        gutter: (16),
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    __VLS_31.slots.default;
    const __VLS_32 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        xs: (24),
        sm: (24),
        md: (16),
    }));
    const __VLS_34 = __VLS_33({
        xs: (24),
        sm: (24),
        md: (16),
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    __VLS_35.slots.default;
    const __VLS_36 = {}.ElCard;
    /** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        shadow: "hover",
    }));
    const __VLS_38 = __VLS_37({
        shadow: "hover",
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    __VLS_39.slots.default;
    {
        const { header: __VLS_thisSlot } = __VLS_39.slots;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.t('dashboard.orderTrend'));
    }
    const __VLS_40 = {}.VChart;
    /** @type {[typeof __VLS_components.VChart, typeof __VLS_components.vChart, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        option: (__VLS_ctx.orderChartOption),
        ...{ style: {} },
        autoresize: true,
    }));
    const __VLS_42 = __VLS_41({
        option: (__VLS_ctx.orderChartOption),
        ...{ style: {} },
        autoresize: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    var __VLS_39;
    var __VLS_35;
    const __VLS_44 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        xs: (24),
        sm: (24),
        md: (8),
        ...{ class: "mt-4 md:mt-0" },
    }));
    const __VLS_46 = __VLS_45({
        xs: (24),
        sm: (24),
        md: (8),
        ...{ class: "mt-4 md:mt-0" },
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
        (__VLS_ctx.t('dashboard.areaDist'));
    }
    const __VLS_52 = {}.VChart;
    /** @type {[typeof __VLS_components.VChart, typeof __VLS_components.vChart, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        option: (__VLS_ctx.areaChartOption),
        ...{ style: {} },
        autoresize: true,
    }));
    const __VLS_54 = __VLS_53({
        option: (__VLS_ctx.areaChartOption),
        ...{ style: {} },
        autoresize: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    var __VLS_51;
    var __VLS_47;
    var __VLS_31;
    const __VLS_56 = {}.ElCard;
    /** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        shadow: "hover",
        ...{ class: "mt-4" },
    }));
    const __VLS_58 = __VLS_57({
        shadow: "hover",
        ...{ class: "mt-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    __VLS_59.slots.default;
    {
        const { header: __VLS_thisSlot } = __VLS_59.slots;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.t('dashboard.recentLogs'));
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "wl-table-scroll" },
    });
    const __VLS_60 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        data: (__VLS_ctx.actionLogs),
        border: true,
        size: "small",
        maxHeight: "250",
    }));
    const __VLS_62 = __VLS_61({
        data: (__VLS_ctx.actionLogs),
        border: true,
        size: "small",
        maxHeight: "250",
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    __VLS_63.slots.default;
    const __VLS_64 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        prop: "createdAt",
        label: (__VLS_ctx.t('dashboard.logTime')),
        width: "160",
    }));
    const __VLS_66 = __VLS_65({
        prop: "createdAt",
        label: (__VLS_ctx.t('dashboard.logTime')),
        width: "160",
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    const __VLS_68 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        prop: "username",
        label: (__VLS_ctx.t('dashboard.logUser')),
        width: "100",
    }));
    const __VLS_70 = __VLS_69({
        prop: "username",
        label: (__VLS_ctx.t('dashboard.logUser')),
        width: "100",
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    const __VLS_72 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        prop: "action",
        label: (__VLS_ctx.t('dashboard.logAction')),
    }));
    const __VLS_74 = __VLS_73({
        prop: "action",
        label: (__VLS_ctx.t('dashboard.logAction')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    var __VLS_63;
    var __VLS_59;
}
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-12']} */ ;
/** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-extrabold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-12']} */ ;
/** @type {__VLS_StyleScopedClasses['h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['md:mt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['wl-table-scroll']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Loading: Loading,
            VChart: VChart,
            t: t,
            loading: loading,
            actionLogs: actionLogs,
            stats: stats,
            orderChartOption: orderChartOption,
            areaChartOption: areaChartOption,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=Dashboard.vue.js.map