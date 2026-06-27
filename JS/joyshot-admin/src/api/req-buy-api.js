/***
 * 請購 API
 * */
import request from '@/api/request'


/** 分頁查詢 請購 資料 **/
export const requestAllReqBuys = (data) => request({
    // url:`/req-buy/find/page?pageNum=${data.pageNum}&pageSize=${data.pageSize}&queryField=${data.queryField}&keyword=${data.keyword}&user=${data.user}`,
    url: '/req-buy/find/page',
    data,
    method: 'post'
})

/** 新增/更新 請購 **/
export const requestSaveReqBuy = (data) => request({
    url: '/req-buy',
    method: 'post',
    data
})

/** 刪除 請購 **/
export const requestDeleteReqBuy = (id) => request({
    url: `/req-buy/${id}`,
    method: 'delete'
})

/** 請購 送出簽核 **/
export const requestSubmitSignForm = (data) => request({
    url: 'req-buy/history/send/signoff',
    method: 'post',
    data
})

/** 請購 簽核紀錄 **/
export const requstSignOffHistory = (id) => request({
    url: `req-buy/history/${id}`,
    method: 'get'
})

