/***
 * 簽核人員 API
 * */
import request from '@/api/request'


/** 分頁查詢 簽核人員 資料 **/
export const requestAllSignoffs = (data) => request({
    url: `/signoff/page?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    method: 'get'
})

/** 新增/更新 簽核人員 **/
export const requestSaveSignoff = (data) => request({
    url: '/signoff',
    method: 'post',
    data
})

/** 刪除 簽核人員 **/
export const requestDeleteSignoff = (id) => request({
    url: `/signoff/${id}`,
    method: 'delete'
})


