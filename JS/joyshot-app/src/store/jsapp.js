//import {reqSaveSearchCondition} from "@/api/app-api";
import {getToken,setToken} from '@/util'
import i18n from '@/i18n'

const actions = {
/*
    async saveSearchCondition({commit}, data) {
        commit("SAVE_SEARCH_CONDITION", result.data)

        let result = await reqSaveSearchCondition(data)
        if (result.code === '200') {
        //    commit("SAVE_SEARCH_CONDITION", result.data)
            return 'ok'
        } else {
            return Promise.reject(new Error('資料刪除失敗'))
        }
    }
*/
}

const mutations = {
    SAVE_SEARCH_CONDITION: (state, data) => {
        console.log('收到資料:', data)
        state.searchCondition = data
    },
    SAVE_PRE_ORDER: (state, data) => {
        console.log('選定攝影師:', data)
        setToken('JS_PRE_ORDER', JSON.stringify(data))
        state.preOrderInfo = data
    },
    SAVE_PREVIEW_MATCHED_PHOTOGRAPHER: (state, data) => {
        console.log('store 目前:', state.previewMatchedPhotographer)
        console.log('store 瀏覽篩選出的攝影師:', data.phUuid)
        console.log(!state.previewMatchedPhotographer[data.phUuid])


        if (!state.previewMatchedPhotographer[data.phUuid]) {
            state.previewMatchedPhotographer[data.phUuid] = data
        } else {
            console.log('已瀏覽過此攝影師:', data.phUuid, data.nickName)
        }
    },
}

const state = {
    token: getToken('JS_APP_TOKEN'),
    searchCondition:{},
    preOrderInfo:{},
    previewMatchedPhotographer:{}
}

const getters = {
    order(state) {
        return (state.preOrderInfo.order)?state.preOrderInfo.order:{}
    },
    mapGeometry(state) {
        if (!state.searchCondition.lat) { return ''}
        return `${state.searchCondition.lat},${state.searchCondition.lng}`
    },
    shootingPersons(state) {
        if (!state.preOrderInfo.order) { return ''}
        let pets = state.preOrderInfo.order.hasPets == 1 ? i18n.t('store.jsapp.pets_notes', {petsNotes: state.preOrderInfo.order.petsNotes}) : i18n.t('store.jsapp.no_pets')

        let adultLabel = i18n.t('store.jsapp.adult_num', {adultNum: state.preOrderInfo.order.adultNum})
        if (state.preOrderInfo.order.adultNum == 99) {
            adultLabel = i18n.t('store.jsapp.over_adult_num')
        }
        let childLabel = i18n.t('store.jsapp.child_num', {childNum: state.preOrderInfo.order.childNum})
        if (state.preOrderInfo.order.childNum == 99) {
            childLabel = i18n.t('store.jsapp.over_child_num')
        }
        return `${adultLabel}, ${childLabel}, ${pets}`
    },
    previewPhotographer(state,key){
        return state.previewMatchedPhotographer
    }
}

export default {
    namespaced: true,
    actions,
    mutations,
    state,
    getters
}
