/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, watch, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import api from '@/api';
import request from '@/api/request';
const route = useRoute();
const providerId = Number(route.params.id);
const provider = ref(null);
const activeTab = ref('basic');
const basicForm = reactive({});
const savingBasic = ref(false);
const cities = ref([]);
const districts = ref([]);
const areaTree = ref([]);
const serviceTypeOptions = ref([]);
const schedule = ref([]);
const serviceAreas = ref([]);
const bank = ref(null);
const features = ref([]);
const works = ref([]);
const ratings = ref([]);
const ratingSummary = ref(null);
const tabLoading = reactive({ schedule: false, area: false, bank: false, feature: false, works: false, rating: false });
const loaded = reactive({});
const featureDialog = ref(false);
const featureEditing = ref(false);
const featureForm = reactive({ language: 'tw', featureType: 'style', featureContent: '', enable: 'Y' });
const consumerWebBase = import.meta.env.VITE_CONSUMER_WEB_URL || 'https://www.wanderlenstw.com';
const publicProfileUrl = computed(() => {
    const uuid = provider.value?.providerUuid || basicForm.providerUuid;
    return uuid ? `${consumerWebBase.replace(/\/$/, '')}/photographer/${uuid}` : '#';
});
const workImageUrl = (w) => w.imageUrl || (w.fileUuid ? `/api/files/serve/works/${w.fileUuid}` : '');
const loadRatingSummary = async () => {
    try {
        const res = await request.get(`/providers/rating/${providerId}`);
        ratingSummary.value = res.data || null;
        if (ratingSummary.value?.averageRating != null && provider.value) {
            provider.value.rating = ratingSummary.value.averageRating;
        }
    }
    catch { /* silent */ }
};
const onCityChange = () => {
    basicForm.districtName = '';
    loadDistricts(basicForm.city);
};
const loadDistricts = (city) => {
    const cityNode = areaTree.value.find((a) => a.name === city && (a.parentId == null || a.parentId === 0));
    if (!cityNode) {
        districts.value = [];
        return;
    }
    districts.value = areaTree.value.filter((a) => a.parentId === cityNode.id).map((a) => a.name);
};
const fillBasicForm = (data) => {
    Object.assign(basicForm, data);
    basicForm.serviceTypes = data.serviceItem
        ? String(data.serviceItem).split(',').map((s) => Number(s.trim())).filter(Boolean)
        : [];
    if (basicForm.city)
        loadDistricts(basicForm.city);
};
const saveBasic = async () => {
    savingBasic.value = true;
    try {
        const payload = {
            ...basicForm,
            id: providerId,
            serviceItem: Array.isArray(basicForm.serviceTypes)
                ? basicForm.serviceTypes.join(',')
                : basicForm.serviceItem,
        };
        await api.updateProvider(payload);
        const res = await api.getProvider(providerId);
        provider.value = res.data;
        fillBasicForm(res.data);
        ElMessage.success('基本資料已儲存');
    }
    catch {
        ElMessage.error('儲存失敗');
    }
    finally {
        savingBasic.value = false;
    }
};
const uploadAvatar = async (options) => {
    try {
        const res = await api.uploadFile('provider_avatar', options.file);
        basicForm.avatar = res.data?.url;
    }
    catch {
        ElMessage.error('上傳失敗');
    }
};
const uploadBanner = async (options) => {
    try {
        const res = await api.uploadFile('provider_banner', options.file);
        basicForm.bannerImg = res.data?.url;
    }
    catch {
        ElMessage.error('上傳失敗');
    }
};
const openAddFeature = () => {
    Object.assign(featureForm, { language: 'tw', featureType: 'style', featureContent: '', enable: 'Y', id: undefined });
    featureEditing.value = false;
    featureDialog.value = true;
};
const editFeature = (row) => {
    Object.assign(featureForm, row);
    featureEditing.value = true;
    featureDialog.value = true;
};
const saveFeature = async () => {
    try {
        await api.setProviderFeature({ ...featureForm, providerId });
        featureDialog.value = false;
        const res = await api.getProviderFeatures(providerId);
        features.value = res.data || [];
        ElMessage.success('特色已儲存');
    }
    catch {
        ElMessage.error('儲存失敗');
    }
};
const removeFeature = async (id) => {
    try {
        await ElMessageBox.confirm('確定刪除此特色？', '確認', { type: 'warning' });
        await api.deleteProviderFeature(id, providerId);
        features.value = features.value.filter((f) => f.id !== id);
        ElMessage.success('已刪除');
    }
    catch (err) {
        if (err !== 'cancel')
            ElMessage.error('刪除失敗');
    }
};
const uploadWork = async (options) => {
    if (works.value.length >= 50) {
        ElMessage.warning('作品集最多 50 張');
        return;
    }
    if (options.file.size > 2 * 1024 * 1024) {
        ElMessage.error('單檔不可超過 2MB');
        return;
    }
    try {
        const res = await api.uploadFile('provider_works', options.file);
        const fileUuid = res.data?.uuid;
        if (!fileUuid)
            throw new Error('missing uuid');
        const workRes = await api.addProviderWork({ providerId, fileUuid });
        works.value.push(workRes.data);
        ElMessage.success('作品已上傳');
    }
    catch {
        ElMessage.error('上傳失敗');
    }
};
const removeWork = async (id) => {
    try {
        await api.deleteProviderWork(id, providerId);
        works.value = works.value.filter((w) => w.id !== id);
        ElMessage.success('已刪除');
    }
    catch {
        ElMessage.error('刪除失敗');
    }
};
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
            const res = await request.get(`/providers/service-area/${providerId}`, { params: { view: 'flat' } });
            serviceAreas.value = res.data || [];
        }
        else if (tab === 'bank') {
            tabLoading.bank = true;
            const res = await request.get('/providers/bank', { params: { providerId } });
            bank.value = res.data;
        }
        else if (tab === 'feature') {
            tabLoading.feature = true;
            const res = await api.getProviderFeatures(providerId);
            features.value = res.data || [];
        }
        else if (tab === 'works') {
            tabLoading.works = true;
            const res = await api.getProviderWorks(providerId);
            works.value = res.data || [];
        }
        else if (tab === 'rating') {
            tabLoading.rating = true;
            const res = await request.get(`/providers/rating/${providerId}/list`);
            ratings.value = res.data || [];
            await loadRatingSummary();
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
        const treeRes = await api.getAreasTree();
        areaTree.value = treeRes.data || [];
        cities.value = areaTree.value
            .filter((a) => a.parentId == null || a.parentId === 0)
            .map((a) => a.name);
    }
    catch { /* silent */ }
    try {
        const stRes = await api.getServiceTypes();
        serviceTypeOptions.value = stRes.data || [];
    }
    catch { /* silent */ }
    try {
        const res = await api.getProvider(providerId);
        provider.value = res.data;
        fillBasicForm(res.data);
        await loadRatingSummary();
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
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mb-4 flex flex-wrap items-center gap-3" },
    });
    if (__VLS_ctx.provider.goLive === 'Y') {
        const __VLS_8 = {}.ElLink;
        /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
        // @ts-ignore
        const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
            href: (__VLS_ctx.publicProfileUrl),
            target: "_blank",
            type: "primary",
        }));
        const __VLS_10 = __VLS_9({
            href: (__VLS_ctx.publicProfileUrl),
            target: "_blank",
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_9));
        __VLS_11.slots.default;
        var __VLS_11;
    }
    else {
        const __VLS_12 = {}.ElText;
        /** @type {[typeof __VLS_components.ElText, typeof __VLS_components.elText, typeof __VLS_components.ElText, typeof __VLS_components.elText, ]} */ ;
        // @ts-ignore
        const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
            type: "info",
            size: "small",
        }));
        const __VLS_14 = __VLS_13({
            type: "info",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_13));
        __VLS_15.slots.default;
        var __VLS_15;
    }
    const __VLS_16 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        type: (__VLS_ctx.provider.goLive === 'Y' ? 'success' : 'info'),
    }));
    const __VLS_18 = __VLS_17({
        type: (__VLS_ctx.provider.goLive === 'Y' ? 'success' : 'info'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    __VLS_19.slots.default;
    (__VLS_ctx.provider.goLive === 'Y' ? '已上架' : '未上架');
    var __VLS_19;
    const __VLS_20 = {}.ElTabs;
    /** @type {[typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        modelValue: (__VLS_ctx.activeTab),
    }));
    const __VLS_22 = __VLS_21({
        modelValue: (__VLS_ctx.activeTab),
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    __VLS_23.slots.default;
    const __VLS_24 = {}.ElTabPane;
    /** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        label: "基本資料",
        name: "basic",
    }));
    const __VLS_26 = __VLS_25({
        label: "基本資料",
        name: "basic",
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    __VLS_27.slots.default;
    const __VLS_28 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        model: (__VLS_ctx.basicForm),
        labelWidth: "110px",
        ...{ class: "max-w-3xl" },
    }));
    const __VLS_30 = __VLS_29({
        model: (__VLS_ctx.basicForm),
        labelWidth: "110px",
        ...{ class: "max-w-3xl" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    __VLS_31.slots.default;
    const __VLS_32 = {}.ElRow;
    /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        gutter: (16),
    }));
    const __VLS_34 = __VLS_33({
        gutter: (16),
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    __VLS_35.slots.default;
    const __VLS_36 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        xs: (24),
        md: (12),
    }));
    const __VLS_38 = __VLS_37({
        xs: (24),
        md: (12),
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    __VLS_39.slots.default;
    const __VLS_40 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        label: "姓名",
    }));
    const __VLS_42 = __VLS_41({
        label: "姓名",
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    __VLS_43.slots.default;
    const __VLS_44 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        modelValue: (__VLS_ctx.basicForm.name),
    }));
    const __VLS_46 = __VLS_45({
        modelValue: (__VLS_ctx.basicForm.name),
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    var __VLS_43;
    var __VLS_39;
    const __VLS_48 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        xs: (24),
        md: (12),
    }));
    const __VLS_50 = __VLS_49({
        xs: (24),
        md: (12),
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    __VLS_51.slots.default;
    const __VLS_52 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        label: "暱稱",
    }));
    const __VLS_54 = __VLS_53({
        label: "暱稱",
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    __VLS_55.slots.default;
    const __VLS_56 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        modelValue: (__VLS_ctx.basicForm.nickName),
    }));
    const __VLS_58 = __VLS_57({
        modelValue: (__VLS_ctx.basicForm.nickName),
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    var __VLS_55;
    var __VLS_51;
    const __VLS_60 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        xs: (24),
        md: (12),
    }));
    const __VLS_62 = __VLS_61({
        xs: (24),
        md: (12),
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    __VLS_63.slots.default;
    const __VLS_64 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        label: "電話",
    }));
    const __VLS_66 = __VLS_65({
        label: "電話",
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    __VLS_67.slots.default;
    const __VLS_68 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        modelValue: (__VLS_ctx.basicForm.phone),
        readonly: true,
    }));
    const __VLS_70 = __VLS_69({
        modelValue: (__VLS_ctx.basicForm.phone),
        readonly: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    var __VLS_67;
    var __VLS_63;
    const __VLS_72 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        xs: (24),
        md: (12),
    }));
    const __VLS_74 = __VLS_73({
        xs: (24),
        md: (12),
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    __VLS_75.slots.default;
    const __VLS_76 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        label: "Email",
    }));
    const __VLS_78 = __VLS_77({
        label: "Email",
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    __VLS_79.slots.default;
    const __VLS_80 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
        modelValue: (__VLS_ctx.basicForm.email),
    }));
    const __VLS_82 = __VLS_81({
        modelValue: (__VLS_ctx.basicForm.email),
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    var __VLS_79;
    var __VLS_75;
    const __VLS_84 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        xs: (24),
        md: (12),
    }));
    const __VLS_86 = __VLS_85({
        xs: (24),
        md: (12),
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    __VLS_87.slots.default;
    const __VLS_88 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
        label: "縣市",
    }));
    const __VLS_90 = __VLS_89({
        label: "縣市",
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    __VLS_91.slots.default;
    const __VLS_92 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.basicForm.city),
        filterable: true,
        clearable: true,
    }));
    const __VLS_94 = __VLS_93({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.basicForm.city),
        filterable: true,
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    let __VLS_96;
    let __VLS_97;
    let __VLS_98;
    const __VLS_99 = {
        onChange: (__VLS_ctx.onCityChange)
    };
    __VLS_95.slots.default;
    for (const [c] of __VLS_getVForSourceType((__VLS_ctx.cities))) {
        const __VLS_100 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
            key: (c),
            label: (c),
            value: (c),
        }));
        const __VLS_102 = __VLS_101({
            key: (c),
            label: (c),
            value: (c),
        }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    }
    var __VLS_95;
    var __VLS_91;
    var __VLS_87;
    const __VLS_104 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
        xs: (24),
        md: (12),
    }));
    const __VLS_106 = __VLS_105({
        xs: (24),
        md: (12),
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    __VLS_107.slots.default;
    const __VLS_108 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        label: "行政區",
    }));
    const __VLS_110 = __VLS_109({
        label: "行政區",
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    __VLS_111.slots.default;
    const __VLS_112 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
        modelValue: (__VLS_ctx.basicForm.districtName),
        filterable: true,
        clearable: true,
        disabled: (!__VLS_ctx.basicForm.city),
    }));
    const __VLS_114 = __VLS_113({
        modelValue: (__VLS_ctx.basicForm.districtName),
        filterable: true,
        clearable: true,
        disabled: (!__VLS_ctx.basicForm.city),
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    __VLS_115.slots.default;
    for (const [d] of __VLS_getVForSourceType((__VLS_ctx.districts))) {
        const __VLS_116 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
            key: (d),
            label: (d),
            value: (d),
        }));
        const __VLS_118 = __VLS_117({
            key: (d),
            label: (d),
            value: (d),
        }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    }
    var __VLS_115;
    var __VLS_111;
    var __VLS_107;
    const __VLS_120 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
        xs: (24),
        md: (8),
    }));
    const __VLS_122 = __VLS_121({
        xs: (24),
        md: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    __VLS_123.slots.default;
    const __VLS_124 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
        label: "身份別",
    }));
    const __VLS_126 = __VLS_125({
        label: "身份別",
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    __VLS_127.slots.default;
    const __VLS_128 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
        modelValue: (__VLS_ctx.basicForm.career),
        clearable: true,
    }));
    const __VLS_130 = __VLS_129({
        modelValue: (__VLS_ctx.basicForm.career),
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_129));
    __VLS_131.slots.default;
    const __VLS_132 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
        label: "全職攝影",
        value: "全職攝影",
    }));
    const __VLS_134 = __VLS_133({
        label: "全職攝影",
        value: "全職攝影",
    }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    const __VLS_136 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
        label: "兼職攝影",
        value: "兼職攝影",
    }));
    const __VLS_138 = __VLS_137({
        label: "兼職攝影",
        value: "兼職攝影",
    }, ...__VLS_functionalComponentArgsRest(__VLS_137));
    var __VLS_131;
    var __VLS_127;
    var __VLS_123;
    const __VLS_140 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
        xs: (24),
        md: (8),
    }));
    const __VLS_142 = __VLS_141({
        xs: (24),
        md: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_141));
    __VLS_143.slots.default;
    const __VLS_144 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
        label: "年資",
    }));
    const __VLS_146 = __VLS_145({
        label: "年資",
    }, ...__VLS_functionalComponentArgsRest(__VLS_145));
    __VLS_147.slots.default;
    const __VLS_148 = {}.ElInputNumber;
    /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
        modelValue: (__VLS_ctx.basicForm.experience),
        min: (0),
        step: (0.5),
        precision: (1),
        ...{ class: "w-full" },
    }));
    const __VLS_150 = __VLS_149({
        modelValue: (__VLS_ctx.basicForm.experience),
        min: (0),
        step: (0.5),
        precision: (1),
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_149));
    var __VLS_147;
    var __VLS_143;
    const __VLS_152 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
        xs: (24),
        md: (8),
    }));
    const __VLS_154 = __VLS_153({
        xs: (24),
        md: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_153));
    __VLS_155.slots.default;
    const __VLS_156 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
        label: "時薪",
    }));
    const __VLS_158 = __VLS_157({
        label: "時薪",
    }, ...__VLS_functionalComponentArgsRest(__VLS_157));
    __VLS_159.slots.default;
    const __VLS_160 = {}.ElInputNumber;
    /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
    // @ts-ignore
    const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
        modelValue: (__VLS_ctx.basicForm.unitPrice),
        min: (0),
        step: (100),
        ...{ class: "w-full" },
    }));
    const __VLS_162 = __VLS_161({
        modelValue: (__VLS_ctx.basicForm.unitPrice),
        min: (0),
        step: (100),
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_161));
    var __VLS_159;
    var __VLS_155;
    const __VLS_164 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
        span: (24),
    }));
    const __VLS_166 = __VLS_165({
        span: (24),
    }, ...__VLS_functionalComponentArgsRest(__VLS_165));
    __VLS_167.slots.default;
    const __VLS_168 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
        label: "服務項目",
    }));
    const __VLS_170 = __VLS_169({
        label: "服務項目",
    }, ...__VLS_functionalComponentArgsRest(__VLS_169));
    __VLS_171.slots.default;
    const __VLS_172 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
        modelValue: (__VLS_ctx.basicForm.serviceTypes),
        multiple: true,
        filterable: true,
        ...{ class: "w-full" },
    }));
    const __VLS_174 = __VLS_173({
        modelValue: (__VLS_ctx.basicForm.serviceTypes),
        multiple: true,
        filterable: true,
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_173));
    __VLS_175.slots.default;
    for (const [st] of __VLS_getVForSourceType((__VLS_ctx.serviceTypeOptions))) {
        const __VLS_176 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
            key: (st.id),
            label: (st.name),
            value: (st.id),
        }));
        const __VLS_178 = __VLS_177({
            key: (st.id),
            label: (st.name),
            value: (st.id),
        }, ...__VLS_functionalComponentArgsRest(__VLS_177));
    }
    var __VLS_175;
    var __VLS_171;
    var __VLS_167;
    const __VLS_180 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
        span: (24),
    }));
    const __VLS_182 = __VLS_181({
        span: (24),
    }, ...__VLS_functionalComponentArgsRest(__VLS_181));
    __VLS_183.slots.default;
    const __VLS_184 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
        label: "自我介紹",
    }));
    const __VLS_186 = __VLS_185({
        label: "自我介紹",
    }, ...__VLS_functionalComponentArgsRest(__VLS_185));
    __VLS_187.slots.default;
    const __VLS_188 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
        modelValue: (__VLS_ctx.basicForm.intro),
        type: "textarea",
        rows: (4),
    }));
    const __VLS_190 = __VLS_189({
        modelValue: (__VLS_ctx.basicForm.intro),
        type: "textarea",
        rows: (4),
    }, ...__VLS_functionalComponentArgsRest(__VLS_189));
    var __VLS_187;
    var __VLS_183;
    const __VLS_192 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
        xs: (24),
        md: (12),
    }));
    const __VLS_194 = __VLS_193({
        xs: (24),
        md: (12),
    }, ...__VLS_functionalComponentArgsRest(__VLS_193));
    __VLS_195.slots.default;
    const __VLS_196 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
        label: "大頭照",
    }));
    const __VLS_198 = __VLS_197({
        label: "大頭照",
    }, ...__VLS_functionalComponentArgsRest(__VLS_197));
    __VLS_199.slots.default;
    const __VLS_200 = {}.ElUpload;
    /** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
    // @ts-ignore
    const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
        showFileList: (false),
        httpRequest: (__VLS_ctx.uploadAvatar),
        accept: "image/*",
    }));
    const __VLS_202 = __VLS_201({
        showFileList: (false),
        httpRequest: (__VLS_ctx.uploadAvatar),
        accept: "image/*",
    }, ...__VLS_functionalComponentArgsRest(__VLS_201));
    __VLS_203.slots.default;
    const __VLS_204 = {}.ElAvatar;
    /** @type {[typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, ]} */ ;
    // @ts-ignore
    const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
        size: (72),
        src: (__VLS_ctx.basicForm.avatar),
    }));
    const __VLS_206 = __VLS_205({
        size: (72),
        src: (__VLS_ctx.basicForm.avatar),
    }, ...__VLS_functionalComponentArgsRest(__VLS_205));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "ml-2 text-sm text-blue-500" },
    });
    var __VLS_203;
    var __VLS_199;
    var __VLS_195;
    const __VLS_208 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
        xs: (24),
        md: (12),
    }));
    const __VLS_210 = __VLS_209({
        xs: (24),
        md: (12),
    }, ...__VLS_functionalComponentArgsRest(__VLS_209));
    __VLS_211.slots.default;
    const __VLS_212 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
        label: "代表橫幅",
    }));
    const __VLS_214 = __VLS_213({
        label: "代表橫幅",
    }, ...__VLS_functionalComponentArgsRest(__VLS_213));
    __VLS_215.slots.default;
    const __VLS_216 = {}.ElUpload;
    /** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
    // @ts-ignore
    const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
        showFileList: (false),
        httpRequest: (__VLS_ctx.uploadBanner),
        accept: "image/*",
    }));
    const __VLS_218 = __VLS_217({
        showFileList: (false),
        httpRequest: (__VLS_ctx.uploadBanner),
        accept: "image/*",
    }, ...__VLS_functionalComponentArgsRest(__VLS_217));
    __VLS_219.slots.default;
    if (__VLS_ctx.basicForm.bannerImg) {
        const __VLS_220 = {}.ElImage;
        /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
        // @ts-ignore
        const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
            src: (__VLS_ctx.basicForm.bannerImg),
            ...{ class: "w-48 h-24 rounded" },
            fit: "cover",
        }));
        const __VLS_222 = __VLS_221({
            src: (__VLS_ctx.basicForm.bannerImg),
            ...{ class: "w-48 h-24 rounded" },
            fit: "cover",
        }, ...__VLS_functionalComponentArgsRest(__VLS_221));
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-sm text-blue-500" },
        });
    }
    var __VLS_219;
    var __VLS_215;
    var __VLS_211;
    const __VLS_224 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
        span: (24),
    }));
    const __VLS_226 = __VLS_225({
        span: (24),
    }, ...__VLS_functionalComponentArgsRest(__VLS_225));
    __VLS_227.slots.default;
    const __VLS_228 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({}));
    const __VLS_230 = __VLS_229({}, ...__VLS_functionalComponentArgsRest(__VLS_229));
    __VLS_231.slots.default;
    const __VLS_232 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.savingBasic),
    }));
    const __VLS_234 = __VLS_233({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.savingBasic),
    }, ...__VLS_functionalComponentArgsRest(__VLS_233));
    let __VLS_236;
    let __VLS_237;
    let __VLS_238;
    const __VLS_239 = {
        onClick: (__VLS_ctx.saveBasic)
    };
    __VLS_235.slots.default;
    var __VLS_235;
    var __VLS_231;
    var __VLS_227;
    var __VLS_35;
    var __VLS_31;
    const __VLS_240 = {}.ElDescriptions;
    /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
    // @ts-ignore
    const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({
        column: (2),
        border: true,
        ...{ class: "max-w-3xl mt-6" },
        title: "系統資訊（唯讀）",
    }));
    const __VLS_242 = __VLS_241({
        column: (2),
        border: true,
        ...{ class: "max-w-3xl mt-6" },
        title: "系統資訊（唯讀）",
    }, ...__VLS_functionalComponentArgsRest(__VLS_241));
    __VLS_243.slots.default;
    const __VLS_244 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
        label: "評價",
    }));
    const __VLS_246 = __VLS_245({
        label: "評價",
    }, ...__VLS_functionalComponentArgsRest(__VLS_245));
    __VLS_247.slots.default;
    (__VLS_ctx.ratingSummary?.averageRating ?? __VLS_ctx.provider.rating ?? '—');
    if (__VLS_ctx.ratingSummary?.totalCount) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.ratingSummary.totalCount);
    }
    var __VLS_247;
    const __VLS_248 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_249 = __VLS_asFunctionalComponent(__VLS_248, new __VLS_248({
        label: "違規",
    }));
    const __VLS_250 = __VLS_249({
        label: "違規",
    }, ...__VLS_functionalComponentArgsRest(__VLS_249));
    __VLS_251.slots.default;
    (__VLS_ctx.provider.violationCount);
    (__VLS_ctx.provider.violationLevel);
    var __VLS_251;
    var __VLS_243;
    var __VLS_27;
    const __VLS_252 = {}.ElTabPane;
    /** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
    // @ts-ignore
    const __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({
        label: "特色資料",
        name: "feature",
        lazy: true,
    }));
    const __VLS_254 = __VLS_253({
        label: "特色資料",
        name: "feature",
        lazy: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_253));
    __VLS_255.slots.default;
    const __VLS_256 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    const __VLS_257 = __VLS_asFunctionalComponent(__VLS_256, new __VLS_256({
        data: (__VLS_ctx.features),
        border: true,
        emptyText: "尚無特色資料",
    }));
    const __VLS_258 = __VLS_257({
        data: (__VLS_ctx.features),
        border: true,
        emptyText: "尚無特色資料",
    }, ...__VLS_functionalComponentArgsRest(__VLS_257));
    __VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.tabLoading.feature) }, null, null);
    __VLS_259.slots.default;
    const __VLS_260 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_261 = __VLS_asFunctionalComponent(__VLS_260, new __VLS_260({
        prop: "language",
        label: "語系",
        width: "80",
    }));
    const __VLS_262 = __VLS_261({
        prop: "language",
        label: "語系",
        width: "80",
    }, ...__VLS_functionalComponentArgsRest(__VLS_261));
    const __VLS_264 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_265 = __VLS_asFunctionalComponent(__VLS_264, new __VLS_264({
        prop: "featureType",
        label: "類型",
        width: "120",
    }));
    const __VLS_266 = __VLS_265({
        prop: "featureType",
        label: "類型",
        width: "120",
    }, ...__VLS_functionalComponentArgsRest(__VLS_265));
    const __VLS_268 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_269 = __VLS_asFunctionalComponent(__VLS_268, new __VLS_268({
        prop: "featureContent",
        label: "內容",
    }));
    const __VLS_270 = __VLS_269({
        prop: "featureContent",
        label: "內容",
    }, ...__VLS_functionalComponentArgsRest(__VLS_269));
    const __VLS_272 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_273 = __VLS_asFunctionalComponent(__VLS_272, new __VLS_272({
        prop: "enable",
        label: "啟用",
        width: "80",
    }));
    const __VLS_274 = __VLS_273({
        prop: "enable",
        label: "啟用",
        width: "80",
    }, ...__VLS_functionalComponentArgsRest(__VLS_273));
    const __VLS_276 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_277 = __VLS_asFunctionalComponent(__VLS_276, new __VLS_276({
        label: "操作",
        width: "140",
    }));
    const __VLS_278 = __VLS_277({
        label: "操作",
        width: "140",
    }, ...__VLS_functionalComponentArgsRest(__VLS_277));
    __VLS_279.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_279.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_280 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_281 = __VLS_asFunctionalComponent(__VLS_280, new __VLS_280({
            ...{ 'onClick': {} },
            text: true,
            type: "primary",
        }));
        const __VLS_282 = __VLS_281({
            ...{ 'onClick': {} },
            text: true,
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_281));
        let __VLS_284;
        let __VLS_285;
        let __VLS_286;
        const __VLS_287 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.provider))
                    return;
                __VLS_ctx.editFeature(row);
            }
        };
        __VLS_283.slots.default;
        var __VLS_283;
        const __VLS_288 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_289 = __VLS_asFunctionalComponent(__VLS_288, new __VLS_288({
            ...{ 'onClick': {} },
            text: true,
            type: "danger",
        }));
        const __VLS_290 = __VLS_289({
            ...{ 'onClick': {} },
            text: true,
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_289));
        let __VLS_292;
        let __VLS_293;
        let __VLS_294;
        const __VLS_295 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.provider))
                    return;
                __VLS_ctx.removeFeature(row.id);
            }
        };
        __VLS_291.slots.default;
        var __VLS_291;
    }
    var __VLS_279;
    var __VLS_259;
    const __VLS_296 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_297 = __VLS_asFunctionalComponent(__VLS_296, new __VLS_296({
        ...{ 'onClick': {} },
        type: "primary",
        ...{ class: "mt-4" },
    }));
    const __VLS_298 = __VLS_297({
        ...{ 'onClick': {} },
        type: "primary",
        ...{ class: "mt-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_297));
    let __VLS_300;
    let __VLS_301;
    let __VLS_302;
    const __VLS_303 = {
        onClick: (__VLS_ctx.openAddFeature)
    };
    __VLS_299.slots.default;
    var __VLS_299;
    var __VLS_255;
    const __VLS_304 = {}.ElTabPane;
    /** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
    // @ts-ignore
    const __VLS_305 = __VLS_asFunctionalComponent(__VLS_304, new __VLS_304({
        label: "作品集",
        name: "works",
        lazy: true,
    }));
    const __VLS_306 = __VLS_305({
        label: "作品集",
        name: "works",
        lazy: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_305));
    __VLS_307.slots.default;
    const __VLS_308 = {}.ElUpload;
    /** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
    // @ts-ignore
    const __VLS_309 = __VLS_asFunctionalComponent(__VLS_308, new __VLS_308({
        drag: true,
        accept: "image/jpeg,image/png,image/webp",
        httpRequest: (__VLS_ctx.uploadWork),
        showFileList: (false),
        ...{ class: "max-w-xl" },
    }));
    const __VLS_310 = __VLS_309({
        drag: true,
        accept: "image/jpeg,image/png,image/webp",
        httpRequest: (__VLS_ctx.uploadWork),
        showFileList: (false),
        ...{ class: "max-w-xl" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_309));
    __VLS_311.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-sm text-gray-500" },
    });
    var __VLS_311;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid grid-cols-2 md:grid-cols-4 gap-3 mt-4" },
    });
    __VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.tabLoading.works) }, null, null);
    for (const [w] of __VLS_getVForSourceType((__VLS_ctx.works))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (w.id),
            ...{ class: "relative group" },
        });
        const __VLS_312 = {}.ElImage;
        /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
        // @ts-ignore
        const __VLS_313 = __VLS_asFunctionalComponent(__VLS_312, new __VLS_312({
            src: (__VLS_ctx.workImageUrl(w)),
            fit: "cover",
            ...{ class: "w-full aspect-square rounded-lg" },
        }));
        const __VLS_314 = __VLS_313({
            src: (__VLS_ctx.workImageUrl(w)),
            fit: "cover",
            ...{ class: "w-full aspect-square rounded-lg" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_313));
        const __VLS_316 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_317 = __VLS_asFunctionalComponent(__VLS_316, new __VLS_316({
            ...{ 'onClick': {} },
            ...{ class: "absolute top-1 right-1 opacity-0 group-hover:opacity-100" },
            type: "danger",
            circle: true,
            size: "small",
        }));
        const __VLS_318 = __VLS_317({
            ...{ 'onClick': {} },
            ...{ class: "absolute top-1 right-1 opacity-0 group-hover:opacity-100" },
            type: "danger",
            circle: true,
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_317));
        let __VLS_320;
        let __VLS_321;
        let __VLS_322;
        const __VLS_323 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.provider))
                    return;
                __VLS_ctx.removeWork(w.id);
            }
        };
        __VLS_319.slots.default;
        var __VLS_319;
    }
    if (!__VLS_ctx.tabLoading.works && __VLS_ctx.works.length === 0) {
        const __VLS_324 = {}.ElEmpty;
        /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
        // @ts-ignore
        const __VLS_325 = __VLS_asFunctionalComponent(__VLS_324, new __VLS_324({
            description: "尚無作品",
            ...{ class: "col-span-full" },
        }));
        const __VLS_326 = __VLS_325({
            description: "尚無作品",
            ...{ class: "col-span-full" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_325));
    }
    var __VLS_307;
    const __VLS_328 = {}.ElTabPane;
    /** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
    // @ts-ignore
    const __VLS_329 = __VLS_asFunctionalComponent(__VLS_328, new __VLS_328({
        label: "接案時段",
        name: "schedule",
        lazy: true,
    }));
    const __VLS_330 = __VLS_329({
        label: "接案時段",
        name: "schedule",
        lazy: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_329));
    __VLS_331.slots.default;
    const __VLS_332 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    const __VLS_333 = __VLS_asFunctionalComponent(__VLS_332, new __VLS_332({
        data: (__VLS_ctx.schedule),
        border: true,
        emptyText: "尚無時段資料",
    }));
    const __VLS_334 = __VLS_333({
        data: (__VLS_ctx.schedule),
        border: true,
        emptyText: "尚無時段資料",
    }, ...__VLS_functionalComponentArgsRest(__VLS_333));
    __VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.tabLoading.schedule) }, null, null);
    __VLS_335.slots.default;
    const __VLS_336 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_337 = __VLS_asFunctionalComponent(__VLS_336, new __VLS_336({
        prop: "scheduleDate",
        label: "日期",
        width: "120",
    }));
    const __VLS_338 = __VLS_337({
        prop: "scheduleDate",
        label: "日期",
        width: "120",
    }, ...__VLS_functionalComponentArgsRest(__VLS_337));
    const __VLS_340 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_341 = __VLS_asFunctionalComponent(__VLS_340, new __VLS_340({
        label: "時段",
    }));
    const __VLS_342 = __VLS_341({
        label: "時段",
    }, ...__VLS_functionalComponentArgsRest(__VLS_341));
    __VLS_343.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_343.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        (row.slotStart);
        (row.slotEnd);
    }
    var __VLS_343;
    const __VLS_344 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_345 = __VLS_asFunctionalComponent(__VLS_344, new __VLS_344({
        prop: "maxValue",
        label: "可預約數",
        width: "100",
    }));
    const __VLS_346 = __VLS_345({
        prop: "maxValue",
        label: "可預約數",
        width: "100",
    }, ...__VLS_functionalComponentArgsRest(__VLS_345));
    const __VLS_348 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_349 = __VLS_asFunctionalComponent(__VLS_348, new __VLS_348({
        prop: "active",
        label: "啟用",
        width: "80",
    }));
    const __VLS_350 = __VLS_349({
        prop: "active",
        label: "啟用",
        width: "80",
    }, ...__VLS_functionalComponentArgsRest(__VLS_349));
    const __VLS_352 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_353 = __VLS_asFunctionalComponent(__VLS_352, new __VLS_352({
        label: "鎖定",
    }));
    const __VLS_354 = __VLS_353({
        label: "鎖定",
    }, ...__VLS_functionalComponentArgsRest(__VLS_353));
    __VLS_355.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_355.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        (row.lockedByOrderId || '—');
    }
    var __VLS_355;
    var __VLS_335;
    var __VLS_331;
    const __VLS_356 = {}.ElTabPane;
    /** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
    // @ts-ignore
    const __VLS_357 = __VLS_asFunctionalComponent(__VLS_356, new __VLS_356({
        label: "服務地區",
        name: "area",
        lazy: true,
    }));
    const __VLS_358 = __VLS_357({
        label: "服務地區",
        name: "area",
        lazy: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_357));
    __VLS_359.slots.default;
    const __VLS_360 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    const __VLS_361 = __VLS_asFunctionalComponent(__VLS_360, new __VLS_360({
        data: (__VLS_ctx.serviceAreas),
        border: true,
        emptyText: "尚無服務地區",
    }));
    const __VLS_362 = __VLS_361({
        data: (__VLS_ctx.serviceAreas),
        border: true,
        emptyText: "尚無服務地區",
    }, ...__VLS_functionalComponentArgsRest(__VLS_361));
    __VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.tabLoading.area) }, null, null);
    __VLS_363.slots.default;
    const __VLS_364 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_365 = __VLS_asFunctionalComponent(__VLS_364, new __VLS_364({
        prop: "areaId",
        label: "區域 ID",
        width: "100",
    }));
    const __VLS_366 = __VLS_365({
        prop: "areaId",
        label: "區域 ID",
        width: "100",
    }, ...__VLS_functionalComponentArgsRest(__VLS_365));
    const __VLS_368 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_369 = __VLS_asFunctionalComponent(__VLS_368, new __VLS_368({
        prop: "zipCode",
        label: "郵遞區號",
        width: "120",
    }));
    const __VLS_370 = __VLS_369({
        prop: "zipCode",
        label: "郵遞區號",
        width: "120",
    }, ...__VLS_functionalComponentArgsRest(__VLS_369));
    const __VLS_372 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_373 = __VLS_asFunctionalComponent(__VLS_372, new __VLS_372({
        prop: "areaParentId",
        label: "上層區域",
    }));
    const __VLS_374 = __VLS_373({
        prop: "areaParentId",
        label: "上層區域",
    }, ...__VLS_functionalComponentArgsRest(__VLS_373));
    var __VLS_363;
    var __VLS_359;
    const __VLS_376 = {}.ElTabPane;
    /** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
    // @ts-ignore
    const __VLS_377 = __VLS_asFunctionalComponent(__VLS_376, new __VLS_376({
        label: "匯款資料",
        name: "bank",
        lazy: true,
    }));
    const __VLS_378 = __VLS_377({
        label: "匯款資料",
        name: "bank",
        lazy: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_377));
    __VLS_379.slots.default;
    if (__VLS_ctx.bank) {
        const __VLS_380 = {}.ElDescriptions;
        /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
        // @ts-ignore
        const __VLS_381 = __VLS_asFunctionalComponent(__VLS_380, new __VLS_380({
            column: (2),
            border: true,
        }));
        const __VLS_382 = __VLS_381({
            column: (2),
            border: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_381));
        __VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.tabLoading.bank) }, null, null);
        __VLS_383.slots.default;
        const __VLS_384 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_385 = __VLS_asFunctionalComponent(__VLS_384, new __VLS_384({
            label: "銀行",
        }));
        const __VLS_386 = __VLS_385({
            label: "銀行",
        }, ...__VLS_functionalComponentArgsRest(__VLS_385));
        __VLS_387.slots.default;
        (__VLS_ctx.bank.bankName);
        var __VLS_387;
        const __VLS_388 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_389 = __VLS_asFunctionalComponent(__VLS_388, new __VLS_388({
            label: "代碼",
        }));
        const __VLS_390 = __VLS_389({
            label: "代碼",
        }, ...__VLS_functionalComponentArgsRest(__VLS_389));
        __VLS_391.slots.default;
        (__VLS_ctx.bank.bankCode);
        var __VLS_391;
        const __VLS_392 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_393 = __VLS_asFunctionalComponent(__VLS_392, new __VLS_392({
            label: "分行",
        }));
        const __VLS_394 = __VLS_393({
            label: "分行",
        }, ...__VLS_functionalComponentArgsRest(__VLS_393));
        __VLS_395.slots.default;
        (__VLS_ctx.bank.bankBranch);
        var __VLS_395;
        const __VLS_396 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_397 = __VLS_asFunctionalComponent(__VLS_396, new __VLS_396({
            label: "戶名",
        }));
        const __VLS_398 = __VLS_397({
            label: "戶名",
        }, ...__VLS_functionalComponentArgsRest(__VLS_397));
        __VLS_399.slots.default;
        (__VLS_ctx.bank.accountName);
        var __VLS_399;
        const __VLS_400 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_401 = __VLS_asFunctionalComponent(__VLS_400, new __VLS_400({
            label: "帳號",
        }));
        const __VLS_402 = __VLS_401({
            label: "帳號",
        }, ...__VLS_functionalComponentArgsRest(__VLS_401));
        __VLS_403.slots.default;
        (__VLS_ctx.bank.accountNo);
        var __VLS_403;
        const __VLS_404 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_405 = __VLS_asFunctionalComponent(__VLS_404, new __VLS_404({
            label: "備註",
        }));
        const __VLS_406 = __VLS_405({
            label: "備註",
        }, ...__VLS_functionalComponentArgsRest(__VLS_405));
        __VLS_407.slots.default;
        (__VLS_ctx.bank.note || '—');
        var __VLS_407;
        var __VLS_383;
    }
    else {
        const __VLS_408 = {}.ElEmpty;
        /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
        // @ts-ignore
        const __VLS_409 = __VLS_asFunctionalComponent(__VLS_408, new __VLS_408({
            description: "尚未填寫匯款資料",
        }));
        const __VLS_410 = __VLS_409({
            description: "尚未填寫匯款資料",
        }, ...__VLS_functionalComponentArgsRest(__VLS_409));
    }
    var __VLS_379;
    const __VLS_412 = {}.ElTabPane;
    /** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
    // @ts-ignore
    const __VLS_413 = __VLS_asFunctionalComponent(__VLS_412, new __VLS_412({
        label: "評價",
        name: "rating",
        lazy: true,
    }));
    const __VLS_414 = __VLS_413({
        label: "評價",
        name: "rating",
        lazy: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_413));
    __VLS_415.slots.default;
    const __VLS_416 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    const __VLS_417 = __VLS_asFunctionalComponent(__VLS_416, new __VLS_416({
        data: (__VLS_ctx.ratings),
        border: true,
        emptyText: "尚無評價",
    }));
    const __VLS_418 = __VLS_417({
        data: (__VLS_ctx.ratings),
        border: true,
        emptyText: "尚無評價",
    }, ...__VLS_functionalComponentArgsRest(__VLS_417));
    __VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.tabLoading.rating) }, null, null);
    __VLS_419.slots.default;
    const __VLS_420 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_421 = __VLS_asFunctionalComponent(__VLS_420, new __VLS_420({
        prop: "author",
        label: "評價者",
        width: "120",
    }));
    const __VLS_422 = __VLS_421({
        prop: "author",
        label: "評價者",
        width: "120",
    }, ...__VLS_functionalComponentArgsRest(__VLS_421));
    const __VLS_424 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_425 = __VLS_asFunctionalComponent(__VLS_424, new __VLS_424({
        prop: "stars",
        label: "星等",
        width: "80",
    }));
    const __VLS_426 = __VLS_425({
        prop: "stars",
        label: "星等",
        width: "80",
    }, ...__VLS_functionalComponentArgsRest(__VLS_425));
    const __VLS_428 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_429 = __VLS_asFunctionalComponent(__VLS_428, new __VLS_428({
        prop: "comments",
        label: "評語",
    }));
    const __VLS_430 = __VLS_429({
        prop: "comments",
        label: "評語",
    }, ...__VLS_functionalComponentArgsRest(__VLS_429));
    const __VLS_432 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_433 = __VLS_asFunctionalComponent(__VLS_432, new __VLS_432({
        prop: "createdAt",
        label: "時間",
        width: "180",
    }));
    const __VLS_434 = __VLS_433({
        prop: "createdAt",
        label: "時間",
        width: "180",
    }, ...__VLS_functionalComponentArgsRest(__VLS_433));
    var __VLS_419;
    var __VLS_415;
    var __VLS_23;
    const __VLS_436 = {}.ElDialog;
    /** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
    // @ts-ignore
    const __VLS_437 = __VLS_asFunctionalComponent(__VLS_436, new __VLS_436({
        modelValue: (__VLS_ctx.featureDialog),
        title: (__VLS_ctx.featureEditing ? '編輯特色' : '新增特色'),
        width: "520px",
    }));
    const __VLS_438 = __VLS_437({
        modelValue: (__VLS_ctx.featureDialog),
        title: (__VLS_ctx.featureEditing ? '編輯特色' : '新增特色'),
        width: "520px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_437));
    __VLS_439.slots.default;
    const __VLS_440 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_441 = __VLS_asFunctionalComponent(__VLS_440, new __VLS_440({
        labelWidth: "80px",
    }));
    const __VLS_442 = __VLS_441({
        labelWidth: "80px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_441));
    __VLS_443.slots.default;
    const __VLS_444 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_445 = __VLS_asFunctionalComponent(__VLS_444, new __VLS_444({
        label: "語系",
    }));
    const __VLS_446 = __VLS_445({
        label: "語系",
    }, ...__VLS_functionalComponentArgsRest(__VLS_445));
    __VLS_447.slots.default;
    const __VLS_448 = {}.ElRadioGroup;
    /** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
    // @ts-ignore
    const __VLS_449 = __VLS_asFunctionalComponent(__VLS_448, new __VLS_448({
        modelValue: (__VLS_ctx.featureForm.language),
    }));
    const __VLS_450 = __VLS_449({
        modelValue: (__VLS_ctx.featureForm.language),
    }, ...__VLS_functionalComponentArgsRest(__VLS_449));
    __VLS_451.slots.default;
    const __VLS_452 = {}.ElRadio;
    /** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
    // @ts-ignore
    const __VLS_453 = __VLS_asFunctionalComponent(__VLS_452, new __VLS_452({
        label: "tw",
    }));
    const __VLS_454 = __VLS_453({
        label: "tw",
    }, ...__VLS_functionalComponentArgsRest(__VLS_453));
    __VLS_455.slots.default;
    var __VLS_455;
    const __VLS_456 = {}.ElRadio;
    /** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
    // @ts-ignore
    const __VLS_457 = __VLS_asFunctionalComponent(__VLS_456, new __VLS_456({
        label: "en",
    }));
    const __VLS_458 = __VLS_457({
        label: "en",
    }, ...__VLS_functionalComponentArgsRest(__VLS_457));
    __VLS_459.slots.default;
    var __VLS_459;
    const __VLS_460 = {}.ElRadio;
    /** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
    // @ts-ignore
    const __VLS_461 = __VLS_asFunctionalComponent(__VLS_460, new __VLS_460({
        label: "jp",
    }));
    const __VLS_462 = __VLS_461({
        label: "jp",
    }, ...__VLS_functionalComponentArgsRest(__VLS_461));
    __VLS_463.slots.default;
    var __VLS_463;
    const __VLS_464 = {}.ElRadio;
    /** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
    // @ts-ignore
    const __VLS_465 = __VLS_asFunctionalComponent(__VLS_464, new __VLS_464({
        label: "kr",
    }));
    const __VLS_466 = __VLS_465({
        label: "kr",
    }, ...__VLS_functionalComponentArgsRest(__VLS_465));
    __VLS_467.slots.default;
    var __VLS_467;
    var __VLS_451;
    var __VLS_447;
    const __VLS_468 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_469 = __VLS_asFunctionalComponent(__VLS_468, new __VLS_468({
        label: "類型",
    }));
    const __VLS_470 = __VLS_469({
        label: "類型",
    }, ...__VLS_functionalComponentArgsRest(__VLS_469));
    __VLS_471.slots.default;
    const __VLS_472 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_473 = __VLS_asFunctionalComponent(__VLS_472, new __VLS_472({
        modelValue: (__VLS_ctx.featureForm.featureType),
    }));
    const __VLS_474 = __VLS_473({
        modelValue: (__VLS_ctx.featureForm.featureType),
    }, ...__VLS_functionalComponentArgsRest(__VLS_473));
    __VLS_475.slots.default;
    const __VLS_476 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_477 = __VLS_asFunctionalComponent(__VLS_476, new __VLS_476({
        label: "風格",
        value: "style",
    }));
    const __VLS_478 = __VLS_477({
        label: "風格",
        value: "style",
    }, ...__VLS_functionalComponentArgsRest(__VLS_477));
    const __VLS_480 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_481 = __VLS_asFunctionalComponent(__VLS_480, new __VLS_480({
        label: "服務",
        value: "service",
    }));
    const __VLS_482 = __VLS_481({
        label: "服務",
        value: "service",
    }, ...__VLS_functionalComponentArgsRest(__VLS_481));
    const __VLS_484 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_485 = __VLS_asFunctionalComponent(__VLS_484, new __VLS_484({
        label: "器材",
        value: "equipment",
    }));
    const __VLS_486 = __VLS_485({
        label: "器材",
        value: "equipment",
    }, ...__VLS_functionalComponentArgsRest(__VLS_485));
    var __VLS_475;
    var __VLS_471;
    const __VLS_488 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_489 = __VLS_asFunctionalComponent(__VLS_488, new __VLS_488({
        label: "內容",
    }));
    const __VLS_490 = __VLS_489({
        label: "內容",
    }, ...__VLS_functionalComponentArgsRest(__VLS_489));
    __VLS_491.slots.default;
    const __VLS_492 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_493 = __VLS_asFunctionalComponent(__VLS_492, new __VLS_492({
        modelValue: (__VLS_ctx.featureForm.featureContent),
        type: "textarea",
        rows: (3),
    }));
    const __VLS_494 = __VLS_493({
        modelValue: (__VLS_ctx.featureForm.featureContent),
        type: "textarea",
        rows: (3),
    }, ...__VLS_functionalComponentArgsRest(__VLS_493));
    var __VLS_491;
    const __VLS_496 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_497 = __VLS_asFunctionalComponent(__VLS_496, new __VLS_496({
        label: "啟用",
    }));
    const __VLS_498 = __VLS_497({
        label: "啟用",
    }, ...__VLS_functionalComponentArgsRest(__VLS_497));
    __VLS_499.slots.default;
    const __VLS_500 = {}.ElSwitch;
    /** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
    // @ts-ignore
    const __VLS_501 = __VLS_asFunctionalComponent(__VLS_500, new __VLS_500({
        modelValue: (__VLS_ctx.featureForm.enable),
        activeValue: "Y",
        inactiveValue: "N",
    }));
    const __VLS_502 = __VLS_501({
        modelValue: (__VLS_ctx.featureForm.enable),
        activeValue: "Y",
        inactiveValue: "N",
    }, ...__VLS_functionalComponentArgsRest(__VLS_501));
    var __VLS_499;
    var __VLS_443;
    {
        const { footer: __VLS_thisSlot } = __VLS_439.slots;
        const __VLS_504 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_505 = __VLS_asFunctionalComponent(__VLS_504, new __VLS_504({
            ...{ 'onClick': {} },
        }));
        const __VLS_506 = __VLS_505({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_505));
        let __VLS_508;
        let __VLS_509;
        let __VLS_510;
        const __VLS_511 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.provider))
                    return;
                __VLS_ctx.featureDialog = false;
            }
        };
        __VLS_507.slots.default;
        var __VLS_507;
        const __VLS_512 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_513 = __VLS_asFunctionalComponent(__VLS_512, new __VLS_512({
            ...{ 'onClick': {} },
            type: "primary",
        }));
        const __VLS_514 = __VLS_513({
            ...{ 'onClick': {} },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_513));
        let __VLS_516;
        let __VLS_517;
        let __VLS_518;
        const __VLS_519 = {
            onClick: (__VLS_ctx.saveFeature)
        };
        __VLS_515.slots.default;
        var __VLS_515;
    }
    var __VLS_439;
}
else {
    const __VLS_520 = {}.ElEmpty;
    /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
    // @ts-ignore
    const __VLS_521 = __VLS_asFunctionalComponent(__VLS_520, new __VLS_520({
        description: "載入中或找不到攝影師",
    }));
    const __VLS_522 = __VLS_521({
        description: "載入中或找不到攝影師",
    }, ...__VLS_functionalComponentArgsRest(__VLS_521));
    var __VLS_524 = {};
    var __VLS_523;
}
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['w-48']} */ ;
/** @type {__VLS_StyleScopedClasses['h-24']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-4']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['aspect-square']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-1']} */ ;
/** @type {__VLS_StyleScopedClasses['right-1']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-0']} */ ;
/** @type {__VLS_StyleScopedClasses['group-hover:opacity-100']} */ ;
/** @type {__VLS_StyleScopedClasses['col-span-full']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            provider: provider,
            activeTab: activeTab,
            basicForm: basicForm,
            savingBasic: savingBasic,
            cities: cities,
            districts: districts,
            serviceTypeOptions: serviceTypeOptions,
            schedule: schedule,
            serviceAreas: serviceAreas,
            bank: bank,
            features: features,
            works: works,
            ratings: ratings,
            ratingSummary: ratingSummary,
            tabLoading: tabLoading,
            featureDialog: featureDialog,
            featureEditing: featureEditing,
            featureForm: featureForm,
            publicProfileUrl: publicProfileUrl,
            workImageUrl: workImageUrl,
            onCityChange: onCityChange,
            saveBasic: saveBasic,
            uploadAvatar: uploadAvatar,
            uploadBanner: uploadBanner,
            openAddFeature: openAddFeature,
            editFeature: editFeature,
            saveFeature: saveFeature,
            removeFeature: removeFeature,
            uploadWork: uploadWork,
            removeWork: removeWork,
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