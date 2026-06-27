/***
 * 商品 API
 * */
import request from '@/api/request'

/** 查詢 商品 資料 **/
export const requestAllProductNoPage = (data) => request({
    url: "/product",
    method: 'get'
})

/** 分頁查詢 商品 資料 **/
export const requestAllProducts = (data) => request({
    url: `/product/page?pageNum=${data.pageNum}&pageSize=${data.pageSize}&queryField=${data.queryField}&keyword=${data.keyword}`,
    method: 'get'
})

/** 新增/更新 商品 **/
export const requestSaveProduct = (data) => request({
    url: '/product',
    method: 'post',
    data
})

/** 刪除 商品 **/
export const requestDeleteProduct = (id) => request({
    url: `/product/${id}`,
    method: 'delete'
})

/** 匯出 商品 **/
export const requestExportProduct = () => request({
    url: "/product/export",
    method: 'get'
})
/** 匯入 商品 **/
export const requestImportProduct = () => request({
    url: "/product/imp",
    method: 'post'
})
