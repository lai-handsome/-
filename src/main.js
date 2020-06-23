// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// import { Pagination, Select, option, button, dialog, Form, FormItem, input } from 'element-ui'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'lib-flexible/flexible.js' //px转rem插件
import store from './store'
import { toInt, toDecimals } from '@/utils/numFormat';
import 'babel-polyfill';
import '@/styles/reset.css'
Vue.prototype.toInt = toInt
Vue.prototype.toDecimals = toDecimals

ElementUI.Cascader.methods.handleClose = function () { //修改element源代码，给element Cascader的组件添加handleClose函数，已经
    this.dropDownVisible = false //这个是 Cascader的组件的开关，
}
ElementUI.Cascader.methods.blur = function () {
    this.$refs.input.blur()  //让Cascader的input组件失去焦点
}

Vue.use(ElementUI)

Vue.config.productionTip = false

function btnPermission (routeName, btnName) {
    const { flatRoutesObj } = store.state.permission
    const children = flatRoutesObj[routeName].children
    return children.some(item => item.url == btnName)
}

Vue.prototype.btnPermission = btnPermission

const bindFn = (el, binding, vnode, oldVnode) => {
    let { name, btnName } = binding.value
    let bool = btnPermission(name, btnName)
    if (!bool) {
        el.parentNode.removeChild(el)
    }
}
Vue.directive('permission', {
    inserted: bindFn,
})

router.beforeEach(async (to, from, next) => {
    let authRoutes = store.state.permission.authRoutes
    let roleId
    if (process.env.NODE_ENV == 'development') {
        sessionStorage.roleId = 1
    }
    roleId = sessionStorage.roleId

    let newRoutes

    let hasPermission = store.state.permission.hasPermission
    if (!hasPermission) {
        let data = {
            roleId: roleId,
            parentId: sessionStorage.parentId ? sessionStorage.parentId : 50,
            barType: 2
        }

        newRoutes = await store.dispatch('permission/getNewRoute', {
            // url: '/permission/managerMenuList',
            // url: '/permission/menuList',
            url: '/permission/platMenuList',
            method: 'get',
            params: { params: data }
        })
        if (sessionStorage.countryId == undefined) {
            store.dispatch('permission/getCountryId', { url: '/countryData/getLocalCountry', method: 'get' })
        }

        // let flatRoutesObj = store.state.permission.flatRoutesObj
        // if (router.currentRoute.fullPath !== to.fullPath) {
        //     // 如果刷新前的页面路径和刷新后页面要跳转的路径一样，会报message: "Navigating to current location ("/systemManagement/role") is not allowed"这样的错误，错误的原因是当前路由记录和要跳转的路由记录是一样的；判断当前路由和要跳转的路由是否完全一样，有一项是判断两个路由对象的query对象是否一样，我给它们的query加了currentTime属性，使这个属性等于new Date()当前的时间，每次刷新，当前时间都不一样，它们的currentTime值就不一样，所以query不相等，就不存在刷新前后的两个路由一样的问题了。
        //     // to.query.currentTime = new Date()
        //     // to.query.routeId =
        //     // to.query.number = 1 //这个方法也可以，currentRoute对象没有number这个属性
        //     to.query.random = Math.random()
        // }
        router.addRoutes(newRoutes); // 动态添加我需要的路由
        next({ ...to })
    } else {
        next()
    }
})

new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})
