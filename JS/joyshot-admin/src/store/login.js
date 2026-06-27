import {
    requestLogin, requestUserInfo, requestUserBadge
} from "@/api";

import {getToken} from "@/util";
import {setToken} from "@/util";
//import {roleBasedRoute} from '@/router/router'


const actions = {

    async getUserInfo({commit}, token) {
        let result = await requestUserInfo({token})
        // console.log('result:', result)
        if (result.code === '200') {
            commit("GET_USER_INFO", result.data)
            return 'ok'
        } else {
            return Promise.reject(new Error('getUserInfo error'))
        }
    },

    async getUserBadge({commit}) {
        let result = await requestUserBadge()
        // console.log('result:', result)
        if (result.code === '200') {
            commit("GET_USER_BADGE", result.data)
            return 'ok'
        } else {
            return Promise.reject(new Error('getUserInfo error'))
        }
    },


    async submitLoginForm({commit}, data) {
        let result = await requestLogin(data)
        console.log('submitLoginForm:', result)
        if (result.code === '200') {
            setToken('JS_ADMIN_TOKEN', result.data.token)
            setToken('JS_ROLE_MENU', JSON.stringify(result.data.userMenus))
            commit('REQUEST_LOGIN', result.data)

            return 'ok'
        } else {
            return Promise.reject(new Error(result.message))
        }
    }
}


/*
const mergeRoute = (roleBasedRoute, userMenus)=> {
    //console.log('mergeRoute data.userMenus:', userMenus)
    console.log('mergeRoute roleBasedRoute:', roleBasedRoute)


    let menuNames = userMenus.map(obj => {
        let menu = []
        if (obj.children.length > 0) {
            let childs = obj.children.map(child => child.name)

            menu.push(obj.name)
            menu.push(childs)
            return menu.flatMap(name=>name)
        }
        return obj.name
    });
    menuNames = menuNames.flatMap(name=>name)

    return roleBasedRoute.filter(item=>{

        console.log(item.name)
        if (item.children && item.children.lenght > 0) {
            // item.children = mergeRoute(item.children, menuNames)
            item.children.filter(child=>{console.log('child:', item.name)})
        }

    })
}
*/



const mutations = {

    REQUEST_LOGIN(state, data) {
        state.token = data.token
        state.userInfo = data
        //state.userAllowedMenus = mergeRoute(roleBasedRoute, data.userMenus )
        //console.log('mergeRoute:', state.userAllowedMenus)

    },
    GET_USER_INFO(state, userInfo) {
        state.userInfo = userInfo
    },
    GET_USER_BADGE(state, badgeInfo) {
        state.badgeInfo = badgeInfo.length
    },

}
const state = {
    badgeInfo: 0,
    userInfo: {},
    userMenus: getToken('JS_ROLE_MENU'),
    token: getToken('JS_ADMIN_TOKEN'),
    userAllowedMenus: []
}
const getters = {}

export default {
    namespaced: true,
    actions,
    mutations,
    state,
    getters
}
