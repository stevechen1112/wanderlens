import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import getters from './getters'
import area from '@/store/area'
import jsapp from '@/store/jsapp'

export default new Vuex.Store({
    modules: {
        // app,
        // profile,
        // login,
        // user,
        // role,
        // menu,
        // dic,
        area,
        jsapp
    },
    getters
})
