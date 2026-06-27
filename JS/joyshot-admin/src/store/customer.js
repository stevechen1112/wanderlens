import {
    requestAllCustomers,
    requestSaveCustomer,
    requestDeleteCustomer
} from "@/api/customer-api";

const actions = {

    async getAllCustomers(_, data) {
        let result = await requestAllCustomers(data)
        if (result.code === '200') {
            return result
        } else {
            return Promise.reject(new Error('無法取得資料'))
        }
    },

    async saveCustomer(_, data) {
        let result = await requestSaveCustomer(data)
        if (result.code === '200') {
            return result.message
        } else {
            return Promise.reject(new Error('資料更新失敗'))
        }
    },

    async deleteCustomer(_, data) {
        let result = await requestDeleteCustomer(data)
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
