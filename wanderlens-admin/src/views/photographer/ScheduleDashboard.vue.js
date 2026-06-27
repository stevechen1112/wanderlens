/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, computed, onMounted } from 'vue';
import { Loading } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import api from '@/api';
const loading = ref(false);
const selectedMonth = ref('');
const selectedPhotographer = ref(undefined);
const photographers = ref([]);
const bookingList = ref([]);
const areaFilter = ref('');
const stats = reactive({
    totalBookings: 0,
    activePhotographers: 0,
    pendingShoots: 0,
    shooting: 0,
});
// 地區分組
const areaGroups = computed(() => {
    const groups = {};
    bookingList.value.forEach(b => {
        const city = b.location || b.city || '未設定';
        if (!groups[city])
            groups[city] = { city, count: 0 };
        groups[city].count++;
    });
    return Object.values(groups);
});
const filteredBookingList = computed(() => {
    if (!areaFilter.value)
        return bookingList.value;
    return bookingList.value.filter(b => (b.location || b.city || '') === areaFilter.value);
});
const filterByArea = (city) => { areaFilter.value = city; };
// 月曆日期
const calendarDays = computed(() => {
    const now = new Date();
    const year = selectedMonth.value ? parseInt(selectedMonth.value.split('-')[0]) : now.getFullYear();
    const month = selectedMonth.value ? parseInt(selectedMonth.value.split('-')[1]) - 1 : now.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startWeekday = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const days = [];
    // 上月填充
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startWeekday - 1; i >= 0; i--) {
        days.push({ date: '', label: '', dayNumber: prevMonthLastDay - i, isCurrentMonth: false, bookings: 0 });
    }
    // 本月
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const bookings = bookingList.value.filter(b => b.date === dateStr).length;
        days.push({ date: dateStr, label: ['日', '一', '二', '三', '四', '五', '六'][new Date(year, month, d).getDay()], dayNumber: d, isCurrentMonth: true, bookings });
    }
    // 下月填充
    while (days.length % 7 !== 0) {
        days.push({ date: '', label: '', dayNumber: days.length - startWeekday - daysInMonth + 1, isCurrentMonth: false, bookings: 0 });
    }
    return days;
});
const bookingStatusLabel = (status) => {
    const map = {
        PendingPayment: '待付款', Paid: '已付款', Confirmed: '已確認',
        ReadyToShoot: '待拍攝', ShootingStarted: '拍攝中', ShootingEnded: '拍攝結束',
        UploadingRaw: '上傳中', AiProcessing: 'AI處理中', Delivered: '已交付',
        Cancelled: '已取消', Closed: '已結案',
    };
    return map[status] || status;
};
const bookingStatusType = (status) => {
    if (['Cancelled'].includes(status))
        return 'danger';
    if (['Delivered', 'Closed'].includes(status))
        return 'success';
    if (['ShootingStarted', 'AiProcessing'].includes(status))
        return 'warning';
    return 'info';
};
const loadData = async () => {
    loading.value = true;
    try {
        // 載入攝影師列表
        const provRes = await api.getProviders();
        photographers.value = (provRes.data || []).filter((p) => p.providerType === 'PHOTOGRAPHER' || p.providerType === 'photographer');
        // 載入檔期資料
        const res = await api.getAllSchedules(selectedMonth.value || undefined);
        const data = res.data || [];
        bookingList.value = selectedPhotographer.value
            ? data.filter((b) => b.photographerId === selectedPhotographer.value)
            : data;
        // 統計
        stats.totalBookings = bookingList.value.length;
        stats.activePhotographers = new Set(bookingList.value.map((b) => b.photographerId)).size;
        stats.pendingShoots = bookingList.value.filter((b) => b.status === 'ReadyToShoot').length;
        stats.shooting = bookingList.value.filter((b) => b.status === 'ShootingStarted').length;
    }
    catch {
        ElMessage.error('載入檔期資料失敗');
        bookingList.value = [];
    }
    finally {
        loading.value = false;
    }
};
onMounted(loadData);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center justify-between mb-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "font-semibold text-lg" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center gap-2" },
});
const __VLS_0 = {}.ElDatePicker;
/** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.selectedMonth),
    type: "month",
    valueFormat: "YYYY-MM",
    placeholder: "選擇月份",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.selectedMonth),
    type: "month",
    valueFormat: "YYYY-MM",
    placeholder: "選擇月份",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onChange: (__VLS_ctx.loadData)
};
var __VLS_3;
const __VLS_8 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.selectedPhotographer),
    placeholder: "選擇攝影師",
    clearable: true,
    filterable: true,
    ...{ style: {} },
}));
const __VLS_10 = __VLS_9({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.selectedPhotographer),
    placeholder: "選擇攝影師",
    clearable: true,
    filterable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
let __VLS_12;
let __VLS_13;
let __VLS_14;
const __VLS_15 = {
    onChange: (__VLS_ctx.loadData)
};
__VLS_11.slots.default;
for (const [p] of __VLS_getVForSourceType((__VLS_ctx.photographers))) {
    const __VLS_16 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        key: (p.id),
        label: (p.nickName || p.empno),
        value: (p.id),
    }));
    const __VLS_18 = __VLS_17({
        key: (p.id),
        label: (p.nickName || p.empno),
        value: (p.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
}
var __VLS_11;
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-center py-12" },
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
        ...{ class: "mb-6" },
    }));
    const __VLS_30 = __VLS_29({
        gutter: (16),
        ...{ class: "mb-6" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    __VLS_31.slots.default;
    const __VLS_32 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        span: (6),
    }));
    const __VLS_34 = __VLS_33({
        span: (6),
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
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-center" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-sm text-gray-500" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-2xl font-bold mt-1" },
    });
    (__VLS_ctx.stats.totalBookings);
    var __VLS_39;
    var __VLS_35;
    const __VLS_40 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        span: (6),
    }));
    const __VLS_42 = __VLS_41({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    __VLS_43.slots.default;
    const __VLS_44 = {}.ElCard;
    /** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        shadow: "hover",
    }));
    const __VLS_46 = __VLS_45({
        shadow: "hover",
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    __VLS_47.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-center" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-sm text-gray-500" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-2xl font-bold mt-1" },
    });
    (__VLS_ctx.stats.activePhotographers);
    var __VLS_47;
    var __VLS_43;
    const __VLS_48 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        span: (6),
    }));
    const __VLS_50 = __VLS_49({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    __VLS_51.slots.default;
    const __VLS_52 = {}.ElCard;
    /** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        shadow: "hover",
    }));
    const __VLS_54 = __VLS_53({
        shadow: "hover",
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    __VLS_55.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-center" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-sm text-gray-500" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-2xl font-bold mt-1 text-orange-500" },
    });
    (__VLS_ctx.stats.pendingShoots);
    var __VLS_55;
    var __VLS_51;
    const __VLS_56 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        span: (6),
    }));
    const __VLS_58 = __VLS_57({
        span: (6),
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
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-center" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-sm text-gray-500" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-2xl font-bold mt-1 text-blue-500" },
    });
    (__VLS_ctx.stats.shooting);
    var __VLS_63;
    var __VLS_59;
    var __VLS_31;
    const __VLS_64 = {}.ElRow;
    /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        gutter: (16),
    }));
    const __VLS_66 = __VLS_65({
        gutter: (16),
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    __VLS_67.slots.default;
    const __VLS_68 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        span: (5),
    }));
    const __VLS_70 = __VLS_69({
        span: (5),
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    __VLS_71.slots.default;
    const __VLS_72 = {}.ElCard;
    /** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({}));
    const __VLS_74 = __VLS_73({}, ...__VLS_functionalComponentArgsRest(__VLS_73));
    __VLS_75.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-sm font-semibold mb-3" },
    });
    for (const [group] of __VLS_getVForSourceType((__VLS_ctx.areaGroups))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.loading))
                        return;
                    __VLS_ctx.filterByArea(group.city);
                } },
            key: (group.city),
            ...{ class: "mb-2 cursor-pointer hover:bg-gray-50 rounded px-2 py-1" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-sm" },
        });
        (group.city);
        (group.count);
    }
    if (__VLS_ctx.areaFilter) {
        const __VLS_76 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
            ...{ 'onClick': {} },
            text: true,
            type: "primary",
            size: "small",
            ...{ class: "mt-2" },
        }));
        const __VLS_78 = __VLS_77({
            ...{ 'onClick': {} },
            text: true,
            type: "primary",
            size: "small",
            ...{ class: "mt-2" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_77));
        let __VLS_80;
        let __VLS_81;
        let __VLS_82;
        const __VLS_83 = {
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.loading))
                    return;
                if (!(__VLS_ctx.areaFilter))
                    return;
                __VLS_ctx.areaFilter = '';
            }
        };
        __VLS_79.slots.default;
        var __VLS_79;
    }
    var __VLS_75;
    var __VLS_71;
    const __VLS_84 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        span: (19),
    }));
    const __VLS_86 = __VLS_85({
        span: (19),
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    __VLS_87.slots.default;
    const __VLS_88 = {}.ElCard;
    /** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
        shadow: "hover",
        ...{ class: "mb-4" },
    }));
    const __VLS_90 = __VLS_89({
        shadow: "hover",
        ...{ class: "mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    __VLS_91.slots.default;
    {
        const { header: __VLS_thisSlot } = __VLS_91.slots;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.selectedMonth || '本月');
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "cal-week-header" },
    });
    for (const [day] of __VLS_getVForSourceType((['日', '一', '二', '三', '四', '五', '六']))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (day),
            ...{ class: "cal-week-day" },
        });
        (day);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "cal-day-grid" },
    });
    for (const [day] of __VLS_getVForSourceType((__VLS_ctx.calendarDays))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (day.date || day.dayNumber),
            ...{ class: "cal-day-cell" },
            ...{ class: ({ 'cal-day-other': !day.isCurrentMonth, 'cal-day-has-booking': day.bookings > 0 }) },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "cal-day-num" },
            ...{ class: ({ 'cal-day-num-other': !day.isCurrentMonth }) },
        });
        (day.dayNumber);
        if (day.bookings > 0) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "cal-booking-badge" },
            });
            const __VLS_92 = {}.ElBadge;
            /** @type {[typeof __VLS_components.ElBadge, typeof __VLS_components.elBadge, ]} */ ;
            // @ts-ignore
            const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
                value: (day.bookings),
                type: "primary",
            }));
            const __VLS_94 = __VLS_93({
                value: (day.bookings),
                type: "primary",
            }, ...__VLS_functionalComponentArgsRest(__VLS_93));
        }
    }
    var __VLS_91;
    const __VLS_96 = {}.ElCard;
    /** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        shadow: "hover",
    }));
    const __VLS_98 = __VLS_97({
        shadow: "hover",
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    __VLS_99.slots.default;
    {
        const { header: __VLS_thisSlot } = __VLS_99.slots;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    }
    const __VLS_100 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        data: (__VLS_ctx.filteredBookingList),
        border: true,
        stripe: true,
    }));
    const __VLS_102 = __VLS_101({
        data: (__VLS_ctx.filteredBookingList),
        border: true,
        stripe: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    __VLS_103.slots.default;
    const __VLS_104 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
        prop: "date",
        label: "日期",
        width: "120",
    }));
    const __VLS_106 = __VLS_105({
        prop: "date",
        label: "日期",
        width: "120",
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    const __VLS_108 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        prop: "timeStart",
        label: "開始",
        width: "80",
    }));
    const __VLS_110 = __VLS_109({
        prop: "timeStart",
        label: "開始",
        width: "80",
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    const __VLS_112 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
        prop: "timeEnd",
        label: "結束",
        width: "80",
    }));
    const __VLS_114 = __VLS_113({
        prop: "timeEnd",
        label: "結束",
        width: "80",
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    const __VLS_116 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
        prop: "photographerName",
        label: "攝影師",
        width: "100",
    }));
    const __VLS_118 = __VLS_117({
        prop: "photographerName",
        label: "攝影師",
        width: "100",
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    const __VLS_120 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
        prop: "consumerName",
        label: "客戶",
        width: "100",
    }));
    const __VLS_122 = __VLS_121({
        prop: "consumerName",
        label: "客戶",
        width: "100",
    }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    const __VLS_124 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
        prop: "serviceType",
        label: "類型",
        width: "100",
    }));
    const __VLS_126 = __VLS_125({
        prop: "serviceType",
        label: "類型",
        width: "100",
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    const __VLS_128 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
        prop: "location",
        label: "地點",
        minWidth: "120",
        showOverflowTooltip: true,
    }));
    const __VLS_130 = __VLS_129({
        prop: "location",
        label: "地點",
        minWidth: "120",
        showOverflowTooltip: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_129));
    const __VLS_132 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
        prop: "status",
        label: "狀態",
        width: "100",
    }));
    const __VLS_134 = __VLS_133({
        prop: "status",
        label: "狀態",
        width: "100",
    }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    __VLS_135.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_135.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_136 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
            type: (__VLS_ctx.bookingStatusType(row.status)),
        }));
        const __VLS_138 = __VLS_137({
            type: (__VLS_ctx.bookingStatusType(row.status)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_137));
        __VLS_139.slots.default;
        (__VLS_ctx.bookingStatusLabel(row.status));
        var __VLS_139;
    }
    var __VLS_135;
    var __VLS_103;
    var __VLS_99;
    var __VLS_87;
    var __VLS_67;
}
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-12']} */ ;
/** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-orange-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['cal-week-header']} */ ;
/** @type {__VLS_StyleScopedClasses['cal-week-day']} */ ;
/** @type {__VLS_StyleScopedClasses['cal-day-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['cal-day-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['cal-day-num']} */ ;
/** @type {__VLS_StyleScopedClasses['cal-booking-badge']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Loading: Loading,
            loading: loading,
            selectedMonth: selectedMonth,
            selectedPhotographer: selectedPhotographer,
            photographers: photographers,
            areaFilter: areaFilter,
            stats: stats,
            areaGroups: areaGroups,
            filteredBookingList: filteredBookingList,
            filterByArea: filterByArea,
            calendarDays: calendarDays,
            bookingStatusLabel: bookingStatusLabel,
            bookingStatusType: bookingStatusType,
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
//# sourceMappingURL=ScheduleDashboard.vue.js.map