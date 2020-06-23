import axios from '@/utils/axios'

const state = {
    countryList: null,
    townList: null,
    townName: '',
    townId: '',
    countryId: '',
    countryName: '',
}

const mutations = {
    GET_COUNTRY_ITEM (state, payload) {
        let { item } = payload
        state.countryName = item.name
        state.countryId = item.id
    },

    GET_TOWN_ITEM (state, payload) {
        let { item } = payload
        state.countryName = ''
        state.countryId = ''
        if (state.townId !== item.id) {
            state.townName = item.name
            state.townId = item.id
            state.countryList = null
        }
    },

    CLEARTOWN (state) {
        state.townName = ''
        state.townId = '',
            state.countryName = '',
            state.countryId = ''
    },

    CLEARCOUNTRY (state) {
        state.countryName = '',
            state.countryId = ''
    },

    GET_TOWN_LIST (state, payload) {
        state.townList = payload.data
    },
    GET_COUNTRY_LIST (state, payload) {
        state.countryList = payload.data
    },

    CLEARCOUNTRYLIST (state) {
        state.countryList = null
    }
}

const actions = {
    getTownOrCountryList ({ commit, state }, payload) {
        let requestObj = { url: '/countryData/getcountry', method: 'get', params: { params: payload.data } }
        axios(requestObj).then(res => {
            if (res.code == '10000') {
                if (payload.val == 1) {// 乡镇的数据
                    commit('GET_TOWN_LIST', { data: res.data })
                } else { //村庄的数据
                    commit('GET_COUNTRY_LIST', { data: res.data })
                }
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