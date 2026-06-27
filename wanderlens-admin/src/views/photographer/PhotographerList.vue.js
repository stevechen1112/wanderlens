/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Search, Plus, Edit, Delete, ArrowRight } from '@element-plus/icons-vue';
import api from '@/api';
const providers = ref([]);
const queryField = ref('name');
const keyword = ref('');
const cityFilter = ref('');
const currentPage = ref(1);
const pageSize = 10;
const showAddDialog = ref(false);
const adding = ref(false);
const addForm = reactive({ phone: '', name: '', nickName: '', email: '', city: '', password: '123456' });
const liveCount = computed(() => providers.value.filter(p => p.goLive === 'Y').length);
const areaGroups = computed(() => {
    const groups = {};
    providers.value.forEach(p => {
        const city = p.city || '未設定';
        if (!groups[city])
            groups[city] = { city, live: 0, total: 0 };
        groups[city].total++;
        if (p.goLive === 'Y')
            groups[city].live++;
    });
    return Object.values(groups);
});
const filteredProviders = computed(() => {
    let result = providers.value;
    if (cityFilter.value)
        result = result.filter(p => p.city === cityFilter.value);
    if (keyword.value) {
        const kw = keyword.value.toLowerCase();
        const field = queryField.value;
        result = result.filter(p => String(p[field] || '').toLowerCase().includes(kw));
    }
    return result;
});
const pagedProviders = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return filteredProviders.value.slice(start, start + pageSize);
});
const filterByCity = (city) => { cityFilter.value = cityFilter.value === city ? '' : city; };
const clearQuery = () => { keyword.value = ''; cityFilter.value = ''; queryField.value = 'name'; };
const handleDelete = async (id) => {
    try {
        await api.deleteUser(id);
        ElMessage.success('已刪除');
        await load();
    }
    catch {
        ElMessage.error('刪除失敗');
    }
};
const toggleLive = async (id, live) => {
    try {
        await api.setProviderLive(id, live);
        ElMessage.success('已更新');
    }
    catch {
        ElMessage.error('更新失敗');
    }
};
const addPhotographer = async () => {
    if (!addForm.phone || !addForm.name) {
        ElMessage.warning('手機和姓名為必填');
        return;
    }
    adding.value = true;
    try {
        await api.saveUser({ empno: addForm.phone, username: addForm.name, phone: addForm.phone, email: addForm.email, role: 'PHOTOGRAPHER', password: addForm.password });
        ElMessage.success('攝影師已建立');
        showAddDialog.value = false;
        addForm.phone = '';
        addForm.name = '';
        addForm.nickName = '';
        addForm.email = '';
        addForm.city = '';
        addForm.password = '123456';
        await load();
    }
    catch {
        ElMessage.error('建立失敗');
    }
    finally {
        adding.value = false;
    }
};
const load = async () => {
    try {
        const res = await api.getProviders();
        providers.value = res.data || [];
    }
    catch { /* 靜默 */ }
};
onMounted(load);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
const __VLS_0 = {}.ElBreadcrumb;
/** @type {[typeof __VLS_components.ElBreadcrumb, typeof __VLS_components.elBreadcrumb, typeof __VLS_components.ElBreadcrumb, typeof __VLS_components.elBreadcrumb, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    separatorIcon: (__VLS_ctx.ArrowRight),
    ...{ class: "mb-4" },
}));
const __VLS_2 = __VLS_1({
    separatorIcon: (__VLS_ctx.ArrowRight),
    ...{ class: "mb-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.ElBreadcrumbItem;
/** @type {[typeof __VLS_components.ElBreadcrumbItem, typeof __VLS_components.elBreadcrumbItem, typeof __VLS_components.ElBreadcrumbItem, typeof __VLS_components.elBreadcrumbItem, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({}));
const __VLS_6 = __VLS_5({}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
var __VLS_7;
const __VLS_8 = {}.ElBreadcrumbItem;
/** @type {[typeof __VLS_components.ElBreadcrumbItem, typeof __VLS_components.elBreadcrumbItem, typeof __VLS_components.ElBreadcrumbItem, typeof __VLS_components.elBreadcrumbItem, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({}));
const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
var __VLS_11;
var __VLS_3;
const __VLS_12 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    ...{ class: "mb-4" },
}));
const __VLS_14 = __VLS_13({
    ...{ class: "mb-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
const __VLS_16 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    span: (16),
}));
const __VLS_18 = __VLS_17({
    span: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
const __VLS_20 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    modelValue: (__VLS_ctx.queryField),
    placeholder: "搜尋欄位",
    ...{ style: {} },
    ...{ class: "mr-2" },
}));
const __VLS_22 = __VLS_21({
    modelValue: (__VLS_ctx.queryField),
    placeholder: "搜尋欄位",
    ...{ style: {} },
    ...{ class: "mr-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
const __VLS_24 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    label: "姓名",
    value: "name",
}));
const __VLS_26 = __VLS_25({
    label: "姓名",
    value: "name",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
const __VLS_28 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    label: "暱稱",
    value: "nickName",
}));
const __VLS_30 = __VLS_29({
    label: "暱稱",
    value: "nickName",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const __VLS_32 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    label: "電話",
    value: "phone",
}));
const __VLS_34 = __VLS_33({
    label: "電話",
    value: "phone",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
const __VLS_36 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    label: "Email",
    value: "email",
}));
const __VLS_38 = __VLS_37({
    label: "Email",
    value: "email",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
var __VLS_23;
const __VLS_40 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    modelValue: (__VLS_ctx.keyword),
    ...{ style: {} },
    placeholder: "keyword",
    prefixIcon: (__VLS_ctx.Search),
    ...{ class: "mr-2" },
}));
const __VLS_42 = __VLS_41({
    modelValue: (__VLS_ctx.keyword),
    ...{ style: {} },
    placeholder: "keyword",
    prefixIcon: (__VLS_ctx.Search),
    ...{ class: "mr-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
const __VLS_44 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_46 = __VLS_45({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
let __VLS_48;
let __VLS_49;
let __VLS_50;
const __VLS_51 = {
    onClick: (__VLS_ctx.load)
};
__VLS_47.slots.default;
var __VLS_47;
const __VLS_52 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    ...{ 'onClick': {} },
}));
const __VLS_54 = __VLS_53({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
let __VLS_56;
let __VLS_57;
let __VLS_58;
const __VLS_59 = {
    onClick: (__VLS_ctx.clearQuery)
};
__VLS_55.slots.default;
var __VLS_55;
var __VLS_19;
const __VLS_60 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    span: (8),
    ...{ style: {} },
}));
const __VLS_62 = __VLS_61({
    span: (8),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
const __VLS_64 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    ...{ 'onClick': {} },
    type: "warning",
}));
const __VLS_66 = __VLS_65({
    ...{ 'onClick': {} },
    type: "warning",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
let __VLS_68;
let __VLS_69;
let __VLS_70;
const __VLS_71 = {
    onClick: (...[$event]) => {
        __VLS_ctx.$router.push('/photographers/dashboard');
    }
};
__VLS_67.slots.default;
var __VLS_67;
const __VLS_72 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Plus),
}));
const __VLS_74 = __VLS_73({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Plus),
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
let __VLS_76;
let __VLS_77;
let __VLS_78;
const __VLS_79 = {
    onClick: (...[$event]) => {
        __VLS_ctx.showAddDialog = true;
    }
};
__VLS_75.slots.default;
var __VLS_75;
var __VLS_63;
var __VLS_15;
const __VLS_80 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    gutter: (16),
}));
const __VLS_82 = __VLS_81({
    gutter: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
const __VLS_84 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    span: (6),
}));
const __VLS_86 = __VLS_85({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
__VLS_87.slots.default;
const __VLS_88 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    ...{ 'onRowClick': {} },
    data: (__VLS_ctx.areaGroups),
    stripe: true,
    size: "small",
}));
const __VLS_90 = __VLS_89({
    ...{ 'onRowClick': {} },
    data: (__VLS_ctx.areaGroups),
    stripe: true,
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
let __VLS_92;
let __VLS_93;
let __VLS_94;
const __VLS_95 = {
    onRowClick: ((row) => __VLS_ctx.filterByCity(row.city))
};
__VLS_91.slots.default;
const __VLS_96 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    label: (`地區 (上架 ${__VLS_ctx.liveCount} / 全部 ${__VLS_ctx.providers.length})`),
}));
const __VLS_98 = __VLS_97({
    label: (`地區 (上架 ${__VLS_ctx.liveCount} / 全部 ${__VLS_ctx.providers.length})`),
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
__VLS_99.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_99.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_100 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        text: true,
        type: "primary",
    }));
    const __VLS_102 = __VLS_101({
        text: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    __VLS_103.slots.default;
    (row.city);
    (row.total);
    var __VLS_103;
}
var __VLS_99;
var __VLS_91;
var __VLS_87;
const __VLS_104 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    span: (18),
}));
const __VLS_106 = __VLS_105({
    span: (18),
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
__VLS_107.slots.default;
const __VLS_108 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    data: (__VLS_ctx.pagedProviders),
    stripe: true,
    border: true,
}));
const __VLS_110 = __VLS_109({
    data: (__VLS_ctx.pagedProviders),
    stripe: true,
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
__VLS_111.slots.default;
const __VLS_112 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    label: "姓名",
    width: "200",
}));
const __VLS_114 = __VLS_113({
    label: "姓名",
    width: "200",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
__VLS_115.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_115.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center gap-2" },
    });
    if (row.avatar) {
        const __VLS_116 = {}.ElAvatar;
        /** @type {[typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, ]} */ ;
        // @ts-ignore
        const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
            size: (32),
            src: (row.avatar),
        }));
        const __VLS_118 = __VLS_117({
            size: (32),
            src: (row.avatar),
        }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    }
    else {
        const __VLS_120 = {}.ElAvatar;
        /** @type {[typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, ]} */ ;
        // @ts-ignore
        const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
            size: (32),
        }));
        const __VLS_122 = __VLS_121({
            size: (32),
        }, ...__VLS_functionalComponentArgsRest(__VLS_121));
        __VLS_123.slots.default;
        (row.name?.charAt(0) || '?');
        var __VLS_123;
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (row.name);
}
var __VLS_115;
const __VLS_124 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
    prop: "nickName",
    label: "暱稱",
    width: "120",
}));
const __VLS_126 = __VLS_125({
    prop: "nickName",
    label: "暱稱",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
const __VLS_128 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
    prop: "phone",
    label: "電話",
    width: "130",
}));
const __VLS_130 = __VLS_129({
    prop: "phone",
    label: "電話",
    width: "130",
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
const __VLS_132 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
    prop: "city",
    label: "縣/市",
    width: "80",
}));
const __VLS_134 = __VLS_133({
    prop: "city",
    label: "縣/市",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
const __VLS_136 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
    label: "是否上架",
    width: "100",
}));
const __VLS_138 = __VLS_137({
    label: "是否上架",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
__VLS_139.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_139.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_140 = {}.ElSwitch;
    /** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
    // @ts-ignore
    const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
        ...{ 'onChange': {} },
        modelValue: (row.goLive === 'Y'),
    }));
    const __VLS_142 = __VLS_141({
        ...{ 'onChange': {} },
        modelValue: (row.goLive === 'Y'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_141));
    let __VLS_144;
    let __VLS_145;
    let __VLS_146;
    const __VLS_147 = {
        onChange: ((val) => __VLS_ctx.toggleLive(row.id, val === true))
    };
    var __VLS_143;
}
var __VLS_139;
const __VLS_148 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
    label: "操作",
    width: "150",
}));
const __VLS_150 = __VLS_149({
    label: "操作",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
__VLS_151.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_151.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_152 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
        ...{ 'onClick': {} },
        type: "warning",
        icon: (__VLS_ctx.Edit),
        circle: true,
        size: "small",
    }));
    const __VLS_154 = __VLS_153({
        ...{ 'onClick': {} },
        type: "warning",
        icon: (__VLS_ctx.Edit),
        circle: true,
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_153));
    let __VLS_156;
    let __VLS_157;
    let __VLS_158;
    const __VLS_159 = {
        onClick: (...[$event]) => {
            __VLS_ctx.$router.push(`/photographers/${row.id}`);
        }
    };
    var __VLS_155;
    const __VLS_160 = {}.ElPopconfirm;
    /** @type {[typeof __VLS_components.ElPopconfirm, typeof __VLS_components.elPopconfirm, typeof __VLS_components.ElPopconfirm, typeof __VLS_components.elPopconfirm, ]} */ ;
    // @ts-ignore
    const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
        ...{ 'onConfirm': {} },
        title: "確定刪除此筆資料嗎?",
        confirmButtonText: "確定",
        cancelButtonText: "取消",
    }));
    const __VLS_162 = __VLS_161({
        ...{ 'onConfirm': {} },
        title: "確定刪除此筆資料嗎?",
        confirmButtonText: "確定",
        cancelButtonText: "取消",
    }, ...__VLS_functionalComponentArgsRest(__VLS_161));
    let __VLS_164;
    let __VLS_165;
    let __VLS_166;
    const __VLS_167 = {
        onConfirm: (...[$event]) => {
            __VLS_ctx.handleDelete(row.id);
        }
    };
    __VLS_163.slots.default;
    {
        const { reference: __VLS_thisSlot } = __VLS_163.slots;
        const __VLS_168 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
            ...{ 'onClick': {} },
            type: "danger",
            icon: (__VLS_ctx.Delete),
            circle: true,
            size: "small",
        }));
        const __VLS_170 = __VLS_169({
            ...{ 'onClick': {} },
            type: "danger",
            icon: (__VLS_ctx.Delete),
            circle: true,
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_169));
        let __VLS_172;
        let __VLS_173;
        let __VLS_174;
        const __VLS_175 = {
            onClick: () => { }
        };
        var __VLS_171;
    }
    var __VLS_163;
}
var __VLS_151;
var __VLS_111;
if (__VLS_ctx.filteredProviders.length > __VLS_ctx.pageSize) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-center mt-4" },
    });
    const __VLS_176 = {}.ElPagination;
    /** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
    // @ts-ignore
    const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
        currentPage: (__VLS_ctx.currentPage),
        pageSize: (__VLS_ctx.pageSize),
        total: (__VLS_ctx.filteredProviders.length),
        layout: "prev, pager, next, total",
        background: true,
    }));
    const __VLS_178 = __VLS_177({
        currentPage: (__VLS_ctx.currentPage),
        pageSize: (__VLS_ctx.pageSize),
        total: (__VLS_ctx.filteredProviders.length),
        layout: "prev, pager, next, total",
        background: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_177));
}
var __VLS_107;
var __VLS_83;
const __VLS_180 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
    modelValue: (__VLS_ctx.showAddDialog),
    title: "新增攝影師",
    width: "600px",
}));
const __VLS_182 = __VLS_181({
    modelValue: (__VLS_ctx.showAddDialog),
    title: "新增攝影師",
    width: "600px",
}, ...__VLS_functionalComponentArgsRest(__VLS_181));
__VLS_183.slots.default;
const __VLS_184 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
    model: (__VLS_ctx.addForm),
    labelWidth: "80px",
}));
const __VLS_186 = __VLS_185({
    model: (__VLS_ctx.addForm),
    labelWidth: "80px",
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
__VLS_187.slots.default;
const __VLS_188 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
    gutter: (16),
}));
const __VLS_190 = __VLS_189({
    gutter: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_189));
__VLS_191.slots.default;
const __VLS_192 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
    span: (12),
}));
const __VLS_194 = __VLS_193({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_193));
__VLS_195.slots.default;
const __VLS_196 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
    label: "手機",
    required: true,
}));
const __VLS_198 = __VLS_197({
    label: "手機",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_197));
__VLS_199.slots.default;
const __VLS_200 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
    modelValue: (__VLS_ctx.addForm.phone),
    placeholder: "09xxxxxxxx",
}));
const __VLS_202 = __VLS_201({
    modelValue: (__VLS_ctx.addForm.phone),
    placeholder: "09xxxxxxxx",
}, ...__VLS_functionalComponentArgsRest(__VLS_201));
var __VLS_199;
var __VLS_195;
const __VLS_204 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
    span: (12),
}));
const __VLS_206 = __VLS_205({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_205));
__VLS_207.slots.default;
const __VLS_208 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
    label: "姓名",
    required: true,
}));
const __VLS_210 = __VLS_209({
    label: "姓名",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_209));
__VLS_211.slots.default;
const __VLS_212 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
    modelValue: (__VLS_ctx.addForm.name),
}));
const __VLS_214 = __VLS_213({
    modelValue: (__VLS_ctx.addForm.name),
}, ...__VLS_functionalComponentArgsRest(__VLS_213));
var __VLS_211;
var __VLS_207;
var __VLS_191;
const __VLS_216 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
    gutter: (16),
}));
const __VLS_218 = __VLS_217({
    gutter: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_217));
__VLS_219.slots.default;
const __VLS_220 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
    span: (12),
}));
const __VLS_222 = __VLS_221({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_221));
__VLS_223.slots.default;
const __VLS_224 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
    label: "暱稱",
}));
const __VLS_226 = __VLS_225({
    label: "暱稱",
}, ...__VLS_functionalComponentArgsRest(__VLS_225));
__VLS_227.slots.default;
const __VLS_228 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
    modelValue: (__VLS_ctx.addForm.nickName),
}));
const __VLS_230 = __VLS_229({
    modelValue: (__VLS_ctx.addForm.nickName),
}, ...__VLS_functionalComponentArgsRest(__VLS_229));
var __VLS_227;
var __VLS_223;
const __VLS_232 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
    span: (12),
}));
const __VLS_234 = __VLS_233({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_233));
__VLS_235.slots.default;
const __VLS_236 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
    label: "Email",
}));
const __VLS_238 = __VLS_237({
    label: "Email",
}, ...__VLS_functionalComponentArgsRest(__VLS_237));
__VLS_239.slots.default;
const __VLS_240 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({
    modelValue: (__VLS_ctx.addForm.email),
}));
const __VLS_242 = __VLS_241({
    modelValue: (__VLS_ctx.addForm.email),
}, ...__VLS_functionalComponentArgsRest(__VLS_241));
var __VLS_239;
var __VLS_235;
var __VLS_219;
const __VLS_244 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
    gutter: (16),
}));
const __VLS_246 = __VLS_245({
    gutter: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_245));
__VLS_247.slots.default;
const __VLS_248 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_249 = __VLS_asFunctionalComponent(__VLS_248, new __VLS_248({
    span: (12),
}));
const __VLS_250 = __VLS_249({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_249));
__VLS_251.slots.default;
const __VLS_252 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({
    label: "縣市",
}));
const __VLS_254 = __VLS_253({
    label: "縣市",
}, ...__VLS_functionalComponentArgsRest(__VLS_253));
__VLS_255.slots.default;
const __VLS_256 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_257 = __VLS_asFunctionalComponent(__VLS_256, new __VLS_256({
    modelValue: (__VLS_ctx.addForm.city),
    placeholder: "例：台北市",
}));
const __VLS_258 = __VLS_257({
    modelValue: (__VLS_ctx.addForm.city),
    placeholder: "例：台北市",
}, ...__VLS_functionalComponentArgsRest(__VLS_257));
var __VLS_255;
var __VLS_251;
const __VLS_260 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_261 = __VLS_asFunctionalComponent(__VLS_260, new __VLS_260({
    span: (12),
}));
const __VLS_262 = __VLS_261({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_261));
__VLS_263.slots.default;
const __VLS_264 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_265 = __VLS_asFunctionalComponent(__VLS_264, new __VLS_264({
    label: "密碼",
}));
const __VLS_266 = __VLS_265({
    label: "密碼",
}, ...__VLS_functionalComponentArgsRest(__VLS_265));
__VLS_267.slots.default;
const __VLS_268 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_269 = __VLS_asFunctionalComponent(__VLS_268, new __VLS_268({
    modelValue: (__VLS_ctx.addForm.password),
    placeholder: "預設 123456",
}));
const __VLS_270 = __VLS_269({
    modelValue: (__VLS_ctx.addForm.password),
    placeholder: "預設 123456",
}, ...__VLS_functionalComponentArgsRest(__VLS_269));
var __VLS_267;
var __VLS_263;
var __VLS_247;
var __VLS_187;
{
    const { footer: __VLS_thisSlot } = __VLS_183.slots;
    const __VLS_272 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_273 = __VLS_asFunctionalComponent(__VLS_272, new __VLS_272({
        ...{ 'onClick': {} },
    }));
    const __VLS_274 = __VLS_273({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_273));
    let __VLS_276;
    let __VLS_277;
    let __VLS_278;
    const __VLS_279 = {
        onClick: (...[$event]) => {
            __VLS_ctx.showAddDialog = false;
        }
    };
    __VLS_275.slots.default;
    var __VLS_275;
    const __VLS_280 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_281 = __VLS_asFunctionalComponent(__VLS_280, new __VLS_280({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.adding),
    }));
    const __VLS_282 = __VLS_281({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.adding),
    }, ...__VLS_functionalComponentArgsRest(__VLS_281));
    let __VLS_284;
    let __VLS_285;
    let __VLS_286;
    const __VLS_287 = {
        onClick: (__VLS_ctx.addPhotographer)
    };
    __VLS_283.slots.default;
    var __VLS_283;
}
var __VLS_183;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Search: Search,
            Plus: Plus,
            Edit: Edit,
            Delete: Delete,
            ArrowRight: ArrowRight,
            providers: providers,
            queryField: queryField,
            keyword: keyword,
            currentPage: currentPage,
            pageSize: pageSize,
            showAddDialog: showAddDialog,
            adding: adding,
            addForm: addForm,
            liveCount: liveCount,
            areaGroups: areaGroups,
            filteredProviders: filteredProviders,
            pagedProviders: pagedProviders,
            filterByCity: filterByCity,
            clearQuery: clearQuery,
            handleDelete: handleDelete,
            toggleLive: toggleLive,
            addPhotographer: addPhotographer,
            load: load,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=PhotographerList.vue.js.map