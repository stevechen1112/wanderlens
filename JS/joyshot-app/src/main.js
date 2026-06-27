import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

/** swiper style **/
import 'swiper/css/swiper.css'
import 'air-datepicker/air-datepicker.css'

import '@/plugins/element.js'

/** axio request **/
import '@/api/request'
import '@/mock/mockServer'
import request from "@/api/request";
import mockRequest from "@/api/mockRequest"

import i18n from './i18n'

import VueLazyload from 'vue-lazyload'
import member_icon from '@/assets/images/Loading_icon.gif'
Vue.use(VueLazyload,{
  loading:member_icon
})

import version from '@/static/version'
Vue.use(version)


import 'swiper/css/swiper.css'


/** custom global function **/
import plugins from '@/plugins/plugins'
Vue.use(plugins)

Vue.prototype.request = request
Vue.prototype.mockRequest = mockRequest
Vue.config.productionTip = false



import VueFbCustomerChat from 'vue-fb-customer-chat'
Vue.use(VueFbCustomerChat, {
  page_id: '104188151988129',
  attribution: 'biz_inbox',
  locale: i18n.locale === "zh" ? "zh_TW" : "en_US",
})

new Vue({
  router,
  i18n,
  store,
  beforeCreate() {
      Vue.prototype.$bus = this
  },
  render: h => h(App)
}).$mount('#app')
