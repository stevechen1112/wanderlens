/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Fold, User, List, ChatDotRound, Bell, Upload, Money, Calendar, Document, ArrowRight } from '@element-plus/icons-vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import WlLangSwitcher from '@/components/WlLangSwitcher.vue';
import WlSkipLink from '@/components/WlSkipLink.vue';
const { t } = useI18n();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const isCollapse = ref(false);
const sidebarWidth = computed(() => (isCollapse.value ? '64px' : '200px'));
const workspaceLabel = computed(() => authStore.isStylist ? t('workspace.stylist') : t('workspace.photographer'));
const PAGE_TITLES = {
    '/account': 'nav.account',
    '/my-order': 'nav.myOrder',
    '/raw-upload': 'nav.rawUpload',
    '/stylist-schedule': 'nav.stylistSchedule',
    '/earnings': 'nav.earnings',
    '/conversations': 'nav.conversations',
    '/notifications': 'nav.notifications',
    '/terms': 'nav.terms',
    '/profile': 'nav.profile',
    '/change-password': 'nav.changePassword',
};
const currentPageTitle = computed(() => {
    const path = route.path;
    const key = PAGE_TITLES[path];
    if (key)
        return t(key);
    if (path.startsWith('/my-order/'))
        return t('nav.orderDetail');
    if (path.startsWith('/conversations/'))
        return t('nav.conversationRoom');
    return '';
});
const toggleSidebar = () => {
    isCollapse.value = !isCollapse.value;
};
const syncSidebarForViewport = () => {
    if (typeof window !== 'undefined') {
        isCollapse.value = window.innerWidth < 768;
    }
};
onMounted(() => {
    syncSidebarForViewport();
    window.addEventListener('resize', syncSidebarForViewport);
});
onUnmounted(() => {
    window.removeEventListener('resize', syncSidebarForViewport);
});
const logout = () => {
    authStore.clearAuth();
    router.push('/login');
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {[typeof WlSkipLink, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(WlSkipLink, new WlSkipLink({}));
const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
const __VLS_3 = {}.ElContainer;
/** @type {[typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, ]} */ ;
// @ts-ignore
const __VLS_4 = __VLS_asFunctionalComponent(__VLS_3, new __VLS_3({
    ...{ class: "h-screen" },
}));
const __VLS_5 = __VLS_4({
    ...{ class: "h-screen" },
}, ...__VLS_functionalComponentArgsRest(__VLS_4));
__VLS_6.slots.default;
const __VLS_7 = {}.ElHeader;
/** @type {[typeof __VLS_components.ElHeader, typeof __VLS_components.elHeader, typeof __VLS_components.ElHeader, typeof __VLS_components.elHeader, ]} */ ;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({
    ...{ class: "flex items-center justify-between bg-white border-b" },
    ...{ style: {} },
    role: "banner",
}));
const __VLS_9 = __VLS_8({
    ...{ class: "flex items-center justify-between bg-white border-b" },
    ...{ style: {} },
    role: "banner",
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
__VLS_10.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center gap-3" },
});
const __VLS_11 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.Fold),
    text: true,
    'aria-label': (__VLS_ctx.t('a11y.toggleSidebar')),
    dataTestid: "sidebar-toggle",
}));
const __VLS_13 = __VLS_12({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.Fold),
    text: true,
    'aria-label': (__VLS_ctx.t('a11y.toggleSidebar')),
    dataTestid: "sidebar-toggle",
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
let __VLS_15;
let __VLS_16;
let __VLS_17;
const __VLS_18 = {
    onClick: (__VLS_ctx.toggleSidebar)
};
var __VLS_14;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-lg font-bold" },
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-sm text-gray-500" },
});
(__VLS_ctx.workspaceLabel);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center gap-3" },
});
/** @type {[typeof WlLangSwitcher, ]} */ ;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent(WlLangSwitcher, new WlLangSwitcher({}));
const __VLS_20 = __VLS_19({}, ...__VLS_functionalComponentArgsRest(__VLS_19));
const __VLS_22 = {}.ElDropdown;
/** @type {[typeof __VLS_components.ElDropdown, typeof __VLS_components.elDropdown, typeof __VLS_components.ElDropdown, typeof __VLS_components.elDropdown, ]} */ ;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent(__VLS_22, new __VLS_22({
    trigger: "click",
}));
const __VLS_24 = __VLS_23({
    trigger: "click",
}, ...__VLS_functionalComponentArgsRest(__VLS_23));
__VLS_25.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    type: "button",
    ...{ class: "flex items-center gap-2 cursor-pointer border-0 bg-transparent p-0" },
    'aria-label': (__VLS_ctx.t('a11y.userMenu')),
});
const __VLS_26 = {}.ElAvatar;
/** @type {[typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, ]} */ ;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({
    size: (32),
    src: (__VLS_ctx.authStore.avatar),
}));
const __VLS_28 = __VLS_27({
    size: (32),
    src: (__VLS_ctx.authStore.avatar),
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-sm" },
});
(__VLS_ctx.authStore.username);
{
    const { dropdown: __VLS_thisSlot } = __VLS_25.slots;
    const __VLS_30 = {}.ElDropdownMenu;
    /** @type {[typeof __VLS_components.ElDropdownMenu, typeof __VLS_components.elDropdownMenu, typeof __VLS_components.ElDropdownMenu, typeof __VLS_components.elDropdownMenu, ]} */ ;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({}));
    const __VLS_32 = __VLS_31({}, ...__VLS_functionalComponentArgsRest(__VLS_31));
    __VLS_33.slots.default;
    const __VLS_34 = {}.ElDropdownItem;
    /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
    // @ts-ignore
    const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({
        ...{ 'onClick': {} },
    }));
    const __VLS_36 = __VLS_35({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_35));
    let __VLS_38;
    let __VLS_39;
    let __VLS_40;
    const __VLS_41 = {
        onClick: (...[$event]) => {
            __VLS_ctx.$router.push('/profile');
        }
    };
    __VLS_37.slots.default;
    (__VLS_ctx.t('nav.profile'));
    var __VLS_37;
    const __VLS_42 = {}.ElDropdownItem;
    /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
    // @ts-ignore
    const __VLS_43 = __VLS_asFunctionalComponent(__VLS_42, new __VLS_42({
        ...{ 'onClick': {} },
    }));
    const __VLS_44 = __VLS_43({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_43));
    let __VLS_46;
    let __VLS_47;
    let __VLS_48;
    const __VLS_49 = {
        onClick: (...[$event]) => {
            __VLS_ctx.$router.push('/change-password');
        }
    };
    __VLS_45.slots.default;
    (__VLS_ctx.t('nav.changePassword'));
    var __VLS_45;
    const __VLS_50 = {}.ElDropdownItem;
    /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
    // @ts-ignore
    const __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({
        ...{ 'onClick': {} },
        divided: true,
    }));
    const __VLS_52 = __VLS_51({
        ...{ 'onClick': {} },
        divided: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_51));
    let __VLS_54;
    let __VLS_55;
    let __VLS_56;
    const __VLS_57 = {
        onClick: (__VLS_ctx.logout)
    };
    __VLS_53.slots.default;
    (__VLS_ctx.t('nav.logout'));
    var __VLS_53;
    var __VLS_33;
}
var __VLS_25;
var __VLS_10;
const __VLS_58 = {}.ElContainer;
/** @type {[typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, ]} */ ;
// @ts-ignore
const __VLS_59 = __VLS_asFunctionalComponent(__VLS_58, new __VLS_58({}));
const __VLS_60 = __VLS_59({}, ...__VLS_functionalComponentArgsRest(__VLS_59));
__VLS_61.slots.default;
const __VLS_62 = {}.ElAside;
/** @type {[typeof __VLS_components.ElAside, typeof __VLS_components.elAside, typeof __VLS_components.ElAside, typeof __VLS_components.elAside, ]} */ ;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent(__VLS_62, new __VLS_62({
    width: (__VLS_ctx.sidebarWidth),
    ...{ class: "sidebar" },
    role: "navigation",
    'aria-label': (__VLS_ctx.t('a11y.mainNav')),
}));
const __VLS_64 = __VLS_63({
    width: (__VLS_ctx.sidebarWidth),
    ...{ class: "sidebar" },
    role: "navigation",
    'aria-label': (__VLS_ctx.t('a11y.mainNav')),
}, ...__VLS_functionalComponentArgsRest(__VLS_63));
__VLS_65.slots.default;
const __VLS_66 = {}.ElMenu;
/** @type {[typeof __VLS_components.ElMenu, typeof __VLS_components.elMenu, typeof __VLS_components.ElMenu, typeof __VLS_components.elMenu, ]} */ ;
// @ts-ignore
const __VLS_67 = __VLS_asFunctionalComponent(__VLS_66, new __VLS_66({
    defaultActive: (__VLS_ctx.$route.path),
    router: true,
    collapse: (__VLS_ctx.isCollapse),
}));
const __VLS_68 = __VLS_67({
    defaultActive: (__VLS_ctx.$route.path),
    router: true,
    collapse: (__VLS_ctx.isCollapse),
}, ...__VLS_functionalComponentArgsRest(__VLS_67));
__VLS_69.slots.default;
const __VLS_70 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_71 = __VLS_asFunctionalComponent(__VLS_70, new __VLS_70({
    index: "/account",
}));
const __VLS_72 = __VLS_71({
    index: "/account",
}, ...__VLS_functionalComponentArgsRest(__VLS_71));
__VLS_73.slots.default;
const __VLS_74 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_75 = __VLS_asFunctionalComponent(__VLS_74, new __VLS_74({}));
const __VLS_76 = __VLS_75({}, ...__VLS_functionalComponentArgsRest(__VLS_75));
__VLS_77.slots.default;
const __VLS_78 = {}.User;
/** @type {[typeof __VLS_components.User, ]} */ ;
// @ts-ignore
const __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({}));
const __VLS_80 = __VLS_79({}, ...__VLS_functionalComponentArgsRest(__VLS_79));
var __VLS_77;
{
    const { title: __VLS_thisSlot } = __VLS_73.slots;
    (__VLS_ctx.authStore.isStylist ? __VLS_ctx.t('nav.stylistAccount') : __VLS_ctx.t('nav.account'));
}
var __VLS_73;
const __VLS_82 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_83 = __VLS_asFunctionalComponent(__VLS_82, new __VLS_82({
    index: "/my-order",
}));
const __VLS_84 = __VLS_83({
    index: "/my-order",
}, ...__VLS_functionalComponentArgsRest(__VLS_83));
__VLS_85.slots.default;
const __VLS_86 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_87 = __VLS_asFunctionalComponent(__VLS_86, new __VLS_86({}));
const __VLS_88 = __VLS_87({}, ...__VLS_functionalComponentArgsRest(__VLS_87));
__VLS_89.slots.default;
const __VLS_90 = {}.List;
/** @type {[typeof __VLS_components.List, ]} */ ;
// @ts-ignore
const __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({}));
const __VLS_92 = __VLS_91({}, ...__VLS_functionalComponentArgsRest(__VLS_91));
var __VLS_89;
{
    const { title: __VLS_thisSlot } = __VLS_85.slots;
    (__VLS_ctx.t('nav.myOrder'));
}
var __VLS_85;
if (__VLS_ctx.authStore.isPhotographer) {
    const __VLS_94 = {}.ElMenuItem;
    /** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
    // @ts-ignore
    const __VLS_95 = __VLS_asFunctionalComponent(__VLS_94, new __VLS_94({
        index: "/raw-upload",
    }));
    const __VLS_96 = __VLS_95({
        index: "/raw-upload",
    }, ...__VLS_functionalComponentArgsRest(__VLS_95));
    __VLS_97.slots.default;
    const __VLS_98 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_99 = __VLS_asFunctionalComponent(__VLS_98, new __VLS_98({}));
    const __VLS_100 = __VLS_99({}, ...__VLS_functionalComponentArgsRest(__VLS_99));
    __VLS_101.slots.default;
    const __VLS_102 = {}.Upload;
    /** @type {[typeof __VLS_components.Upload, ]} */ ;
    // @ts-ignore
    const __VLS_103 = __VLS_asFunctionalComponent(__VLS_102, new __VLS_102({}));
    const __VLS_104 = __VLS_103({}, ...__VLS_functionalComponentArgsRest(__VLS_103));
    var __VLS_101;
    {
        const { title: __VLS_thisSlot } = __VLS_97.slots;
        (__VLS_ctx.t('nav.rawUpload'));
    }
    var __VLS_97;
}
if (__VLS_ctx.authStore.isStylist) {
    const __VLS_106 = {}.ElMenuItem;
    /** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
    // @ts-ignore
    const __VLS_107 = __VLS_asFunctionalComponent(__VLS_106, new __VLS_106({
        index: "/stylist-schedule",
    }));
    const __VLS_108 = __VLS_107({
        index: "/stylist-schedule",
    }, ...__VLS_functionalComponentArgsRest(__VLS_107));
    __VLS_109.slots.default;
    const __VLS_110 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_111 = __VLS_asFunctionalComponent(__VLS_110, new __VLS_110({}));
    const __VLS_112 = __VLS_111({}, ...__VLS_functionalComponentArgsRest(__VLS_111));
    __VLS_113.slots.default;
    const __VLS_114 = {}.Calendar;
    /** @type {[typeof __VLS_components.Calendar, ]} */ ;
    // @ts-ignore
    const __VLS_115 = __VLS_asFunctionalComponent(__VLS_114, new __VLS_114({}));
    const __VLS_116 = __VLS_115({}, ...__VLS_functionalComponentArgsRest(__VLS_115));
    var __VLS_113;
    {
        const { title: __VLS_thisSlot } = __VLS_109.slots;
        (__VLS_ctx.t('nav.stylistSchedule'));
    }
    var __VLS_109;
}
const __VLS_118 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_119 = __VLS_asFunctionalComponent(__VLS_118, new __VLS_118({
    index: "/earnings",
}));
const __VLS_120 = __VLS_119({
    index: "/earnings",
}, ...__VLS_functionalComponentArgsRest(__VLS_119));
__VLS_121.slots.default;
const __VLS_122 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_123 = __VLS_asFunctionalComponent(__VLS_122, new __VLS_122({}));
const __VLS_124 = __VLS_123({}, ...__VLS_functionalComponentArgsRest(__VLS_123));
__VLS_125.slots.default;
const __VLS_126 = {}.Money;
/** @type {[typeof __VLS_components.Money, ]} */ ;
// @ts-ignore
const __VLS_127 = __VLS_asFunctionalComponent(__VLS_126, new __VLS_126({}));
const __VLS_128 = __VLS_127({}, ...__VLS_functionalComponentArgsRest(__VLS_127));
var __VLS_125;
{
    const { title: __VLS_thisSlot } = __VLS_121.slots;
    (__VLS_ctx.t('nav.earnings'));
}
var __VLS_121;
const __VLS_130 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_131 = __VLS_asFunctionalComponent(__VLS_130, new __VLS_130({
    index: "/conversations",
}));
const __VLS_132 = __VLS_131({
    index: "/conversations",
}, ...__VLS_functionalComponentArgsRest(__VLS_131));
__VLS_133.slots.default;
const __VLS_134 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_135 = __VLS_asFunctionalComponent(__VLS_134, new __VLS_134({}));
const __VLS_136 = __VLS_135({}, ...__VLS_functionalComponentArgsRest(__VLS_135));
__VLS_137.slots.default;
const __VLS_138 = {}.ChatDotRound;
/** @type {[typeof __VLS_components.ChatDotRound, ]} */ ;
// @ts-ignore
const __VLS_139 = __VLS_asFunctionalComponent(__VLS_138, new __VLS_138({}));
const __VLS_140 = __VLS_139({}, ...__VLS_functionalComponentArgsRest(__VLS_139));
var __VLS_137;
{
    const { title: __VLS_thisSlot } = __VLS_133.slots;
    (__VLS_ctx.t('nav.conversations'));
}
var __VLS_133;
const __VLS_142 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_143 = __VLS_asFunctionalComponent(__VLS_142, new __VLS_142({
    index: "/notifications",
}));
const __VLS_144 = __VLS_143({
    index: "/notifications",
}, ...__VLS_functionalComponentArgsRest(__VLS_143));
__VLS_145.slots.default;
const __VLS_146 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_147 = __VLS_asFunctionalComponent(__VLS_146, new __VLS_146({}));
const __VLS_148 = __VLS_147({}, ...__VLS_functionalComponentArgsRest(__VLS_147));
__VLS_149.slots.default;
const __VLS_150 = {}.Bell;
/** @type {[typeof __VLS_components.Bell, ]} */ ;
// @ts-ignore
const __VLS_151 = __VLS_asFunctionalComponent(__VLS_150, new __VLS_150({}));
const __VLS_152 = __VLS_151({}, ...__VLS_functionalComponentArgsRest(__VLS_151));
var __VLS_149;
{
    const { title: __VLS_thisSlot } = __VLS_145.slots;
    (__VLS_ctx.t('nav.notifications'));
}
var __VLS_145;
const __VLS_154 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_155 = __VLS_asFunctionalComponent(__VLS_154, new __VLS_154({
    index: "/terms",
}));
const __VLS_156 = __VLS_155({
    index: "/terms",
}, ...__VLS_functionalComponentArgsRest(__VLS_155));
__VLS_157.slots.default;
const __VLS_158 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_159 = __VLS_asFunctionalComponent(__VLS_158, new __VLS_158({}));
const __VLS_160 = __VLS_159({}, ...__VLS_functionalComponentArgsRest(__VLS_159));
__VLS_161.slots.default;
const __VLS_162 = {}.Document;
/** @type {[typeof __VLS_components.Document, ]} */ ;
// @ts-ignore
const __VLS_163 = __VLS_asFunctionalComponent(__VLS_162, new __VLS_162({}));
const __VLS_164 = __VLS_163({}, ...__VLS_functionalComponentArgsRest(__VLS_163));
var __VLS_161;
{
    const { title: __VLS_thisSlot } = __VLS_157.slots;
    (__VLS_ctx.t('nav.terms'));
}
var __VLS_157;
var __VLS_69;
var __VLS_65;
const __VLS_166 = {}.ElContainer;
/** @type {[typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, ]} */ ;
// @ts-ignore
const __VLS_167 = __VLS_asFunctionalComponent(__VLS_166, new __VLS_166({}));
const __VLS_168 = __VLS_167({}, ...__VLS_functionalComponentArgsRest(__VLS_167));
__VLS_169.slots.default;
const __VLS_170 = {}.ElMain;
/** @type {[typeof __VLS_components.ElMain, typeof __VLS_components.elMain, typeof __VLS_components.ElMain, typeof __VLS_components.elMain, ]} */ ;
// @ts-ignore
const __VLS_171 = __VLS_asFunctionalComponent(__VLS_170, new __VLS_170({
    id: "main-content",
    ...{ class: "bg-gray-50" },
    role: "main",
    tabindex: "-1",
}));
const __VLS_172 = __VLS_171({
    id: "main-content",
    ...{ class: "bg-gray-50" },
    role: "main",
    tabindex: "-1",
}, ...__VLS_functionalComponentArgsRest(__VLS_171));
__VLS_173.slots.default;
const __VLS_174 = {}.ElBreadcrumb;
/** @type {[typeof __VLS_components.ElBreadcrumb, typeof __VLS_components.elBreadcrumb, typeof __VLS_components.ElBreadcrumb, typeof __VLS_components.elBreadcrumb, ]} */ ;
// @ts-ignore
const __VLS_175 = __VLS_asFunctionalComponent(__VLS_174, new __VLS_174({
    separatorIcon: (__VLS_ctx.ArrowRight),
    ...{ class: "mb-4" },
}));
const __VLS_176 = __VLS_175({
    separatorIcon: (__VLS_ctx.ArrowRight),
    ...{ class: "mb-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_175));
__VLS_177.slots.default;
const __VLS_178 = {}.ElBreadcrumbItem;
/** @type {[typeof __VLS_components.ElBreadcrumbItem, typeof __VLS_components.elBreadcrumbItem, typeof __VLS_components.ElBreadcrumbItem, typeof __VLS_components.elBreadcrumbItem, ]} */ ;
// @ts-ignore
const __VLS_179 = __VLS_asFunctionalComponent(__VLS_178, new __VLS_178({
    to: ({ path: '/account' }),
}));
const __VLS_180 = __VLS_179({
    to: ({ path: '/account' }),
}, ...__VLS_functionalComponentArgsRest(__VLS_179));
__VLS_181.slots.default;
(__VLS_ctx.t('nav.home'));
var __VLS_181;
const __VLS_182 = {}.ElBreadcrumbItem;
/** @type {[typeof __VLS_components.ElBreadcrumbItem, typeof __VLS_components.elBreadcrumbItem, typeof __VLS_components.ElBreadcrumbItem, typeof __VLS_components.elBreadcrumbItem, ]} */ ;
// @ts-ignore
const __VLS_183 = __VLS_asFunctionalComponent(__VLS_182, new __VLS_182({}));
const __VLS_184 = __VLS_183({}, ...__VLS_functionalComponentArgsRest(__VLS_183));
__VLS_185.slots.default;
(__VLS_ctx.currentPageTitle);
var __VLS_185;
var __VLS_177;
const __VLS_186 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, typeof __VLS_components.routerView, typeof __VLS_components.RouterView, typeof __VLS_components.routerView, ]} */ ;
// @ts-ignore
const __VLS_187 = __VLS_asFunctionalComponent(__VLS_186, new __VLS_186({}));
const __VLS_188 = __VLS_187({}, ...__VLS_functionalComponentArgsRest(__VLS_187));
{
    const { default: __VLS_thisSlot } = __VLS_189.slots;
    const [{ Component }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_190 = {}.transition;
    /** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
    // @ts-ignore
    const __VLS_191 = __VLS_asFunctionalComponent(__VLS_190, new __VLS_190({
        name: "fade-transform",
        mode: "out-in",
    }));
    const __VLS_192 = __VLS_191({
        name: "fade-transform",
        mode: "out-in",
    }, ...__VLS_functionalComponentArgsRest(__VLS_191));
    __VLS_193.slots.default;
    const __VLS_194 = ((Component));
    // @ts-ignore
    const __VLS_195 = __VLS_asFunctionalComponent(__VLS_194, new __VLS_194({}));
    const __VLS_196 = __VLS_195({}, ...__VLS_functionalComponentArgsRest(__VLS_195));
    var __VLS_193;
    __VLS_189.slots['' /* empty slot name completion */];
}
var __VLS_189;
var __VLS_173;
const __VLS_198 = {}.ElFooter;
/** @type {[typeof __VLS_components.ElFooter, typeof __VLS_components.elFooter, typeof __VLS_components.ElFooter, typeof __VLS_components.elFooter, ]} */ ;
// @ts-ignore
const __VLS_199 = __VLS_asFunctionalComponent(__VLS_198, new __VLS_198({
    ...{ class: "text-center text-xs text-gray-400" },
    ...{ style: {} },
}));
const __VLS_200 = __VLS_199({
    ...{ class: "text-center text-xs text-gray-400" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_199));
__VLS_201.slots.default;
var __VLS_201;
var __VLS_169;
var __VLS_61;
var __VLS_6;
/** @type {__VLS_StyleScopedClasses['h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['border-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Fold: Fold,
            User: User,
            List: List,
            ChatDotRound: ChatDotRound,
            Bell: Bell,
            Upload: Upload,
            Money: Money,
            Calendar: Calendar,
            Document: Document,
            ArrowRight: ArrowRight,
            WlLangSwitcher: WlLangSwitcher,
            WlSkipLink: WlSkipLink,
            t: t,
            authStore: authStore,
            isCollapse: isCollapse,
            sidebarWidth: sidebarWidth,
            workspaceLabel: workspaceLabel,
            currentPageTitle: currentPageTitle,
            toggleSidebar: toggleSidebar,
            logout: logout,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=DefaultLayout.vue.js.map