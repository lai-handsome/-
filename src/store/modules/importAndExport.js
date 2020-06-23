import request from '@/request/request'

function axios (payload) {
    if (payload.method === 'post') {
        let data = payload.params
        return request({
            url: payload.url,
            method: payload.method,
            data,
        })
    } else {
        return request({
            url: payload.url,
            method: payload.method,
            ...payload.params,
        })
    }
}

const state = {

}

const mutations = {

}

const actions = {

}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}