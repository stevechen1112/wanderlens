/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import api from '@/api';
import { useAuthStore } from '@/stores/auth';
import dayjs from 'dayjs';
const authStore = useAuthStore();
const { t } = useI18n();
const currentYear = ref(dayjs().year());
const currentMonth = ref(dayjs().month() + 1);
const showDialog = ref(false);
const showBatchDialog = ref(false);
const batchLoading = ref(false);
const slots = ref([]);
const batchSlot = reactive({ start: '10:00', end: '12:00', excludeWeekend: false });
const weekDays = computed(() => [
    t('schedulePage.weekSun'),
    t('schedulePage.weekMon'),
    t('schedulePage.weekTue'),
    t('schedulePage.weekWed'),
    t('schedulePage.weekThu'),
    t('schedulePage.weekFri'),
    t('schedulePage.weekSat'),
]);
const hours = computed(() => {
    const result = [];
    for (let h = 8; h <= 22; h++)
        result.push(`${String(h).padStart(2, '0')}:00`);
    return result;
});
const newSlot = reactive({ start: '10:00', end: '12:00', dates: [] });
const calendarDays = computed(() => {
    const first = dayjs(`${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}-01`);
    const startDay = first.day();
    const daysInMonth = first.daysInMonth();
    const prevMonthDays = first.subtract(1, 'month').daysInMonth();
    const days = [];
    for (let i = 0; i < startDay; i++) {
        const d = prevMonthDays - startDay + i + 1;
        days.push({ key: `prev-${d}`, day: d, isCurrentMonth: false, isToday: false, slots: [] });
    }
    for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        days.push({
            key: `cur-${i}`,
            day: i,
            isCurrentMonth: true,
            isToday: dateStr === dayjs().format('YYYY-MM-DD'),
            dateStr,
            slots: slots.value.filter(s => s.scheduleDate === dateStr),
        });
    }
    return days;
});
const currentMonthDays = computed(() => calendarDays.value.filter(d => d.isCurrentMonth));
const prevMonth = () => {
    if (currentMonth.value === 1) {
        currentMonth.value = 12;
        currentYear.value--;
    }
    else {
        currentMonth.value--;
    }
    loadSlots();
};
const nextMonth = () => {
    if (currentMonth.value === 12) {
        currentMonth.value = 1;
        currentYear.value++;
    }
    else {
        currentMonth.value++;
    }
    loadSlots();
};
const goToday = () => {
    currentYear.value = dayjs().year();
    currentMonth.value = dayjs().month() + 1;
    loadSlots();
};
const loadSlots = async () => {
    if (!authStore.userId)
        return;
    try {
        const res = await api.getSchedule(authStore.userId);
        slots.value = res.data || [];
    }
    catch {
        slots.value = [];
    }
};
const saveSlot = async () => {
    if (!newSlot.start || !newSlot.end) {
        ElMessage.warning(t('schedulePage.warnTimeRequired'));
        return;
    }
    if (newSlot.start >= newSlot.end) {
        ElMessage.warning(t('schedulePage.warnEndAfterStart'));
        return;
    }
    if (newSlot.dates.length === 0) {
        ElMessage.warning(t('schedulePage.warnSelectDate'));
        return;
    }
    try {
        await api.setSchedule({
            providerId: authStore.userId,
            dates: newSlot.dates,
            slotStart: newSlot.start,
            slotEnd: newSlot.end,
        });
        ElMessage.success(t('schedulePage.saveSuccess'));
        showDialog.value = false;
        newSlot.dates = [];
        await loadSlots();
    }
    catch {
        ElMessage.error(t('schedulePage.saveFailed'));
    }
};
const deleteSlot = async (id) => {
    try {
        await api.deleteSchedule(id);
        ElMessage.success(t('schedulePage.deleteSuccess'));
        await loadSlots();
    }
    catch {
        ElMessage.error(t('schedulePage.deleteFailed'));
    }
};
const saveBatchSlot = async () => {
    if (batchSlot.start >= batchSlot.end) {
        ElMessage.warning(t('schedulePage.warnEndAfterStart'));
        return;
    }
    // 產生整月所有日期
    const allDays = currentMonthDays.value;
    const dates = allDays
        .filter(d => {
        if (!batchSlot.excludeWeekend)
            return true;
        const day = dayjs(d.dateStr).day();
        return day !== 0 && day !== 6; // 排除週六日
    })
        .map(d => d.dateStr);
    if (dates.length === 0) {
        ElMessage.warning(t('schedulePage.warnNoDates'));
        return;
    }
    batchLoading.value = true;
    try {
        await api.setSchedule({
            providerId: authStore.userId,
            dates,
            slotStart: batchSlot.start,
            slotEnd: batchSlot.end,
        });
        ElMessage.success(t('schedulePage.batchSuccess'));
        showBatchDialog.value = false;
        await loadSlots();
    }
    catch {
        ElMessage.error(t('schedulePage.batchFailed'));
    }
    finally {
        batchLoading.value = false;
    }
};
onMounted(() => {
    loadSlots();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['cal-day-cell']} */ ;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center justify-between mb-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center gap-2" },
});
const __VLS_5 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    ...{ 'onClick': {} },
}));
const __VLS_7 = __VLS_6({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
let __VLS_9;
let __VLS_10;
let __VLS_11;
const __VLS_12 = {
    onClick: (__VLS_ctx.prevMonth)
};
__VLS_8.slots.default;
var __VLS_8;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "font-semibold" },
});
(__VLS_ctx.t('schedulePage.yearMonth', { year: __VLS_ctx.currentYear, month: __VLS_ctx.currentMonth }));
const __VLS_13 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    ...{ 'onClick': {} },
}));
const __VLS_15 = __VLS_14({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
let __VLS_17;
let __VLS_18;
let __VLS_19;
const __VLS_20 = {
    onClick: (__VLS_ctx.nextMonth)
};
__VLS_16.slots.default;
var __VLS_16;
const __VLS_21 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
    ...{ 'onClick': {} },
    size: "small",
}));
const __VLS_23 = __VLS_22({
    ...{ 'onClick': {} },
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
let __VLS_25;
let __VLS_26;
let __VLS_27;
const __VLS_28 = {
    onClick: (__VLS_ctx.goToday)
};
__VLS_24.slots.default;
(__VLS_ctx.t('schedulePage.today'));
var __VLS_24;
const __VLS_29 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_31 = __VLS_30({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
let __VLS_33;
let __VLS_34;
let __VLS_35;
const __VLS_36 = {
    onClick: (...[$event]) => {
        __VLS_ctx.showDialog = true;
    }
};
__VLS_32.slots.default;
(__VLS_ctx.t('schedulePage.setSlot'));
var __VLS_32;
const __VLS_37 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
    ...{ 'onClick': {} },
    type: "warning",
}));
const __VLS_39 = __VLS_38({
    ...{ 'onClick': {} },
    type: "warning",
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
let __VLS_41;
let __VLS_42;
let __VLS_43;
const __VLS_44 = {
    onClick: (...[$event]) => {
        __VLS_ctx.showBatchDialog = true;
    }
};
__VLS_40.slots.default;
(__VLS_ctx.t('schedulePage.batchSet'));
var __VLS_40;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "cal-week-header" },
});
for (const [w, idx] of __VLS_getVForSourceType((__VLS_ctx.weekDays))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (idx),
        ...{ class: "cal-week-day" },
    });
    (w);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "cal-day-grid" },
});
for (const [d] of __VLS_getVForSourceType((__VLS_ctx.calendarDays))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (d.key),
        ...{ class: "cal-day-cell" },
        ...{ class: ({ 'cal-day-other': !d.isCurrentMonth, 'cal-day-today': d.isToday }) },
    });
    if (d.isCurrentMonth) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "cal-day-num" },
            ...{ class: ({ 'cal-day-num-today': d.isToday }) },
        });
        (d.day);
        for (const [slot] of __VLS_getVForSourceType((d.slots))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                key: (slot.id),
                ...{ class: "cal-slot" },
            });
            const __VLS_45 = {}.ElTag;
            /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
            // @ts-ignore
            const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
                ...{ 'onClose': {} },
                size: "small",
                type: (slot.lockedByOrderId ? 'info' : 'success'),
                closable: (!slot.lockedByOrderId),
            }));
            const __VLS_47 = __VLS_46({
                ...{ 'onClose': {} },
                size: "small",
                type: (slot.lockedByOrderId ? 'info' : 'success'),
                closable: (!slot.lockedByOrderId),
            }, ...__VLS_functionalComponentArgsRest(__VLS_46));
            let __VLS_49;
            let __VLS_50;
            let __VLS_51;
            const __VLS_52 = {
                onClose: (...[$event]) => {
                    if (!(d.isCurrentMonth))
                        return;
                    __VLS_ctx.deleteSlot(slot.id);
                }
            };
            __VLS_48.slots.default;
            (slot.slotStart);
            (slot.slotEnd);
            var __VLS_48;
        }
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "cal-day-num cal-day-num-other" },
        });
        (d.day);
    }
}
const __VLS_53 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
    modelValue: (__VLS_ctx.showDialog),
    title: (__VLS_ctx.t('schedulePage.dialogTitle')),
    width: "min(400px, 92vw)",
}));
const __VLS_55 = __VLS_54({
    modelValue: (__VLS_ctx.showDialog),
    title: (__VLS_ctx.t('schedulePage.dialogTitle')),
    width: "min(400px, 92vw)",
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
__VLS_56.slots.default;
const __VLS_57 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
    labelWidth: "80px",
}));
const __VLS_59 = __VLS_58({
    labelWidth: "80px",
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
__VLS_60.slots.default;
const __VLS_61 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
    label: (__VLS_ctx.t('schedulePage.start')),
}));
const __VLS_63 = __VLS_62({
    label: (__VLS_ctx.t('schedulePage.start')),
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
__VLS_64.slots.default;
const __VLS_65 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({
    modelValue: (__VLS_ctx.newSlot.start),
}));
const __VLS_67 = __VLS_66({
    modelValue: (__VLS_ctx.newSlot.start),
}, ...__VLS_functionalComponentArgsRest(__VLS_66));
__VLS_68.slots.default;
for (const [h] of __VLS_getVForSourceType((__VLS_ctx.hours))) {
    const __VLS_69 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({
        key: (h),
        label: (h),
        value: (h),
    }));
    const __VLS_71 = __VLS_70({
        key: (h),
        label: (h),
        value: (h),
    }, ...__VLS_functionalComponentArgsRest(__VLS_70));
}
var __VLS_68;
var __VLS_64;
const __VLS_73 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({
    label: (__VLS_ctx.t('schedulePage.end')),
}));
const __VLS_75 = __VLS_74({
    label: (__VLS_ctx.t('schedulePage.end')),
}, ...__VLS_functionalComponentArgsRest(__VLS_74));
__VLS_76.slots.default;
const __VLS_77 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
    modelValue: (__VLS_ctx.newSlot.end),
}));
const __VLS_79 = __VLS_78({
    modelValue: (__VLS_ctx.newSlot.end),
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
__VLS_80.slots.default;
for (const [h] of __VLS_getVForSourceType((__VLS_ctx.hours))) {
    const __VLS_81 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
        key: (h),
        label: (h),
        value: (h),
    }));
    const __VLS_83 = __VLS_82({
        key: (h),
        label: (h),
        value: (h),
    }, ...__VLS_functionalComponentArgsRest(__VLS_82));
}
var __VLS_80;
var __VLS_76;
const __VLS_85 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({
    label: (__VLS_ctx.t('schedulePage.dates')),
}));
const __VLS_87 = __VLS_86({
    label: (__VLS_ctx.t('schedulePage.dates')),
}, ...__VLS_functionalComponentArgsRest(__VLS_86));
__VLS_88.slots.default;
const __VLS_89 = {}.ElCheckboxGroup;
/** @type {[typeof __VLS_components.ElCheckboxGroup, typeof __VLS_components.elCheckboxGroup, typeof __VLS_components.ElCheckboxGroup, typeof __VLS_components.elCheckboxGroup, ]} */ ;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({
    modelValue: (__VLS_ctx.newSlot.dates),
}));
const __VLS_91 = __VLS_90({
    modelValue: (__VLS_ctx.newSlot.dates),
}, ...__VLS_functionalComponentArgsRest(__VLS_90));
__VLS_92.slots.default;
for (const [d] of __VLS_getVForSourceType((__VLS_ctx.currentMonthDays))) {
    const __VLS_93 = {}.ElCheckbox;
    /** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
    // @ts-ignore
    const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({
        key: (d.key),
        label: (d.dateStr),
    }));
    const __VLS_95 = __VLS_94({
        key: (d.key),
        label: (d.dateStr),
    }, ...__VLS_functionalComponentArgsRest(__VLS_94));
    __VLS_96.slots.default;
    (d.day);
    var __VLS_96;
}
var __VLS_92;
var __VLS_88;
var __VLS_60;
{
    const { footer: __VLS_thisSlot } = __VLS_56.slots;
    const __VLS_97 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, new __VLS_97({
        ...{ 'onClick': {} },
    }));
    const __VLS_99 = __VLS_98({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_98));
    let __VLS_101;
    let __VLS_102;
    let __VLS_103;
    const __VLS_104 = {
        onClick: (...[$event]) => {
            __VLS_ctx.showDialog = false;
        }
    };
    __VLS_100.slots.default;
    (__VLS_ctx.t('common.cancel', '取消'));
    var __VLS_100;
    const __VLS_105 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_106 = __VLS_asFunctionalComponent(__VLS_105, new __VLS_105({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_107 = __VLS_106({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_106));
    let __VLS_109;
    let __VLS_110;
    let __VLS_111;
    const __VLS_112 = {
        onClick: (__VLS_ctx.saveSlot)
    };
    __VLS_108.slots.default;
    (__VLS_ctx.t('schedulePage.save'));
    var __VLS_108;
}
var __VLS_56;
const __VLS_113 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113({
    modelValue: (__VLS_ctx.showBatchDialog),
    title: (__VLS_ctx.t('schedulePage.batchDialogTitle')),
    width: "min(500px, 92vw)",
}));
const __VLS_115 = __VLS_114({
    modelValue: (__VLS_ctx.showBatchDialog),
    title: (__VLS_ctx.t('schedulePage.batchDialogTitle')),
    width: "min(500px, 92vw)",
}, ...__VLS_functionalComponentArgsRest(__VLS_114));
__VLS_116.slots.default;
const __VLS_117 = {}.ElAlert;
/** @type {[typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, ]} */ ;
// @ts-ignore
const __VLS_118 = __VLS_asFunctionalComponent(__VLS_117, new __VLS_117({
    type: "info",
    closable: (false),
    ...{ class: "mb-4" },
}));
const __VLS_119 = __VLS_118({
    type: "info",
    closable: (false),
    ...{ class: "mb-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_118));
__VLS_120.slots.default;
(__VLS_ctx.t('schedulePage.batchHint'));
var __VLS_120;
const __VLS_121 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_122 = __VLS_asFunctionalComponent(__VLS_121, new __VLS_121({
    labelWidth: "100px",
}));
const __VLS_123 = __VLS_122({
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_122));
__VLS_124.slots.default;
const __VLS_125 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_126 = __VLS_asFunctionalComponent(__VLS_125, new __VLS_125({
    label: (__VLS_ctx.t('schedulePage.start')),
}));
const __VLS_127 = __VLS_126({
    label: (__VLS_ctx.t('schedulePage.start')),
}, ...__VLS_functionalComponentArgsRest(__VLS_126));
__VLS_128.slots.default;
const __VLS_129 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_130 = __VLS_asFunctionalComponent(__VLS_129, new __VLS_129({
    modelValue: (__VLS_ctx.batchSlot.start),
}));
const __VLS_131 = __VLS_130({
    modelValue: (__VLS_ctx.batchSlot.start),
}, ...__VLS_functionalComponentArgsRest(__VLS_130));
__VLS_132.slots.default;
for (const [h] of __VLS_getVForSourceType((__VLS_ctx.hours))) {
    const __VLS_133 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_134 = __VLS_asFunctionalComponent(__VLS_133, new __VLS_133({
        key: (h),
        label: (h),
        value: (h),
    }));
    const __VLS_135 = __VLS_134({
        key: (h),
        label: (h),
        value: (h),
    }, ...__VLS_functionalComponentArgsRest(__VLS_134));
}
var __VLS_132;
var __VLS_128;
const __VLS_137 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_138 = __VLS_asFunctionalComponent(__VLS_137, new __VLS_137({
    label: (__VLS_ctx.t('schedulePage.end')),
}));
const __VLS_139 = __VLS_138({
    label: (__VLS_ctx.t('schedulePage.end')),
}, ...__VLS_functionalComponentArgsRest(__VLS_138));
__VLS_140.slots.default;
const __VLS_141 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_142 = __VLS_asFunctionalComponent(__VLS_141, new __VLS_141({
    modelValue: (__VLS_ctx.batchSlot.end),
}));
const __VLS_143 = __VLS_142({
    modelValue: (__VLS_ctx.batchSlot.end),
}, ...__VLS_functionalComponentArgsRest(__VLS_142));
__VLS_144.slots.default;
for (const [h] of __VLS_getVForSourceType((__VLS_ctx.hours))) {
    const __VLS_145 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_146 = __VLS_asFunctionalComponent(__VLS_145, new __VLS_145({
        key: (h),
        label: (h),
        value: (h),
    }));
    const __VLS_147 = __VLS_146({
        key: (h),
        label: (h),
        value: (h),
    }, ...__VLS_functionalComponentArgsRest(__VLS_146));
}
var __VLS_144;
var __VLS_140;
const __VLS_149 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_150 = __VLS_asFunctionalComponent(__VLS_149, new __VLS_149({
    label: (__VLS_ctx.t('schedulePage.excludeWeekend')),
}));
const __VLS_151 = __VLS_150({
    label: (__VLS_ctx.t('schedulePage.excludeWeekend')),
}, ...__VLS_functionalComponentArgsRest(__VLS_150));
__VLS_152.slots.default;
const __VLS_153 = {}.ElSwitch;
/** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
// @ts-ignore
const __VLS_154 = __VLS_asFunctionalComponent(__VLS_153, new __VLS_153({
    modelValue: (__VLS_ctx.batchSlot.excludeWeekend),
}));
const __VLS_155 = __VLS_154({
    modelValue: (__VLS_ctx.batchSlot.excludeWeekend),
}, ...__VLS_functionalComponentArgsRest(__VLS_154));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "ml-2 text-xs text-gray-400" },
});
(__VLS_ctx.t('schedulePage.excludeWeekendHint'));
var __VLS_152;
var __VLS_124;
{
    const { footer: __VLS_thisSlot } = __VLS_116.slots;
    const __VLS_157 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_158 = __VLS_asFunctionalComponent(__VLS_157, new __VLS_157({
        ...{ 'onClick': {} },
    }));
    const __VLS_159 = __VLS_158({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_158));
    let __VLS_161;
    let __VLS_162;
    let __VLS_163;
    const __VLS_164 = {
        onClick: (...[$event]) => {
            __VLS_ctx.showBatchDialog = false;
        }
    };
    __VLS_160.slots.default;
    (__VLS_ctx.t('common.cancel', '取消'));
    var __VLS_160;
    const __VLS_165 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_166 = __VLS_asFunctionalComponent(__VLS_165, new __VLS_165({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.batchLoading),
    }));
    const __VLS_167 = __VLS_166({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.batchLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_166));
    let __VLS_169;
    let __VLS_170;
    let __VLS_171;
    const __VLS_172 = {
        onClick: (__VLS_ctx.saveBatchSlot)
    };
    __VLS_168.slots.default;
    (__VLS_ctx.t('schedulePage.batchSave'));
    var __VLS_168;
}
var __VLS_116;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['cal-week-header']} */ ;
/** @type {__VLS_StyleScopedClasses['cal-week-day']} */ ;
/** @type {__VLS_StyleScopedClasses['cal-day-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['cal-day-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['cal-day-num']} */ ;
/** @type {__VLS_StyleScopedClasses['cal-slot']} */ ;
/** @type {__VLS_StyleScopedClasses['cal-day-num']} */ ;
/** @type {__VLS_StyleScopedClasses['cal-day-num-other']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            t: t,
            currentYear: currentYear,
            currentMonth: currentMonth,
            showDialog: showDialog,
            showBatchDialog: showBatchDialog,
            batchLoading: batchLoading,
            batchSlot: batchSlot,
            weekDays: weekDays,
            hours: hours,
            newSlot: newSlot,
            calendarDays: calendarDays,
            currentMonthDays: currentMonthDays,
            prevMonth: prevMonth,
            nextMonth: nextMonth,
            goToday: goToday,
            saveSlot: saveSlot,
            deleteSlot: deleteSlot,
            saveBatchSlot: saveBatchSlot,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=Schedule.vue.js.map