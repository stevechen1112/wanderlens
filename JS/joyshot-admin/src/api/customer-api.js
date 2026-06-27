/***
 * 客戶 API
 * */
import request from '@/api/request'

/** 查詢 客戶 資料 **/
export const requestAllCustomerNoPage = () => request({
    url: "/customer",
    method: 'get'
})

/** 分頁查詢 客戶 資料 **/
export const requestAllCustomers = (data) => request({
    url: `/customer/page?pageNum=${data.pageNum}&pageSize=${data.pageSize}&queryField=${data.queryField}&keyword=${data.keyword}`,
    method: 'get'
})

/** 新增/更新 客戶 **/
export const requestSaveCustomer = (data) => request({
    url: '/customer',
    method: 'post',
    data
})

/** 刪除 客戶 **/
export const requestDeleteCustomer = (id) => request({
    url: `/customer/${id}`,
    method: 'delete'
})

/** 匯出 客戶 **/
export const requestExportCustomer = () => request({
    url: "/customer/export",
    method: 'get'
})

/** 匯入 客戶 **/
export const requestImportCustomer = () => request({
    url: "/customer/imp",
    method: 'post'
})
