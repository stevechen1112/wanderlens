import {
    requestAllMenu,
    requestSaveMenu,
    requestDeleteMenu,
    requestIcons
} from "@/api/menu-api";

const actions = {

    async getAllMenus(_, data) {
        let result = await requestAllMenu(data)
        if (result.code === '200') {
            return result
        } else {
            return Promise.reject(new Error('無法取得資料'))
        }
    },

    async saveMenu(_, data) {
        let result = await requestSaveMenu(data)
        if (result.code === '200') {
            return result.message
        } else {
            return Promise.reject(new Error('資料更新失敗'))
        }
    },

    async deleteMenu(_, data) {
        let result = await requestDeleteMenu(data)
        if (result.code === '200') {
            return result.message
        } else {
            return Promise.reject(new Error('資料刪除失敗'))
        }
    },

    async getMenuIcons() {
        let result = await requestIcons()
        if (result.code === '200') {
            return result
        } else {
            return Promise.reject(new Error('資料刪除失敗'))
        }
    }
}

const mutations = {}
const state = {}

const getters = {}

export default {
    namespaced: true,
    actions,
    mutations,
    state,
    getters
}
