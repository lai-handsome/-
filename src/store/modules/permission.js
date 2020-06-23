import axios from '@/utils/axios'
import authRoutes from '@/router/authRoutes.js'

let flatRoutes = []
let flatRoutesObj = {}
const flatTreeRoutes = (source) => {
    for (let item of source) {
        flatRoutes.push(item.name)
        flatRoutesObj[item.name] = item
        if (item.children && item.children.length > 0 && item.type == 1) {//type 2是按钮，1是路由,3是路由最后一级
            flatTreeRoutes(item.children)
        }
    }
}

function formatList (auths, authRoutes) {
    return authRoutes.filter(el => {
        if (flatRoutes.includes(el.name)) {
            if (el.children) {
                el.children = formatList(auths, el.children)
            }
            return true
        }
    })
}

let roleId
if (process.env.NODE_ENV == 'development') {
    roleId = 1
} else {
    roleId = sessionStorage.roleId
}
const state = {
    // needRoutes: '',
    hasPermission: false,
    // roleId: roleId
    flatRoutesObj: flatRoutesObj
    // firstRedirectRoute: router.options.routes[0].redirect.name
}

const mutations = {
    setPermission () {
        state.hasPermission = true
    },
    // GET_AUTHROUTES (payload) {
    //     state.authRoutes = payload.data
    // }
}

const actions = {
    getNewRoute ({ commit, }, payload) {
        payload.params.params.roleId = roleId
        // let data
        return axios(payload).then(res => {
            if (res.code == '10000') {
                // commit('GET_AUTHROUTES', { data: res.data })
                flatTreeRoutes(res.data)

                let needRoutes = formatList(flatRoutes, authRoutes)

                commit('setPermission')
                return needRoutes
            }
        })

    },

    getCountryId ({ }, payload) {
        axios(payload).then(res => {
            if (res.code == '10000') {
                sessionStorage.setItem('countryId', res.data.countryId)
            }
        })
    }
}



export default {
    namespaced: true,
    state,
    mutations,
    actions
}