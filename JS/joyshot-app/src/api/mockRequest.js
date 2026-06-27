import axios from "axios";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const request = axios.create({
    baseURL: '/mock',
    timeout: 5000
})


request.interceptors.request.use((config) => {
    //setup headers
    NProgress.start()
    return config
}, (error) => {
    NProgress.done()
    return Promise.reject(error)
})

request.interceptors.response.use((response) => {
    NProgress.done()
    return response.data
}, (error) => {
    return Promise.reject(error)
})

export default request
