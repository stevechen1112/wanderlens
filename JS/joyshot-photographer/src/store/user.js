import {
    requestSaveUser,
    requestAllUser,
    requestDeleteUser
} from "@/api";



const actions = {

    async getAllUsers(_, data) {
        let result = await requestAllUser(data)
        console.log(result)
        if (result.code === '200') {
            return result
        } else {
            return Promise.reject(new Error(result.message))
        }
    },

    async saveUser(_, data) {
        let result = await requestSaveUser(data)
        console.log('saveUser:', result)
        if (result.code === '200') {
            return result.message
        } else {
            return Promise.reject(new Error('資料更新失敗'))
        }
    },

    async deleteUser(_, data) {
        let result = await requestDeleteUser(data)
        if (result.code === '200') {
            return result.message
        } else {
            return Promise.reject(new Error('資料刪除失敗'))
        }
    }
}

const mutations = {
    GET_USER_INFO(state, userInfo) {
        state.userInfo = userInfo
    }
}
const state = {
    userInfo: {},
    event_token: ''
}

const getters = {
    basicInfo(state) {
        return state.userInfo
    },
    userId(state) {
        return state.userInfo.id
    }

}

export default {
    namespaced: true,
    actions,
    mutations,
    state,
    getters
}
