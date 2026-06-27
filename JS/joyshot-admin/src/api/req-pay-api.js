/***
 * 請款 API
 * */
import request from '@/api/request'

// /** 查詢 請款 資料 **/
// export const requestAllReqPays = (data)=> request({
//     url: "/pay",
//     method: 'get'
// })

/** 分頁查詢 請款 資料 **/
export const requestAllReqPays = (data) => request({
    // url:`/req-pay/find/page?pageNum=${data.pageNum}&pageSize=${data.pageSize}&queryField=${data.queryField}&keyword=${data.keyword}&user=${data.user}`,
    url: '/req-pay/find/page',
    data,
    method: 'post'
})

/** 新增/更新 請款 **/
export const requestSaveReqPay = (data) => request({
    url: '/req-pay',
    method: 'post',
    data
})

/** 刪除 請款 **/
export const requestDeleteReqPay = (id) => request({
    url: `/req-pay/${id}`,
    method: 'delete'
})

/** 請款 送出簽核 **/
export const requestSubmitSignForm = (data) => request({
    url: 'req-pay/history/send/signoff',
    method: 'post',
    data
})

/** 請款 簽核紀錄 **/
export const requstSignOffHistory = (id) => request({
    url: `req-pay/history/${id}`,
    method: 'get'
})

