import Vue from 'vue'
import Vuex from 'vuex'

import getters from './getters'
import app from '@/store/modules/app'
import profile from '@/store/modules/profile'
import user from '@/store/user'
import role from '@/store/role'
import login from '@/store/login'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        app,
        profile,
        user,
        role,
        login
    },
    getters
})
