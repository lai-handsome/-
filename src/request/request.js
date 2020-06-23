import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
// import store from '@/store'
// import { getToken } from '@/utils/auth'
import Qs from 'qs';

// create an axios instance

let ROOT
let token
if (process.env.NODE_ENV == 'development') {
    // root = 'http://192.168.14.71:8081'
    ROOT = "/apis"
    localStorage.setItem('token', 'ed4c952457499031b1396bd3d4bef285')
} else {
    ROOT = "/cloudPlatformApiNew/"
}

export { ROOT }

const service = axios.create({
    baseURL: ROOT, // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 5000,// request timeout
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        "Accept": "application/json; charset=utf-8",
    },
    transformRequest: [function (data) {
        // 这里可以在发送请求之前对请求数据做处理，比如form-data格式化等，这里可以使用开头引入的Qs（这个模块在安装axios的时候就已经安装了，不需要另外安装）
        return Qs.stringify(data)
        // return data
    }],
    transformResponse: [function (data) {
        // 这里提前处理返回的数据
        let dataType = typeof (data);
        if (dataType == "string") {
            data = JSON.parse(data);
            return data;
        } else {
            return data;
        }
    }]
})

token = localStorage.token
// request interceptor
service.interceptors.request.use(
    config => {
        // do something before request is sent

        // if (store.getters.token) {
        // let each request carry token
        // ['X-Token'] is a custom headers key
        // please modify it according to the actual situation
        config.headers['token'] = token
        // }
        return config
    },
    error => {
        // do something with request error
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
    */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
        const res = response.data
        // if the custom code is not 20000, it is judged as an error.
        if (res.code == 10001 || res.code == 10002) {

            Message({
                message: res.msg || 'Error',
                type: 'error',
                duration: 3 * 1000,
                showClose: true
                // showClose: true
            })
            return Promise.reject(new Error(res.message || 'Error'))
        } else if (res.code == 10020) {
            Message({
                message: res.msg,
                type: 'error',
                duration: 3 * 1000,
                showClose: true
            })
            setTimeout(() => {
                let href = window.location.href.split('#')[0]
                window.location.href = href + '/login/login.html'
                // window.location.href = "http://www.zjnydsj.com/cloudPlatform/login/login.html"
            }, 4000)
        } else {
            return res
        }
    },
    error => {
        console.log('err' + error) // for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 3 * 1000,
            showClose: true
        })
        return Promise.reject(error)
    }
)

// // http request拦截器 添加一个请求拦截器
// service.interceptors.request.use(function (config) {
//     // Do something before request is sent
//     let token = window.localStorage.getItem("accessToken")
//     if (token) {
//         config.headers.accessToken = token;    //将token放到请求头发送给服务器
//         return config;
//         //这里经常搭配token使用，将token值配置到tokenkey中，将tokenkey放在请求头中
//         // config.headers['accessToken'] = Token;
//     }
// }, function (error) {
//     // Do something with request error
//     return Promise.reject(error);
// });

export default service
