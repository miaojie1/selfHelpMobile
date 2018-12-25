// 给action注册事件处理函数。当这个函数被触发时候，将状态提交到mutations中处理
// export function modifyAName ({commit}, name) { // commit 提交；name即为点击后传递过来的参数，此时是 'A餐馆'
//   return commit('modifyAName', name)
// }
// export function modifyBName ({commit}, name) {
//   return commit('modifyBName', name)
// }
// 给action注册事件处理函数。当这个函数被触发时候，将状态提交到mutations中处理
// ES6精简写法
// export const modifyTitle = ({commit}, name) => commit('title', name)
// export const modifyTypeDjbh = ({commit}, name) => commit('typeDjbh', name)
// export const modifyDjbh = ({commit}, name) => commit('djbh', name)
// export const modifyDjbhItem = ({commit}, name) => commit('djbhItem', name)
export const modifyTitle = ({commit}, val) => commit('modifyTitle', val)
export const modifyTypeDjbh = ({commit}, val) => commit('modifyTypeDjbh', val)
export const modifyDjbh = ({commit}, val) => commit('modifyDjbh', val)
export const modifyDjbhItem = ({commit}, val) => commit('modifyDjbhItem', val)
export const modifyMissionTaskType = ({commit}, val) => commit('modifyMissionTaskType', val)
export const modifyMissionFlowId = ({commit}, val) => commit('modifyMissionFlowId', val)
export const modifyMissionRows = ({commit}, val) => commit('modifyMissionRows', val)
export const modifyMissionEmpNum = ({commit}, val) => commit('modifyMissionEmpNum', val)
export const modifyMissionFlowDetail = ({commit}, val) => commit('modifyMissionFlowDetail', val)
export const modifyPathStatus = ({commit}, val) => commit('modifyPathStatus', val)
export const modifyFlowData = ({commit}, val) => commit('modifyFlowData', val)
export const modifyMissionTitle = ({commit}, val) => commit('modifyMissionTitle', val)
