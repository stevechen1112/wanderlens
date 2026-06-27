import Vue from 'vue'
import Vuex from 'vuex'

import getters from './getters'
import app from '@/store/modules/app'
import profile from '@/store/modules/profile'
import user from '@/store/user'
import role from '@/store/role'
import menu from '@/store/menu'
import dic from '@/store/dic'
import login from '@/store/login'
import area from '@/store/area'
import customer from '@/store/customer'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        app,
        profile,
        login,
        user,
        role,
        menu,
        dic,
        area,
        customer
    },
    getters
})
