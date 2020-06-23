import request from '@/request/request'


//dzz login
export function logind (data) {
    return request({
        url: '/login/login',
        method: 'post',
        data
    })
}
//dzz admin
export function adminDel (data) {
    return request({
        url: '/admin/del',
        method: 'post',
        data
    })
}
//dzz
export function addAdmin (data) {
    return request({
        url: '/admin/add',
        method: 'post',
        data
    })
}
//dzz
export function updateAdmin (data) {
    return request({
        url: '/admin/update',
        method: 'post',
        data
    })
}
//dzz
export function getAdminList (data) {
    return request({
        url: '/admin/getList',
        method: 'get',
        params: data //get请求时需加params
    })
}
//dzz user
export function getUserList (data) {
    return request({
        url: '/user/getList',
        method: 'get',
        params: data
    })
}
//dzz
export function updateUser (data) {
    return request({
        url: '/user/update',
        method: 'post',
        data
    })
}
//dzz
export function addUser (data) {
    return request({
        url: '/user/add',
        method: 'post',
        data
    })
}
//dzz
export function delUser (data) {
    return request({
        url: '/user/del',
        method: 'post',
        data
    })
}

export function login (data) {
    return request({
        url: '/user/login',
        method: 'post',
        data
    })
}

export function getInfo (token) {
    return request({
        url: '/user/info',
        method: 'get',
        params: { token }
    })
}

export function logout () {
    return request({
        url: '/login/logout',
        method: 'post'
    })
}
