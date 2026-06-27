import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Match from '../views/Match.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/match',
    name: 'Match',
    component: Match
  },
  {
    path: '/photographer/:pid',
    name: 'Photographer',

    // route level code-splitting
    // this generates a separate chunk (photographer.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/Photographer.vue')
  },
  {
    path: '/matched-photographer/:pid',
    name: 'MatchedPhotographer',

    // route level code-splitting
    // this generates a separate chunk (photographer.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/MatchedPhotographer.vue')
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('../views/Checkout.vue')
  },
  {
    path: '/thankyou/:tradeNo',
    name: 'Thankyou',
    component: () => import('../views/Thankyou.vue')
  },
  ,
  {
    path: '/pay/:orderNo',
    name: 'Pay',
    component: () => import('../views/Pay.vue')
  },
  {
    path: '/photographer-list',
    name: 'PhotographerList',
    component: () => import('../views/PhotographerList.vue')
  },
  {
    path: '/faq',
    name: 'FAQ',
    component: () => import('../views/Faq.vue')
  },
  {
    path: '/privacy-policy',
    name: 'PrivacyPolicy',
    component: () => import('../views/PrivacyPolicy.vue')
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
    path: '*',
    name: 'NotFound',
    component: () => import('@/views/404.vue'),
    meta: {
      title: '404'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  next()
})

router.afterEach((to, from, next) => {
  gtag('config', 'G-DLGSCPNQCV', {'page_path': to.fullPath});
  // gtag('config', 'G-QNT3XFZLHQ', {'page_path': to.fullPath});//test env
});

export default router
