import Vue from 'vue'
import Router from 'vue-router'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import HttpUtil from '@/common/HttpUtil.js'
Vue.use(Router)
Vue.use(MintUI)
Vue.config.productionTip = false
Vue.prototype.$http = HttpUtil
export default new Router({
  base: '/selfHelpVue',
  routes: [
    {
      path: '/index',
      name: 'Index',
      component: () => import('@/components/index.vue')
    },
    {
      path: '/myWage',
      name: 'MyWage',
      component: () => import('@/components/myWage/myWage')
    },
    {
      path: '/missionToDo',
      name: 'MissionToDo',
      component: () => import('@/components/mission/missionToDo')
    },
    {
      path: '/missionDone',
      name: 'MissionDone',
      component: () => import('@/components/mission/missionDone')
    },
    {
      path: '/toDoCard',
      name: 'ToDoCard',
      component: () => import('@/components/mission/toDoCard')
    },
    {
      path: '/flowDetails',
      name: 'FlowDetails',
      component: () => import('@/components/mission/details')
    },
    {
      path: '/danju',
      name: 'DanJu',
      meta: {
        keepAlive: true, // 该字段表示该页面需要缓存
        isBack: false, // 用于判断上一个页面是哪个
        title: 'DanJuListHead'
      },
      component: resolve => require(['@/components/mission/danju/danju'], resolve) // 路由懒加载
      // component: () => import('@/components/mission/danju/danju')
    },
    {
      path: '/danjuListHead',
      name: 'DanJuListHead',
      component: () => import('@/components/mission/danju/listHead')
    },
    {
      path: '/danjuListBody',
      name: 'DanJuListBody',
      component: () => import('@/components/mission/danju/listBody')
    },
    {
      path: '/recruit',
      name: 'Recruit',
      component: () => import('@/components/recruit/recruit')
    },
    {
      path: '/detail',
      name: 'Detail',
      component: () => import('@/components/recruit/detail')
    },
    {
      path: '/myRecord',
      name: 'MyRecord',
      component: () => import('@/components/recruit/applyRecord')
    },
    {
      path: '/information',
      name: 'Information',
      component: () => import('@/components/information/infor')
    },
    {
      path: '/inforM',
      name: 'InforM',
      component: () => import('@/components/jiashi/infor')
    },
    {
      path: '/chartAnalysis',
      name: 'ChartAnalysis',
      component: () => import('@/components/chartAnalysis/companyList')
    },
    {
      path: '/chartList',
      component: () => import('@/components/chartAnalysis/chartList')
    },
    {
      path: '/showChart',
      component: () => import('@/components/chartAnalysis/showChart')
    }
  ]
})
