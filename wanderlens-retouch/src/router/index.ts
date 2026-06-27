import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'Login', component: () => import('@/views/auth/Login.vue') },
    {
      path: '/',
      component: () => import('@/layouts/DefaultLayout.vue'),
      redirect: '/jobs',
      children: [
        { path: 'jobs', name: 'JobList', component: () => import('@/views/job/JobList.vue') },
        { path: 'jobs/:id', name: 'JobDetail', component: () => import('@/views/job/JobDetail.vue') },
        { path: 'spec', name: 'SpecDocument', component: () => import('@/views/spec/SpecDocument.vue') },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/login' },
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('wl_retouch_token')
  if (to.path === '/login') {
    token ? next('/jobs') : next()
  } else {
    token ? next() : next('/login')
  }
})

export default router