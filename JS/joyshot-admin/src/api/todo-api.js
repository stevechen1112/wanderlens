/***
 * 待辦 API
 * */
import request from '@/api/request'

/** 查詢 待辦 資料 **/
export const requestAllMytodoNoPage = (data) => request({
    url: "/todo",
    method: 'get'
})

/** 分頁查詢 待辦 資料 **/
export const requestAllMytodos = (data) => request({
    url: `/todo/page?pageNum=${data.pageNum}&pageSize=${data.pageSize}&queryField=${data.queryField}&keyword=${data.keyword}`,
    method: 'get'
})

/** 新增/更新 待辦 **/
export const requestSaveMytodo = (data) => request({
    url: '/todo',
    method: 'post',
    data
})

/** 刪除 待辦 **/
export const requestDeleteMytodo = (id) => request({
    url: `/todo/${id}`,
    method: 'delete'
})
