import {
    requestAllAreaNoPage,
    requestAllArea,
    requestSaveArea,
    requestDeleteArea
} from "@/api/area-api";

const actions = {

    async getAllAreasNoPage(_, data) {
        let result = await requestAllAreaNoPage(data)
        if (result.code === '200') {
            return result
        } else {
            return Promise.reject(new Error('無法取得資料'))
        }
    },

    async getAllAreas(_, data) {
        let result = await requestAllArea(data)
        if (result.code === '200') {
            return result
        } else {
            return Promise.reject(new Error('無法取得資料'))
        }
    },

    async saveArea(_, data) {
        let result = await requestSaveArea(data)
        if (result.code === '200') {
            return result.message
        } else {
            return Promise.reject(new Error('資料更新失敗'))
        }
    },

    async deleteArea(_, data) {
        let result = await requestDeleteArea(data)
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
