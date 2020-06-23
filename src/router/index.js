import Vue from 'vue'
import Router from 'vue-router'
import App from '@/App'
import noFound from '@/views/components/404'
Vue.use(Router)

export default new Router({
    mode: 'hash',
    routes: [
        {
            path: '/',
            name: 'app',
            redirect: '/systemManagement',
            component: App,
        },
        {//数据管理大屏幕
            path: '/dataManagementScreen',
            name: 'dataManagementScreen',
            component: () => import('@/views/dataManagement/dataManagementScreen'),
        },

        {
            path: '*',
            component: noFound
        }
    ]
})
