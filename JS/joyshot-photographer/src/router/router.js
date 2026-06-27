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
        path:'*',
        name: 'NotFind',
        component: () => import('@/views/404.vue'),
        meta: {
            title: '404'
        }
    }

]

export const roleBasedRoute = [
    
   
    {
        path: '/',
        component: Full,
        redirect: 'account',
        meta: {
            breadcrumb: 'route.meta.breadcrumb.photographers',
            title: 'route.meta.title.photographers',
            requireLogin: true
        },
        children:[
            {
                // path: 'detail/:pid',
                path: 'account',
                name: 'PhotographerDetail',
                component: () => import( '@/views/photographers/maintain/detail'),
                meta: {
                    breadcrumb: 'route.meta.breadcrumb.photographers',
                    title: 'route.meta.title.photographers',
                    requireLogin: true
                }
            },
            {
                path: 'data/users/profile',
                name: 'UserProfile',
                component: () => import( '@/views/users/profile'),
                meta: {
                    breadcrumb: DATA_MAINTAIN,
                    title: 'route.meta.title.profile',
                    requireLogin: true
                }
            },
            {
                path: 'data/users/change_password',
                name: 'ChangePassword',
                component: () => import('@/views/users/change_password'),
                meta: {
                    breadcrumb: DATA_MAINTAIN,
                    title: 'route.meta.title.change_password',
                    requireLogin: true
                }
            },
            {
                path: 'terms',
                name: 'TermsAndCondition',
                component: () => import('@/views/photographers/terms_and_condition'),
                meta: {
                    breadcrumb: '使用者條款',
                    title: 'route.meta.title.terms',
                    requireLogin: true
                }
            },
            {
                path: 'myorder',
                name: 'MyOrder',
                component: () => import('@/views/photographers/my_order'),
                meta: {
                    breadcrumb: '我的訂單',
                    title: 'route.meta.title.myorder',
                    requireLogin: true
                }
            }
        ]
    }
    
    
]

const allowedRoute = commonRoute.concat(roleBasedRoute)


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
    const loginToken = getToken('JS_P_TOKEN')
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
                    
                    next()
                } catch (e) {
                    console.log('beforeEach: 撈使用者資料失敗，重新登入', e)
                    removeToken('JS_P_TOKEN')
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
