import axios from "axios";
import store from '@/store'
import i18n from '@/i18n'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import { nanoid } from 'nanoid'
import { setToken, getToken } from "@/util";

//測試
const request = axios.create({
    baseURL: '/api',
    timeout: 5000
})

request.interceptors.request.use((config) => {
    NProgress.start()


    if (store.state.jsapp.token) {
        config.headers['apptoken'] = store.state.jsapp.token
       // config.headers['info'] = store.state.login.userInfo.id
    } else {
        console.log('no token, create one')
        const newId = nanoid()
        setToken('JS_APP_TOKEN', newId)
        config.headers['apptoken'] = newId
    }

    if (i18n.locale) {
        config.headers['locale'] = i18n.locale
    }

//    console.log('locale:', i18n.locale)
    return config
}, (error) => {
    NProgress.done()
    return Promise.reject(error)
})

request.interceptors.response.use((response) => {
    NProgress.done()
    return response.data
}, (error) => {
    NProgress.done()
    return Promise.reject(error)
})

export default request
