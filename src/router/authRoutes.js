import store from '../store/index'

const redirectRoute = to => {
    let routeName = to.name
    let redirectRoutes = store.state.permission.flatRoutesObj[routeName].children

    if (redirectRoutes && redirectRoutes.length > 0) {
        if (redirectRoutes.children && redirectRoutes.children.length > 0) {
            let childRoute = redirectRoutes[0].children[0]
            return { name: childRoute.name, query: { routeId: childRoute.id, parentRoute: redirectRoutes[0].name, title: childRoute.description } }
        }
        return { name: redirectRoutes[0].name, query: { routeId: redirectRoutes[0].id, parentRoute: routeName, title: redirectRoutes[0].description } }
    }
}

const authRoutes = [
    {  //系统管理
        path: '/systemManagement',
        name: 'systemManagement',
        component: () => import('@/views/management/index'),
        redirect: redirectRoute,
        children: [
            {
                path: 'role',
                name: 'role',
                title: '角色管理',
                component: () => import('@/views/management/components/role')
            },
            {
                path: 'user',
                name: 'user',
                title: '用户管理',
                component: () => import('@/views/management/components/user')
            },
            {
                path: 'organization',
                name: 'organization',
                title: '机构管理',
                component: () => import('@/views/management/components/organization')
            },
            {
                path: 'log',
                name: 'log',
                title: '日志管理',
                component: () => import('@/views/management/log'),
                redirect: redirectRoute,
                children: [
                    {
                        path: 'loginLog',
                        name: 'loginLog',
                        title: '登录日志',
                        // component: () => import('@/views/management/log/loginLog')
                    },
                    {
                        path: 'operationLog',
                        name: 'operationLog',
                        title: '操作日志',
                        // component: () => import('@/views/management/log/operationLog')
                    }
                ]
            },
            {
                path: 'moduleManage',
                name: 'moduleManage',
                title: '模块管理',
                component: () => import('@/views/management/components/moduleManage')
            },
            {
                path: '/addIndAndArea',
                name: 'addIndAndArea',
                title: '添加产业和地区',
                component: () => import('@/views/management/addIndAndArea')
            },
        ]
    },

    {
        path: '/dataManagement',
        name: 'dataManagement',
        redirect: '/dataManagementScreen',
        component: () => import('@/views/dataManagement/index.vue'),
        children: [
            { //大屏数据
                path: 'screenData',
                name: 'screenData',
                component: () => import('@/views/dataManagement/screenData/screenData'),
                redirect: redirectRoute,
                children: [
                    {// 宏观数据
                        path: 'macroData',
                        name: 'macroData',
                        // redirect: '/dataManagement/macroData/data1',
                        component: () => import('@/views/dataManagement/macroData/macroData'),
                        redirect: redirectRoute,
                        children: [
                            {
                                path: 'data1',
                                name: 'data1'
                            },
                            {
                                path: 'data2',
                                name: 'data2'
                            },
                            {
                                path: 'data3',
                                name: 'data3'
                            },
                            {
                                path: 'data4',
                                name: 'data4'
                            },
                            {
                                path: 'data5',
                                name: 'data5'
                            },
                            {
                                path: 'data6',
                                name: 'data6'
                            },
                        ]
                    },
                    { //农业统计
                        path: 'farmingStatistics',
                        name: 'farmingStatistics',
                        component: () => import('@/views/dataManagement/farmingStatistics/farmingStatistics'),
                        redirect: redirectRoute,
                        children: [
                            {//种植业
                                path: 'plant',
                                name: 'plant',
                                meta: {
                                    title: '种植业生产情况',
                                },
                                component: () => import('@/views/dataManagement/farmingStatistics/plant/index')
                            },
                            {//畜牧业
                                path: 'livestock',
                                name: 'livestock',
                                meta: {
                                    title: '畜牧业生产情况',
                                },
                                component: () => import('@/views/dataManagement/farmingStatistics/livestock/index')
                            }
                        ]
                    },
                ]
            },
            { //美丽乡村
                path: 'beartyCountry',
                name: 'beartyCountry',
                // redirect: '/dataManagement/beartyCountry/wasteWater',
                component: () => import('@/views/dataManagement/beartyCountry/beartyCountry'),
                redirect: redirectRoute,
                children: [
                    {
                        path: 'wasteWater',
                        name: 'wasteWater',
                        meta: {
                            title: '农村生活污水处理',
                            hasMap: true
                        },
                        component: () => import('@/views/dataManagement/beartyCountry/wasteWater/index')
                    },
                    {
                        path: 'rubbish',
                        name: 'rubbish',
                        meta: {
                            title: '农村生活垃圾分类',
                            hasMap: true
                        },
                        component: () => import('@/views/dataManagement/beartyCountry/rubbish/index')
                    },
                    {
                        path: 'country',
                        name: 'country',
                        meta: {
                            title: '历史文化村落保护',
                            hasMap: true
                        },
                        component: () => import('@/views/dataManagement/beartyCountry/country/index')
                    }
                ]
            },
            {//农业主体
                path: 'farmingSubject',
                name: 'farmingSubject',
                // redirect: '/dataManagement/farmingSubject/cock',
                component: () => import('@/views/dataManagement/farmingSubject/farmingSubject'),
                redirect: redirectRoute,
                children: [
                    {
                        path: 'cock',
                        name: 'cock',
                        meta: {
                            title: '龙头企业',
                            id: 1,
                            hasMap: true
                        },
                        // component: () => import('@/views/dataManagement/farmingSubject/cock/index')
                    },
                    {
                        path: 'cooperative',
                        name: 'cooperative',

                        meta: {
                            title: '农民专业合作社',
                            id: 2,
                            hasMap: true
                        },
                        // component: () => import('@/views/dataManagement/farmingSubject/cooperative/index')
                    },
                    {
                        path: 'familyFarm',
                        name: 'familyFarm',

                        meta: {
                            title: '家庭农场',
                            id: 3,
                            hasMap: true
                        },
                        // component: () => import('@/views/dataManagement/farmingSubject/familyFarm/index')
                    },

                    {
                        path: 'guestFarms',
                        name: 'guestFarms',

                        meta: {
                            title: '农家乐',
                            id: 4,
                            hasMap: true
                        },
                        // component: () => import('@/views/dataManagement/farmingSubject/guestFarms/index')
                    },
                    {
                        path: 'otherRichFamily',
                        name: 'otherRichFamily',

                        meta: {
                            title: '规模大户',
                            id: 5,
                            hasMap: true
                        },
                        // component: () => import('@/views/dataManagement/farmingSubject/otherRichFamily/index')
                    },
                ]
            },
            { //区域数据
                path: 'areaData',
                name: 'areaData',
                // redirect: '/dataManagement/areaData/foodProduction',
                component: () => import('@/views/dataManagement/areaData/areaData'),
                redirect: redirectRoute,
                children: [
                    {
                        path: 'foodProduction',
                        name: 'foodProduction',
                        meta: {
                            title: '粮食生产功能区',
                            id: 1,
                            hasMap: true,
                            exportExcelUrl: '/Type1Ziduan/exportExcel',
                            excelTemplateUrl: '/Type1Ziduan/toExcel',
                        },

                        // component: () => import('@/views/dataManagement/areaData/areaData')
                    },
                    {
                        path: 'modernFarm',
                        name: 'modernFarm',

                        meta: {
                            title: '现代农业综合区',
                            id: 2,
                            hasMap: true,
                            exportExcelUrl: '/Type2Ziduan/exportExcel',
                            excelTemplateUrl: '/Type2Ziduan/toExcel',
                        },
                        // component: () => import('@/views/dataManagement/areaData/areaData')
                    },
                    {
                        path: 'industryExample',
                        name: 'industryExample',

                        meta: {
                            title: '主导产业示范区',
                            id: 3,
                            hasMap: true,
                            exportExcelUrl: '/Type3Ziduan/exportExcel',
                            excelTemplateUrl: '/Type3Ziduan/toExcel',
                        },
                        // component: () => import('@/views/dataManagement/areaData/areaData')
                    },
                    {
                        path: 'featureFarm',
                        name: 'featureFarm',
                        meta: {
                            title: '特色农业精品园',
                            id: 4,
                            hasMap: true,
                            exportExcelUrl: '/Type4Ziduan/exportExcel',
                            excelTemplateUrl: '/Type4Ziduan/toExcel',
                        },
                        // component: () => import('@/views/dataManagement/areaData/areaData')
                    },
                ]
            },
            { //示范基地
                path: 'modelBase',
                name: 'modelBase',
                // redirect: '/dataManagement/modelBase/industryModelBase',
                component: () => import('@/views/dataManagement/modelBase/modelBase'),
                redirect: redirectRoute,
                children: [
                    {
                        path: 'industryModelBase',
                        name: 'industryModelBase',
                        meta: {
                            title: '产业化示范基地',
                            hasMap: true
                        },
                        // component: () => import('@/views/dataManagement/modelBase/modelBase'),
                    }
                ]
            },
            {  //自定义模块
                path: 'definedModule',
                name: 'definedModule',
                meta: {
                    hasMap: true
                },
                component: () => import('@/views/dataManagement/definedModule/definedModule'),
            }
        ]
    }
]

export default authRoutes