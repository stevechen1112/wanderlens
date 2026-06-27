import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/index'
import './assets/styles/reset.css'
import './assets/styles/common.css'
import './plugins/element.js'
import './plugins/vcharts.js'
import plugins from '@/plugins/plugins'
import version from '@/static/version'
import i18n from './i18n'




Vue.use(version)
Vue.use(plugins)

import '@/assets/icons/iconfont.css'
import '@/assets/global.css'

import VueLazyload from 'vue-lazyload'
import member_icon from '@/assets/images/member.svg'
Vue.use(VueLazyload,{
  loading:member_icon
})


import '@/api/request'
//import '@/mock/mockServer'
import request from "@/api/request";
//import mockRequest from "@/api/mockRequest"
Vue.prototype.request = request
//Vue.prototype.mockRequest = mockRequest


import VueNumberFormat from 'vue-number-format'

import './icons'

Vue.use(VueNumberFormat, {prefix: '$', thousand: ',', precision: 0})



Vue.config.productionTip = false


new Vue({
    router,
    store,
    i18n,
    beforeCreate() {
        Vue.prototype.$bus = this
    },
    render: h => h(App)
}).$mount('#app')
