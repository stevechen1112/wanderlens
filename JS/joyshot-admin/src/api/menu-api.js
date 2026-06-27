/***
 * 選單 API
 * */
import request from '@/api/request'


/** 分頁查詢 選單 資料 **/
export const requestAllMenu = (data) => request({
    url: `/menu?keyword=${data.keyword}`,
    method: 'get'
})

/** 新增/更新 選單 **/
export const requestSaveMenu = (data) => request({
    url: '/menu',
    method: 'post',
    data
})

/** 刪除 選單 **/
export const requestDeleteMenu = (id) => request({
    url: `/menu/${id}`,
    method: 'delete'
})

/** 取得圖示類型 **/
export const requestIcons = () => request({
    url: `/menu/icons`,
    method: 'get'
})


