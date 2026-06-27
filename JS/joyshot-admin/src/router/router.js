import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import Full from '@/containers/Full'
import {removeToken, getToken} from "@/util";



const DATA_MAINTAIN = "route.meta.breadcrumb.data_maintain"


Vue.use(Router)

export const commonRoute = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/users/Login.vue'),
        meta: {
            title: '登入'
        }
    },
    {
        path: '/404',
        name: 'NotFind',
        component: () => import('@/views/404.vue'),
        meta: {
            title: '404'
        }
    },
    {
      path:'*',
      name: 'NotFind',
      component: () => import('@/views/404.vue'),
      meta: {
          title: '404'
      }
    },
    {
        path: '/',
        redirect: '/dashboard',
        name: 'Full',
        component: Full,
        meta: {
            breadcrumb: 'route.meta.breadcrumb.home',
            title: 'route.meta.title.home',
            requireLogin: true
        },
        children: [{
            path: '/dashboard',
            name: 'Dashboard',
            component: () => import( '@/views/dashboard/Dashboard.vue'),
            meta: {
                breadcrumb: DATA_MAINTAIN,
                title: 'route.meta.title.dashboard',
                requireLogin: true
            }
        }]
    }
]

export const roleBasedRoute = [
    {
        path: '/data',
        component: Full,
        redirect: 'users/maintain',
        meta: {
            breadcrumb: DATA_MAINTAIN,
            title: 'route.meta.breadcrumb.data_maintain',
            requireLogin: true
        },
        children: [
            {
                path: 'users/maintain',
                name: 'UserMaintain',
                component: () => import( '@/views/users/maintain/index'),
                meta: {
                    breadcrumb: DATA_MAINTAIN,
                    title: 'route.meta.title.account_setting',
                    requireLogin: true
                }
            },
            {
                path: 'users/profile',
                name: 'UserProfile',
                component: () => import( '@/views/users/profile'),
                meta: {
                    breadcrumb: DATA_MAINTAIN,
                    title: 'route.meta.title.profile',
                    requireLogin: true
                }
            },
            {
                path: 'users/change_password',
                name: 'ChangePassword',
                component: () => import('@/views/users/change_password'),
                meta: {
                    breadcrumb: DATA_MAINTAIN,
                    title: 'route.meta.title.change_password',
                    requireLogin: true
                }
            },
            {
                path: 'roles/maintain',
                name: 'RoleMaintain',
                component: () => import( '@/views/roles/maintain/index'),
                meta: {
                    breadcrumb: DATA_MAINTAIN,
                    title: 'route.meta.title.roles',
                    requireLogin: true
                }
            },
            {
                path: 'areas/maintain',
                name: 'AreaMaintain',
                component: () => import( '@/views/areas/maintain/index'),
                meta: {
                    breadcrumb: DATA_MAINTAIN,
                    title: 'route.meta.title.areas',
                    requireLogin: true
                }
            },
            {
                path: 'services/maintain',
                name: 'ServiceCatMaintain',
                component: () => import( '@/views/services/maintain/index'),
                meta: {
                    breadcrumb: DATA_MAINTAIN,
                    title: 'route.meta.title.services',
                    requireLogin: true
                }
            },
            {
                path: 'faqs/maintain',
                name: 'FaqsMaintain',
                component: () => import( '@/views/faqs/maintain/index'),
                meta: {
                    breadcrumb: DATA_MAINTAIN,
                    title: 'route.meta.title.faqs',
                    requireLogin: true
                }
            },
            {
                path: 'instagram/maintain',
                name: 'InstagramMaintain',
                component: () => import( '@/views/instagram/maintain/index'),
                meta: {
                    breadcrumb: DATA_MAINTAIN,
                    title: 'route.meta.title.ig',
                    requireLogin: true
                }
            },
            {
                path: 'banner/maintain',
                name: 'BannerMaintain',
                component: () => import( '@/views/banner/maintain/index'),
                meta: {
                    breadcrumb: DATA_MAINTAIN,
                    title: 'route.meta.title.banner',
                    requireLogin: true
                }
            },
            {
                path: 'news/maintain',
                name: 'NewsMaintain',
                component: () => import( '@/views/news/maintain/index'),
                meta: {
                    breadcrumb: DATA_MAINTAIN,
                    title: 'route.meta.title.news',
                    requireLogin: true
                }
            },
            {
                path: 'attraction/maintain',
                name: 'AttractionMaintain',
                component: () => import( '@/views/attraction/maintain/index'),
                meta: {
                    breadcrumb: DATA_MAINTAIN,
                    title: 'route.meta.title.attraction',
                    requireLogin: true
                }
            }
        ]
    },
    {
        path: '/customers',
        component: Full,
        meta: {
            breadcrumb: 'route.meta.breadcrumb.customers',
            title: 'route.meta.title.customers',
            requireLogin: true
        },
        children:[
            {
                path: 'maintain',
                name: 'CustomerMaintain',
                component: () => import( '@/views/customers/maintain/index'),
                meta: {
                    breadcrumb: 'route.meta.breadcrumb.customers',
                    title: 'route.meta.title.customers',
                    requireLogin: true
                }
            }
        ]
    },
    {
        path: '/photographer',
        component: Full,
        meta: {
            breadcrumb: 'route.meta.breadcrumb.photographers',
            title: 'route.meta.title.photographer',
            requireLogin: true
        },
        children:[
            {
                path: 'maintain',
                name: 'PhotographerMaintain',
                component: () => import( '@/views/photographers/maintain/index'),
                meta: {
                    breadcrumb: 'route.meta.breadcrumb.photographers',
                    title: 'route.meta.title.photographer',
                    requireLogin: true
                }
            },
            {
                path: 'detail/:pid',
                name: 'PhotographerDetail',
                component: () => import( '@/views/photographers/maintain/detail'),
                meta: {
                    breadcrumb: 'route.meta.breadcrumb.photographers',
                    title: 'route.meta.title.photographer',
                    requireLogin: true
                }
            },
            {
                path: 'dashboard',
                name: 'PhotographerDashboard',
                component: () => import( '@/views/photographers/dashboard'),
                meta: {
                    breadcrumb: 'route.meta.breadcrumb.photographers',
                    title: 'route.meta.title.photographer_dashboard',
                    requireLogin: true
                }
            },
            {
                path: 'broadcast',
                name: 'PhotographerBroadcast',
                component: () => import( '@/views/photographers/broadcast'),
                meta: {
                    breadcrumb: 'route.meta.breadcrumb.photographers',
                    title: 'route.meta.title.photographer_broadcast',
                    requireLogin: true
                }
            }

        ]
    },
    {
        path: '/orders',
        component: Full,
        meta: {
            breadcrumb: 'route.meta.breadcrumb.orders',
            title: 'route.meta.title.orders',
            requireLogin: true
        },
        children:[
            {
                path: 'maintain',
                name: 'OrdersMaintain',
                component: () => import( '@/views/orders/maintain/index'),
                meta: {
                    breadcrumb: 'route.meta.breadcrumb.orders',
                    title: 'route.meta.title.orders',
                    requireLogin: true
                }
            }
        ]
    },
    {
        path: '/campaign',
        component: Full,
        meta: {
            breadcrumb: 'route.meta.breadcrumb.campaign',
            title: 'route.meta.title.campaign',
            requireLogin: true
        },
        children:[
            {
                path: 'coupons/maintain',
                name: 'CouponsMaintain',
                component: () => import( '@/views/campaign/coupons/maintain/index'),
                meta: {
                    breadcrumb: 'route.meta.breadcrumb.campaign',
                    title: 'route.meta.title.coupons',
                    requireLogin: true
                }
            }
        ]
    },
    {
        path: '/settings',
        component: Full,
        meta: {
            breadcrumb: 'route.meta.breadcrumb.system',
            title: 'route.meta.title.system',
            requireLogin: true
        },
        children:[
            {
                path: 'dictionary',
                name: 'DicMaintain',
                component:() => import( '@/views/dic/maintain/index'),
                meta: {
                    breadcrumb: 'route.meta.breadcrumb.settings',
                    title: 'route.meta.title.dictionary',
                    requireLogin: true
                }
            },
            {
                path: 'menu',
                name: 'MenuMaintain',
                component: () => import( '@/views/menus/maintain/index'),
                meta: {
                    breadcrumb: 'route.meta.breadcrumb.settings',
                    title: 'route.meta.title.menus',
                    requireLogin: true
                }
            },
            {
                path: 'flow',
                name: 'AppFlowMaintain',
                component: () => import( '@/views/flows/maintain/index'),
                meta: {
                    breadcrumb: 'route.meta.breadcrumb.settings',
                    title: 'route.meta.title.flows',
                    requireLogin: true
                }
            }
        ]
    },
    {
        path: '/affiliate',
        component: Full,
        meta: {
            breadcrumb: 'route.meta.breadcrumb.affiliate',
            title: 'route.meta.title.affiliate',
            requireLogin: true
        },
        children:[
            {
                path: 'maintain',
                name: 'AffiliateMaintain',
                component: () => import( '@/views/affiliate/maintain/index'),
                meta: {
                    breadcrumb: 'route.meta.breadcrumb.affiliate',
                    title: 'route.meta.title.affiliate',
                    requireLogin: true
                }
            },
            {
                path: 'report',
                name: 'AffiliateReport',
                component: () => import( '@/views/affiliate/maintain/report'),
                meta: {
                    breadcrumb: 'route.meta.breadcrumb.affiliate',
                    title: 'route.meta.title.affiliate_report',
                    requireLogin: true
                }
            }
        ]
    }
]

const allowedRoute = commonRoute.concat(roleBasedRoute)

// console.log('allowedRoute:', allowedRoute)

// const allowedRoute = [
//         {
//             path: '/login',
//             name: 'Login',
//             component: Login,
//             meta: {
//                 title: '登入'
//             }
//         },
//         {
//             path: '/',
//             redirect: '/dashboard',
//             name: 'Full',
//             component: Full,
//             meta: {
//                 breadcrumb: 'route.meta.breadcrumb.home',
//                 title: 'route.meta.title.home',
//                 requireLogin: true
//             },
//             children: [
//                 {
//                     path: '/users/maintain',
//                     name: 'UserMaintain',
//                     component: () => import( '@/views/users/maintain/index'),
//                     meta: {
//                         breadcrumb: DATA_MAINTAIN,
//                         title: 'route.meta.title.account_setting',
//                         requireLogin: true
//                     }
//                 },
//                 {
//                     path: '/user/profile',
//                     name: 'UserProfile',
//                     component: UserProfile,
//                     meta: {
//                         breadcrumb: DATA_MAINTAIN,
//                         title: 'route.meta.title.profile',
//                         requireLogin: true
//                     }
//                 },
//                 {
//                     path: '/user/change_password',
//                     name: 'ChangePassword',
//                     component: () => import('@/views/users/change_password'),
//                     meta: {
//                         breadcrumb: DATA_MAINTAIN,
//                         title: 'route.meta.title.change_password',
//                         requireLogin: true
//                     }
//                 },
//                 {
//                     path: '/roles/maintain',
//                     name: 'RoleMaintain',
//                     component: RoleMaintain,
//                     meta: {
//                         breadcrumb: DATA_MAINTAIN,
//                         title: 'Maintain Role',
//                         requireLogin: true
//                     }
//                 },
//                 {
//                     path: '/sys/menu',
//                     name: 'MenuMaintain',
//                     component: MenuMaintain,
//                     meta: {
//                         breadcrumb: DATA_MAINTAIN,
//                         title: 'Setup Menu',
//                         requireLogin: true
//                     }
//                 },
//                 {
//                     path: '/areas/maintain',
//                     name: 'AreaMaintain',
//                     component: AreaMaintain,
//                     meta: {
//                         breadcrumb: DATA_MAINTAIN,
//                         title: '區域設定',
//                         requireLogin: true
//                     }
//                 },
//                 {
//                     path: '/sys/dictionary',
//                     name: 'DicMaintain',
//                     component: DicMaintain,
//                     meta: {
//                         breadcrumb: '系統設定',
//                         title: '字典維護',
//                         requireLogin: true
//                     }
//                 },
//                 {
//                     path: '/service_cat/maintain',
//                     name: 'ServiceCatMaintain',
//                     component: ServiceCatMaintain,
//                     meta: {
//                         breadcrumb: DATA_MAINTAIN,
//                         title: 'route.meta.title.service_category',
//                         requireLogin: true
//                     }
//                 },
//                 {
//                     path: '/photographers/maintain',
//                     name: 'PhotographerMaintain',
//                     component: () => import( '@/views/photographer/maintain/index'),
//                     meta: {
//                         breadcrumb: 'menu.photographer',
//                         title: 'route.meta.title.photographer_maintain',
//                         requireLogin: true
//                     }
//                 }
//             ]
//         },
//         {
//             path: '*',
//             redirect: '/404',
//             hidden: true
//         }
//     ]


const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: allowedRoute
})

// bind token when page refresh
if (localStorage.getItem('token')) {
    store.commit('BIND_LOGIN', localStorage.getItem('token'))
}


router.beforeEach(async (to, from, next) => {
    // determine whether the user has logged in
    // const loginToken = store.state.login.token
    const loginToken = getToken('JS_ADMIN_TOKEN')
    const username = store.state.login.userInfo.username
    console.log('to=', to.path, ' from=', from.path, 'token=', loginToken)

    //已登入過
    if (loginToken) {
        console.log('beforeEach: 已登入過')
        //已登入，不能再進入登入頁
        if (to.path === '/login') {
            console.log('beforeEach: 已登入，不能再進入登入頁')
            next(false)
        } else {
            console.log('beforeEach 使用者資料:', username)

            if (username) {
                //使用者資料在本地store仍存在，放行
                next()
            } else {
                //使用者資料不在
                console.log('beforeEach: 使用者資料不在，重撈使用者資料:')
                try {
                    //重撈使用者資料
                    await store.dispatch('login/getUserInfo', loginToken)
                    // await store.dispatch('login/getUserBadge')
                    next()
                } catch (e) {
                    console.log('beforeEach: 撈使用者資料失敗，重新登入', e)
                    removeToken('JS_ADMIN_TOKEN')
                    store.state.login.token = null
                    next('/login')
                }
            }
        }
    } else {
        console.log('beforeEach 未登入:', to.path)
        if (to.path === '/login') {
            next()
        } else {
            next('/login?redirect='+to.path)
        }
    }


})

export default router
