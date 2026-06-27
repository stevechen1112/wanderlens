import {
    requestAllDics,
    requestSaveDic,
    requestDeleteDic
} from "@/api/dictionary-api";

const actions = {

    async getAllDics(_, data) {
        let result = await requestAllDics(data)
        if (result.code === '200') {
            return result
        } else {
            return Promise.reject(new Error('無法取得資料'))
        }
    },

    async saveDic(_, data) {
        let result = await requestSaveDic(data)
        if (result.code === '200') {
            return result.message
        } else {
            return Promise.reject(new Error('資料更新失敗'))
        }
    },

    async deleteDic(_, data) {
        let result = await requestDeleteDic(data)
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
