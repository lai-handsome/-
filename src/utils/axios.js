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

export default axios