import { Message } from 'element-ui'
import axios from '@/utils/axios'
const state = {
    dataList: null,
    total: 0,
    // countryOption1: null,// 乡村一级
    deleteDialog: false,// 删除弹框开关
    deleteDatasDialog: false, //批量删除弹框
    addDialog: false, //添加编辑弹框开关
    replaceDialog: false, //替换数据弹框开关
    // indexDialog: false, //模块数据指标开关
    dataListParams: null, //把getDataList的请求参数存起来
    jingdu: '', //经度
    weidu: '',  //纬度
}

const mutations = {
    GET_DATALIST (state, { dataList, total, dataListParams }) {
        state.dataList = dataList
        state.total = total
        state.dataListParams = dataListParams
    },

    ONOFF_DELETE_DATA (state, payload) {//删除弹框开关 
        state.deleteDialog = payload
    },

    ONOFF_DELETE_DATAS (state, payload) {//批量删除弹框
        state.deleteDatasDialog = payload
    },

    ONOFF_ADDDATA_DIALOG (state, payload) { //添加数据编辑弹框表单开关
        state.addDialog = payload
    },

    ONOFF_REPLACE_DIALOG (state, payload) { //替换数据弹框开关
        state.replaceDialog = payload
    },

    // ONOFF_INDEXE_DIALOG (state, payload) {  //模块数据指标开关
    //     state.indexDialog = payload
    // },

    GET_LONGITUDE_AND_LATITUDE (state, payload) { //添加经度和纬度
        state.jingdu = payload.jingdu
        state.weidu = payload.weidu
    },

    CLEAR_LONGITUDE_AND_LATITUDE (state) { //清空经度和纬度
        state.jingdu = ''
        state.weidu = ''
    }
}

const actions = {
    getDataList ({ commit }, payload) { //获取数据列表
        commit('GET_DATALIST', { dataList: null, total: 0, dataListParams: payload })
        axios(payload).then(res => {
            if (res.code == '10000') {
                // if (payload.module && payload.module === 'macroData') {
                //     if (res.nameIndex) {
                //         commit('ONOFF_INDEXE_DIALOG', true)
                //         return
                //     } else {
                //         commit('ONOFF_INDEXE_DIALOG', false)
                //     }
                // }
                commit('GET_DATALIST', { dataList: res.data, total: res.total, dataListParams: payload })
            }
        })
    },

    deleteData ({ dispatch, commit, state }, payload) {
        axios(payload).then(res => {
            if (res.code == '10000') {
                Message({
                    message: res.msg,
                    type: 'success',
                    showClose: true,
                });
                dispatch('getDataList', state.dataListParams)
                if (state.deleteDialog) {
                    commit('ONOFF_DELETE_DATA', false)
                } else {
                    commit('ONOFF_DELETE_DATAS', false)
                }
            }
        })
    },

    addData ({ dispatch, commit, state }, payload) {  //添加数据
        if ((payload.params.hasOwnProperty('jingdu') && payload.params.hasOwnProperty('weidu'))) {

            if (payload.params.jingdu == '' && payload.params.weidu == '') {
                if (state.jingdu === '' && state.weidu === '') {
                    Message({
                        message: '请标注地图上的位置，再提交数据！',
                        type: 'error',
                        showClose: true,
                    })
                    return
                } else {
                    payload.params.jingdu = state.jingdu
                    payload.params.weidu = state.weidu
                }
            }

        } else if (payload.hasMap) {
            if (state.jingdu === '' && state.weidu === '') {
                Message({
                    message: '请标注地图上的位置，再提交数据！',
                    type: 'error',
                    showClose: true,
                })
                return
            }
        }

        axios(payload).then(res => {
            if (res.code == '10000') {
                if (res.replace) {  //弹出替换数据弹框
                    commit('ONOFF_REPLACE_DIALOG', true)
                    return
                }
                Message({
                    message: res.msg,
                    type: 'success',
                    showClose: true,
                });
                if (state.jingdu !== '' || state.weidu !== '') {
                    commit('CLEAR_LONGITUDE_AND_LATITUDE')
                }
                dispatch('getDataList', state.dataListParams)
                commit('ONOFF_ADDDATA_DIALOG', false)
                commit('ONOFF_REPLACE_DIALOG', false)
            }
        })
    },

}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}