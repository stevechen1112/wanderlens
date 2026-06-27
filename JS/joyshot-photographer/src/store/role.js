import {
    requestAllNoPage,
    requestAll,
    requestSave,
    requestDelete
} from "@/api/role-api";

const actions = {

    async getAllRolesNoPage() {
        let result = await requestAllNoPage()
        if (result.code === '200') {
            return result
        } else {
            return Promise.reject(new Error('無法取得資料'))
        }
    },

    async getAllRoles(_, data) {
        let result = await requestAll(data)
        if (result.code === '200') {
            return result
        } else {
            return Promise.reject(new Error('無法取得資料'))
        }
    },

    async saveRole(_, data) {
        let result = await requestSave(data)
        if (result.code === '200') {
            return result.message
        } else {
            return Promise.reject(new Error('資料更新失敗'))
        }
    },

    async deleteRole(_, data) {
        let result = await requestDelete(data)
        if (result.code === '200') {
            return result.message
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
