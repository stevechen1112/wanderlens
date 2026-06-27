/***
 * 角色 API
 * */
import request from '@/api/request'
//import mockRequest from '@/api/mockRequest'

/** 查詢 角色 資料 **/
export const requestAllNoPage = () => request({
    url: "/role",
    method: 'get'
})

/** 分頁查詢 角色 資料 **/
export const requestAll = (data) => request({
    url: `/role/page?pageNum=${data.pageNum}&pageSize=${data.pageSize}&queryField=${data.queryField}&keyword=${data.keyword}`,
    method: 'get'
})

/** 新增/更新 角色 **/
export const requestSave = (data) => request({
    url: '/role',
    method: 'post',
    data
})

/** 刪除 角色 **/
export const requestDelete = (id) => request({
    url: `/role/${id}`,
    method: 'delete'
})
