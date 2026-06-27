import axios from "axios";
import store from '@/store'
import i18n from '@/i18n'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

//測試
const request = axios.create({
    baseURL: '/api',
    timeout: 10000
})

request.interceptors.request.use((config) => {
    NProgress.start()
    //console.log('config:', config)
    if (store.state.login.token) {
        config.headers['token'] = store.state.login.token
        config.headers['info'] = store.state.login.userInfo.id
    }
    if (i18n.locale) {
        config.headers['locale'] = i18n.locale
    }
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
