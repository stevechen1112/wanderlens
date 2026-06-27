/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted, onUnmounted } from 'vue';
import { Fold, DataAnalysis, User, Camera, UserFilled, Document, Picture, Money, Service, Ticket, Files, Setting, TrendCharts, Bell } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import WlLangSwitcher from '@/components/WlLangSwitcher.vue';
import WlSkipLink from '@/components/WlSkipLink.vue';
const { t } = useI18n();
const authStore = useAuthStore();
const router = useRouter();
const isCollapse = ref(false);
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
    onClick: (...[$event]) => {
        __VLS_ctx.isCollapse = !__VLS_ctx.isCollapse;
    }
};
var __VLS_14;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-lg font-bold" },
    ...{ style: {} },
});
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
    width: (__VLS_ctx.isCollapse ? '64px' : '220px'),
    ...{ class: "sidebar" },
    role: "navigation",
    'aria-label': (__VLS_ctx.t('a11y.mainNav')),
}));
const __VLS_64 = __VLS_63({
    width: (__VLS_ctx.isCollapse ? '64px' : '220px'),
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
    index: "/dashboard",
}));
const __VLS_72 = __VLS_71({
    index: "/dashboard",
}, ...__VLS_functionalComponentArgsRest(__VLS_71));
__VLS_73.slots.default;
const __VLS_74 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_75 = __VLS_asFunctionalComponent(__VLS_74, new __VLS_74({}));
const __VLS_76 = __VLS_75({}, ...__VLS_functionalComponentArgsRest(__VLS_75));
__VLS_77.slots.default;
const __VLS_78 = {}.DataAnalysis;
/** @type {[typeof __VLS_components.DataAnalysis, ]} */ ;
// @ts-ignore
const __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({}));
const __VLS_80 = __VLS_79({}, ...__VLS_functionalComponentArgsRest(__VLS_79));
var __VLS_77;
{
    const { title: __VLS_thisSlot } = __VLS_73.slots;
    (__VLS_ctx.t('nav.dashboard'));
}
var __VLS_73;
const __VLS_82 = {}.ElSubMenu;
/** @type {[typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, ]} */ ;
// @ts-ignore
const __VLS_83 = __VLS_asFunctionalComponent(__VLS_82, new __VLS_82({
    index: "users-group",
}));
const __VLS_84 = __VLS_83({
    index: "users-group",
}, ...__VLS_functionalComponentArgsRest(__VLS_83));
__VLS_85.slots.default;
{
    const { title: __VLS_thisSlot } = __VLS_85.slots;
    const __VLS_86 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_87 = __VLS_asFunctionalComponent(__VLS_86, new __VLS_86({}));
    const __VLS_88 = __VLS_87({}, ...__VLS_functionalComponentArgsRest(__VLS_87));
    __VLS_89.slots.default;
    const __VLS_90 = {}.User;
    /** @type {[typeof __VLS_components.User, ]} */ ;
    // @ts-ignore
    const __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({}));
    const __VLS_92 = __VLS_91({}, ...__VLS_functionalComponentArgsRest(__VLS_91));
    var __VLS_89;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.t('nav.usersGroup'));
}
const __VLS_94 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_95 = __VLS_asFunctionalComponent(__VLS_94, new __VLS_94({
    index: "/users",
}));
const __VLS_96 = __VLS_95({
    index: "/users",
}, ...__VLS_functionalComponentArgsRest(__VLS_95));
__VLS_97.slots.default;
(__VLS_ctx.t('nav.users'));
var __VLS_97;
const __VLS_98 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_99 = __VLS_asFunctionalComponent(__VLS_98, new __VLS_98({
    index: "/roles",
}));
const __VLS_100 = __VLS_99({
    index: "/roles",
}, ...__VLS_functionalComponentArgsRest(__VLS_99));
__VLS_101.slots.default;
(__VLS_ctx.t('nav.roles'));
var __VLS_101;
const __VLS_102 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_103 = __VLS_asFunctionalComponent(__VLS_102, new __VLS_102({
    index: "/menus",
}));
const __VLS_104 = __VLS_103({
    index: "/menus",
}, ...__VLS_functionalComponentArgsRest(__VLS_103));
__VLS_105.slots.default;
(__VLS_ctx.t('nav.menus'));
var __VLS_105;
var __VLS_85;
const __VLS_106 = {}.ElSubMenu;
/** @type {[typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, ]} */ ;
// @ts-ignore
const __VLS_107 = __VLS_asFunctionalComponent(__VLS_106, new __VLS_106({
    index: "provider-group",
}));
const __VLS_108 = __VLS_107({
    index: "provider-group",
}, ...__VLS_functionalComponentArgsRest(__VLS_107));
__VLS_109.slots.default;
{
    const { title: __VLS_thisSlot } = __VLS_109.slots;
    const __VLS_110 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_111 = __VLS_asFunctionalComponent(__VLS_110, new __VLS_110({}));
    const __VLS_112 = __VLS_111({}, ...__VLS_functionalComponentArgsRest(__VLS_111));
    __VLS_113.slots.default;
    const __VLS_114 = {}.Camera;
    /** @type {[typeof __VLS_components.Camera, ]} */ ;
    // @ts-ignore
    const __VLS_115 = __VLS_asFunctionalComponent(__VLS_114, new __VLS_114({}));
    const __VLS_116 = __VLS_115({}, ...__VLS_functionalComponentArgsRest(__VLS_115));
    var __VLS_113;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.t('nav.providerGroup'));
}
const __VLS_118 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_119 = __VLS_asFunctionalComponent(__VLS_118, new __VLS_118({
    index: "/photographers",
}));
const __VLS_120 = __VLS_119({
    index: "/photographers",
}, ...__VLS_functionalComponentArgsRest(__VLS_119));
__VLS_121.slots.default;
(__VLS_ctx.t('nav.photographers'));
var __VLS_121;
const __VLS_122 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_123 = __VLS_asFunctionalComponent(__VLS_122, new __VLS_122({
    index: "/photographers/dashboard",
}));
const __VLS_124 = __VLS_123({
    index: "/photographers/dashboard",
}, ...__VLS_functionalComponentArgsRest(__VLS_123));
__VLS_125.slots.default;
(__VLS_ctx.t('nav.scheduleDashboard'));
var __VLS_125;
const __VLS_126 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_127 = __VLS_asFunctionalComponent(__VLS_126, new __VLS_126({
    index: "/photographers/broadcast",
}));
const __VLS_128 = __VLS_127({
    index: "/photographers/broadcast",
}, ...__VLS_functionalComponentArgsRest(__VLS_127));
__VLS_129.slots.default;
(__VLS_ctx.t('nav.lineBroadcast'));
var __VLS_129;
var __VLS_109;
const __VLS_130 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_131 = __VLS_asFunctionalComponent(__VLS_130, new __VLS_130({
    index: "/customers",
}));
const __VLS_132 = __VLS_131({
    index: "/customers",
}, ...__VLS_functionalComponentArgsRest(__VLS_131));
__VLS_133.slots.default;
const __VLS_134 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_135 = __VLS_asFunctionalComponent(__VLS_134, new __VLS_134({}));
const __VLS_136 = __VLS_135({}, ...__VLS_functionalComponentArgsRest(__VLS_135));
__VLS_137.slots.default;
const __VLS_138 = {}.UserFilled;
/** @type {[typeof __VLS_components.UserFilled, ]} */ ;
// @ts-ignore
const __VLS_139 = __VLS_asFunctionalComponent(__VLS_138, new __VLS_138({}));
const __VLS_140 = __VLS_139({}, ...__VLS_functionalComponentArgsRest(__VLS_139));
var __VLS_137;
{
    const { title: __VLS_thisSlot } = __VLS_133.slots;
    (__VLS_ctx.t('nav.customers'));
}
var __VLS_133;
const __VLS_142 = {}.ElSubMenu;
/** @type {[typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, ]} */ ;
// @ts-ignore
const __VLS_143 = __VLS_asFunctionalComponent(__VLS_142, new __VLS_142({
    index: "order-group",
}));
const __VLS_144 = __VLS_143({
    index: "order-group",
}, ...__VLS_functionalComponentArgsRest(__VLS_143));
__VLS_145.slots.default;
{
    const { title: __VLS_thisSlot } = __VLS_145.slots;
    const __VLS_146 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_147 = __VLS_asFunctionalComponent(__VLS_146, new __VLS_146({}));
    const __VLS_148 = __VLS_147({}, ...__VLS_functionalComponentArgsRest(__VLS_147));
    __VLS_149.slots.default;
    const __VLS_150 = {}.Document;
    /** @type {[typeof __VLS_components.Document, ]} */ ;
    // @ts-ignore
    const __VLS_151 = __VLS_asFunctionalComponent(__VLS_150, new __VLS_150({}));
    const __VLS_152 = __VLS_151({}, ...__VLS_functionalComponentArgsRest(__VLS_151));
    var __VLS_149;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.t('nav.orderGroup'));
}
const __VLS_154 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_155 = __VLS_asFunctionalComponent(__VLS_154, new __VLS_154({
    index: "/orders",
}));
const __VLS_156 = __VLS_155({
    index: "/orders",
}, ...__VLS_functionalComponentArgsRest(__VLS_155));
__VLS_157.slots.default;
(__VLS_ctx.t('nav.orders'));
var __VLS_157;
const __VLS_158 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_159 = __VLS_asFunctionalComponent(__VLS_158, new __VLS_158({
    index: "/match/monitor",
}));
const __VLS_160 = __VLS_159({
    index: "/match/monitor",
}, ...__VLS_functionalComponentArgsRest(__VLS_159));
__VLS_161.slots.default;
(__VLS_ctx.t('nav.matchMonitor'));
var __VLS_161;
var __VLS_145;
const __VLS_162 = {}.ElSubMenu;
/** @type {[typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, ]} */ ;
// @ts-ignore
const __VLS_163 = __VLS_asFunctionalComponent(__VLS_162, new __VLS_162({
    index: "media-group",
}));
const __VLS_164 = __VLS_163({
    index: "media-group",
}, ...__VLS_functionalComponentArgsRest(__VLS_163));
__VLS_165.slots.default;
{
    const { title: __VLS_thisSlot } = __VLS_165.slots;
    const __VLS_166 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_167 = __VLS_asFunctionalComponent(__VLS_166, new __VLS_166({}));
    const __VLS_168 = __VLS_167({}, ...__VLS_functionalComponentArgsRest(__VLS_167));
    __VLS_169.slots.default;
    const __VLS_170 = {}.Picture;
    /** @type {[typeof __VLS_components.Picture, ]} */ ;
    // @ts-ignore
    const __VLS_171 = __VLS_asFunctionalComponent(__VLS_170, new __VLS_170({}));
    const __VLS_172 = __VLS_171({}, ...__VLS_functionalComponentArgsRest(__VLS_171));
    var __VLS_169;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.t('nav.mediaGroup'));
}
const __VLS_174 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_175 = __VLS_asFunctionalComponent(__VLS_174, new __VLS_174({
    index: "/media/verify",
}));
const __VLS_176 = __VLS_175({
    index: "/media/verify",
}, ...__VLS_functionalComponentArgsRest(__VLS_175));
__VLS_177.slots.default;
(__VLS_ctx.t('nav.rawVerify'));
var __VLS_177;
const __VLS_178 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_179 = __VLS_asFunctionalComponent(__VLS_178, new __VLS_178({
    index: "/media/ai-monitor",
}));
const __VLS_180 = __VLS_179({
    index: "/media/ai-monitor",
}, ...__VLS_functionalComponentArgsRest(__VLS_179));
__VLS_181.slots.default;
(__VLS_ctx.t('nav.aiMonitor'));
var __VLS_181;
var __VLS_165;
const __VLS_182 = {}.ElSubMenu;
/** @type {[typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, ]} */ ;
// @ts-ignore
const __VLS_183 = __VLS_asFunctionalComponent(__VLS_182, new __VLS_182({
    index: "finance-group",
}));
const __VLS_184 = __VLS_183({
    index: "finance-group",
}, ...__VLS_functionalComponentArgsRest(__VLS_183));
__VLS_185.slots.default;
{
    const { title: __VLS_thisSlot } = __VLS_185.slots;
    const __VLS_186 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_187 = __VLS_asFunctionalComponent(__VLS_186, new __VLS_186({}));
    const __VLS_188 = __VLS_187({}, ...__VLS_functionalComponentArgsRest(__VLS_187));
    __VLS_189.slots.default;
    const __VLS_190 = {}.Money;
    /** @type {[typeof __VLS_components.Money, ]} */ ;
    // @ts-ignore
    const __VLS_191 = __VLS_asFunctionalComponent(__VLS_190, new __VLS_190({}));
    const __VLS_192 = __VLS_191({}, ...__VLS_functionalComponentArgsRest(__VLS_191));
    var __VLS_189;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.t('nav.financeGroup'));
}
const __VLS_194 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_195 = __VLS_asFunctionalComponent(__VLS_194, new __VLS_194({
    index: "/finance/ledger",
}));
const __VLS_196 = __VLS_195({
    index: "/finance/ledger",
}, ...__VLS_functionalComponentArgsRest(__VLS_195));
__VLS_197.slots.default;
(__VLS_ctx.t('nav.ledger'));
var __VLS_197;
const __VLS_198 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_199 = __VLS_asFunctionalComponent(__VLS_198, new __VLS_198({
    index: "/finance/payout",
}));
const __VLS_200 = __VLS_199({
    index: "/finance/payout",
}, ...__VLS_functionalComponentArgsRest(__VLS_199));
__VLS_201.slots.default;
(__VLS_ctx.t('nav.payout'));
var __VLS_201;
const __VLS_202 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_203 = __VLS_asFunctionalComponent(__VLS_202, new __VLS_202({
    index: "/finance/refund",
}));
const __VLS_204 = __VLS_203({
    index: "/finance/refund",
}, ...__VLS_functionalComponentArgsRest(__VLS_203));
__VLS_205.slots.default;
(__VLS_ctx.t('nav.refund'));
var __VLS_205;
var __VLS_185;
const __VLS_206 = {}.ElSubMenu;
/** @type {[typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, ]} */ ;
// @ts-ignore
const __VLS_207 = __VLS_asFunctionalComponent(__VLS_206, new __VLS_206({
    index: "support-group",
}));
const __VLS_208 = __VLS_207({
    index: "support-group",
}, ...__VLS_functionalComponentArgsRest(__VLS_207));
__VLS_209.slots.default;
{
    const { title: __VLS_thisSlot } = __VLS_209.slots;
    const __VLS_210 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_211 = __VLS_asFunctionalComponent(__VLS_210, new __VLS_210({}));
    const __VLS_212 = __VLS_211({}, ...__VLS_functionalComponentArgsRest(__VLS_211));
    __VLS_213.slots.default;
    const __VLS_214 = {}.Service;
    /** @type {[typeof __VLS_components.Service, ]} */ ;
    // @ts-ignore
    const __VLS_215 = __VLS_asFunctionalComponent(__VLS_214, new __VLS_214({}));
    const __VLS_216 = __VLS_215({}, ...__VLS_functionalComponentArgsRest(__VLS_215));
    var __VLS_213;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.t('nav.supportGroup'));
}
const __VLS_218 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_219 = __VLS_asFunctionalComponent(__VLS_218, new __VLS_218({
    index: "/support/dispute",
}));
const __VLS_220 = __VLS_219({
    index: "/support/dispute",
}, ...__VLS_functionalComponentArgsRest(__VLS_219));
__VLS_221.slots.default;
(__VLS_ctx.t('nav.disputes'));
var __VLS_221;
const __VLS_222 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_223 = __VLS_asFunctionalComponent(__VLS_222, new __VLS_222({
    index: "/support/chat",
}));
const __VLS_224 = __VLS_223({
    index: "/support/chat",
}, ...__VLS_functionalComponentArgsRest(__VLS_223));
__VLS_225.slots.default;
(__VLS_ctx.t('nav.supportChat'));
var __VLS_225;
const __VLS_226 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_227 = __VLS_asFunctionalComponent(__VLS_226, new __VLS_226({
    index: "/support/conversation",
}));
const __VLS_228 = __VLS_227({
    index: "/support/conversation",
}, ...__VLS_functionalComponentArgsRest(__VLS_227));
__VLS_229.slots.default;
(__VLS_ctx.t('nav.conversationAudit'));
var __VLS_229;
var __VLS_209;
const __VLS_230 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_231 = __VLS_asFunctionalComponent(__VLS_230, new __VLS_230({
    index: "/campaign/coupons",
}));
const __VLS_232 = __VLS_231({
    index: "/campaign/coupons",
}, ...__VLS_functionalComponentArgsRest(__VLS_231));
__VLS_233.slots.default;
const __VLS_234 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_235 = __VLS_asFunctionalComponent(__VLS_234, new __VLS_234({}));
const __VLS_236 = __VLS_235({}, ...__VLS_functionalComponentArgsRest(__VLS_235));
__VLS_237.slots.default;
const __VLS_238 = {}.Ticket;
/** @type {[typeof __VLS_components.Ticket, ]} */ ;
// @ts-ignore
const __VLS_239 = __VLS_asFunctionalComponent(__VLS_238, new __VLS_238({}));
const __VLS_240 = __VLS_239({}, ...__VLS_functionalComponentArgsRest(__VLS_239));
var __VLS_237;
{
    const { title: __VLS_thisSlot } = __VLS_233.slots;
    (__VLS_ctx.t('nav.coupons'));
}
var __VLS_233;
const __VLS_242 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_243 = __VLS_asFunctionalComponent(__VLS_242, new __VLS_242({
    index: "/affiliate",
}));
const __VLS_244 = __VLS_243({
    index: "/affiliate",
}, ...__VLS_functionalComponentArgsRest(__VLS_243));
__VLS_245.slots.default;
const __VLS_246 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_247 = __VLS_asFunctionalComponent(__VLS_246, new __VLS_246({}));
const __VLS_248 = __VLS_247({}, ...__VLS_functionalComponentArgsRest(__VLS_247));
__VLS_249.slots.default;
const __VLS_250 = {}.UserFilled;
/** @type {[typeof __VLS_components.UserFilled, ]} */ ;
// @ts-ignore
const __VLS_251 = __VLS_asFunctionalComponent(__VLS_250, new __VLS_250({}));
const __VLS_252 = __VLS_251({}, ...__VLS_functionalComponentArgsRest(__VLS_251));
var __VLS_249;
{
    const { title: __VLS_thisSlot } = __VLS_245.slots;
    (__VLS_ctx.t('nav.affiliate'));
}
var __VLS_245;
const __VLS_254 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_255 = __VLS_asFunctionalComponent(__VLS_254, new __VLS_254({
    index: "/affiliate/report",
}));
const __VLS_256 = __VLS_255({
    index: "/affiliate/report",
}, ...__VLS_functionalComponentArgsRest(__VLS_255));
__VLS_257.slots.default;
const __VLS_258 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_259 = __VLS_asFunctionalComponent(__VLS_258, new __VLS_258({}));
const __VLS_260 = __VLS_259({}, ...__VLS_functionalComponentArgsRest(__VLS_259));
__VLS_261.slots.default;
const __VLS_262 = {}.TrendCharts;
/** @type {[typeof __VLS_components.TrendCharts, ]} */ ;
// @ts-ignore
const __VLS_263 = __VLS_asFunctionalComponent(__VLS_262, new __VLS_262({}));
const __VLS_264 = __VLS_263({}, ...__VLS_functionalComponentArgsRest(__VLS_263));
var __VLS_261;
{
    const { title: __VLS_thisSlot } = __VLS_257.slots;
    (__VLS_ctx.t('nav.affiliateReport'));
}
var __VLS_257;
const __VLS_266 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_267 = __VLS_asFunctionalComponent(__VLS_266, new __VLS_266({
    index: "/analytics/market-signals",
}));
const __VLS_268 = __VLS_267({
    index: "/analytics/market-signals",
}, ...__VLS_functionalComponentArgsRest(__VLS_267));
__VLS_269.slots.default;
const __VLS_270 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_271 = __VLS_asFunctionalComponent(__VLS_270, new __VLS_270({}));
const __VLS_272 = __VLS_271({}, ...__VLS_functionalComponentArgsRest(__VLS_271));
__VLS_273.slots.default;
const __VLS_274 = {}.TrendCharts;
/** @type {[typeof __VLS_components.TrendCharts, ]} */ ;
// @ts-ignore
const __VLS_275 = __VLS_asFunctionalComponent(__VLS_274, new __VLS_274({}));
const __VLS_276 = __VLS_275({}, ...__VLS_functionalComponentArgsRest(__VLS_275));
var __VLS_273;
{
    const { title: __VLS_thisSlot } = __VLS_269.slots;
    (__VLS_ctx.t('nav.marketSignals'));
}
var __VLS_269;
const __VLS_278 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_279 = __VLS_asFunctionalComponent(__VLS_278, new __VLS_278({
    index: "/notifications",
}));
const __VLS_280 = __VLS_279({
    index: "/notifications",
}, ...__VLS_functionalComponentArgsRest(__VLS_279));
__VLS_281.slots.default;
const __VLS_282 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_283 = __VLS_asFunctionalComponent(__VLS_282, new __VLS_282({}));
const __VLS_284 = __VLS_283({}, ...__VLS_functionalComponentArgsRest(__VLS_283));
__VLS_285.slots.default;
const __VLS_286 = {}.Bell;
/** @type {[typeof __VLS_components.Bell, ]} */ ;
// @ts-ignore
const __VLS_287 = __VLS_asFunctionalComponent(__VLS_286, new __VLS_286({}));
const __VLS_288 = __VLS_287({}, ...__VLS_functionalComponentArgsRest(__VLS_287));
var __VLS_285;
{
    const { title: __VLS_thisSlot } = __VLS_281.slots;
    (__VLS_ctx.t('nav.notifications'));
}
var __VLS_281;
const __VLS_290 = {}.ElSubMenu;
/** @type {[typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, ]} */ ;
// @ts-ignore
const __VLS_291 = __VLS_asFunctionalComponent(__VLS_290, new __VLS_290({
    index: "content-group",
}));
const __VLS_292 = __VLS_291({
    index: "content-group",
}, ...__VLS_functionalComponentArgsRest(__VLS_291));
__VLS_293.slots.default;
{
    const { title: __VLS_thisSlot } = __VLS_293.slots;
    const __VLS_294 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_295 = __VLS_asFunctionalComponent(__VLS_294, new __VLS_294({}));
    const __VLS_296 = __VLS_295({}, ...__VLS_functionalComponentArgsRest(__VLS_295));
    __VLS_297.slots.default;
    const __VLS_298 = {}.Files;
    /** @type {[typeof __VLS_components.Files, ]} */ ;
    // @ts-ignore
    const __VLS_299 = __VLS_asFunctionalComponent(__VLS_298, new __VLS_298({}));
    const __VLS_300 = __VLS_299({}, ...__VLS_functionalComponentArgsRest(__VLS_299));
    var __VLS_297;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.t('nav.contentGroup'));
}
const __VLS_302 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_303 = __VLS_asFunctionalComponent(__VLS_302, new __VLS_302({
    index: "/content/banners",
}));
const __VLS_304 = __VLS_303({
    index: "/content/banners",
}, ...__VLS_functionalComponentArgsRest(__VLS_303));
__VLS_305.slots.default;
(__VLS_ctx.t('nav.banners'));
var __VLS_305;
const __VLS_306 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_307 = __VLS_asFunctionalComponent(__VLS_306, new __VLS_306({
    index: "/content/news",
}));
const __VLS_308 = __VLS_307({
    index: "/content/news",
}, ...__VLS_functionalComponentArgsRest(__VLS_307));
__VLS_309.slots.default;
(__VLS_ctx.t('nav.news'));
var __VLS_309;
const __VLS_310 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_311 = __VLS_asFunctionalComponent(__VLS_310, new __VLS_310({
    index: "/content/faqs",
}));
const __VLS_312 = __VLS_311({
    index: "/content/faqs",
}, ...__VLS_functionalComponentArgsRest(__VLS_311));
__VLS_313.slots.default;
(__VLS_ctx.t('nav.faqs'));
var __VLS_313;
const __VLS_314 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_315 = __VLS_asFunctionalComponent(__VLS_314, new __VLS_314({
    index: "/content/attractions",
}));
const __VLS_316 = __VLS_315({
    index: "/content/attractions",
}, ...__VLS_functionalComponentArgsRest(__VLS_315));
__VLS_317.slots.default;
(__VLS_ctx.t('nav.attractions'));
var __VLS_317;
const __VLS_318 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_319 = __VLS_asFunctionalComponent(__VLS_318, new __VLS_318({
    index: "/content/instagram",
}));
const __VLS_320 = __VLS_319({
    index: "/content/instagram",
}, ...__VLS_functionalComponentArgsRest(__VLS_319));
__VLS_321.slots.default;
(__VLS_ctx.t('nav.instagram'));
var __VLS_321;
const __VLS_322 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_323 = __VLS_asFunctionalComponent(__VLS_322, new __VLS_322({
    index: "/content/public-consent",
}));
const __VLS_324 = __VLS_323({
    index: "/content/public-consent",
}, ...__VLS_functionalComponentArgsRest(__VLS_323));
__VLS_325.slots.default;
(__VLS_ctx.t('nav.publicConsent'));
var __VLS_325;
var __VLS_293;
const __VLS_326 = {}.ElSubMenu;
/** @type {[typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, ]} */ ;
// @ts-ignore
const __VLS_327 = __VLS_asFunctionalComponent(__VLS_326, new __VLS_326({
    index: "settings-group",
}));
const __VLS_328 = __VLS_327({
    index: "settings-group",
}, ...__VLS_functionalComponentArgsRest(__VLS_327));
__VLS_329.slots.default;
{
    const { title: __VLS_thisSlot } = __VLS_329.slots;
    const __VLS_330 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_331 = __VLS_asFunctionalComponent(__VLS_330, new __VLS_330({}));
    const __VLS_332 = __VLS_331({}, ...__VLS_functionalComponentArgsRest(__VLS_331));
    __VLS_333.slots.default;
    const __VLS_334 = {}.Setting;
    /** @type {[typeof __VLS_components.Setting, ]} */ ;
    // @ts-ignore
    const __VLS_335 = __VLS_asFunctionalComponent(__VLS_334, new __VLS_334({}));
    const __VLS_336 = __VLS_335({}, ...__VLS_functionalComponentArgsRest(__VLS_335));
    var __VLS_333;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.t('nav.settingsGroup'));
}
const __VLS_338 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_339 = __VLS_asFunctionalComponent(__VLS_338, new __VLS_338({
    index: "/settings/areas",
}));
const __VLS_340 = __VLS_339({
    index: "/settings/areas",
}, ...__VLS_functionalComponentArgsRest(__VLS_339));
__VLS_341.slots.default;
(__VLS_ctx.t('nav.areas'));
var __VLS_341;
const __VLS_342 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_343 = __VLS_asFunctionalComponent(__VLS_342, new __VLS_342({
    index: "/settings/services",
}));
const __VLS_344 = __VLS_343({
    index: "/settings/services",
}, ...__VLS_functionalComponentArgsRest(__VLS_343));
__VLS_345.slots.default;
(__VLS_ctx.t('nav.services'));
var __VLS_345;
const __VLS_346 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_347 = __VLS_asFunctionalComponent(__VLS_346, new __VLS_346({
    index: "/dic",
}));
const __VLS_348 = __VLS_347({
    index: "/dic",
}, ...__VLS_functionalComponentArgsRest(__VLS_347));
__VLS_349.slots.default;
(__VLS_ctx.t('nav.dictionary'));
var __VLS_349;
const __VLS_350 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_351 = __VLS_asFunctionalComponent(__VLS_350, new __VLS_350({
    index: "/flows",
}));
const __VLS_352 = __VLS_351({
    index: "/flows",
}, ...__VLS_functionalComponentArgsRest(__VLS_351));
__VLS_353.slots.default;
(__VLS_ctx.t('nav.appFlows'));
var __VLS_353;
var __VLS_329;
var __VLS_69;
var __VLS_65;
const __VLS_354 = {}.ElContainer;
/** @type {[typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, ]} */ ;
// @ts-ignore
const __VLS_355 = __VLS_asFunctionalComponent(__VLS_354, new __VLS_354({}));
const __VLS_356 = __VLS_355({}, ...__VLS_functionalComponentArgsRest(__VLS_355));
__VLS_357.slots.default;
const __VLS_358 = {}.ElMain;
/** @type {[typeof __VLS_components.ElMain, typeof __VLS_components.elMain, typeof __VLS_components.ElMain, typeof __VLS_components.elMain, ]} */ ;
// @ts-ignore
const __VLS_359 = __VLS_asFunctionalComponent(__VLS_358, new __VLS_358({
    id: "main-content",
    ...{ class: "bg-gray-50" },
    role: "main",
    tabindex: "-1",
}));
const __VLS_360 = __VLS_359({
    id: "main-content",
    ...{ class: "bg-gray-50" },
    role: "main",
    tabindex: "-1",
}, ...__VLS_functionalComponentArgsRest(__VLS_359));
__VLS_361.slots.default;
const __VLS_362 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, typeof __VLS_components.routerView, typeof __VLS_components.RouterView, typeof __VLS_components.routerView, ]} */ ;
// @ts-ignore
const __VLS_363 = __VLS_asFunctionalComponent(__VLS_362, new __VLS_362({}));
const __VLS_364 = __VLS_363({}, ...__VLS_functionalComponentArgsRest(__VLS_363));
{
    const { default: __VLS_thisSlot } = __VLS_365.slots;
    const [{ Component }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_366 = {}.transition;
    /** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
    // @ts-ignore
    const __VLS_367 = __VLS_asFunctionalComponent(__VLS_366, new __VLS_366({
        name: "fade-transform",
        mode: "out-in",
    }));
    const __VLS_368 = __VLS_367({
        name: "fade-transform",
        mode: "out-in",
    }, ...__VLS_functionalComponentArgsRest(__VLS_367));
    __VLS_369.slots.default;
    const __VLS_370 = ((Component));
    // @ts-ignore
    const __VLS_371 = __VLS_asFunctionalComponent(__VLS_370, new __VLS_370({}));
    const __VLS_372 = __VLS_371({}, ...__VLS_functionalComponentArgsRest(__VLS_371));
    var __VLS_369;
    __VLS_365.slots['' /* empty slot name completion */];
}
var __VLS_365;
var __VLS_361;
const __VLS_374 = {}.ElFooter;
/** @type {[typeof __VLS_components.ElFooter, typeof __VLS_components.elFooter, typeof __VLS_components.ElFooter, typeof __VLS_components.elFooter, ]} */ ;
// @ts-ignore
const __VLS_375 = __VLS_asFunctionalComponent(__VLS_374, new __VLS_374({
    ...{ style: {} },
}));
const __VLS_376 = __VLS_375({
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_375));
__VLS_377.slots.default;
var __VLS_377;
var __VLS_357;
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
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Fold: Fold,
            DataAnalysis: DataAnalysis,
            User: User,
            Camera: Camera,
            UserFilled: UserFilled,
            Document: Document,
            Picture: Picture,
            Money: Money,
            Service: Service,
            Ticket: Ticket,
            Files: Files,
            Setting: Setting,
            TrendCharts: TrendCharts,
            Bell: Bell,
            WlLangSwitcher: WlLangSwitcher,
            WlSkipLink: WlSkipLink,
            t: t,
            authStore: authStore,
            isCollapse: isCollapse,
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