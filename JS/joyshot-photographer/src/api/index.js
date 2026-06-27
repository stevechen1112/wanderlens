/***
 * API 呼叫統一定義在此
 * */
import request from '@/api/request'

/** 取得用戶資料 **/
export const requestUserInfo = (data) => request({
    url: `/user/info`,
    data,
    method: 'post'
})

export const requestUserBadge = () => request({
    url: `/notify/unread`,
    method: 'get'
})

/**送出登入表單**/
export const requestLogin = (data) => request({
// export const requestLogin = (data)=> mockRequest({
    url: '/user/login',
    data,
    method: 'post'
})

/**送出 登入 表單**/
export const requestAllUser = (data) => request({
    url: `/user/page?pageNum=${data.pageNum}&pageSize=${data.pageSize}&queryField=${data.queryField}&keyword=${data.keyword}`,
    method: 'get'
})

/**送出 新增帳號 表單**/
export const requestSaveUser = (data) => request({
    url: '/user',
    method: 'post',
    data
})

/**送出 刪除帳號 **/
export const requestDeleteUser = (id) => request({
    url: `/user/${id}`,
    method: 'delete'
})


//dev
// export const $file_location = 'https://s.muds.me/joyshot';

//prod
export const $file_location = 'https://www.joyshot.app';
