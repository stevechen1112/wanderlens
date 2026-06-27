/***
 * 區域 API
 * */
import request from '@/api/request'


/** 查詢 區域 資料 **/
export const requestAllAreaNoPage = (data) => request({
    url: `/area?keyword=${data.keyword}`,
    method: 'get'
})

/** 分頁查詢 區域 資料 **/
export const requestAllArea = (data) => request({
    url: `/area/page?pageNum=${data.pageNum}&pageSize=${data.pageSize}&queryField=${data.queryField}&keyword=${data.keyword}`,
    method: 'get'
})

/** 新增/更新 區域 **/
export const requestSaveArea = (data) => request({
    url: '/area',
    method: 'post',
    data
})

/** 刪除 區域 **/
export const requestDeleteArea = (id) => request({
    url: `/area/${id}`,
    method: 'delete'
})


