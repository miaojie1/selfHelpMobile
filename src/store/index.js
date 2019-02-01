import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters' // 导入响应的模块，*相当于引入了这个组件下所有导出的事例
import * as actions from './actions'
import * as mutations from './mutations'

Vue.use(Vuex)
// 首先声明一个需要全局维护的状态 state,比如 我这里举例的resturantName
const state = {
  title: '',
  typeDjbh: '',
  djbh: '',
  djbhItem: '',
  // 已办 待办区分状态
  missionTaskType: '',
  missionFlowId: '',
  missionRows: '',
  missionTitle: '',
  // 用户信息
  missionEmpNum: '',
  missionFlowDetail: '',
  pathStatus: '',
  flowData: '',
  // 图表分析 所在的部门 公司 时间
  depart: '',
  company: '',
  companyId: '',
  chartTitle: '',
  time: '',
  // 图表分析 所有公司，部门
  allCompanys: '',
  allDeparts: '',
  // 图表类别
  chartType: '',
  // 向后台传递的图表类别
  chartTypeKey: ''
  // 查询图表某个具体分类所需要的条件
}
// 注册上面引入的各大模块
const store = new Vuex.Store({
  // 共同维护的一个状态，state里面可以是很多个全局状态
  state,
  // 获取数据并渲染
  getters,
  // 数据的异步操作
  actions,
  // 处理数据的唯一途径，state的改变或赋值只能在这里
  mutations
})
// 导出store并在 main.js中引用注册。
export default store
