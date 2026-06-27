/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import { ChatLineRound } from '@element-plus/icons-vue';
import api from '@/api';
import request from '@/api/request';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
const { t } = useI18n();
const form = reactive({});
const areaTree = ref([]);
const cities = ref([]);
const districts = ref([]);
const geocoding = ref(false);
const saving = ref(false);
const serviceTypeOptions = ref([]);
const frontendUrl = computed(() => `http://localhost:3001/photographer/${form.providerUuid || ''}`);
const connectLineNotify = () => {
    // 開啟 LINE Notify 授權頁面
    const clientId = 'YOUR_LINE_CLIENT_ID';
    const redirectUri = encodeURIComponent(window.location.origin + '/line/callback');
    const state = `provider_${authStore.userId}`;
    window.open(`https://notify-bot.line.me/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=notify&state=${state}`, '_blank');
};
const onCityChange = () => {
    form.districtName = '';
    loadDistricts(form.city);
};
const loadDistricts = (city) => {
    const cityNode = areaTree.value.find((a) => a.name === city && (a.parentId == null || a.parentId === 0));
    if (!cityNode) {
        districts.value = areaTree.value.filter((a) => a.parentId != null && a.parentId !== 0 && a.name?.includes(city))
            .map((a) => a.name);
        return;
    }
    districts.value = areaTree.value
        .filter((a) => a.parentId === cityNode.id)
        .map((a) => a.name);
};
const geocode = async () => {
    const full = [form.city, form.districtName, form.address].filter(Boolean).join('');
    if (!full)
        return;
    geocoding.value = true;
    try {
        const res = await api.geocodeAddress(full);
        const coords = res.data;
        if (Array.isArray(coords) && coords.length >= 2) {
            form.addrLat = coords[0];
            form.addrLng = coords[1];
            ElMessage.success(t('profilePage.geocodeSuccess'));
        }
    }
    catch {
        ElMessage.error(t('profilePage.geocodeFailed'));
    }
    finally {
        geocoding.value = false;
    }
};
const uploadAvatar = async (options) => {
    try {
        const res = await api.uploadFile('provider_avatar', options.file);
        form.avatar = res.data?.url;
    }
    catch {
        ElMessage.error(t('profilePage.uploadFailed'));
    }
};
const uploadBanner = async (options) => {
    try {
        const res = await api.uploadFile('provider_banner', options.file);
        form.bannerImg = res.data?.url;
    }
    catch {
        ElMessage.error(t('profilePage.uploadFailed'));
    }
};
const save = async () => {
    saving.value = true;
    try {
        await api.updateProvider(form);
        ElMessage.success(t('profilePage.saveSuccess'));
    }
    catch {
        ElMessage.error(t('profilePage.saveFailed'));
    }
    finally {
        saving.value = false;
    }
};
onMounted(async () => {
    try {
        const treeRes = await api.getAreasTree();
        areaTree.value = treeRes.data || [];
        cities.value = areaTree.value
            .filter((a) => a.parentId == null || a.parentId === 0)
            .map((a) => a.name);
    }
    catch { /* 靜默 */ }
    // 載入服務類型選項
    try {
        const stRes = await request.get('/service-types');
        serviceTypeOptions.value = stRes.data || [];
    }
    catch { /* 靜默 */ }
    if (authStore.userId) {
        try {
            const res = await api.getProvider(authStore.userId);
            Object.assign(form, res.data);
            if (form.city)
                loadDistricts(form.city);
        }
        catch { /* 靜默 */ }
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    shadow: "never",
    ...{ class: "basic-info-card" },
}));
const __VLS_2 = __VLS_1({
    shadow: "never",
    ...{ class: "basic-info-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    model: (__VLS_ctx.form),
    labelWidth: "120px",
    ...{ class: "max-w-2xl" },
}));
const __VLS_7 = __VLS_6({
    model: (__VLS_ctx.form),
    labelWidth: "120px",
    ...{ class: "max-w-2xl" },
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
const __VLS_9 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    label: (__VLS_ctx.t('profilePage.frontendLink')),
}));
const __VLS_11 = __VLS_10({
    label: (__VLS_ctx.t('profilePage.frontendLink')),
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
const __VLS_13 = {}.ElLink;
/** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    href: (__VLS_ctx.frontendUrl),
    target: "_blank",
    type: "primary",
}));
const __VLS_15 = __VLS_14({
    href: (__VLS_ctx.frontendUrl),
    target: "_blank",
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_16.slots.default;
(__VLS_ctx.frontendUrl);
var __VLS_16;
var __VLS_12;
const __VLS_17 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    label: (__VLS_ctx.t('profilePage.lineNotify')),
}));
const __VLS_19 = __VLS_18({
    label: (__VLS_ctx.t('profilePage.lineNotify')),
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
__VLS_20.slots.default;
const __VLS_21 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
    ...{ 'onClick': {} },
    type: "success",
    icon: (__VLS_ctx.ChatLineRound),
}));
const __VLS_23 = __VLS_22({
    ...{ 'onClick': {} },
    type: "success",
    icon: (__VLS_ctx.ChatLineRound),
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
let __VLS_25;
let __VLS_26;
let __VLS_27;
const __VLS_28 = {
    onClick: (__VLS_ctx.connectLineNotify)
};
__VLS_24.slots.default;
(__VLS_ctx.form.lineUserId ? `✅ ${__VLS_ctx.t('profilePage.lineBound')}` : __VLS_ctx.t('profilePage.lineBind'));
var __VLS_24;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "ml-2 text-xs text-gray-400" },
});
(__VLS_ctx.t('profilePage.lineHint'));
var __VLS_20;
const __VLS_29 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
    label: (__VLS_ctx.t('profilePage.phone')),
}));
const __VLS_31 = __VLS_30({
    label: (__VLS_ctx.t('profilePage.phone')),
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
__VLS_32.slots.default;
const __VLS_33 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
    modelValue: (__VLS_ctx.form.phone),
    readonly: true,
}));
const __VLS_35 = __VLS_34({
    modelValue: (__VLS_ctx.form.phone),
    readonly: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
var __VLS_32;
const __VLS_37 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
    label: (__VLS_ctx.t('profilePage.name')),
}));
const __VLS_39 = __VLS_38({
    label: (__VLS_ctx.t('profilePage.name')),
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
__VLS_40.slots.default;
const __VLS_41 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
    modelValue: (__VLS_ctx.form.name),
}));
const __VLS_43 = __VLS_42({
    modelValue: (__VLS_ctx.form.name),
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
var __VLS_40;
const __VLS_45 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
    label: (__VLS_ctx.t('profilePage.nickName')),
}));
const __VLS_47 = __VLS_46({
    label: (__VLS_ctx.t('profilePage.nickName')),
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
__VLS_48.slots.default;
const __VLS_49 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
    modelValue: (__VLS_ctx.form.nickName),
}));
const __VLS_51 = __VLS_50({
    modelValue: (__VLS_ctx.form.nickName),
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
var __VLS_48;
const __VLS_53 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
    label: (__VLS_ctx.t('profilePage.email')),
}));
const __VLS_55 = __VLS_54({
    label: (__VLS_ctx.t('profilePage.email')),
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
__VLS_56.slots.default;
const __VLS_57 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
    modelValue: (__VLS_ctx.form.email),
}));
const __VLS_59 = __VLS_58({
    modelValue: (__VLS_ctx.form.email),
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
var __VLS_56;
const __VLS_61 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
    label: (__VLS_ctx.t('profilePage.city')),
}));
const __VLS_63 = __VLS_62({
    label: (__VLS_ctx.t('profilePage.city')),
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
__VLS_64.slots.default;
const __VLS_65 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.form.city),
    placeholder: (__VLS_ctx.t('profilePage.selectCity')),
    filterable: true,
}));
const __VLS_67 = __VLS_66({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.form.city),
    placeholder: (__VLS_ctx.t('profilePage.selectCity')),
    filterable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_66));
let __VLS_69;
let __VLS_70;
let __VLS_71;
const __VLS_72 = {
    onChange: (__VLS_ctx.onCityChange)
};
__VLS_68.slots.default;
for (const [c] of __VLS_getVForSourceType((__VLS_ctx.cities))) {
    const __VLS_73 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({
        key: (c),
        label: (c),
        value: (c),
    }));
    const __VLS_75 = __VLS_74({
        key: (c),
        label: (c),
        value: (c),
    }, ...__VLS_functionalComponentArgsRest(__VLS_74));
}
var __VLS_68;
var __VLS_64;
const __VLS_77 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
    label: (__VLS_ctx.t('profilePage.district')),
}));
const __VLS_79 = __VLS_78({
    label: (__VLS_ctx.t('profilePage.district')),
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
__VLS_80.slots.default;
const __VLS_81 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
    modelValue: (__VLS_ctx.form.districtName),
    placeholder: (__VLS_ctx.t('profilePage.selectDistrict')),
    filterable: true,
    disabled: (!__VLS_ctx.form.city),
}));
const __VLS_83 = __VLS_82({
    modelValue: (__VLS_ctx.form.districtName),
    placeholder: (__VLS_ctx.t('profilePage.selectDistrict')),
    filterable: true,
    disabled: (!__VLS_ctx.form.city),
}, ...__VLS_functionalComponentArgsRest(__VLS_82));
__VLS_84.slots.default;
for (const [d] of __VLS_getVForSourceType((__VLS_ctx.districts))) {
    const __VLS_85 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({
        key: (d),
        label: (d),
        value: (d),
    }));
    const __VLS_87 = __VLS_86({
        key: (d),
        label: (d),
        value: (d),
    }, ...__VLS_functionalComponentArgsRest(__VLS_86));
}
var __VLS_84;
var __VLS_80;
const __VLS_89 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({
    label: (__VLS_ctx.t('profilePage.address')),
}));
const __VLS_91 = __VLS_90({
    label: (__VLS_ctx.t('profilePage.address')),
}, ...__VLS_functionalComponentArgsRest(__VLS_90));
__VLS_92.slots.default;
const __VLS_93 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.address),
    placeholder: (__VLS_ctx.t('profilePage.addressPlaceholder')),
}));
const __VLS_95 = __VLS_94({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.address),
    placeholder: (__VLS_ctx.t('profilePage.addressPlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_94));
let __VLS_97;
let __VLS_98;
let __VLS_99;
const __VLS_100 = {
    onBlur: (__VLS_ctx.geocode)
};
__VLS_96.slots.default;
{
    const { append: __VLS_thisSlot } = __VLS_96.slots;
    const __VLS_101 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_102 = __VLS_asFunctionalComponent(__VLS_101, new __VLS_101({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.geocoding),
    }));
    const __VLS_103 = __VLS_102({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.geocoding),
    }, ...__VLS_functionalComponentArgsRest(__VLS_102));
    let __VLS_105;
    let __VLS_106;
    let __VLS_107;
    const __VLS_108 = {
        onClick: (__VLS_ctx.geocode)
    };
    __VLS_104.slots.default;
    (__VLS_ctx.t('profilePage.geocode'));
    var __VLS_104;
}
var __VLS_96;
var __VLS_92;
const __VLS_109 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({
    label: (__VLS_ctx.t('profilePage.coordinates')),
}));
const __VLS_111 = __VLS_110({
    label: (__VLS_ctx.t('profilePage.coordinates')),
}, ...__VLS_functionalComponentArgsRest(__VLS_110));
__VLS_112.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-sm text-gray-500" },
});
(__VLS_ctx.form.addrLng ?? '—');
(__VLS_ctx.form.addrLat ?? '—');
var __VLS_112;
const __VLS_113 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113({
    label: (__VLS_ctx.t('profilePage.intro')),
}));
const __VLS_115 = __VLS_114({
    label: (__VLS_ctx.t('profilePage.intro')),
}, ...__VLS_functionalComponentArgsRest(__VLS_114));
__VLS_116.slots.default;
const __VLS_117 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_118 = __VLS_asFunctionalComponent(__VLS_117, new __VLS_117({
    modelValue: (__VLS_ctx.form.intro),
    type: "textarea",
    rows: (4),
}));
const __VLS_119 = __VLS_118({
    modelValue: (__VLS_ctx.form.intro),
    type: "textarea",
    rows: (4),
}, ...__VLS_functionalComponentArgsRest(__VLS_118));
var __VLS_116;
const __VLS_121 = {}.ElDivider;
/** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
// @ts-ignore
const __VLS_122 = __VLS_asFunctionalComponent(__VLS_121, new __VLS_121({}));
const __VLS_123 = __VLS_122({}, ...__VLS_functionalComponentArgsRest(__VLS_122));
__VLS_124.slots.default;
(__VLS_ctx.t('profilePage.professional'));
var __VLS_124;
const __VLS_125 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_126 = __VLS_asFunctionalComponent(__VLS_125, new __VLS_125({
    gutter: (20),
}));
const __VLS_127 = __VLS_126({
    gutter: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_126));
__VLS_128.slots.default;
const __VLS_129 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_130 = __VLS_asFunctionalComponent(__VLS_129, new __VLS_129({
    xs: (24),
    sm: (8),
}));
const __VLS_131 = __VLS_130({
    xs: (24),
    sm: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_130));
__VLS_132.slots.default;
const __VLS_133 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_134 = __VLS_asFunctionalComponent(__VLS_133, new __VLS_133({
    label: (__VLS_ctx.t('profilePage.career')),
}));
const __VLS_135 = __VLS_134({
    label: (__VLS_ctx.t('profilePage.career')),
}, ...__VLS_functionalComponentArgsRest(__VLS_134));
__VLS_136.slots.default;
const __VLS_137 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_138 = __VLS_asFunctionalComponent(__VLS_137, new __VLS_137({
    modelValue: (__VLS_ctx.form.career),
    placeholder: (__VLS_ctx.t('profilePage.selectCareer')),
}));
const __VLS_139 = __VLS_138({
    modelValue: (__VLS_ctx.form.career),
    placeholder: (__VLS_ctx.t('profilePage.selectCareer')),
}, ...__VLS_functionalComponentArgsRest(__VLS_138));
__VLS_140.slots.default;
const __VLS_141 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_142 = __VLS_asFunctionalComponent(__VLS_141, new __VLS_141({
    label: (__VLS_ctx.t('profilePage.careerFull')),
    value: "全職攝影",
}));
const __VLS_143 = __VLS_142({
    label: (__VLS_ctx.t('profilePage.careerFull')),
    value: "全職攝影",
}, ...__VLS_functionalComponentArgsRest(__VLS_142));
const __VLS_145 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_146 = __VLS_asFunctionalComponent(__VLS_145, new __VLS_145({
    label: (__VLS_ctx.t('profilePage.careerPart')),
    value: "兼職攝影",
}));
const __VLS_147 = __VLS_146({
    label: (__VLS_ctx.t('profilePage.careerPart')),
    value: "兼職攝影",
}, ...__VLS_functionalComponentArgsRest(__VLS_146));
var __VLS_140;
var __VLS_136;
var __VLS_132;
const __VLS_149 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_150 = __VLS_asFunctionalComponent(__VLS_149, new __VLS_149({
    xs: (24),
    sm: (8),
}));
const __VLS_151 = __VLS_150({
    xs: (24),
    sm: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_150));
__VLS_152.slots.default;
const __VLS_153 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_154 = __VLS_asFunctionalComponent(__VLS_153, new __VLS_153({
    label: (__VLS_ctx.t('profilePage.experience')),
}));
const __VLS_155 = __VLS_154({
    label: (__VLS_ctx.t('profilePage.experience')),
}, ...__VLS_functionalComponentArgsRest(__VLS_154));
__VLS_156.slots.default;
const __VLS_157 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_158 = __VLS_asFunctionalComponent(__VLS_157, new __VLS_157({
    modelValue: (__VLS_ctx.form.experience),
    min: (0),
    step: (0.5),
    precision: (1),
}));
const __VLS_159 = __VLS_158({
    modelValue: (__VLS_ctx.form.experience),
    min: (0),
    step: (0.5),
    precision: (1),
}, ...__VLS_functionalComponentArgsRest(__VLS_158));
var __VLS_156;
var __VLS_152;
const __VLS_161 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_162 = __VLS_asFunctionalComponent(__VLS_161, new __VLS_161({
    xs: (24),
    sm: (8),
}));
const __VLS_163 = __VLS_162({
    xs: (24),
    sm: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_162));
__VLS_164.slots.default;
const __VLS_165 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_166 = __VLS_asFunctionalComponent(__VLS_165, new __VLS_165({
    label: (__VLS_ctx.t('profilePage.serviceTypes')),
}));
const __VLS_167 = __VLS_166({
    label: (__VLS_ctx.t('profilePage.serviceTypes')),
}, ...__VLS_functionalComponentArgsRest(__VLS_166));
__VLS_168.slots.default;
const __VLS_169 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_170 = __VLS_asFunctionalComponent(__VLS_169, new __VLS_169({
    modelValue: (__VLS_ctx.form.serviceTypes),
    multiple: true,
    placeholder: (__VLS_ctx.t('profilePage.selectServiceTypes')),
    filterable: true,
}));
const __VLS_171 = __VLS_170({
    modelValue: (__VLS_ctx.form.serviceTypes),
    multiple: true,
    placeholder: (__VLS_ctx.t('profilePage.selectServiceTypes')),
    filterable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_170));
__VLS_172.slots.default;
for (const [st] of __VLS_getVForSourceType((__VLS_ctx.serviceTypeOptions))) {
    const __VLS_173 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_174 = __VLS_asFunctionalComponent(__VLS_173, new __VLS_173({
        key: (st.id),
        label: (st.name),
        value: (st.id),
    }));
    const __VLS_175 = __VLS_174({
        key: (st.id),
        label: (st.name),
        value: (st.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_174));
}
var __VLS_172;
var __VLS_168;
var __VLS_164;
var __VLS_128;
const __VLS_177 = {}.ElDivider;
/** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
// @ts-ignore
const __VLS_178 = __VLS_asFunctionalComponent(__VLS_177, new __VLS_177({}));
const __VLS_179 = __VLS_178({}, ...__VLS_functionalComponentArgsRest(__VLS_178));
__VLS_180.slots.default;
(__VLS_ctx.t('profilePage.multilingual'));
var __VLS_180;
const __VLS_181 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_182 = __VLS_asFunctionalComponent(__VLS_181, new __VLS_181({
    label: (__VLS_ctx.t('profilePage.nickNameEn')),
}));
const __VLS_183 = __VLS_182({
    label: (__VLS_ctx.t('profilePage.nickNameEn')),
}, ...__VLS_functionalComponentArgsRest(__VLS_182));
__VLS_184.slots.default;
const __VLS_185 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_186 = __VLS_asFunctionalComponent(__VLS_185, new __VLS_185({
    modelValue: (__VLS_ctx.form.nickNameEn),
}));
const __VLS_187 = __VLS_186({
    modelValue: (__VLS_ctx.form.nickNameEn),
}, ...__VLS_functionalComponentArgsRest(__VLS_186));
var __VLS_184;
const __VLS_189 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_190 = __VLS_asFunctionalComponent(__VLS_189, new __VLS_189({
    label: (__VLS_ctx.t('profilePage.nickNameJp')),
}));
const __VLS_191 = __VLS_190({
    label: (__VLS_ctx.t('profilePage.nickNameJp')),
}, ...__VLS_functionalComponentArgsRest(__VLS_190));
__VLS_192.slots.default;
const __VLS_193 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_194 = __VLS_asFunctionalComponent(__VLS_193, new __VLS_193({
    modelValue: (__VLS_ctx.form.nickNameJp),
}));
const __VLS_195 = __VLS_194({
    modelValue: (__VLS_ctx.form.nickNameJp),
}, ...__VLS_functionalComponentArgsRest(__VLS_194));
var __VLS_192;
const __VLS_197 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_198 = __VLS_asFunctionalComponent(__VLS_197, new __VLS_197({
    label: (__VLS_ctx.t('profilePage.nickNameKr')),
}));
const __VLS_199 = __VLS_198({
    label: (__VLS_ctx.t('profilePage.nickNameKr')),
}, ...__VLS_functionalComponentArgsRest(__VLS_198));
__VLS_200.slots.default;
const __VLS_201 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_202 = __VLS_asFunctionalComponent(__VLS_201, new __VLS_201({
    modelValue: (__VLS_ctx.form.nickNameKr),
}));
const __VLS_203 = __VLS_202({
    modelValue: (__VLS_ctx.form.nickNameKr),
}, ...__VLS_functionalComponentArgsRest(__VLS_202));
var __VLS_200;
const __VLS_205 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_206 = __VLS_asFunctionalComponent(__VLS_205, new __VLS_205({
    label: (__VLS_ctx.t('profilePage.introEn')),
}));
const __VLS_207 = __VLS_206({
    label: (__VLS_ctx.t('profilePage.introEn')),
}, ...__VLS_functionalComponentArgsRest(__VLS_206));
__VLS_208.slots.default;
const __VLS_209 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_210 = __VLS_asFunctionalComponent(__VLS_209, new __VLS_209({
    modelValue: (__VLS_ctx.form.introEn),
    type: "textarea",
    rows: (3),
}));
const __VLS_211 = __VLS_210({
    modelValue: (__VLS_ctx.form.introEn),
    type: "textarea",
    rows: (3),
}, ...__VLS_functionalComponentArgsRest(__VLS_210));
var __VLS_208;
const __VLS_213 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_214 = __VLS_asFunctionalComponent(__VLS_213, new __VLS_213({
    label: (__VLS_ctx.t('profilePage.avatar')),
}));
const __VLS_215 = __VLS_214({
    label: (__VLS_ctx.t('profilePage.avatar')),
}, ...__VLS_functionalComponentArgsRest(__VLS_214));
__VLS_216.slots.default;
const __VLS_217 = {}.ElUpload;
/** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
// @ts-ignore
const __VLS_218 = __VLS_asFunctionalComponent(__VLS_217, new __VLS_217({
    showFileList: (false),
    httpRequest: (__VLS_ctx.uploadAvatar),
    accept: "image/*",
}));
const __VLS_219 = __VLS_218({
    showFileList: (false),
    httpRequest: (__VLS_ctx.uploadAvatar),
    accept: "image/*",
}, ...__VLS_functionalComponentArgsRest(__VLS_218));
__VLS_220.slots.default;
const __VLS_221 = {}.ElAvatar;
/** @type {[typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, ]} */ ;
// @ts-ignore
const __VLS_222 = __VLS_asFunctionalComponent(__VLS_221, new __VLS_221({
    size: (80),
    src: (__VLS_ctx.form.avatar),
}));
const __VLS_223 = __VLS_222({
    size: (80),
    src: (__VLS_ctx.form.avatar),
}, ...__VLS_functionalComponentArgsRest(__VLS_222));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "ml-2 text-sm text-blue-500" },
});
(__VLS_ctx.t('profilePage.clickUpload'));
var __VLS_220;
var __VLS_216;
const __VLS_225 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_226 = __VLS_asFunctionalComponent(__VLS_225, new __VLS_225({
    label: (__VLS_ctx.t('profilePage.banner')),
}));
const __VLS_227 = __VLS_226({
    label: (__VLS_ctx.t('profilePage.banner')),
}, ...__VLS_functionalComponentArgsRest(__VLS_226));
__VLS_228.slots.default;
const __VLS_229 = {}.ElUpload;
/** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
// @ts-ignore
const __VLS_230 = __VLS_asFunctionalComponent(__VLS_229, new __VLS_229({
    showFileList: (false),
    httpRequest: (__VLS_ctx.uploadBanner),
    accept: "image/*",
}));
const __VLS_231 = __VLS_230({
    showFileList: (false),
    httpRequest: (__VLS_ctx.uploadBanner),
    accept: "image/*",
}, ...__VLS_functionalComponentArgsRest(__VLS_230));
__VLS_232.slots.default;
if (__VLS_ctx.form.bannerImg) {
    const __VLS_233 = {}.ElImage;
    /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
    // @ts-ignore
    const __VLS_234 = __VLS_asFunctionalComponent(__VLS_233, new __VLS_233({
        src: (__VLS_ctx.form.bannerImg),
        ...{ class: "w-48 h-24 rounded" },
        fit: "cover",
    }));
    const __VLS_235 = __VLS_234({
        src: (__VLS_ctx.form.bannerImg),
        ...{ class: "w-48 h-24 rounded" },
        fit: "cover",
    }, ...__VLS_functionalComponentArgsRest(__VLS_234));
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-sm text-blue-500" },
    });
    (__VLS_ctx.t('profilePage.clickUpload'));
}
var __VLS_232;
var __VLS_228;
const __VLS_237 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_238 = __VLS_asFunctionalComponent(__VLS_237, new __VLS_237({}));
const __VLS_239 = __VLS_238({}, ...__VLS_functionalComponentArgsRest(__VLS_238));
__VLS_240.slots.default;
const __VLS_241 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_242 = __VLS_asFunctionalComponent(__VLS_241, new __VLS_241({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.saving),
}));
const __VLS_243 = __VLS_242({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.saving),
}, ...__VLS_functionalComponentArgsRest(__VLS_242));
let __VLS_245;
let __VLS_246;
let __VLS_247;
const __VLS_248 = {
    onClick: (__VLS_ctx.save)
};
__VLS_244.slots.default;
(__VLS_ctx.t('profilePage.save'));
var __VLS_244;
var __VLS_240;
var __VLS_8;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['basic-info-card']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['w-48']} */ ;
/** @type {__VLS_StyleScopedClasses['h-24']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-500']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ChatLineRound: ChatLineRound,
            t: t,
            form: form,
            cities: cities,
            districts: districts,
            geocoding: geocoding,
            saving: saving,
            serviceTypeOptions: serviceTypeOptions,
            frontendUrl: frontendUrl,
            connectLineNotify: connectLineNotify,
            onCityChange: onCityChange,
            geocode: geocode,
            uploadAvatar: uploadAvatar,
            uploadBanner: uploadBanner,
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
//# sourceMappingURL=BasicInfo.vue.js.map