/***
 * 選單 API
 * */
import request from '@/api/request'


/** 分頁查詢 字典 資料 **/
export const requestAllDics = (data) => request({
    url: `/dic/page?pageNum=${data.pageNum}&pageSize=${data.pageSize}&queryField=${data.queryField}&keyword=${data.keyword}`,
    method: 'get'
})

/** 新增/更新 字典 **/
export const requestSaveDic = (data) => request({
    url: '/dic',
    method: 'post',
    data
})

/** 刪除 字典 **/
export const requestDeleteDic = (id) => request({
    url: `/dic/${id}`,
    method: 'delete'
})


